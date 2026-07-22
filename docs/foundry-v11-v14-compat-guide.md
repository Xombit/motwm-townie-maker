# Foundry VTT Module Compatibility Guide: v11 → v14

This document records every technique used to keep the `motwm-xp` module running on both Foundry v11 and Foundry v14. Use it as a reference when porting other modules.

---

## Contents

1. [Global utility functions (`getProperty`, `mergeObject`)](#1-global-utility-functions)
2. [Scene Controls hook (`getSceneControlButtons`)](#2-scene-controls-hook)
3. [Scene control button callbacks (`onClick` vs `onChange`)](#3-scene-control-button-callbacks)
4. [Token document and actor access](#4-token-document-and-actor-access)
5. [Token disposition constants](#5-token-disposition-constants)
6. [Controlled token and user target collections](#6-controlled-token-and-user-target-collections)
7. [Application element access](#7-application-element-access)
8. [Actor ID access (`.id` vs `._id`)](#8-actor-id-access)
9. [Actor/item data paths (`system.*` vs `data.*`)](#9-actoritem-data-paths)
10. [ApplicationV1: `activateListeners` HTML argument](#10-applicationv1-activatelisteners-html-argument)
11. [Theme integration (ApplicationV1 + ThemeV2)](#11-theme-integration)
12. [Event listeners: cleanup on `close()`](#12-event-listeners-cleanup-on-close)
13. [User character resolution](#13-user-character-resolution)
14. [Chat message ID access](#14-chat-message-id-access)
15. [Version detection helper](#15-version-detection-helper)
16. [Central compat module pattern](#16-central-compat-module-pattern)

---

## 1. Global utility functions

### Problem

v11/v12 exposed `getProperty()` and `mergeObject()` as bare globals. v13 moved them under `foundry.utils.*` and deprecated the bare forms. v15 is expected to remove them entirely.

### Fix

**`mergeObject`** — always call it via `foundry.utils.mergeObject()`. It exists on all supported versions:

```ts
// ❌ v12 — works but deprecated in v13+, removed in v15
return mergeObject(super.defaultOptions, { ... });

// ✅ works on v11–v14
return foundry.utils.mergeObject(super.defaultOptions, { ... });
```

**`getProperty`** — wrap it in a compat helper that prefers `foundry.utils.getProperty` and falls back to a plain dot-path walk for very old builds:

```ts
// src/foundry-compat.ts
export function getFoundryProperty<T = unknown>(object: unknown, path: string): T | undefined {
  const getter = foundry?.utils?.getProperty;
  if (typeof getter === "function") {
    return getter(object, path) as T | undefined;
  }
  // Fallback: manual dot-path walk (v10 and very old builds)
  if (!object || !path) return undefined;
  let current: any = object;
  for (const segment of path.split(".")) {
    if (current == null) return undefined;
    current = current[segment];
  }
  return current as T | undefined;
}
```

Use `getFoundryProperty(actor, "system.details.xp.value")` everywhere instead of the bare global.

---

## 2. Scene Controls hook

### Problem

v12 and earlier: `getSceneControlButtons` passes `controls` as a **`SceneControl[]` array**. Tools inside each group are also arrays.

v13 and later: `controls` is a **plain object keyed by control name** (`controls.tokens`). Tools inside each group are also plain objects keyed by tool name.

### Fix

Detect the shape with `Array.isArray(controls)` and dispatch to separate helpers:

```ts
Hooks.on("getSceneControlButtons", (controls: any) => {
  if (!game.user?.isGM) return;

  if (Array.isArray(controls)) {
    // v11/v12 path
    addToolToArrayControls(controls);
    return;
  }
  if (controls && typeof controls === "object") {
    // v13/v14 path
    addToolToObjectControls(controls as Record<string, any>);
  }
});

function addToolToArrayControls(controls: any[]) {
  // v11/v12: control groups are array items, tools is an array
  const tokenControl = controls.find(c => c?.name === "token" || c?.name === "tokens");
  if (!tokenControl) return;
  if (!Array.isArray(tokenControl.tools)) tokenControl.tools = [];
  if (tokenControl.tools.some((t: any) => t?.name === "my-tool")) return; // dedup
  tokenControl.tools.push(createTool());
}

function addToolToObjectControls(controls: Record<string, any>) {
  // v13/v14: control groups keyed by name, tools is a plain object
  const tokenControl =
    controls?.token ??
    controls?.tokens ??
    Object.values(controls ?? {}).find((c: any) => c?.name === "token" || c?.name === "tokens");
  if (!tokenControl) return;
  if (!tokenControl.tools || Array.isArray(tokenControl.tools)) tokenControl.tools = {};
  if (tokenControl.tools["my-tool"]) return; // dedup
  tokenControl.tools["my-tool"] = createTool();
}
```

**Notes**

- In v13, the token group is named `"tokens"` (plural). Guard for both `"token"` and `"tokens"` for safety.
- Always deduplicate before inserting — hooks can fire multiple times if re-rendered.
- When adding a brand-new control group in v13, assign `controls["my-group"] = { ..., tools: {} }`. In v12 use `controls.push({ ..., tools: [] })`.

---

## 3. Scene control button callbacks

### Problem

v11/v12 fires `onClick` for button-type tools. v13+ fires `onChange`. A tool with only `onChange` renders visually in v11 but clicking it is silently a no-op (v11 checks `if (tool.onClick instanceof Function)` before calling it). A tool with only `onClick` works in v13 but will break in v15 when `onClick` is removed.

An earlier iteration branched on `getFoundryMajorVersion() >= 13` to choose between callbacks. This is fragile: if version detection runs before `game` is fully available, it can misfire and produce the wrong callback type.

### Fix

Include **both callbacks** in every tool definition. Each version ignores the one it doesn't understand:

```ts
function createTool() {
  return {
    name: "my-tool",
    title: "My Tool",
    icon: "fas fa-wrench",
    visible: true,
    order: 99,
    button: true,
    // v11/v12: _onClickTool dispatches via onClick
    onClick: () => openMyApp(),
    // v13/v14: canonical callback; v11 ignores this property entirely
    onChange: () => openMyApp(),
  };
}
```

**Do not** add an `active === false` guard inside `onChange`. Button-type tools (`button: true`) in v13 do not toggle state, so active is irrelevant and the guard can suppress the click.

---

## 4. Token document and actor access

### Problem

- v12 and earlier: `token.actor`, `token.actorId`
- v13: actor is on `token.actor` (still works) but synthetic/unlinked tokens additionally route through `token.document.actor`
- v12: `token.document.actorId` is the canonical way (not `token.actorId`)

### Fix

A safe single helper covers all cases:

```ts
// src/foundry-compat.ts
export function getTokenActor<T = Actor>(token: any): T | null {
  return (token?.actor ?? token?.document?.actor ?? null) as T | null;
}

export function getTokenDocument(token: any): any {
  return token?.document ?? token ?? null;
}

export function getTokenId(token: any): string | null {
  return String(token?.id ?? token?.document?.id ?? token?.document?._id ?? "") || null;
}
```

Usage:

```ts
const actor = getTokenActor(token);
const tokenId = getTokenId(token);
const disposition = getTokenDocument(token)?.disposition;
```

---

## 5. Token disposition constants

### Problem

v12 and earlier: `CONST.TOKEN_DISPOSITIONS.HOSTILE` (plural)
v13+: `CONST.TOKEN_DISPOSITION.HOSTILE` (singular)

### Fix

Guard for both names:

```ts
export function getTokenDisposition(token: any): number | null {
  const doc = getTokenDocument(token);
  const disposition = doc?.disposition;
  return Number.isFinite(disposition) ? Number(disposition) : null;
}

// When you need the constant value itself:
const HOSTILE = (CONST as any)?.TOKEN_DISPOSITION?.HOSTILE
             ?? (CONST as any)?.TOKEN_DISPOSITIONS?.HOSTILE
             ?? -1;
const FRIENDLY = (CONST as any)?.TOKEN_DISPOSITION?.FRIENDLY
              ?? (CONST as any)?.TOKEN_DISPOSITIONS?.FRIENDLY
              ?? 1;
const NEUTRAL = (CONST as any)?.TOKEN_DISPOSITION?.NEUTRAL
             ?? (CONST as any)?.TOKEN_DISPOSITIONS?.NEUTRAL
             ?? 0;
```

---

## 6. Controlled token and user target collections

### Problem

`canvas.tokens.controlled` changed from a plain `Array` in v11 to a more complex collection type in v13. `game.user.targets` is a `Set` in v11 and can have a different shape in later versions. Calling `.filter()` or `.length` on these directly breaks when the shape changes.

### Fix

A `collectionToArray` normaliser handles all known shapes:

```ts
export function collectionToArray<T>(value: unknown): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (value instanceof Set || value instanceof Map) return Array.from(value.values()) as T[];
  if (typeof (value as any)[Symbol.iterator] === "function") {
    try { return Array.from(value as Iterable<T>); } catch { return []; }
  }
  if (typeof (value as any).values === "function") {
    try { return Array.from((value as any).values()) as T[]; } catch { return []; }
  }
  return [];
}

export function getControlledTokens<T = any>(): T[] {
  return collectionToArray<T>(
    canvas?.tokens?.controlled
    ?? canvas?.primary?.controlled        // v14 canvas restructure guard
    ?? canvas?.activeLayer?.controlled
  );
}

export function getUserTargets<T = any>(): T[] {
  return collectionToArray<T>(game.user?.targets);
}
```

---

## 7. Application element access

### Problem

ApplicationV1: `this.element` is a jQuery object. `this.element[0]` gives the raw `HTMLElement`.
ApplicationV2 (v13+): `this.element` is the raw `HTMLElement` directly.

Code that assumes `this.element[0]` breaks under ApplicationV2. Code that passes `html` from `activateListeners` to a jQuery consumer breaks when the argument is a native element.

### Fix

A helper that normalises both shapes:

```ts
export function getApplicationElement(source: unknown): HTMLElement | null {
  const element = (source as any)?.element ?? source;
  if (!element) return null;
  if (element instanceof HTMLElement) return element;
  if (element[0] instanceof HTMLElement) return element[0];
  return null;
}
```

Usage inside ApplicationV1 methods:

```ts
private _getElement(): HTMLElement | null {
  return getApplicationElement(this);
}
```

Usage inside `activateListeners`:

```ts
activateListeners(html: any) {
  super.activateListeners(html);
  const root = getApplicationElement(html); // works for jQuery and native
  // ...
}
```

---

## 8. Actor ID access

### Problem

v12 and earlier: Documents expose both `.id` and `._id`. Some codebases used `._id` directly.
v13+: `._id` is internal and unreliable. The canonical property is always `.id`.

### Fix

Always use `.id`:

```ts
// ❌
const id = actor._id;

// ✅
const id = actor.id;
```

When you need a fallback for edge cases (unlinked synthetic actors, token documents):

```ts
const id = token?.id ?? token?.document?.id ?? token?.document?._id;
```

---

## 9. Actor/item data paths

### Problem

v12 and earlier: system data was at `actor.data.data.*` and `data.*` in update calls.
v13+: system data is at `actor.system.*` and `system.*` in update calls. Using `data.*` update paths silently fails or is ignored.

### Fix

Always use `system.*`:

```ts
// ❌ v12 update path
await actor.update({ "data.details.xp.value": newXp });

// ✅ works v11–v14
await actor.update({ "system.details.xp.value": newXp });
```

For reads, use the `getFoundryProperty` helper from §1 with `"system.*"` paths. D35E stores data at `system.*` on all supported Foundry versions.

---

## 10. ApplicationV1: `activateListeners` HTML argument

### Problem

v11/v12: `activateListeners(html)` receives a jQuery object. `.on("click", selector, handler)` works.
v13+: Foundry is moving toward ApplicationV2 where `html` is a native `HTMLElement`. If you stay on ApplicationV1 in v13+, jQuery is no longer guaranteed — specifically after the Foundry team removed the jQuery dependency from their ApplicationV2 pipeline.

### Fix

Write an event-binding adapter that detects jQuery vs native and provides a consistent `.on(events, selector, handler)` surface:

```ts
private _bindEvents(html: any) {
  // jQuery path (v11/v12 ApplicationV1)
  if (typeof html?.on === "function") {
    return {
      on: (events: string, selector: string, handler: (event: any) => void) => {
        html.on(events, selector, handler);
      }
    };
  }

  // Native DOM path (v13+ or ApplicationV2)
  const root = getApplicationElement(html);
  return {
    on: (events: string, selector: string, handler: (event: any) => void) => {
      if (!root) return;
      for (const evt of events.split(/\s+/).filter(Boolean)) {
        // "blur" doesn't bubble — use focusout instead
        const eventName = evt === "blur" ? "focusout" : evt;
        root.addEventListener(eventName, (event: Event) => {
          const origin = event.target as Element | null;
          const currentTarget = origin?.closest(selector) as HTMLElement | null;
          if (!currentTarget || !root.contains(currentTarget)) return;
          handler({
            originalEvent: event,
            target: event.target,
            currentTarget,
            preventDefault: () => event.preventDefault(),
            stopPropagation: () => event.stopPropagation()
          });
        });
      }
    }
  };
}
```

Usage:

```ts
activateListeners(html: any) {
  super.activateListeners(html);
  const events = this._bindEvents(html);

  events.on("click", "[data-action='my-action']", ev => { ... });
  events.on("change blur", "input.my-input", ev => { ... });
}
```

**Notes**

- `blur` does not bubble; the native adapter maps it to `focusout` which does.
- The `currentTarget` in the synthetic event object matches what jQuery delegated event handlers expose, so handlers can be written the same way regardless of path.

---

## 11. Theme integration

### Problem

ApplicationV2 in v13+ participates in Foundry's `ThemeV2` system automatically: it receives `theme-dark` / `theme-light` classes on its root element and re-renders when the user changes the application colour scheme in core settings.

ApplicationV1 does **not** participate in ThemeV2. The window element never gets theme classes applied, so dark-mode CSS selectors like `#my-app.theme-dark` never match and dark styling never activates.

### Solution overview

1. Opt the app into the D35E system CSS contract and into the Foundry themed surface:
   - Include `"D35E"` and `"themed"` in `classes` in `defaultOptions`
2. Apply the correct theme class (`theme-dark` / `theme-light`) manually to the root element after every render
3. React to theme change events and reapply immediately

### Implementation

**`defaultOptions`:**

```ts
static get defaultOptions() {
  return foundry.utils.mergeObject(super.defaultOptions, {
    id: "my-app",
    classes: ["D35E", "themed", "my-app-class"],
    // ...
  });
}
```

**Theme helpers on the ApplicationV1 class:**

```ts
// Parse the explicit applications colour scheme from a core.uiConfig payload
private _getThemeFromUiConfig(uiConfig: any): "dark" | "light" | undefined {
  const scheme = uiConfig?.colorScheme?.applications;
  return scheme === "dark" || scheme === "light" ? scheme : undefined;
}

// Derive the correct theme from multiple fallback sources
private _getEffectiveTheme(): "dark" | "light" {
  try {
    const uiConfig: any = (game as any).settings?.get?.("core", "uiConfig");
    const scheme = this._getThemeFromUiConfig(uiConfig);
    if (scheme) return scheme;
  } catch { /* v11: setting doesn't exist */ }
  if (document.body.classList.contains("theme-dark")) return "dark";
  if (document.body.classList.contains("theme-light")) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Apply theme class to the window element; accepts an explicit override
private _applyThemeClass(theme?: "dark" | "light"): void {
  const el = this.element?.[0] as HTMLElement | undefined;
  if (!el) return;
  const effectiveTheme = theme ?? this._getEffectiveTheme();
  el.classList.remove("theme-dark", "theme-light");
  el.classList.add(`theme-${effectiveTheme}`);
}

// Override _render to apply theme after every render cycle
protected async _render(force?: boolean, options?: any): Promise<void> {
  await super._render(force, options);
  this._applyThemeClass();
}
```

**Module bootstrap (hook listeners in `ready`):**

```ts
// Parse applications theme from a raw uiConfig setting value
const getApplicationsTheme = (uiConfig: any): "dark" | "light" | undefined => {
  const scheme = uiConfig?.colorScheme?.applications;
  return scheme === "dark" || scheme === "light" ? scheme : undefined;
};

let lastAppliedTheme: "dark" | "light" | undefined;
const applyCalcTheme = (explicitTheme?: "dark" | "light") => {
  const calc = window.MY_MODULE?.calc as any;
  if (!calc?._applyThemeClass) return;
  if (explicitTheme && explicitTheme === lastAppliedTheme) return; // dedupe
  calc._applyThemeClass(explicitTheme);
  if (explicitTheme) lastAppliedTheme = explicitTheme;
};

// Primary signal: v13+ fires clientSettingChanged with setting value in args
Hooks.on("clientSettingChanged", (...args: any[]) => {
  const key = typeof args[0] === "string" ? args[0] : String(args[0]?.key ?? "");
  if (key !== "core.uiConfig" && !key.startsWith("core.uiConfig.")) return;
  const theme =
    getApplicationsTheme(args[2]) ??
    getApplicationsTheme(args[1]) ??
    getApplicationsTheme(args[0]?.value);
  applyCalcTheme(theme);
});

// Fallback: updateSetting is fired on some versions/modules
Hooks.on("updateSetting", (setting: any, value: any) => {
  const key = String(setting?.key ?? "");
  if (key !== "core.uiConfig" && !key.startsWith("core.uiConfig.")) return;
  const theme =
    getApplicationsTheme(value) ??
    getApplicationsTheme(setting?.value) ??
    getApplicationsTheme(setting?.data?.value);
  applyCalcTheme(theme);
});
```

**CSS dark-mode overrides:**

Scope all dark-mode overrides to the fully-qualified selector `#my-app.themed.theme-dark`. This is entirely inert on v11/v12 because `.themed` and `.theme-dark` are never added there, so there is no regression.

```css
/* Only fires when both .themed AND .theme-dark are present — i.e. v13+ with dark scheme */
#my-app.themed.theme-dark .window-content {
  background: #1a1817;
  color: #e8e4d4;
}
```

**Important:** Do not override `background` or `color` on `button` or `.btn` elements in your dark-mode block. The D35E system stylesheet owns button textures and backgrounds. Override only content surfaces (`.window-content`, panels, inputs, tables).

**Why not use a MutationObserver?**

An earlier approach watched `document.body` class changes via `MutationObserver` and called `_applyThemeClass()` on every change. This produced a race condition: the settings hook and the observer both fired within the same event loop, each independently recomputing the theme from potentially-stale DOM state. On every other toggle the two callbacks would disagree and overwrite each other, causing the class to flip to the wrong value. Using only the setting payload — which contains the *new* value explicitly — eliminates this entirely.

---

## 12. Event listeners: cleanup on `close()`

### Problem

If you attach `window.addEventListener` listeners (e.g. for drag tracking), they outlive the application's rendered element. Closing and reopening the app accumulates duplicate listeners because they were never removed.

### Fix

Store references to all `window`-level listeners and remove them in `close()`:

```ts
private _onPointerMove?: (event: PointerEvent) => void;
private _onPointerUp?: () => void;
private _onResize?: () => void;
private _wired = false;

private _wireGlobalListeners(): void {
  if (this._wired) return;
  this._wired = true;

  this._onPointerMove = (ev) => { /* drag handler */ };
  this._onPointerUp = async () => { /* drag end */ };
  this._onResize = () => this._applyPos();

  window.addEventListener("pointermove", this._onPointerMove);
  window.addEventListener("pointerup", this._onPointerUp);
  window.addEventListener("resize", this._onResize, { passive: true });
}

async close(options?: any): Promise<any> {
  if (this._onPointerMove) window.removeEventListener("pointermove", this._onPointerMove);
  if (this._onPointerUp)   window.removeEventListener("pointerup",   this._onPointerUp);
  if (this._onResize)      window.removeEventListener("resize",      this._onResize);
  this._wired = false;
  this._onPointerMove = this._onPointerUp = this._onResize = undefined;
  return super.close(options);
}
```

---

## 13. User character resolution

### Problem

`game.user.character` returns an `Actor` object in v11. In v13, it can return either an `Actor` or a **string ID** (the character ID before the world fully loads, or in some server-side contexts).

### Fix

```ts
function resolveCurrentUserActor(): Actor | undefined {
  const ref = (game.user as any)?.character;
  if (!ref) return undefined;
  if (typeof ref === "string") return game.actors?.get(ref) as Actor | undefined;
  return ref as Actor;
}
```

Apply the same guard in `settings.ts` `onChange` callbacks:

```ts
const myActor = game.user?.character;
const actorId = typeof myActor === "string" ? myActor : myActor?.id;
const actor   = typeof myActor === "string" ? game.actors?.get(myActor) : myActor;
```

---

## 14. Chat message ID access

### Problem

`ChatMessage.create()` has always returned the created document, but accessing `.id` on it is only safe when the return value is confirmed to be a Document (not `null` or `undefined`). The return type also changes shape slightly between versions.

### Fix

A small wrapper that returns `string | null` safely:

```ts
export async function createChatMessage(content: string): Promise<string | null> {
  const message = await (ChatMessage as any)?.create?.({ content });
  return message?.id ?? null;
}
```

Always use `.id` not `._id` on the returned document.

---

## 15. Version detection helper

Used only where version-specific branching cannot be avoided (rare):

```ts
export function getFoundryVersion(): string {
  return String(
    (game as any)?.release?.version ??
    (game as any)?.version ??
    (game as any)?.data?.version ??
    "0.0.0"
  );
}

export function getFoundryMajorVersion(): number {
  const generation = Number((game as any)?.release?.generation ?? 0);
  if (generation > 0) return generation;
  const match = getFoundryVersion().match(/\d+/);
  return Number(match?.[0] ?? 0);
}
```

**Caution:** `getFoundryMajorVersion()` calls `game.release`, which is only populated after the `init` hook. Do not call it at module load time (top of file) or in early hooks like `setup`. At hook time (`getSceneControlButtons` fires after `ready`), it is safe.

**Prefer payload-first over version branching** wherever possible. For example, detecting the *shape* of the `controls` argument with `Array.isArray(controls)` is safer and more durable than branching on version numbers.

---

## 16. Central compat module pattern

All compatibility helpers live in a single file (`src/foundry-compat.ts`) and are imported by name. This has several advantages:

- Breaking API changes are fixed in one place
- Consumer code stays readable and intent-focused
- Adding support for a new major version means updating the compat file, not hunting through every sheet/hook file
- The compat file itself documents its assumptions clearly

Recommended structure for any module supporting multiple Foundry versions:

```
src/
  foundry-compat.ts   ← version-safe wrappers for all Foundry APIs
  main.ts             ← hooks, bootstrap; imports from compat where needed
  settings.ts         ← settings registration; imports from compat where needed
  adapter.ts          ← system-specific data access (e.g. D35E); imports compat
  ui/
    MyApp.ts          ← UI code; imports compat helpers directly
```

---

## Quick reference: v11 vs v13/v14 API changes

| Area | v11/v12 | v13/v14 | Compat approach |
|---|---|---|---|
| `mergeObject()` | bare global | `foundry.utils.mergeObject()` | Always use the namespaced form |
| `getProperty()` | bare global | `foundry.utils.getProperty()` | Use `getFoundryProperty()` helper |
| Scene controls argument | `SceneControl[]` array | `Record<name, SceneControl>` object | `Array.isArray()` guard |
| Tool button callback | `onClick: () => {}` | `onChange: () => {}` | Include both; each version ignores the other |
| Tools in control group | `tools[]` array | `tools{}` plain object | Detected same way as controls argument |
| Token control name | `"token"` | `"tokens"` | Guard for both names |
| `token.actorId` | direct property | `token.document.actorId` | Use `getTokenDocument()` helper |
| `.element[0]` (ApplicationV1) | jQuery → `[0]` for HTMLElement | May already be HTMLElement | Use `getApplicationElement()` helper |
| `activateListeners` html arg | jQuery | Can be native HTMLElement | Use `_bindEvents()` adapter |
| `CONST.TOKEN_DISPOSITIONS` | plural | `CONST.TOKEN_DISPOSITION` singular | Guard both with `??` |
| `actor._id` | present | `.id` only | Always use `.id` |
| Data update paths | `"data.*"` | `"system.*"` | Always use `"system.*"` |
| Theme on ApplicationV1 | Not applicable | `theme-dark`/`theme-light` on element | Manual `_applyThemeClass()` + hooks |
| `game.user.character` | Actor object | Actor or string ID | `resolveCurrentUserActor()` helper |
| Theme change event | N/A | `clientSettingChanged` + `updateSetting` | Listen to both; prefer payload value |
