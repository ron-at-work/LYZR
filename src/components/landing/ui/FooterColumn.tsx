export function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="min-w-0">
      <span className="site-footer-heading">{title}</span>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a className="site-footer-link" href={link.href} rel="noreferrer" target="_blank">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
