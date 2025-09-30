function MobileSocialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="flex items-center justify-center px-3 py-3 bg-white/20 text-white backdrop-blur-[100px] top-right-corner-cut transition-all duration-200 hover:bg-white/30"
      aria-label={`Visit our ${new URL(href).hostname} page`}
    >
      {children}
    </a>
  );
}

export default MobileSocialLink;
