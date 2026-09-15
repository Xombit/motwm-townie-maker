import { TownieTemplate, TownieFormData } from "../types";
import { D35EAdapter } from "../d35e-adapter";
import { loadTemplates } from "../data/template-loader";
import { generateCharacterName, generateFirstName, generateSurname, generateClassTitle } from "../data/character-names";
import { resolveCharacterImages, normalizeGender, getDefaultImages } from "../data/image-resolver";
import { bindDelegatedEvents, getApplicationElement, getElementChecked, getElementValue, mergeObjectCompat } from "../foundry-compat";
import {
  calculateGeneratedCharacterCR,
  ClassTier,
  formatCR,
  getHighestSpellLevelAvailable,
  normalizeClassKey,
  resolveClassTier,
  WealthTier,
} from "../data/cr-calculation";
import { SRD_LOOT_PROFILES } from "../data/srd-treasure-profiles";
import { parseBudgetPercentToDecimal, parseIntegerWithFallback } from "./form-parsing";
import { buildCreationPipelinePlan } from "./pipeline-plan";
import { budgetModeToFlags, deriveBudgetModeFromFlags, normalizeBudgetMode, type BudgetMode } from "./budget-mode";
import {
  BASIS_POINTS_TOTAL,
  SPENDING_SPLIT_GROUPS,
  clampSplitGroupEdit,
  createDefaultSpendingPlanConfig,
  resolveSpendingPlan,
  type SpendingPlanConfig,
  type SpendingCategory,
  type SpendingPresetId,
  type SpendingSplitGroupKey,
  type SpendingSplitKey,
} from "../data/spending-plan";
import {
  ABILITY_KEYS,
  POINT_BUY_BUDGETS,
  STANDARD_ARRAY,
  assignRollPool,
  generateAbilityScores,
  normalizeAbilityPins,
  normalizeAbilityPriority,
  splitPointBuyBudget,
  type AbilityGenerationMethod,
  type AbilityKey,
} from "../data/ability-generation";
import { buildTemplateDetailView } from "./template-detail-view";
import {
  buildWizardFooterState,
  isCreationTab,
  nextCreationTab,
  previousCreationTab,
  type CreationTab,
  type PrimaryTab,
} from "./wizard-flow";

// Temporary kill-switch for SRD loot generation while upstream D35E treasure output is unstable.
const SRD_LOOT_FEATURE_ENABLED = false;

// Module-level storage for Equipment and Settings values that persists between app opens
// This resets on page reload but persists during the session
let persistedConfigSettings: {
  useStandardBudget?: boolean;
  useNpcWealth?: boolean;
  budgetMode?: BudgetMode;
  includeLootPacks?: boolean;
  lootProfile?: "standard" | "none" | "double_goods_items" | "percent_goods_items_50";
  usePcSheet?: boolean;
  useMaxHpPerHD?: boolean;
  identifyItems?: boolean;
  extraMoneyInBank?: boolean;
  reserveGoldPercent?: number;
  keepPocketChange?: boolean;
  bankName?: string;
  tokenDisposition?: number;  // -1 = Hostile, 0 = Neutral, 1 = Friendly
  spendingPlan?: SpendingPlanConfig;
  abilityGenerationMethod?: AbilityGenerationMethod;
  abilityPointBuyBudget?: number;
  magicItemBudgets?: {
    shieldPercent?: number;
    armorPercent?: number;
    secondaryWeaponPercent?: number;
    ringPercent?: number;
    amuletPercent?: number;
  };
} | null = null;

export class TownieMakerApp extends Application {
  private selectedTemplate: TownieTemplate | null = null;
  private templates: TownieTemplate[] = [];
  private templateLoadError: any = null;
  private lastLoadingStepSetAtMs = 0;
  private lastLoadingStepText: string | null = null;
  private formData: Partial<TownieFormData> = {
    magicItemBudgets: {}, // Initialize budget object
    budgetMode: "standardBudget",
    useStandardBudget: true, // Default to standard adventurer budget
    useNpcWealth: false,
    lootProfile: "standard", // Default SRD profile
    usePcSheet: true, // Default to PC sheet
    useMaxHpPerHD: false, // Default to rolling HP
    reserveGoldPercent: 0,
    keepPocketChange: true,
    spendingPlan: createDefaultSpendingPlanConfig(),
    abilityPriority: [...ABILITY_KEYS],
    abilityPins: {},
    abilityRollPool: []
  };
  private showAdvancedSpendingPlan = false;
  private resolvedSpendingPriority: SpendingCategory[] = [];
  private spendingSplitDraft: Partial<Record<SpendingSplitKey, number>> | null = null;
  private splitClampFeedback: { group: SpendingSplitGroupKey; key: SpendingSplitKey; message: string } | null = null;
  private activePrimaryTab: PrimaryTab = 'template';
  private lastCreationTab: CreationTab = 'template';
  private templateView: 'gallery' | 'details' = 'gallery';
  private availableRaces: Array<{ id: string; name: string }> = [];
  private availableClasses: Array<{ id: string; name: string }> = [];

  static get defaultOptions() {
    return mergeObjectCompat(super.defaultOptions, {
      id: "motwm-townie-maker",
      title: "MOTWM Townie Maker",
      width: 720,
      height: 660,
      resizable: true,
      template: "modules/motwm-townie-maker/templates/townie-maker.hbs",
      classes: ["D35E", "motwm-townie-maker"],
      tabs: [{ navSelector: ".tabs", contentSelector: ".content", initial: "template" }],
      // Preserve scroll position of the main content pane across renders.
      scrollY: [".content"]
    });
  }

  private getRootElement(): HTMLElement | null {
    return getApplicationElement(this);
  }

  /**
   * Get the default budget percentages based on level and template
   */
  private getDefaultBudgets(): { [key: string]: number } {
    const level = this.formData.classLevel || 1;
    
    // Check if template has budget overrides
    const templateBudgets = this.selectedTemplate?.magicItemBudgets;
    
    // Level-dependent hardcoded defaults
    const shieldDefault = level >= 17 ? 50 : 40;
    const armorDefault = level >= 17 ? 50 : 60;
    
    return {
      shieldPercent: templateBudgets?.shieldPercent !== undefined 
        ? Math.round(templateBudgets.shieldPercent * 100)
        : shieldDefault,
      armorPercent: templateBudgets?.armorPercent !== undefined 
        ? Math.round(templateBudgets.armorPercent * 100)
        : armorDefault,
      secondaryWeaponPercent: templateBudgets?.secondaryWeaponPercent !== undefined 
        ? Math.round(templateBudgets.secondaryWeaponPercent * 100)
        : 50,
      ringPercent: templateBudgets?.ringPercent !== undefined 
        ? Math.round(templateBudgets.ringPercent * 100)
        : 60,
      amuletPercent: templateBudgets?.amuletPercent !== undefined 
        ? Math.round(templateBudgets.amuletPercent * 100)
        : 40
    };
  }

