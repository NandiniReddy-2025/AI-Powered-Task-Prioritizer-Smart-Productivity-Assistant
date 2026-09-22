import React from 'react';

/**
 * AppBackground Component
 * Renders a modern, elegant, calm SaaS background featuring:
 * - Soft pastel lavender and subtle warm peach tones
 * - Gentle cream & off-white base
 * - Smooth flowing gradient shapes and large abstract organic shapes with soft edges
 * - Subtle decorative dots and curved SVG spline lines
 * - Lightweight, non-intrusive, zero-overflow, pointer-events-none
 */
const AppBackground = ({ variant = 'dashboard' }) => {
  if (variant === 'hero') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden -z-10">
        {/* Base Cream Background */}
        <div className="absolute inset-0 bg-[#FAF7F2]" />

        {/* 1. Large Abstract Lavender Organic Shape (Top-Left) */}
        <div 
          className="absolute -top-24 -left-20 w-[600px] h-[600px] rounded-[42%_58%_70%_30%/45%_45%_55%_55%] bg-gradient-to-br from-[#EDE9FE]/85 via-[#DDD6FE]/60 to-[#C4B5FD]/25 blur-3xl"
        />

        {/* 2. Soft Warm Peach & Cream Gradient (Center & Right) */}
        <div 
          className="absolute top-1/4 right-0 w-[650px] h-[650px] rounded-[55%_45%_35%_65%/60%_30%_70%_40%] bg-gradient-to-bl from-[#FFEBDC]/80 via-[#FFD6BA]/50 to-[#FAF7F2]/30 blur-3xl"
        />

        {/* 3. Subtle Lavender-Rose Accent (Behind Laptop Mockup area) */}
        <div 
          className="absolute top-1/3 right-1/4 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#FCE7F3]/40 via-[#EDE9FE]/50 to-transparent blur-2xl"
        />

        {/* 4. Soft Mint Freshness (Bottom-Left) */}
        <div 
          className="absolute -bottom-24 left-10 w-[500px] h-[500px] rounded-[60%_40%_50%_50%/40%_60%_40%_60%] bg-gradient-to-tr from-[#DCFCE7]/45 via-[#FAF7F2]/40 to-transparent blur-3xl"
        />

        {/* SVG Decorative Curved Flowing Lines */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-40" 
          viewBox="0 0 1440 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Smooth curved spline 1 (Lavender) */}
          <path 
            d="M-100 250 C 300 120, 600 480, 1100 220 C 1300 120, 1500 280, 1600 320" 
            stroke="#C4B5FD" 
            strokeWidth="1.75" 
            strokeDasharray="6 8"
            strokeLinecap="round"
          />
          {/* Smooth curved spline 2 (Peach) */}
          <path 
            d="M-50 480 C 400 620, 750 280, 1200 490 C 1400 580, 1550 420, 1650 460" 
            stroke="#FFBA88" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          {/* Subtle concentric decorative ring */}
          <circle cx="280" cy="180" r="140" stroke="#DDD6FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="1250" cy="420" r="180" stroke="#FFD6BA" strokeWidth="1" strokeDasharray="5 7" opacity="0.6" />
        </svg>

        {/* Subtle Decorative Geometric Dot Matrix (Top-Left) */}
        <div className="absolute top-20 left-12 opacity-35">
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <circle
                  key={`dot-tl-${r}-${c}`}
                  cx={c * 20 + 10}
                  cy={r * 20 + 10}
                  r="1.75"
                  fill="#7C3AED"
                />
              ))
            )}
          </svg>
        </div>

        {/* Subtle Decorative Geometric Dot Matrix (Behind Laptop / Right) */}
        <div className="absolute top-1/3 right-12 opacity-30">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 5 }).map((_, c) => (
                <circle
                  key={`dot-tr-${r}-${c}`}
                  cx={c * 20 + 10}
                  cy={r * 20 + 10}
                  r="1.5"
                  fill="#FB923C"
                />
              ))
            )}
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'auth') {
    return (
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10">
        {/* Base Cream */}
        <div className="absolute inset-0 bg-[#FAF7F2]" />

        {/* Organic Soft Lavender Blur Top Left */}
        <div className="absolute -top-32 -left-20 w-[550px] h-[550px] rounded-[50%_50%_60%_40%/40%_60%_40%_60%] bg-gradient-to-br from-[#EDE9FE]/80 via-[#DDD6FE]/50 to-transparent blur-3xl" />
        
        {/* Organic Soft Peach Blur Bottom Right */}
        <div className="absolute -bottom-32 -right-20 w-[550px] h-[550px] rounded-[40%_60%_50%_50%/60%_40%_60%_40%] bg-gradient-to-tl from-[#FFEBDC]/80 via-[#FFD6BA]/50 to-transparent blur-3xl" />

        {/* Central Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#FCE7F3]/30 via-[#EDE9FE]/30 to-[#FFEBDC]/30 blur-2xl" />

        {/* Flowing Curved Accent Lines */}
        <svg 
          className="absolute inset-0 w-full h-full opacity-35" 
          viewBox="0 0 1200 800" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M-50 200 C 350 80, 850 450, 1250 250" 
            stroke="#C4B5FD" 
            strokeWidth="1.5" 
            strokeDasharray="5 7" 
          />
          <path 
            d="M-50 600 C 450 720, 800 350, 1250 550" 
            stroke="#FFBA88" 
            strokeWidth="1.5" 
          />
        </svg>

        {/* Dot Grids */}
        <div className="absolute bottom-12 left-12 opacity-30">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <circle
                  key={`dot-auth-${r}-${c}`}
                  cx={c * 20 + 10}
                  cy={r * 20 + 10}
                  r="1.5"
                  fill="#7C3AED"
                />
              ))
            )}
          </svg>
        </div>
      </div>
    );
  }

  // Default: 'dashboard' variant used throughout MainLayout
  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden -z-10">
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#FAF7F2]" />

      {/* 1. Top-Left Soft Pastel Lavender Organic Shape */}
      <div 
        className="absolute -top-40 -left-20 w-[620px] h-[620px] rounded-[45%_55%_65%_35%/50%_40%_60%_50%] bg-gradient-to-br from-[#EDE9FE]/75 via-[#DDD6FE]/45 to-transparent blur-3xl"
      />

      {/* 2. Top-Right Subtle Warm Peach Organic Shape */}
      <div 
        className="absolute -top-20 right-0 w-[580px] h-[580px] rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-gradient-to-bl from-[#FFEBDC]/75 via-[#FFD6BA]/40 to-transparent blur-3xl"
      />

      {/* 3. Center-Right Gentle Coral-Peach Ambient Aura */}
      <div 
        className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-[#FFE4E1]/40 via-[#FFCCC7]/20 to-transparent blur-3xl"
      />

      {/* 4. Bottom-Left Delicate Lavender & Rose Touch */}
      <div 
        className="absolute -bottom-32 left-1/4 w-[550px] h-[550px] rounded-[60%_40%_55%_45%/45%_55%_45%_55%] bg-gradient-to-tr from-[#FCE7F3]/45 via-[#EDE9FE]/35 to-transparent blur-3xl"
      />

      {/* 5. Bottom-Right Fresh Mint Glow */}
      <div 
        className="absolute -bottom-20 right-10 w-[420px] h-[420px] rounded-full bg-gradient-to-tl from-[#DCFCE7]/40 via-[#FAF7F2]/20 to-transparent blur-3xl"
      />

      {/* Flowing Subtle Curved SVG Accent Splines */}
      <svg 
        className="absolute inset-0 w-full h-full opacity-35" 
        viewBox="0 0 1600 1000" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path 
          d="M-50 180 C 400 70, 900 380, 1650 140" 
          stroke="#C4B5FD" 
          strokeWidth="1.5" 
          strokeDasharray="6 8"
          strokeLinecap="round"
        />
        <path 
          d="M-50 780 C 500 920, 1050 550, 1650 740" 
          stroke="#FFBA88" 
          strokeWidth="1.25" 
          strokeLinecap="round"
        />
        <circle cx="1450" cy="220" r="120" stroke="#DDD6FE" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
      </svg>

      {/* Subtle Geometric Dot Matrix (Top Right Margin) */}
      <div className="absolute top-8 right-8 opacity-25 hidden md:block">
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none">
          {Array.from({ length: 3 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => (
              <circle
                key={`dot-dash-tr-${r}-${c}`}
                cx={c * 20 + 10}
                cy={r * 20 + 10}
                r="1.5"
                fill="#7C3AED"
              />
            ))
          )}
        </svg>
      </div>

      {/* Subtle Geometric Dot Matrix (Bottom Left Margin) */}
      <div className="absolute bottom-10 left-72 opacity-25 hidden lg:block">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 4 }).map((_, c) => (
              <circle
                key={`dot-dash-bl-${r}-${c}`}
                cx={c * 20 + 10}
                cy={r * 20 + 10}
                r="1.5"
                fill="#FB923C"
              />
            ))
          )}
        </svg>
      </div>
    </div>
  );
};

export default AppBackground;
