import type { FeatureItem } from '../types';

export default function FeatureCard({ title, description }: FeatureItem) {
  const getIcon = (titleStr: string) => {
    const t = titleStr.toLowerCase();
    if (t.includes('resume')) return '📝';
    if (t.includes('interview')) return '🗣️';
    if (t.includes('job')) return '💼';
    if (t.includes('roadmap')) return '📚';
    return '🚀';
  };

  return (
    <article className="feature-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontSize: '2rem', marginBottom: '4px' }}>
        {getIcon(title)}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
        {description}
      </p>
    </article>
  );
}
