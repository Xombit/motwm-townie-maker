/**
 * Image Resolver for Character Portraits and Tokens
 * 
 * Handles dynamic loading of character artwork based on race/class combinations.
 * Images are organized in: modules/motwm-townie-maker/images/artwork/[class]/[race]/[gender]/[portraits|tokens]/
 * 
 * File naming convention:
 * - Portraits: [gender][race][class]portrait[nn].webp (e.g., femalehumanfighterportrait01.webp)
 * - Tokens: [gender][race][class]token[nn].webp (e.g., femalehumanfightertoken01.webp)
 * 
 * Portrait and token with the same number are a matching set.
 */

// Race name mappings: D35E race names -> image folder names
const RACE_IMAGE_MAP: Record<string, string> = {
  // Core races (exact names from SUPPORTED_RACES)
  "human": "human",
  "elf, high": "highelf",
  "elf, wood": "woodelf",
  "drow": "drowelf",
  "dwarf": "dwarf",
  "gnome": "gnome",
  "halfling": "halfling",
  "half-elf": "halfelf",
  "half-orc": "halforc",
  "aasimar": "aasimar",
  "tiefling": "tiefling",
  
  // Legacy/alternate names for compatibility with existing templates
  "elf": "highelf",
  "high elf": "highelf",
  "highelf": "highelf",
  "wood elf": "woodelf",
  "woodelf": "woodelf",
  "wild elf": "woodelf",
  "elf, wild": "woodelf",
  "dark elf": "drowelf",
  "drowelf": "drowelf",
  "elf, drow": "drowelf",
  "hill dwarf": "dwarf",
  "mountain dwarf": "dwarf",
  "dwarf, hill": "dwarf",
  "dwarf, mountain": "dwarf",
  "rock gnome": "gnome",
  "forest gnome": "gnome",
  "lightfoot halfling": "halfling",
  "halfling, lightfoot": "halfling",
  "halfelf": "halfelf",
  "halforc": "halforc",
};

// Class name mappings: D35E class names -> image folder names
const CLASS_IMAGE_MAP: Record<string, string> = {
  // Core classes (exact names from SUPPORTED_CLASSES)
  "fighter": "fighter",
  "barbarian": "barbarian",
  "monk": "monk",
  "paladin": "paladin",
  "ranger": "ranger",
  "rogue": "rogue",
  "bard": "bard",
  "cleric": "cleric",
  "druid": "druid",
  "sorcerer": "wizsorc",
  "wizard": "wizsorc",
  
  // NPC classes (exact names from SUPPORTED_CLASSES)
  "adept (npc)": "cleric",
  "aristocrat (npc)": "aristocrat",
  "commoner (npc)": "commoner",
  "expert (npc)": "expert",
  "warrior (npc)": "fighter",
  
  // Legacy/alternate names for compatibility with existing templates
  "adept": "cleric",
  "aristocrat": "aristocrat",
  "commoner": "commoner",
  "expert": "expert",
  "warrior": "fighter",
  "wizsorc": "wizsorc",
};

// Valid genders for image lookup
type Gender = "male" | "female";

// Result of image resolution
export interface CharacterImages {
  portrait: string;   // Full path to portrait image
  token: string;      // Full path to token image
}

/**
 * Get the image folder name for a race
 */
export function getRaceImageFolder(raceName: string): string | null {
  const normalized = raceName.toLowerCase().trim();
  return RACE_IMAGE_MAP[normalized] || null;
}

/**
 * Get the image folder name for a class
 */
export function getClassImageFolder(className: string): string | null {
  const normalized = className.toLowerCase().trim();
  return CLASS_IMAGE_MAP[normalized] || null;
}

/**
 * Build the path to the tokens folder for a race/class/gender combination
 */
function getTokenFolderPath(classFolder: string, raceFolder: string, gender: Gender): string {
  return `modules/motwm-townie-maker/images/artwork/${classFolder}/${raceFolder}/${gender}/tokens`;
}

/**
 * Build the path to the portraits folder for a race/class/gender combination
 */
function getPortraitFolderPath(classFolder: string, raceFolder: string, gender: Gender): string {
  return `modules/motwm-townie-maker/images/artwork/${classFolder}/${raceFolder}/${gender}/portraits`;
}

/**
 * Get list of available token files in a folder
 * This is called each time a character is created to allow dynamic addition of images
 */
