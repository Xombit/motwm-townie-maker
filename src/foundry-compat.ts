export type DelegatedEvent = {
  originalEvent: Event;
  target: EventTarget | null;
  currentTarget: HTMLElement;
  preventDefault: () => void;
  stopPropagation: () => void;
};

export function mergeObjectCompat<T extends object, U extends object>(target: T, source: U): T & U {
  const utilsMerge = (globalThis as any)?.foundry?.utils?.mergeObject;
  if (typeof utilsMerge === "function") {
    return utilsMerge(target, source) as T & U;
  }

  const legacyMerge = (globalThis as any)?.mergeObject;
  if (typeof legacyMerge === "function") {
    return legacyMerge(target, source) as T & U;
  }

  return Object.assign({}, target, source) as T & U;
}

export function getFoundryProperty<T = unknown>(object: unknown, path: string): T | undefined {
  const getter = (globalThis as any)?.foundry?.utils?.getProperty;
  if (typeof getter === "function") {
    return getter(object, path) as T | undefined;
  }

  if (!object || !path) return undefined;

  let current: any = object;
  for (const segment of path.split(".")) {
    if (current == null) return undefined;
    current = current[segment];
  }
  return current as T | undefined;
}

export function getApplicationElement(source: unknown): HTMLElement | null {
  const element = (source as any)?.element ?? source;
  if (!element) return null;
  if (element instanceof HTMLElement) return element;
  if (element?.[0] instanceof HTMLElement) return element[0] as HTMLElement;
  return null;
}

export function getElementValue(element: HTMLElement): string {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element.value;
  }
  return element.getAttribute("value") ?? "";
}

export function getElementChecked(element: HTMLElement): boolean {
  if (element instanceof HTMLInputElement) return element.checked;
  return false;
}

export function getDocumentId(value: any): string | null {
  const id = value?.id ?? value?._id ?? value?.document?.id ?? value?.document?._id;
  if (id === undefined || id === null) return null;
  const text = String(id);
  return text.length > 0 ? text : null;
}

export function bindDelegatedEvents(htmlSource: unknown): {
  on: (events: string, selector: string, handler: (event: DelegatedEvent) => void) => void;
} {
  const jq = htmlSource as any;
  if (typeof jq?.on === "function") {
    return {
      on: (events: string, selector: string, handler: (event: DelegatedEvent) => void) => {
        jq.on(events, selector, (event: any) => {
          handler({
            originalEvent: event?.originalEvent ?? event,
            target: event?.target ?? null,
            currentTarget: event?.currentTarget as HTMLElement,
            preventDefault: () => event?.preventDefault?.(),
            stopPropagation: () => event?.stopPropagation?.()
          });
        });
      }
    };
  }

  const root = getApplicationElement(htmlSource);
  return {
    on: (events: string, selector: string, handler: (event: DelegatedEvent) => void) => {
      if (!root) return;
      for (const evt of events.split(/\s+/).filter(Boolean)) {
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
