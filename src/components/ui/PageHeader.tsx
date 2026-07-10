import React from "react";

interface PageHeaderProps {
  tagline: string;
  title: string;
  description: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ tagline, title, description }) => (
  <section className="bg-secondary/40 border-b border-borderColor py-16 text-center transition-all">
    <div className="mx-auto max-w-xl px-4 space-y-3">
      <span className="text-xs font-bold text-primary uppercase tracking-widest">{tagline}</span>
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-textMuted leading-relaxed">{description}</p>
    </div>
  </section>
);