  async getData(): Promise<any> {
    // Load templates from external JSON (cached by loader)
    const { templates, error } = await loadTemplates();
    this.templates = templates;
    this.templateLoadError = error;

    // Load available races if not already loaded
    if (this.availableRaces.length === 0) {
      this.availableRaces = await D35EAdapter.getRaces();
      console.log("Available races:", this.availableRaces.map(r => r.name));
    }
    
    // Load available classes if not already loaded
    if (this.availableClasses.length === 0) {
      this.availableClasses = await D35EAdapter.getClasses();
    }
    
    // Load persisted Config settings if available (first open after page load)
    if (persistedConfigSettings) {
      // Only restore config settings if they haven't been overwritten by template selection
      if (this.formData.budgetMode === undefined || !this.selectedTemplate) {
        this.applyBudgetMode(
          normalizeBudgetMode(
            persistedConfigSettings.budgetMode,
            deriveBudgetModeFromFlags(persistedConfigSettings.useStandardBudget, persistedConfigSettings.useNpcWealth)
          )
        );
      }
      if (this.formData.includeLootPacks === undefined || !this.selectedTemplate) {
        this.formData.includeLootPacks = persistedConfigSettings.includeLootPacks ?? false;
      }
      if (this.formData.lootProfile === undefined || !this.selectedTemplate) {
        this.formData.lootProfile = persistedConfigSettings.lootProfile ?? "standard";
      }

      if (!SRD_LOOT_FEATURE_ENABLED) {
        this.formData.includeLootPacks = false;
      }
      this.syncBudgetModeState();
      if (this.formData.usePcSheet === undefined || !this.selectedTemplate) {
        this.formData.usePcSheet = persistedConfigSettings.usePcSheet ?? true;
      }
      if (this.formData.useMaxHpPerHD === undefined || !this.selectedTemplate) {
        this.formData.useMaxHpPerHD = persistedConfigSettings.useMaxHpPerHD ?? false;
      }
      if (this.formData.identifyItems === undefined || !this.selectedTemplate) {
        this.formData.identifyItems = persistedConfigSettings.identifyItems ?? false;
      }
      if (this.formData.extraMoneyInBank === undefined || !this.selectedTemplate) {
        this.formData.extraMoneyInBank = persistedConfigSettings.extraMoneyInBank ?? true;
      }
      if (this.formData.reserveGoldPercent === undefined || !this.selectedTemplate) {
        this.formData.reserveGoldPercent = persistedConfigSettings.reserveGoldPercent ?? 0;
      }
      if (this.formData.keepPocketChange === undefined || !this.selectedTemplate) {
        this.formData.keepPocketChange = persistedConfigSettings.keepPocketChange ?? true;
      }
      if (this.formData.bankName === undefined || !this.selectedTemplate) {
        this.formData.bankName = persistedConfigSettings.bankName ?? "The First Bank of Lower Everbrook";
      }
      if (this.formData.tokenDisposition === undefined || !this.selectedTemplate) {
        this.formData.tokenDisposition = persistedConfigSettings.tokenDisposition ?? 0; // Default: Neutral
      }
      if (!this.formData.magicItemBudgets || Object.keys(this.formData.magicItemBudgets).length === 0) {
        this.formData.magicItemBudgets = persistedConfigSettings.magicItemBudgets || {};
      }
      if (!this.formData.spendingPlan && persistedConfigSettings.spendingPlan) {
        this.formData.spendingPlan = structuredClone(persistedConfigSettings.spendingPlan);
      }
      this.formData.abilityGenerationMethod ??= persistedConfigSettings.abilityGenerationMethod;
      this.formData.abilityPointBuyBudget ??= persistedConfigSettings.abilityPointBuyBudget;
    } else {
      // Initialize usePcSheet from settings if not already set
      if (this.formData.usePcSheet === undefined) {
        const defaultSheetType = game.settings.get("motwm-townie-maker", "defaultSheetType") as string;
        this.formData.usePcSheet = defaultSheetType !== 'simpleNpc';
      }
      // Initialize new loot options to defaults
      if (this.formData.identifyItems === undefined) {
        this.formData.identifyItems = false;
      }
      if (this.formData.extraMoneyInBank === undefined) {
        this.formData.extraMoneyInBank = true;
      }
      if (this.formData.reserveGoldPercent === undefined) {
        this.formData.reserveGoldPercent = 0;
      }
      if (this.formData.keepPocketChange === undefined) {
        this.formData.keepPocketChange = true;
      }
      if (this.formData.bankName === undefined) {
        this.formData.bankName = "The First Bank of Lower Everbrook";
      }
      if (this.formData.tokenDisposition === undefined) {
        this.formData.tokenDisposition = 0; // Default: Neutral
      }
      if (this.formData.lootProfile === undefined) {
        this.formData.lootProfile = "standard";
      }

      if (!SRD_LOOT_FEATURE_ENABLED) {
        this.formData.includeLootPacks = false;
      }
      this.syncBudgetModeState();
    }

    const settings = {
      defaultActorType: game.settings.get("motwm-townie-maker", "defaultActorType"),
      autoRollHP: game.settings.get("motwm-townie-maker", "autoRollHP"),
      abilityScoreMethod: game.settings.get("motwm-townie-maker", "abilityScoreMethod"),
      defaultPointBuyBudget: game.settings.get("motwm-townie-maker", "defaultPointBuyBudget"),
      defaultFolder: game.settings.get("motwm-townie-maker", "defaultFolder")
    };

    if (!this.formData.abilityGenerationMethod) {
      this.formData.abilityGenerationMethod = this.normalizeAbilityGenerationMethod(settings.abilityScoreMethod);
    }
    if (!Number.isFinite(this.formData.abilityPointBuyBudget)) {
      this.formData.abilityPointBuyBudget = Number(settings.defaultPointBuyBudget) || 15;
    }
    this.formData.abilityPriority = normalizeAbilityPriority(
      this.formData.abilityPriority,
      this.selectedTemplate?.primaryAbility,
    );

    // Ability scores with labels
    const abilities = [
      { key: "str", label: "Strength", value: this.formData.abilities?.str ?? 10, pinned: this.formData.abilityPins?.str !== undefined },
      { key: "dex", label: "Dexterity", value: this.formData.abilities?.dex ?? 10, pinned: this.formData.abilityPins?.dex !== undefined },
      { key: "con", label: "Constitution", value: this.formData.abilities?.con ?? 10, pinned: this.formData.abilityPins?.con !== undefined },
      { key: "int", label: "Intelligence", value: this.formData.abilities?.int ?? 10, pinned: this.formData.abilityPins?.int !== undefined },
      { key: "wis", label: "Wisdom", value: this.formData.abilities?.wis ?? 10, pinned: this.formData.abilityPins?.wis !== undefined },
      { key: "cha", label: "Charisma", value: this.formData.abilities?.cha ?? 10, pinned: this.formData.abilityPins?.cha !== undefined }
    ];
    const abilityLabels: Record<AbilityKey, string> = {
      str: 'Strength', dex: 'Dexterity', con: 'Constitution',
      int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma',
    };
    const pointShares = splitPointBuyBudget(this.formData.abilityPointBuyBudget ?? 15, this.formData.abilityPriority);
    const abilityPriorityRows = this.formData.abilityPriority.map((key, index) => {
      const pinnedValue = this.formData.abilityPins?.[key];
      const allocationNote = pinnedValue !== undefined
        ? `Pinned ${pinnedValue}`
        : this.formData.abilityGenerationMethod === 'pointBuy'
          ? `${pointShares[key]} pts`
          : this.formData.abilityGenerationMethod === 'standardArray'
            ? `Array ${STANDARD_ARRAY[index]}`
            : '';
      return {
        key,
        label: abilityLabels[key],
        rank: index + 1,
        pinned: pinnedValue !== undefined,
        pinnedValue,
        allocationNote,
      };
    });
    const abilityMethods = [
      { id: 'manual', label: 'Manual', icon: 'fas fa-pen', selected: this.formData.abilityGenerationMethod === 'manual' },
      { id: 'standardArray', label: 'Standard Array', icon: 'fas fa-list-ol', selected: this.formData.abilityGenerationMethod === 'standardArray' },
      { id: 'pointBuy', label: 'Auto Buy', icon: 'fas fa-coins', selected: this.formData.abilityGenerationMethod === 'pointBuy' },
      { id: 'roll3d6', label: '3d6', icon: 'fas fa-dice', selected: this.formData.abilityGenerationMethod === 'roll3d6' },
      { id: 'roll4d6DropLowest', label: '4d6 Drop Lowest', icon: 'fas fa-dice-d20', selected: this.formData.abilityGenerationMethod === 'roll4d6DropLowest' },
    ];

    // Get default budgets
    const defaultBudgets = this.getDefaultBudgets();
    
    // Format budget percentages for display (use current value or default)
    const magicItemBudgets = {
      shieldPercent: this.formData.magicItemBudgets?.shieldPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.shieldPercent * 100) 
        : defaultBudgets.shieldPercent,
      armorPercent: this.formData.magicItemBudgets?.armorPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.armorPercent * 100) 
        : defaultBudgets.armorPercent,
      secondaryWeaponPercent: this.formData.magicItemBudgets?.secondaryWeaponPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.secondaryWeaponPercent * 100) 
        : defaultBudgets.secondaryWeaponPercent,
      ringPercent: this.formData.magicItemBudgets?.ringPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.ringPercent * 100) 
        : defaultBudgets.ringPercent,
      amuletPercent: this.formData.magicItemBudgets?.amuletPercent !== undefined 
        ? Math.round(this.formData.magicItemBudgets.amuletPercent * 100) 
        : defaultBudgets.amuletPercent
    };

    // Resolve the same spending plan used by generation for the live preview.
    let budgetInfo = null;
    
    if (this.formData.classLevel && this.formData.className) {
      // Import wealth calculation (dynamic to avoid circular deps)
      const { getWealthForLevel } = await import('../data/wealth');
      const { calculateKitCost } = await import('../data/equipment-resolver');
      
      const level = this.formData.classLevel;
      const className = this.formData.className;
      
      const totalWealth = getWealthForLevel(level, className, this.getBudgetMode() === "npcWealth");
      
      // Calculate mundane equipment cost if template has starting kit
      let mundaneCost = 0;
      if (this.selectedTemplate?.startingKit) {
        mundaneCost = calculateKitCost(this.selectedTemplate.startingKit, level);
      }

      // Display and budget math are in whole GP; ignore silver/copper-level precision.
      mundaneCost = Math.round(mundaneCost);
      
      const currentPlan = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(this.getBudgetMode());
      const planConfig: SpendingPlanConfig = {
        ...currentPlan,
        wealth: {
          ...currentPlan.wealth,
          mode: this.getBudgetMode(),
          reservePercent: this.formData.reserveGoldPercent ?? currentPlan.wealth.reservePercent,
        },
      };
      this.formData.spendingPlan = planConfig;
      const resolvedPlan = resolveSpendingPlan({
        level,
        className,
        hasShield: !!this.selectedTemplate?.startingKit?.shield,
        totalWealthGp: totalWealth,
        mundaneCostGp: mundaneCost,
        config: planConfig,
        legacyMagicItemBudgets: this.formData.magicItemBudgets,
      });
      const casterFocused = ['pureCaster', 'clericCaster', 'druidCaster'].includes(resolvedPlan.profile);
      const categoryLabels: Record<string, string> = {
        weapon: casterFocused ? 'Backup Weapon' : 'Weapon',
        armor: 'Armor & Shield',
        abilityItem: 'Ability Item',
        resistance: 'Save Resistance',
        protection: 'AC Protection',
        consumables: 'Consumables',
        rodsStaves: casterFocused ? 'Caster Implements (Staffs & Rods)' : 'Rods & Staves',
        mightyFists: 'Mighty Fists',
      };
      const categories = Object.values(resolvedPlan.categories)
        .filter(category => category.applicable)
        .sort((left, right) => left.priority - right.priority)
        .map(category => ({
          ...category,
          label: categoryLabels[category.key],
          percent: (category.shareBasisPoints / 100).toFixed(2).replace(/\.00$/, ''),
          maxPercent: (category.maxShareBasisPoints / 100).toFixed(2).replace(/\.00$/, ''),
          priorityDisplay: category.priority + 1,
          itemLimit: category.itemLimit,
        }));
      this.resolvedSpendingPriority = categories.filter(category => category.enabled).map(category => category.key);
      
      const resolvedSplits = resolvedPlan.splits as Record<SpendingSplitKey, number>;
      if (!this.spendingSplitDraft) this.spendingSplitDraft = { ...resolvedSplits };
      const splitValues = { ...resolvedSplits, ...this.spendingSplitDraft } as Record<SpendingSplitKey, number>;
      const protectionOtherLabel = resolvedPlan.profile === 'monk'
        ? 'Bracers'
        : resolvedPlan.profile === 'pureCaster'
          ? 'Amulet & Bracers'
          : 'Other Protection';
      const splitLabels: Record<SpendingSplitKey, string> = {
        primaryWeaponBasisPoints: casterFocused ? 'Backup Weapon' : 'Primary Weapon',
        secondaryWeaponBasisPoints: 'Secondary Weapon',
        armorBasisPoints: 'Armor',
        shieldBasisPoints: 'Shield',
        ringBasisPoints: 'Ring',
        otherProtectionBasisPoints: protectionOtherLabel,
        wandsBasisPoints: 'Wands',
        scrollsBasisPoints: 'Scrolls',
        potionsBasisPoints: 'Potions',
      };
      const splitGroupLabels: Record<SpendingSplitGroupKey, { label: string; parent: string }> = {
        weapon: { label: casterFocused ? 'Backup Weapon Mix' : 'Weapon Mix', parent: casterFocused ? 'Backup Weapon category' : 'Weapon category' },
        armor: { label: 'Armor Mix', parent: 'Armor & Shield category' },
        protection: { label: 'Protection Mix', parent: 'AC Protection category' },
        consumables: { label: 'Consumables Mix', parent: 'Consumables category' },
      };
      const splitGroups = (Object.keys(SPENDING_SPLIT_GROUPS) as SpendingSplitGroupKey[])
        .filter(group => group === 'protection' || group === 'consumables' || resolvedPlan.categories[group].applicable)
        .map(group => {
        const keys = SPENDING_SPLIT_GROUPS[group] as readonly SpendingSplitKey[];
        const totalBasisPoints = keys.reduce((sum, key) => sum + (splitValues[key] ?? 0), 0);
        return {
          key: group,
          ...splitGroupLabels[group],
          totalPercent: totalBasisPoints / 100,
          remainingPercent: Math.max(0, BASIS_POINTS_TOTAL - totalBasisPoints) / 100,
          valid: totalBasisPoints === BASIS_POINTS_TOTAL,
          members: keys.map(key => {
            const otherTotal = keys.filter(other => other !== key).reduce((sum, other) => sum + (splitValues[other] ?? 0), 0);
            const feedback = this.splitClampFeedback?.group === group && this.splitClampFeedback.key === key
              ? this.splitClampFeedback
              : null;
            return {
              key,
              label: splitLabels[key],
              percent: (splitValues[key] ?? 0) / 100,
              maxPercent: Math.max(0, BASIS_POINTS_TOTAL - otherTotal) / 100,
              invalid: feedback !== null,
              message: feedback?.message,
            };
          }),
        };
      });
      const overallCategoryTotal = categories.reduce((sum, category) => sum + category.shareBasisPoints, 0) / 100;

      budgetInfo = {
        totalWealth: resolvedPlan.totalWealthGp,
        mundaneCost: resolvedPlan.mundaneCostGp,
        grossMagicBudget: resolvedPlan.grossMagicBudgetGp,
        reservedGp: resolvedPlan.reservedGp,
        spendableGp: resolvedPlan.spendableGp,
        profile: resolvedPlan.profile,
        preset: resolvedPlan.preset,
        categories,
        warnings: resolvedPlan.warnings,
        showAdvanced: this.showAdvancedSpendingPlan,
        multiplierPercent: resolvedPlan.wealth.multiplierPercent,
        splitGroups,
        overallCategoryTotal,
        categoryHeading: casterFocused ? 'Overall Magic Budget (includes Backup Weapon and Caster Implements)' : 'Overall Magic Budget',
      };
    }

    return {
      templates: this.templates,
      selectedTemplate: this.selectedTemplate,
      selectedTemplateDetail: this.selectedTemplate ? buildTemplateDetailView(this.selectedTemplate) : null,
      showTemplateDetail: this.templateView === 'details' && this.selectedTemplate !== null,
      templateLoadError: this.templateLoadError,
      formData: {
        ...this.formData,
        magicItemBudgets
      },
      abilities,
      abilityPriorityRows,
      abilityMethods,
      pointBuyBudgets: POINT_BUY_BUDGETS.map(value => ({
        value,
        selected: this.formData.abilityPointBuyBudget === value,
      })),
      isPointBuy: this.formData.abilityGenerationMethod === 'pointBuy',
      isRollMethod: this.formData.abilityGenerationMethod === 'roll3d6'
        || this.formData.abilityGenerationMethod === 'roll4d6DropLowest',
      abilityRollPool: this.formData.abilityRollPool?.join(', '),
      abilityWarnings: normalizeAbilityPins(this.formData.abilityPins).warnings,
      settings,
      races: this.availableRaces,
      classes: this.availableClasses,
      lootProfiles: SRD_LOOT_PROFILES,
      spendingPresets: [
        { id: 'classRecommended', label: 'Class Recommended', selected: this.formData.spendingPlan?.preset === 'classRecommended' },
        { id: 'frontlineOffense', label: 'Frontline Offense', selected: this.formData.spendingPlan?.preset === 'frontlineOffense' },
        { id: 'defensive', label: 'Defensive', selected: this.formData.spendingPlan?.preset === 'defensive' },
        { id: 'spellcaster', label: 'Spellcaster', selected: this.formData.spendingPlan?.preset === 'spellcaster' },
        { id: 'support', label: 'Consumables & Support', selected: this.formData.spendingPlan?.preset === 'support' },
      ],
      wizardFooter: buildWizardFooterState(
        this.activePrimaryTab,
        this.selectedTemplate !== null,
        this.lastCreationTab,
      ),
      budgetInfo
    };
  }

  activateListeners(html: any): void {
    super.activateListeners(html);

    const events = bindDelegatedEvents(html);

    // Template selection
    events.on("click", "[data-action='select-template']", (ev) => {
      const templateId = ev.currentTarget.dataset.templateId;
      if (!templateId) return;
      this.selectTemplate(templateId);
    });

    events.on("click", ".tabs [data-tab]", (ev) => {
      const tab = ev.currentTarget.dataset.tab as PrimaryTab | undefined;
      if (!tab) return;
      this.activePrimaryTab = tab;
      if (isCreationTab(tab)) this.lastCreationTab = tab;
      setTimeout(() => this.updateWizardFooterDom(), 0);
    });

    events.on("click", "[data-action='template-gallery-back']", () => {
      this.templateView = 'gallery';
      this.renderAndRestoreTab();
    });

    events.on("click", "[data-action='wizard-back']", () => {
      this.syncFormDataFromRenderedInputs();
      const previous = isCreationTab(this.activePrimaryTab)
        ? previousCreationTab(this.activePrimaryTab)
        : null;
      if (previous) this.navigateToTab(previous);
    });

    events.on("click", "[data-action='wizard-next']", () => {
      this.syncFormDataFromRenderedInputs();
      if (!this.validateWizardStep(this.activePrimaryTab)) return;
      const next = isCreationTab(this.activePrimaryTab) ? nextCreationTab(this.activePrimaryTab) : null;
      if (next) this.navigateToTab(next);
    });

    events.on("click", "[data-action='return-to-flow']", () => {
      this.syncFormDataFromRenderedInputs();
      this.navigateToTab(this.lastCreationTab);
    });

    // Form inputs
    events.on("change", "[data-field]", (ev) => {
      const current = ev.currentTarget;
      const field = current.dataset.field;
      if (!field) return;

      let value: any = getElementValue(current);

      if (current instanceof HTMLInputElement && current.type === "checkbox") {
        value = getElementChecked(current);
      }

      if (
        field === "usePcSheet" ||
        field === "useMaxHpPerHD" ||
        field === "includeLootPacks" ||
        field === "lootProfile" ||
        field === "identifyItems" ||
        field === "extraMoneyInBank" ||
        field === "keepPocketChange"
      ) {
        // @ts-ignore
        this.formData[field] = value;
        this.persistConfigSettings();
        this.render(false);
        return;
      }

      if (field === "budgetMode") {
        this.applyBudgetMode(value as BudgetMode);
        this.persistConfigSettings();
        this.render(false);
        return;
      }

      if (field === "useStandardBudget" || field === "useNpcWealth") {
        this.applyBudgetMode(field === "useStandardBudget"
          ? (value ? "standardBudget" : "noBudget")
          : (value ? "npcWealth" : "noBudget"));
        this.persistConfigSettings();
        this.render(false);
        return;
      }

      // Parse numeric fields
      if (field === "classLevel") {
        value = parseInt(value as string) || 1;

        // Check if level crosses the 17 threshold and budgets haven't been customized
        const oldLevel = this.formData.classLevel || 1;
        const newLevel = value;

        // If crossing threshold and no custom budgets set, update to new defaults
        if ((oldLevel < 17 && newLevel >= 17) || (oldLevel >= 17 && newLevel < 17)) {
          // Only auto-update if user hasn't customized budgets
          if (!this.formData.magicItemBudgets || Object.keys(this.formData.magicItemBudgets).length === 0) {
            // Will be auto-populated with new defaults on render
            this.formData.magicItemBudgets = {};
          }
        }
      }

      if (field === "reserveGoldPercent") {
        value = parseIntegerWithFallback(value, this.formData.reserveGoldPercent ?? 0, 0, 100);
        const currentPlan = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(this.getBudgetMode());
        this.formData.spendingPlan = {
          ...currentPlan,
          wealth: { ...currentPlan.wealth, reservePercent: value },
        };
      }

      this.updateFormData(field, value);

      // Smart name regeneration based on what changed
      if (field === "race" && this.formData.race && this.formData.className && this.formData.name) {
        this.regenerateRacialName();
        this.render(false);
      } else if (field === "gender" && this.formData.gender && this.formData.name) {
        this.regenerateFirstName();
        this.render(false);
      } else if (field === "className") {
        this.spendingSplitDraft = null;
        this.splitClampFeedback = null;
        if (this.formData.className && this.formData.race && this.formData.name) {
          this.regenerateClassTitle();
        }
        this.render(false);
      } else if (field === "classLevel") {
        this.render(false);
      }
    });

    // Ability score inputs
    events.on("change", "[data-ability]", (ev) => {
      const ability = ev.currentTarget.dataset.ability;
      if (!ability) return;
      const parsed = Number.parseInt(String(getElementValue(ev.currentTarget)), 10);
      const value = Number.isFinite(parsed) ? parsed : 10;
      this.updateAbilityScore(ability, value);
    });

    // Budget percentage inputs
    events.on("change", "[data-budget]", (ev) => {
      const budgetField = ev.currentTarget.dataset.budget;
      if (!budgetField) return;

      const value = getElementValue(ev.currentTarget);

      // If empty string, delete the override to use default
      if (value === "" || value === null || value === undefined) {
        if (this.formData.magicItemBudgets) {
          delete this.formData.magicItemBudgets[budgetField];
        }
      } else {
        const numValue = parseFloat(value as string);
        if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
          if (!this.formData.magicItemBudgets) {
            this.formData.magicItemBudgets = {};
          }
          // Convert percentage to decimal (e.g., 50 -> 0.5)
          this.formData.magicItemBudgets[budgetField] = numValue / 100;
        }
      }
      this.persistConfigSettings();
      console.log("Budget updated:", budgetField, this.formData.magicItemBudgets);
    });

    events.on("click", "[data-action='select-spending-preset']", (ev) => {
      const preset = ev.currentTarget.dataset.preset as SpendingPresetId | undefined;
      if (!preset) return;
      const current = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(this.getBudgetMode());
      this.formData.spendingPlan = {
        ...current,
        preset,
        categories: undefined,
      };
      this.spendingSplitDraft = null;
      this.splitClampFeedback = null;
      this.persistConfigSettings();
      this.render(false);
    });

    events.on("click", "[data-action='toggle-advanced-spending']", () => {
      this.showAdvancedSpendingPlan = !this.showAdvancedSpendingPlan;
      this.render(false);
    });

    events.on("change", "[data-spending-share]", (ev) => {
      const category = ev.currentTarget.dataset.spendingShare as SpendingCategory | undefined;
      if (!category) return;
      const percent = parseIntegerWithFallback(getElementValue(ev.currentTarget), 0, 0, 100);
      this.updateSpendingCategory(category, { shareBasisPoints: percent * 100 });
    });

    events.on("change", "[data-spending-cap]", (ev) => {
      const category = ev.currentTarget.dataset.spendingCap as SpendingCategory | undefined;
      if (!category) return;
      const percent = parseIntegerWithFallback(getElementValue(ev.currentTarget), 100, 0, 100);
      this.updateSpendingCategory(category, { maxShareBasisPoints: percent * 100 });
    });

    events.on("change", "[data-spending-enabled]", (ev) => {
      const category = ev.currentTarget.dataset.spendingEnabled as SpendingCategory | undefined;
      if (!category) return;
      this.updateSpendingCategory(category, { enabled: getElementChecked(ev.currentTarget) });
    });

    events.on("change", "[data-spending-item-limit]", (ev) => {
      const category = ev.currentTarget.dataset.spendingItemLimit as SpendingCategory | undefined;
      if (!category) return;
      const raw = getElementValue(ev.currentTarget);
      const itemLimit = raw === '' ? undefined : parseIntegerWithFallback(raw, 0, 0, 100);
      this.updateSpendingCategory(category, { itemLimit });
    });

    events.on("click", "[data-action='move-spending-category']", (ev) => {
      const category = ev.currentTarget.dataset.category as SpendingCategory | undefined;
      const direction = ev.currentTarget.dataset.direction === 'up' ? -1 : 1;
      if (!category) return;
      const currentIndex = this.resolvedSpendingPriority.indexOf(category);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= this.resolvedSpendingPriority.length) return;
      const reordered = [...this.resolvedSpendingPriority];
      [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
      reordered.forEach((key, priority) => this.updateSpendingCategory(key, { priority }, false));
      this.persistConfigSettings();
      this.render(false);
    });

    events.on("change", "[data-spending-multiplier]", (ev) => {
      const multiplierPercent = parseIntegerWithFallback(getElementValue(ev.currentTarget), 100, 0, 200);
      const current = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(this.getBudgetMode());
      this.formData.spendingPlan = {
        ...current,
        wealth: { ...current.wealth, multiplierPercent },
      };
      this.persistConfigSettings();
      this.render(false);
    });

    events.on("change", "[data-spending-split]", (ev) => {
      const split = ev.currentTarget.dataset.spendingSplit as SpendingSplitKey | undefined;
      const group = ev.currentTarget.dataset.spendingGroup as SpendingSplitGroupKey | undefined;
      if (!split || !group) return;
      const requestedPercent = Number.parseFloat(String(getElementValue(ev.currentTarget)));
      const percent = Number.isFinite(requestedPercent) ? Math.min(100, Math.max(0, requestedPercent)) : 0;
      const current = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(this.getBudgetMode());
      const resolvedCurrent = this.spendingSplitDraft ?? current.splits ?? {};
      const completeCurrent = Object.fromEntries(
        Object.values(SPENDING_SPLIT_GROUPS).flat().map(key => [key, resolvedCurrent[key] ?? 0]),
      ) as Record<SpendingSplitKey, number>;
      const result = clampSplitGroupEdit(completeCurrent, group, split, Math.round(percent * 100));
      this.spendingSplitDraft = result.values;
      this.splitClampFeedback = result.clamped
        ? {
            group,
            key: split,
            message: `Clamped to ${result.acceptedBasisPoints / 100}%; the other items already use ${(BASIS_POINTS_TOTAL - result.maximumBasisPoints) / 100}%.`,
          }
        : null;
      this.formData.spendingPlan = { ...current, splits: { ...result.values } };
      this.persistConfigSettings();
      this.render(false);
    });

    // Reset budgets button - restore to current defaults
    events.on("click", "[data-action='reset-budgets']", () => {
      const defaults = this.getDefaultBudgets();
      this.formData.magicItemBudgets = {
        shieldPercent: defaults.shieldPercent / 100,
        armorPercent: defaults.armorPercent / 100,
        secondaryWeaponPercent: defaults.secondaryWeaponPercent / 100,
        ringPercent: defaults.ringPercent / 100,
        amuletPercent: defaults.amuletPercent / 100
      };
      this.render(false);
    });

    events.on("click", "[data-action='apply-standard-array']", () => {
      this.applyStandardArray();
    });

    events.on("click", "[data-action='roll-abilities']", () => {
      this.generateCurrentAbilityScores(true);
    });

    events.on("click", "[data-action='select-ability-method']", (ev) => {
      const method = ev.currentTarget.dataset.method as AbilityGenerationMethod | undefined;
      if (!method) return;
      this.formData.abilityGenerationMethod = method;
      this.persistConfigSettings();
      if (method === 'manual') {
        this.render(false);
      } else {
        this.generateCurrentAbilityScores(method === 'roll3d6' || method === 'roll4d6DropLowest');
      }
    });

    events.on("change", "[data-ability-budget]", (ev) => {
      this.formData.abilityPointBuyBudget = parseIntegerWithFallback(getElementValue(ev.currentTarget), 15, 0, 100);
      this.persistConfigSettings();
      if (this.formData.abilityGenerationMethod === 'pointBuy') this.generateCurrentAbilityScores(false);
    });

    events.on("click", "[data-action='move-ability-priority']", (ev) => {
      const ability = ev.currentTarget.dataset.ability as AbilityKey | undefined;
      const direction = ev.currentTarget.dataset.direction === 'up' ? -1 : 1;
      if (!ability) return;
      const priority = normalizeAbilityPriority(this.formData.abilityPriority);
      const currentIndex = priority.indexOf(ability);
      const targetIndex = currentIndex + direction;
      if (currentIndex < 0 || targetIndex < 0 || targetIndex >= priority.length) return;
      [priority[currentIndex], priority[targetIndex]] = [priority[targetIndex], priority[currentIndex]];
      this.formData.abilityPriority = priority;
      if (this.formData.abilityGenerationMethod === 'roll3d6'
        || this.formData.abilityGenerationMethod === 'roll4d6DropLowest') {
        this.formData.abilities = assignRollPool(
          this.formData.abilityRollPool ?? [],
          priority,
          this.formData.abilityPins,
        );
        this.render(false);
      } else {
        this.generateCurrentAbilityScores(false);
      }
    });

    events.on("click", "[data-action='unpin-ability']", (ev) => {
      const ability = ev.currentTarget.dataset.ability as AbilityKey | undefined;
      if (!ability || !this.formData.abilityPins) return;
      delete this.formData.abilityPins[ability];
      this.generateCurrentAbilityScores(false);
    });

    events.on("click", "[data-action='randomize-name']", () => {
      this.randomizeName();
    });

    events.on("click", "[data-action='create-npc']", (ev) => {
      ev.preventDefault();
      this.createNPC();
    });

    events.on("click", "[data-action='cancel']", () => {
      this.close();
    });

    setTimeout(() => this.activatePrimaryTab(this.activePrimaryTab), 0);
  }

  private selectTemplate(templateId: string): void {
    // Save scroll position of the template tab before re-render
    const templateTab = this.getRootElement()?.querySelector('.tab[data-tab="template"]') as HTMLElement | null;
    const scrollTop = templateTab?.scrollTop || 0;
    
    this.selectedTemplate = this.templates.find(t => t.id === templateId) || null;
    this.templateView = this.selectedTemplate ? 'details' : 'gallery';
    this.activePrimaryTab = 'template';
    this.lastCreationTab = 'template';
    
    if (this.selectedTemplate) {
      // Pre-fill form with template data
      this.formData.race = this.selectedTemplate.race || "";
      this.formData.classes = this.selectedTemplate.classes || [];
      this.formData.className = "";
      this.formData.classLevel = 1;
      this.formData.alignment = this.selectedTemplate.alignment || "";
      
      // Set first class name and level from template
      if (this.selectedTemplate.classes && this.selectedTemplate.classes.length > 0) {
        this.formData.className = this.selectedTemplate.classes[0].name;
        // Ensure level is always a number
        this.formData.classLevel = parseInt(this.selectedTemplate.classes[0].level as any) || 1;
      }
      
      // Apply ability score modifiers
      if (this.selectedTemplate.abilities) {
        this.formData.abilityPins = { ...this.selectedTemplate.abilities };
      } else {
        this.formData.abilityPins = {};
      }
      this.formData.abilityPriority = normalizeAbilityPriority(
        this.selectedTemplate.abilityPriority,
        this.selectedTemplate.primaryAbility,
      );
      this.generateCurrentAbilityScores(
        this.formData.abilityGenerationMethod === 'roll3d6'
          || this.formData.abilityGenerationMethod === 'roll4d6DropLowest',
        false,
      );
      
      // Load magic item budget overrides from template
      if (this.selectedTemplate.magicItemBudgets) {
        this.formData.magicItemBudgets = { ...this.selectedTemplate.magicItemBudgets };
      } else {
        this.formData.magicItemBudgets = {};
      }
      this.formData.spendingPlan = this.selectedTemplate.spendingPlan
        ? structuredClone(this.selectedTemplate.spendingPlan)
        : createDefaultSpendingPlanConfig();
      this.spendingSplitDraft = null;
      this.splitClampFeedback = null;
      
      // A complete spending plan is canonical; legacy fields remain fallbacks.
      const primaryClassName = this.selectedTemplate.classes?.[0]?.name || '';
      this.applyBudgetMode(
        normalizeBudgetMode(
          this.selectedTemplate.spendingPlan?.wealth.mode ?? this.selectedTemplate.budgetMode,
          deriveBudgetModeFromFlags(
            this.selectedTemplate.useStandardBudget !== false,
            primaryClassName.includes('(NPC)')
          )
        )
      );
      this.formData.reserveGoldPercent = this.selectedTemplate.spendingPlan?.wealth.reservePercent
        ?? this.formData.reserveGoldPercent
        ?? 0;
      
      // Load usePcSheet from template (default to true if not specified)
      this.formData.usePcSheet = this.selectedTemplate.usePcSheet !== false;
      
      // Load useMaxHpPerHD from template (default to false if not specified)
      this.formData.useMaxHpPerHD = this.selectedTemplate.useMaxHpPerHD === true;

      // Prefill flavor fields
      this.formData.personality = this.selectedTemplate.personality || "";
      this.formData.background = this.selectedTemplate.background || "";
      
      // Auto-generate name for non-blank templates
      if (this.selectedTemplate.id !== 'blank' && this.formData.race && this.formData.className) {
        this.generateAndSetName();
      }
    }
    
    // Render and restore scroll position
    // Note: render() may not return a Promise in all Foundry versions
    const renderResult = this.render(false);
    if (renderResult && typeof renderResult.then === 'function') {
      renderResult.then(() => {
        // Restore scroll position after render completes
        if (scrollTop > 0) {
          const newTemplateTab = this.getRootElement()?.querySelector('.tab[data-tab="template"]') as HTMLElement | null;
          if (newTemplateTab) newTemplateTab.scrollTop = scrollTop;
        }
      });
    } else {
      // Fallback for synchronous render
      setTimeout(() => {
        if (scrollTop > 0) {
          const newTemplateTab = this.getRootElement()?.querySelector('.tab[data-tab="template"]') as HTMLElement | null;
          if (newTemplateTab) newTemplateTab.scrollTop = scrollTop;
        }
      }, 10);
    }
  }

  private updateFormData(field: string, value: any): void {
    // @ts-ignore
    this.formData[field] = value;
  }

  private renderAndRestoreTab(): void {
    const result = this.render(false);
    if (result && typeof result.then === 'function') {
      result.then(() => this.activatePrimaryTab(this.activePrimaryTab));
    } else {
      setTimeout(() => this.activatePrimaryTab(this.activePrimaryTab), 10);
    }
  }

  private activatePrimaryTab(tab: PrimaryTab): void {
    const tabController = (this as any)._tabs?.[0];
    if (tabController?.activate) {
      tabController.activate(tab, { triggerCallback: false });
    } else {
      const root = this.getRootElement();
      root?.querySelector<HTMLElement>(`.tabs [data-tab="${tab}"]`)?.click();
    }
    this.updateWizardFooterDom();
  }

  private navigateToTab(tab: CreationTab): void {
    this.activePrimaryTab = tab;
    this.lastCreationTab = tab;
    this.activatePrimaryTab(tab);
    setTimeout(() => {
      const heading = this.getRootElement()?.querySelector<HTMLElement>(`.tab[data-tab="${tab}"] .section-header`);
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
    }, 0);
  }

  private validateWizardStep(tab: PrimaryTab): boolean {
    if (tab === 'template' && !this.selectedTemplate) {
      ui.notifications?.warn('Choose a template before continuing.');
      return false;
    }
    if (tab === 'details') {
      const missing = [
        !this.formData.name ? 'name' : '',
        !this.formData.race ? 'race' : '',
        !this.formData.className ? 'class' : '',
      ].filter(Boolean);
      if (missing.length > 0) {
        ui.notifications?.warn(`Complete the required details: ${missing.join(', ')}.`);
        return false;
      }
    }
    return true;
  }

  private updateWizardFooterDom(): void {
    const state = buildWizardFooterState(
      this.activePrimaryTab,
      this.selectedTemplate !== null,
      this.lastCreationTab,
    );
    const root = this.getRootElement();
    if (!root) return;
    const visibility: Record<string, boolean> = {
      cancel: state.showCancel,
      back: state.showBack,
      createNow: state.showCreateNow,
      next: state.showNext,
      finalCreate: state.showFinalCreate,
      returnToFlow: state.showReturnToFlow,
    };
    for (const [key, visible] of Object.entries(visibility)) {
      const element = root.querySelector<HTMLElement>(`[data-footer-action="${key}"]`);
      if (element) element.hidden = !visible;
    }
    const nextButton = root.querySelector<HTMLButtonElement>('[data-footer-action="next"]');
    if (nextButton) nextButton.disabled = state.nextDisabled;
    const returnLabel = root.querySelector<HTMLElement>('[data-return-label]');
    if (returnLabel) returnLabel.textContent = state.returnLabel;
  }

  private updateSpendingCategory(
    category: SpendingCategory,
    updates: Partial<NonNullable<SpendingPlanConfig['categories']>[SpendingCategory]>,
    render: boolean = true,
  ): void {
    const current = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(this.getBudgetMode());
    this.formData.spendingPlan = {
      ...current,
      categories: {
        ...current.categories,
        [category]: { ...current.categories?.[category], ...updates },
      },
    };
    if (render) {
      this.persistConfigSettings();
      this.render(false);
    }
  }

  private updateAbilityScore(ability: string, value: number): void {
    if (!this.formData.abilities) {
      this.formData.abilities = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
    }
    // @ts-ignore
    this.formData.abilities[ability] = value;
    if (this.formData.abilityPins && this.formData.abilityPins[ability as AbilityKey] !== undefined) {
      this.formData.abilityPins[ability as AbilityKey] = value;
    }
  }

  private applyBudgetMode(mode: BudgetMode): void {
    const normalized = normalizeBudgetMode(mode);
    const flags = budgetModeToFlags(normalized);

    this.formData.budgetMode = normalized;
    this.formData.useStandardBudget = flags.useStandardBudget;
    this.formData.useNpcWealth = flags.useNpcWealth;
    const currentPlan = this.formData.spendingPlan ?? createDefaultSpendingPlanConfig(normalized);
    this.formData.spendingPlan = {
      ...currentPlan,
      wealth: { ...currentPlan.wealth, mode: normalized },
    };
  }

  private syncBudgetModeState(): void {
    const mode = normalizeBudgetMode(
      this.formData.budgetMode,
      deriveBudgetModeFromFlags(this.formData.useStandardBudget, this.formData.useNpcWealth)
    );

    this.applyBudgetMode(mode);
  }

  private getBudgetMode(): BudgetMode {
    return normalizeBudgetMode(this.formData.budgetMode, deriveBudgetModeFromFlags(this.formData.useStandardBudget, this.formData.useNpcWealth));
  }

  /**
   * Foundry/browser `change` events for text/number inputs often only fire on blur.
   * To avoid requiring blur, sync current rendered input values when the user clicks Create.
   */
  private syncFormDataFromRenderedInputs(): void {
    const root = this.getRootElement();
    if (!root) return;

    // General form fields
    root.querySelectorAll<HTMLElement>("[data-field]").forEach((el) => {
      const field = el.dataset.field;

      if (!field) return;

      // Radios share the same data-field; only sync the checked option.
      if (el instanceof HTMLInputElement && el.type === "radio") {
        if (!el.checked) return;
        // @ts-ignore
        this.formData[field] = el.value;
        return;
      }

      // Checkboxes
      if (el instanceof HTMLInputElement && el.type === "checkbox") {
        // @ts-ignore
        this.formData[field] = el.checked;
        return;
      }

      // Numbers
      if (field === "classLevel") {
        const raw = getElementValue(el);
        const parsed = parseIntegerWithFallback(raw, this.formData.classLevel || 1, 1, 20);
        // @ts-ignore
        this.formData[field] = parsed;
        return;
      }

      if (field === "reserveGoldPercent") {
        const raw = getElementValue(el);
        const parsed = parseIntegerWithFallback(raw, this.formData.reserveGoldPercent || 0, 0, 100);
        // @ts-ignore
        this.formData[field] = parsed;
        return;
      }

      if (field === "tokenDisposition") {
        const raw = getElementValue(el);
        const parsed = parseIntegerWithFallback(raw, 0, -1, 1);
        // @ts-ignore
        this.formData[field] = parsed;
        return;
      }

      // Everything else (text/select/textarea)
      // @ts-ignore
      this.formData[field] = getElementValue(el);
    });

    // Abilities
    root.querySelectorAll<HTMLElement>("input[data-ability]").forEach((el) => {
      const ability = el.dataset.ability;
      const parsed = Number.parseInt(String(getElementValue(el)), 10);
      const value = Number.isFinite(parsed) ? parsed : 10;
      if (ability) this.updateAbilityScore(ability, value);
    });

    // Budget overrides (stored as decimals)
    root.querySelectorAll<HTMLElement>("input[data-budget]").forEach((el) => {
      const budgetField = el.dataset.budget;
      const raw = getElementValue(el);
      if (!budgetField) return;

      if (raw === "" || raw === null || raw === undefined) {
        if (this.formData.magicItemBudgets) {
          delete this.formData.magicItemBudgets[budgetField];
        }
        return;
      }

      const decimalBudget = parseBudgetPercentToDecimal(raw as string);
      if (decimalBudget !== null) {
        if (!this.formData.magicItemBudgets) {
          this.formData.magicItemBudgets = {};
        }
        this.formData.magicItemBudgets[budgetField] = decimalBudget;
      }
    });

    this.persistConfigSettings();
  }

  /**
  * Persist Equipment and Settings values to module-level storage
   * These persist between app opens but reset on page reload
   */
  private persistConfigSettings(): void {
    const budgetMode = this.getBudgetMode();
    persistedConfigSettings = {
      budgetMode,
      ...budgetModeToFlags(budgetMode),
      includeLootPacks: this.formData.includeLootPacks,
      lootProfile: this.formData.lootProfile,
      usePcSheet: this.formData.usePcSheet,
      useMaxHpPerHD: this.formData.useMaxHpPerHD,
      identifyItems: this.formData.identifyItems,
      extraMoneyInBank: this.formData.extraMoneyInBank,
      reserveGoldPercent: this.formData.reserveGoldPercent,
      keepPocketChange: this.formData.keepPocketChange,
      bankName: this.formData.bankName,
      tokenDisposition: this.formData.tokenDisposition,
      magicItemBudgets: this.formData.magicItemBudgets ? { ...this.formData.magicItemBudgets } : {},
      spendingPlan: this.formData.spendingPlan ? structuredClone(this.formData.spendingPlan) : undefined,
      abilityGenerationMethod: this.formData.abilityGenerationMethod,
      abilityPointBuyBudget: this.formData.abilityPointBuyBudget
    };
    console.log("TownieMakerApp | Persisted config settings:", persistedConfigSettings);
  }

  private normalizeAbilityGenerationMethod(value: unknown): AbilityGenerationMethod {
    if (value === 'manual' || value === 'custom') return 'manual';
    if (value === 'pointBuy') return 'pointBuy';
    if (value === 'roll3d6') return 'roll3d6';
    if (value === 'roll4d6DropLowest' || value === 'roll') return 'roll4d6DropLowest';
    return 'standardArray';
  }

  private applyStandardArray(): void {
    this.formData.abilityGenerationMethod = 'standardArray';
    this.generateCurrentAbilityScores(false);
  }

  private generateCurrentAbilityScores(reroll: boolean, render: boolean = true): void {
    const method = this.formData.abilityGenerationMethod ?? 'standardArray';
    const isRollMethod = method === 'roll3d6' || method === 'roll4d6DropLowest';
    const result = generateAbilityScores({
      method,
      priority: this.formData.abilityPriority,
      primaryAbility: this.selectedTemplate?.primaryAbility,
      pins: this.formData.abilityPins,
      pointBuyBudget: this.formData.abilityPointBuyBudget,
      rollPool: isRollMethod && !reroll ? this.formData.abilityRollPool : undefined,
    });
    this.formData.abilities = result.scores;
    this.formData.abilityPriority = result.metadata.priority;
    this.formData.abilityPins = result.metadata.pins;
    this.formData.abilityRollPool = result.metadata.rollPool ?? [];
    if (isRollMethod && reroll) ui.notifications?.info('Ability scores rolled!');
    if (render) this.render(false);
  }

  private generateAndSetName(genderOverride?: 'male' | 'female'): void {
    if (!this.formData.race || !this.formData.className) {
      return;
    }
    
    const gender: 'male' | 'female' = genderOverride || this.formData.gender || 'male';
    
    const name = generateCharacterName(this.formData.race, this.formData.className, gender);
    this.formData.name = name;
  }

  /**
   * Regenerate only the first name (used when gender changes)
   */
  private regenerateFirstName(): void {
    if (!this.formData.race || !this.formData.gender || !this.formData.name) {
      return;
    }

    const currentName = this.formData.name;
    const nameParts = currentName.split(' ');
    
    if (nameParts.length === 0) {
      return;
    }

    // Generate new first name
    const newFirstName = generateFirstName(this.formData.race, this.formData.gender);
    
    // Replace first name, keep everything else
    nameParts[0] = newFirstName;
    this.formData.name = nameParts.join(' ');
  }

  /**
   * Regenerate first and last name, preserve class title if present (used when race changes)
   */
  private regenerateRacialName(): void {
    if (!this.formData.race || !this.formData.className || !this.formData.name) {
      return;
    }

    const currentName = this.formData.name;
    const nameParts = currentName.split(' ');
    
    if (nameParts.length === 0) {
      return;
    }

    // Generate new first and last name
    const newFirstName = generateFirstName(this.formData.race, this.formData.gender || 'male');
    const newSurname = generateSurname(this.formData.race);
    
    // Check if there was a title (3+ parts means title exists)
    if (nameParts.length >= 3) {
      // Keep the title (everything after the surname)
      const title = nameParts.slice(2).join(' ');
      this.formData.name = `${newFirstName} ${newSurname} ${title}`;
    } else {
      this.formData.name = `${newFirstName} ${newSurname}`;
    }
  }

  /**
   * Regenerate class title only (used when class changes)
   */
  private regenerateClassTitle(): void {
    if (!this.formData.race || !this.formData.className || !this.formData.name) {
      return;
    }

    const currentName = this.formData.name;
    const nameParts = currentName.split(' ');
    
    if (nameParts.length < 2) {
      return;
    }

    // Generate new class title
    const newTitle = generateClassTitle(this.formData.race, this.formData.className);
    
    // Keep first and last name, replace or add title
    const firstName = nameParts[0];
    const surname = nameParts[1];
    
    if (newTitle) {
      this.formData.name = `${firstName} ${surname} ${newTitle}`;
    } else {
      // No title generated, just use first and last name
      this.formData.name = `${firstName} ${surname}`;
    }
  }

  private randomizeName(): void {
    if (!this.formData.race || !this.formData.className) {
      ui.notifications?.warn("Please select a race and class first");
      return;
    }

    this.generateAndSetName();
    this.render(false);
  }

  private getPrimaryAbilityFromScores(
    scores: { str: number; dex: number; con: number; int: number; wis: number; cha: number }
  ): "str" | "dex" | "con" | "int" | "wis" | "cha" {
    // Find the ability with the highest score
    let highest: "str" | "dex" | "con" | "int" | "wis" | "cha" = "str";
    let highestValue = scores.str;
    
    for (const [key, value] of Object.entries(scores)) {
      if (value > highestValue) {
        highest = key as "str" | "dex" | "con" | "int" | "wis" | "cha";
        highestValue = value;
      }
    }
    
    return highest;
  }

  private deriveWealthTier(className: string): "unequipped" | "npc_wealth" | "pc_wealth" {
    const budgetMode = this.getBudgetMode();
    if (budgetMode === "noBudget") return WealthTier.UNEQUIPPED;
    if (budgetMode === "npcWealth") return WealthTier.NPC;

    const normalized = normalizeClassKey(className);
    const tier = resolveClassTier(normalized);
    return tier === ClassTier.PC ? WealthTier.PC : WealthTier.NPC;
  }

  private computeGeneratedCR(className: string, classLevel: number): {
    cr: number;
    classTier: "pc_class" | "npc_class" | "noncombat_npc_class";
    wealthTier: "unequipped" | "npc_wealth" | "pc_wealth";
    highestSpellLevel: number;
  } {
    const classTier = resolveClassTier(className);
    const wealthTier = this.deriveWealthTier(className);
    const highestSpellLevel = getHighestSpellLevelAvailable(className, classLevel);

    const cr = calculateGeneratedCharacterCR({
      level: classLevel,
      wealthTier,
      classTier,
      highestSpellLevel,
      roundResult: true,
    });

    return { cr, classTier, wealthTier, highestSpellLevel };
  }

  /**
   * Show/hide the loading overlay
   */
  private setLoading(show: boolean, step?: string, progress?: number): void {
    const root = this.getRootElement();
    if (!root) return;

    const overlay = root.querySelector('.loading-overlay') as HTMLElement | null;
    const stepEl = root.querySelector('.loading-step') as HTMLElement | null;
    const progressBar = root.querySelector('.loading-progress-bar') as HTMLElement | null;
    if (!overlay || !stepEl || !progressBar) return;
    
    if (show) {
      overlay.style.display = 'flex';
      if (step) {
        stepEl.textContent = step;
        this.lastLoadingStepText = step;
        this.lastLoadingStepSetAtMs = Date.now();
      }
      if (progress !== undefined) {
        progressBar.style.width = `${progress}%`;
      }
    } else {
      overlay.style.display = 'none';
      stepEl.textContent = '';
      progressBar.style.width = '0%';
      this.lastLoadingStepText = null;
      this.lastLoadingStepSetAtMs = 0;
    }
  }

  /**
   * Update just the loading step text and progress
   */
  private updateLoadingStep(step: string, progress: number): void {
    const root = this.getRootElement();
    if (!root) return;
    const stepEl = root.querySelector('.loading-step') as HTMLElement | null;
    const progressBar = root.querySelector('.loading-progress-bar') as HTMLElement | null;
    if (stepEl) stepEl.textContent = step;
    if (progressBar) progressBar.style.width = `${progress}%`;
  }

  private async sleep(ms: number): Promise<void> {
    if (ms <= 0) return;
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update the loading step text/progress, ensuring the previous step stayed visible
   * for at least `minDisplayMs` (prevents fast steps from flashing by unreadably).
   */
  private async showLoadingStep(step: string, progress: number, minDisplayMs = 250): Promise<void> {
    // If we're changing the step text too quickly, pause briefly for readability.
    if (this.lastLoadingStepText && this.lastLoadingStepText !== step) {
      const elapsed = Date.now() - this.lastLoadingStepSetAtMs;
      const remaining = minDisplayMs - elapsed;
      if (remaining > 0) {
        await this.sleep(remaining);
      }
    }

    this.updateLoadingStep(step, progress);
    this.lastLoadingStepText = step;
    this.lastLoadingStepSetAtMs = Date.now();
  }

  private async createNPC(): Promise<void> {
    // Ensure we capture the latest typed values even if the user didn't blur the input.
    this.syncFormDataFromRenderedInputs();

    if (this.spendingSplitDraft && this.getBudgetMode() !== 'noBudget') {
      const incompleteGroups = (Object.keys(SPENDING_SPLIT_GROUPS) as SpendingSplitGroupKey[])
        .filter(group => (SPENDING_SPLIT_GROUPS[group] as readonly SpendingSplitKey[])
          .reduce((sum, key) => sum + (this.spendingSplitDraft?.[key] ?? 0), 0) !== BASIS_POINTS_TOTAL);
      if (incompleteGroups.length > 0) {
        ui.notifications?.warn(`Complete each item mix to 100% before creating: ${incompleteGroups.join(', ')}.`);
        return;
      }
    }

    const name = this.formData.name;
    if (!name) {
      ui.notifications?.warn("Please enter a name for the NPC");
      return;
    }

    const abilities = this.formData.abilities || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };

    // Show loading overlay
    this.setLoading(true, 'Initializing...', 0);

    try {
      // Determine actor type based on sheet type selection
      const usePcSheet = this.formData.usePcSheet !== false;
      const actorType = usePcSheet ? 'character' : 'npc';
      const useMaxHp = this.formData.useMaxHpPerHD === true;
      
      const folder = game.settings.get("motwm-townie-maker", "defaultFolder") as string;
      const autoRollHP = game.settings.get("motwm-townie-maker", "autoRollHP") as boolean;
      
      // Use formData for loot options from the Equipment tab.
      const identifyItems = this.formData.identifyItems === true;
      const extraMoneyInBank = this.formData.extraMoneyInBank === true;
      const reserveGoldPercent = Number.isFinite(this.formData.reserveGoldPercent)
        ? Number(this.formData.reserveGoldPercent)
        : 0;
      const keepPocketChange = this.formData.keepPocketChange !== false;
      const bankName = this.formData.bankName || "The First Bank of Lower Everbrook";
      
      console.log(`TownieMakerApp | Creating actor - usePcSheet: ${usePcSheet}, actorType: ${actorType}, useMaxHp: ${useMaxHp}, identifyItems: ${identifyItems}, extraMoneyInBank: ${extraMoneyInBank}`);
      console.log(`TownieMakerApp | Reserve Gold %: ${reserveGoldPercent}, Keep Pocket Change: ${keepPocketChange}`);
      console.log(`TownieMakerApp | Bank name: ${bankName}`);

      // Resolve character images based on race, class, and gender
      await this.showLoadingStep('Resolving character images...', 5);
      const className = this.formData.className || (this.formData.classes?.[0]?.name);
      const classLevel = parseInt(this.formData.classLevel as any) || parseInt(this.formData.classes?.[0]?.level as any) || 1;
      const creationPlan = buildCreationPipelinePlan({
        className,
        classLevel,
        usePcSheet,
        autoRollHP,
      });
      const gender = normalizeGender(this.formData.gender);
      let characterImages = getDefaultImages();
      
      if (this.formData.race && className) {
        const resolvedImages = await resolveCharacterImages(
          this.formData.race,
          className,
          gender
        );
        if (resolvedImages) {
          characterImages = resolvedImages;
          console.log(`TownieMakerApp | Resolved images - Portrait: ${characterImages.portrait}, Token: ${characterImages.token}`);
        } else {
          console.log(`TownieMakerApp | No images found for ${this.formData.race} ${className}, using defaults`);
        }
      }

      // Get token disposition from form data (default to Neutral)
      const tokenDisposition = this.formData.tokenDisposition ?? 0;

      // Create the actor with portrait and token images
      await this.showLoadingStep('Creating actor...', 10);
      const actor = await D35EAdapter.createActor({
        name,
            type: creationPlan.actorType,
        folder: folder || undefined,
        img: characterImages.portrait,
        tokenImg: characterImages.token,
        tokenDisposition: tokenDisposition
      });

      if (!actor) {
        throw new Error("Failed to create actor");
      }

      // Set ability scores
      await this.showLoadingStep('Setting ability scores...', 15);
      await D35EAdapter.setAbilityScores(actor, abilities);

      // Set alignment on the actor (supports legacy text mode and D35E 3.1+ axes mode).
      if (this.formData.alignment) {
        await D35EAdapter.setAlignment(actor, this.formData.alignment);
      }

      // Add race if specified
      if (this.formData.race) {
        await this.showLoadingStep(`Adding race: ${this.formData.race}...`, 20);
        await D35EAdapter.addRace(actor, this.formData.race);
      }

      // Branch based on sheet type
      if (!usePcSheet) {
        // SIMPLE NPC SHEET PATH
        // Uses manual HP and simplified level tracking
        
        if (className) {
          await this.showLoadingStep(`Adding class: ${className} (Level ${classLevel})...`, 25);
          const hitDie = await D35EAdapter.addNpcClass(actor, className, classLevel);
          
          // Calculate and set HP for NPC (pass className to set system.classes.X.hp)
          if (creationPlan.shouldCalculateNpcHp) {
            await this.showLoadingStep('Calculating hit points...', 30);
            const conMod = Math.floor((abilities.con - 10) / 2);
            await D35EAdapter.calculateAndSetNpcHP(actor, classLevel, hitDie, conMod, useMaxHp, className);
          }
        }
        
        // Add skills from template for NPC (uses direct point assignment, no levelUpData)
        if (this.selectedTemplate?.skills && this.selectedTemplate.skills.length > 0) {
          await this.showLoadingStep('Adding skills...', 35);
          await D35EAdapter.addNpcSkills(actor, classLevel, this.selectedTemplate.skills);
        }
        
        console.log(`TownieMakerApp | Simple NPC sheet - skills added via direct point assignment`);
        
      } else {
        // PC SHEET PATH
        // Uses full class progression with levelUpData
        
        if (className) {
          await this.showLoadingStep(`Adding class: ${className} (Level ${classLevel})...`, 25);
          await D35EAdapter.addClass(actor, className, classLevel);
        }

        // Roll HP if enabled (MUST be before addSkills to create levelUpData)
        if (creationPlan.shouldRollHpOnPcPath) {
          await this.showLoadingStep('Rolling hit points...', 30);
          // Get primary ability from template or default based on highest ability score
          const primaryAbility = this.selectedTemplate?.primaryAbility || this.getPrimaryAbilityFromScores(abilities);
          await D35EAdapter.rollHP(actor, classLevel, primaryAbility, useMaxHp);
        }

        // Add skills from template if available (MUST be after rollHP creates levelUpData)
        if (this.selectedTemplate?.skills && this.selectedTemplate.skills.length > 0) {
          await this.showLoadingStep('Adding skills...', 35);
          await D35EAdapter.addSkills(actor, classLevel, this.selectedTemplate.skills);
        }
      }
      // END OF PC/NPC BRANCHING - Common code follows

      // Add feats from template if available
      if (this.selectedTemplate?.feats && this.selectedTemplate.feats.length > 0) {
        await this.showLoadingStep('Adding feats...', 40);
        // Import feat selection system
        const { allocateFeats, RangerCombatStyle } = await import('../data/feat-selection');
        
        // Determine Ranger combat style if applicable
        let rangerStyle: any = undefined;
        if (className?.toLowerCase() === 'ranger') {
          if (this.selectedTemplate.rangerCombatStyle === 'archery') {
            rangerStyle = RangerCombatStyle.ARCHERY;
          } else if (this.selectedTemplate.rangerCombatStyle === 'two-weapon') {
            rangerStyle = RangerCombatStyle.TWO_WEAPON;
          }
        }
        
        // Allocate feats based on class, level, and race
        const isHuman = this.formData.race === "Human";
        const featAllocations = allocateFeats(
          className || 'Fighter', 
          classLevel, 
          isHuman,
          this.selectedTemplate.feats,
          rangerStyle
        );
        
        console.log(`TownieMakerApp | Feat allocations for ${className} level ${classLevel}:`, featAllocations);
        
        // Pass full allocation objects to preserve source information
        await D35EAdapter.addFeats(actor, classLevel, featAllocations, isHuman);
      }

      // Add Ranger favored enemies if applicable
      console.log(`TownieMakerApp | Checking favored enemies - className: ${className}, template: ${this.selectedTemplate?.id}, favoredEnemies:`, this.selectedTemplate?.favoredEnemies);
      if (className?.toLowerCase() === 'ranger' && 
          this.selectedTemplate?.favoredEnemies && 
          this.selectedTemplate.favoredEnemies.length > 0) {
        await this.showLoadingStep('Adding favored enemies...', 50);
        console.log(`TownieMakerApp | Adding favored enemies for level ${classLevel} Ranger`);
        await D35EAdapter.addFavoredEnemies(actor, classLevel, this.selectedTemplate.favoredEnemies);
      } else {
        console.log(`TownieMakerApp | Skipping favored enemies - conditions not met`);
      }

      // Add Rogue special abilities if applicable
      if (className?.toLowerCase() === 'rogue' && 
          this.selectedTemplate?.rogueSpecialAbilities && 
          this.selectedTemplate.rogueSpecialAbilities.length > 0) {
        await this.showLoadingStep('Adding special abilities...', 50);
        console.log(`TownieMakerApp | Adding special abilities for level ${classLevel} Rogue`);
        await D35EAdapter.addRogueSpecialAbilities(actor, classLevel, this.selectedTemplate.rogueSpecialAbilities);
      }

      // Add spells for caster classes (MUST be after class/level set, before equipment)
      if (creationPlan.shouldConfigureSpells && className) {
        await this.showLoadingStep('Configuring spells...', 55);
        console.log(`TownieMakerApp | About to call addSpells for ${className} level ${classLevel}`);
        console.log(`TownieMakerApp | Ability scores:`, abilities);
        await D35EAdapter.addSpells(actor, className, classLevel, abilities);
      } else {
        console.log(`TownieMakerApp | Spell configuration skipped for class '${className ?? "(none)"}' at level ${classLevel}`);
      }

      // Add equipment from template if available
      await this.showLoadingStep('Adding equipment & magic items...', 65);
      console.log("TownieMakerApp | About to call addEquipment...");
      console.log("TownieMakerApp | selectedTemplate:", this.selectedTemplate?.name);
      console.log("TownieMakerApp | has startingKit:", !!this.selectedTemplate?.startingKit);
      console.log("TownieMakerApp | budgetMode:", this.getBudgetMode());
      console.log("TownieMakerApp | identifyItems:", identifyItems);
      console.log("TownieMakerApp | extraMoneyInBank:", extraMoneyInBank);
      console.log("TownieMakerApp | reserveGoldPercent:", reserveGoldPercent);
      console.log("TownieMakerApp | keepPocketChange:", keepPocketChange);
      console.log("TownieMakerApp | bankName:", bankName);
      if (this.selectedTemplate) {
        const budgetMode = this.getBudgetMode();
        const budgetFlags = budgetModeToFlags(budgetMode);

        if (budgetMode === "noBudget" && classLevel >= 3) {
          const warning = "No-budget mode is active: magic items and wealth-by-level are disabled for this generation.";
          console.warn(`TownieMakerApp | ${warning}`);
          ui.notifications?.warn(warning);
        }

        // Merge form data budget overrides into template for this creation
        const templateWithOverrides = {
          ...this.selectedTemplate,
          magicItemBudgets: this.formData.magicItemBudgets && Object.keys(this.formData.magicItemBudgets).length > 0
            ? this.formData.magicItemBudgets
            : this.selectedTemplate.magicItemBudgets,
          spendingPlan: this.formData.spendingPlan
            ? structuredClone(this.formData.spendingPlan)
            : this.selectedTemplate.spendingPlan,
          ...budgetFlags,
        };
        
        await D35EAdapter.addEquipment(
          actor,
          templateWithOverrides,
          classLevel,
          identifyItems,
          extraMoneyInBank,
          bankName,
          budgetMode === "npcWealth",
          reserveGoldPercent,
          keepPocketChange
        );
        
        // IMPORTANT: Complete container moves AFTER character is fully created
        await this.showLoadingStep('Organizing inventory...', 80);
        console.log("TownieMakerApp | Completing pending container moves...");
        await D35EAdapter.completePendingContainerMoves(actor);
      }
      console.log("TownieMakerApp | Finished addEquipment");

      // Generate attacks for all equipped weapons
      await this.showLoadingStep('Generating attacks...', 85);
      console.log("TownieMakerApp | Generating attacks...");
      await D35EAdapter.addAttacks(actor);
      console.log("TownieMakerApp | Finished generating attacks");

      // Compute and apply derived CR (used for XP/treasure workflows)
      const computed = this.computeGeneratedCR(className || "", classLevel);
      this.formData.computedCR = computed.cr;
      this.formData.computedHighestSpellLevel = computed.highestSpellLevel;
      await D35EAdapter.setActorCR(actor, computed.cr);
      console.log(
        `TownieMakerApp | Computed CR ${formatCR(computed.cr)} ` +
        `(classTier=${computed.classTier}, wealthTier=${computed.wealthTier}, highestSpellLevel=${computed.highestSpellLevel})`
      );

      // Add SRD loot pack if enabled
      if (SRD_LOOT_FEATURE_ENABLED && this.formData.includeLootPacks) {
        await this.showLoadingStep('Generating loot pack...', 88);
        console.log(`TownieMakerApp | Generating SRD loot pack with computed CR ${formatCR(computed.cr)}`);

        await D35EAdapter.addSrdLootPack(
          actor,
          computed.cr,
          this.formData.identifyItems ?? false,
          this.formData.lootProfile || "standard"
        );
        console.log("TownieMakerApp | Finished loot pack");
      }

      // FINAL STEP: Re-apply token image after all D35E updates
      // D35E's actorUpdater overwrites the token image during various updates,
      // so we need to set it again at the very end
      if (characterImages.token !== characterImages.portrait) {
        await this.showLoadingStep('Finalizing token...', 90);
        console.log("TownieMakerApp | Re-applying token image after D35E updates...");
        await D35EAdapter.setTokenImage(actor, characterImages.token);
      }

      // Trigger a D35E rest on the created actor.
      // This matches the sheet Rest dialog defaults (restoreHealth=true, restoreDailyUses=true, longTermCare=false)
      // and ensures daily-use abilities/spells are initialized correctly.
      await this.showLoadingStep('Triggering rest...', 93);
      const anyActor = actor as any;
      if (typeof anyActor.rest === 'function') {
        await anyActor.rest(true, true, false);
      } else {
        console.warn('TownieMakerApp | Actor does not expose rest(); skipping rest trigger.');
      }

      // Set biography AFTER rest to ensure it's never overwritten by D35E hooks
      if (this.formData.personality || this.formData.background) {
        await this.showLoadingStep('Setting biography...', 97);
        await D35EAdapter.setBiography(actor, {
          personality: this.formData.personality,
          background: this.formData.background
        });
      }

      await this.showLoadingStep('Complete!', 100);
      
      // Small delay to show completion before closing
      await new Promise(resolve => setTimeout(resolve, 300));

      this.setLoading(false);
      ui.notifications?.info(`Created ${name}!`);
      actor.sheet?.render(true);
      this.close();

    } catch (error) {
      console.error("Failed to create NPC:", error);
      this.setLoading(false);
      ui.notifications?.error("Failed to create NPC. Check console for details.");
    }
  }
}