async function getAvailableTokens(folderPath: string): Promise<string[]> {
  try {
    // Use FilePicker to browse the folder
    const result = await FilePicker.browse("data", folderPath);
    
    // Filter for .webp files that contain "token" in the name
    const tokenFiles = result.files.filter((file: string) => {
      const filename = file.split('/').pop() || '';
      return filename.endsWith('.webp') && filename.includes('token');
    });
    
    return tokenFiles;
  } catch (error) {
    console.warn(`ImageResolver | Could not browse folder ${folderPath}:`, error);
    return [];
  }
}

/**
 * Extract the number from a token filename
 * e.g., "femalehumanfightertoken03.webp" -> "03"
 */
function extractImageNumber(filename: string): string | null {
  const match = filename.match(/token(\d+)\.webp$/);
  return match ? match[1] : null;
}

/**
 * Build the portrait filename from a token filename
 * e.g., "femalehumanfightertoken03.webp" -> "femalehumanfighterportrait03.webp"
 */
function getMatchingPortraitFilename(tokenFilename: string): string {
  return tokenFilename.replace('token', 'portrait');
}

/**
 * Resolve character images based on race, class, and gender
 * Randomly selects a token and returns both the token and matching portrait
 * 
 * @param raceName - The character's race (e.g., "Human", "Elf", "Drow")
 * @param className - The character's class (e.g., "Fighter", "Wizard", "Adept")
 * @param gender - The character's gender ("male" or "female")
 * @returns Promise resolving to portrait and token paths, or null if not found
 */
export async function resolveCharacterImages(
  raceName: string,
  className: string,
  gender: Gender
): Promise<CharacterImages | null> {
  // Get folder names from mappings
  const raceFolder = getRaceImageFolder(raceName);
  const classFolder = getClassImageFolder(className);
  
  if (!raceFolder) {
    console.warn(`ImageResolver | No image mapping found for race: ${raceName}`);
    return null;
  }
  
  if (!classFolder) {
    console.warn(`ImageResolver | No image mapping found for class: ${className}`);
    return null;
  }
  
  // Build folder paths
  const tokenFolderPath = getTokenFolderPath(classFolder, raceFolder, gender);
  const portraitFolderPath = getPortraitFolderPath(classFolder, raceFolder, gender);
  
  console.log(`ImageResolver | Looking for images in: ${tokenFolderPath}`);
  
  // Get available tokens (fresh each time to allow user additions)
  const availableTokens = await getAvailableTokens(tokenFolderPath);
  
  if (availableTokens.length === 0) {
    console.warn(`ImageResolver | No tokens found in ${tokenFolderPath}`);
    return null;
  }
  
  console.log(`ImageResolver | Found ${availableTokens.length} tokens available`);
  
  // Randomly select a token
  const randomIndex = Math.floor(Math.random() * availableTokens.length);
  const selectedTokenPath = availableTokens[randomIndex];
  const tokenFilename = selectedTokenPath.split('/').pop() || '';
  
  // Build matching portrait path
  const portraitFilename = getMatchingPortraitFilename(tokenFilename);
  const selectedPortraitPath = `${portraitFolderPath}/${portraitFilename}`;
  
  console.log(`ImageResolver | Selected token: ${tokenFilename}`);
  console.log(`ImageResolver | Matching portrait: ${portraitFilename}`);
  
  return {
    portrait: selectedPortraitPath,
    token: selectedTokenPath
  };
}

/**
 * Normalize a gender string to "male" or "female"
 * Defaults to random if not specified or invalid
 */
export function normalizeGender(gender?: string): Gender {
  if (!gender) {
    // Random gender if not specified
    return Math.random() < 0.5 ? "male" : "female";
  }
  
  const normalized = gender.toLowerCase().trim();
  if (normalized === "male" || normalized === "m") {
    return "male";
  }
  if (normalized === "female" || normalized === "f") {
    return "female";
  }
  
  // Default to random for invalid input
  console.warn(`ImageResolver | Invalid gender "${gender}", selecting randomly`);
  return Math.random() < 0.5 ? "male" : "female";
}

/**
 * Get the default fallback images when no matching artwork is found
 */
export function getDefaultImages(): CharacterImages {
  return {
    portrait: "icons/svg/mystery-man.svg",
    token: "icons/svg/mystery-man.svg"
  };
}
