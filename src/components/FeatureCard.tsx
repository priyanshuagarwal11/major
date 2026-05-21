import type { FeatureItem } from '../types';

export default function FeatureCard({ title, description }: FeatureItem) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
