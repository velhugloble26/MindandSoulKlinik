export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Klinik", href: "/about" },
      { label: "Meet Your Therapist", href: "/about#therapist" },
    ],
  },
  {
    label: "Services",
    children: [
      { label: "Individual Counselling", href: "/services#individual-counselling" },
      { label: "Career Assessment & Counselling", href: "/services#career-counselling" },
      { label: "Family Counselling", href: "/services#family-counselling" },
      { label: "Relationship Building", href: "/services#relationship-building" },
    ],
  },
  {
    label: "Programs",
    children: [
      { label: "Courses", href: "/courses" },
      { label: "Therapy", href: "/therapy" },
      { label: "Events", href: "/events" },
      { label: "Assignments", href: "/assignments" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: "/blog" },
      { label: "Products", href: "/products" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const MOBILE_MORE = [
  { label: "Courses", href: "/courses" },
  { label: "Therapy", href: "/therapy" },
  { label: "Events", href: "/events" },
  { label: "Assignments", href: "/assignments" },
  { label: "Blog", href: "/blog" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];
