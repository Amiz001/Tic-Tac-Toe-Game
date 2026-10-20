import React from 'react';
import './BackgroundSky.css';

/**
 * Animated cartoon sky background with smooth drifting clouds.
 * Uses CartoonSky.webp in an infinite horizontal loop with a calm, relaxing velocity.
 */
export default function BackgroundSky({ children }) {
  return (
    <div className="sky-container">
      {/* Primary infinite seamless drifting sky */}
      <div className="sky-layer sky-layer-primary" />
      {/* Secondary subtle drifting cloud overlay for gentle parallax depth */}
      <div className="sky-layer sky-layer-secondary" />
      {/* Main app content overlay */}
      <div className="sky-content">
        {children}
      </div>
    </div>
  );
}
