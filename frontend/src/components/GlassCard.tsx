import React from 'react';

interface GlassCardProps {
  title?: string;
  badge?: React.ReactNode;
  cta?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function GlassCard({ title, badge, cta, className = '', children }: GlassCardProps) {
  return (
    <div className={`glass-card ${className}`}>
      {badge && <div style={{ position: 'absolute', top: 12, right: 12 }}>{badge}</div>}
      <div>
        {title && <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</h3>}
        {children}
      </div>

      {cta && <div className="mt-6">{cta}</div>}
    </div>
  );
}
