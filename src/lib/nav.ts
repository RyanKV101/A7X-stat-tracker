export type NavItem = {
  href: string;
  label: string;
  icon: "songs" | "quiz" | "stats" | "profile";
};

/** Main sections of the app, in header and footer order. */
export const mainNav: NavItem[] = [
  { href: "/songs", label: "Songs", icon: "songs" },
  { href: "/quiz", label: "Quiz", icon: "quiz" },
  { href: "/stats", label: "Stats", icon: "stats" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

/** True when `pathname` is `href` or one of its sub-pages. */
export function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
