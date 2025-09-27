interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Section({
  id,
  title,
  subtitle,
  description,
  children,
  className,
}: SectionProps) {
  const sectionId = title ? title.toLowerCase().replace(/\s+/g, "-") : id;
  return (
    <section id={id ?? sectionId}>
      <div className={className}>
        <div className="relative container mx-auto px-4 lg:py-24 py-16 max-w-7xl">
          <div className="text-center space-y-4 pb-6 mx-auto">
            {title && (
              <h3 className="text-sm text-secondary font-bold">
                {title}
              </h3>
            )}
            {subtitle && (
              <h2 className="xl:text-4xl lg:text-3xl text-2xl font-bold mb-6 px-6 tracking-tight sm:max-w-none">
                {subtitle}
              </h2>
            )}
            {description && (
              <p className="max-w-4xl mx-auto px-6 lg:mb-14 mb-10 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
