interface HeaderProps {
  page: string;
}

type NavItem = {
  label: string;
  href: string;
  page: string;
};

const navItems: NavItem[] = [
  { label: "home", href: "/", page: "home" },
  { label: "about", href: "/about", page: "about" },
  { label: "contact us", href: "/contact", page: "contact" },
  { label: "gallery", href: "/gallery", page: "gallery" },
];

export function Header({ page }: HeaderProps) {
  return (
    <header className="rounded-md bg-gray-200 p-4">
      {navItems.map((item, index) => (
        <span key={item.page}>
          {index > 0 ? " | " : null}
          {page === item.page ? (
            <span className="font-bold">
              {item.label}
            </span>
          ) : (
            <a href={item.href}>{item.label}</a>
          )}
        </span>
      ))}
    </header>
  );
}