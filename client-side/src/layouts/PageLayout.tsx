import type { ReactNode } from 'react';

export default function PageLayout({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="from-primary to-tertiary bg-gradient-to-br py-16">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-xl text-blue-100">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-7xl px-4 py-16">{children}</div>
    </div>
  );
}
