export type NavigationItem = {
  id?: string | number;
  title: string;
  link?: { url?: string | null };
  url?: string | null;
  expanded?: boolean;
  below?: NavigationItems | null;
};

type NavigationItems = NavigationItem[] | Record<string, NavigationItem>;

export function getMenuItems(items?: NavigationItems | null): NavigationItem[] {
  return items && typeof items === 'object' ? Object.values(items) : [];
}

export function getMenuChildren(
  item?: NavigationItem | null,
): NavigationItem[] {
  return getMenuItems(item?.below);
}

export function hasMenuChildren(item?: NavigationItem | null): boolean {
  if (item?.below && typeof item.below === 'object') {
    return getMenuChildren(item).length > 0;
  }

  return Boolean(item?.expanded);
}

export function getMenuItemUrl(
  item?: NavigationItem | null,
): string | undefined {
  return item?.link?.url || item?.url || undefined;
}

export function getFocusableElements(root: ParentNode | null): HTMLElement[] {
  if (!root) return [];

  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]',
    ),
  ).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.matches(':disabled') &&
      !element.closest('[hidden], [inert]') &&
      element.getClientRects().length > 0 &&
      window.getComputedStyle(element).visibility !== 'hidden',
  );
}
