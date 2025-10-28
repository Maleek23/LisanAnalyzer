export function StarPattern() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      <defs>
        <pattern 
          id="islamic-star" 
          x="0" 
          y="0" 
          width="120" 
          height="120" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M60 0 L70 40 L110 40 L80 65 L90 105 L60 80 L30 105 L40 65 L10 40 L50 40 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.08"
          />
          <circle cx="60" cy="60" r="5" fill="currentColor" opacity="0.05" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-star)" />
    </svg>
  );
}

export function GeometricTessellation() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      <defs>
        <pattern 
          id="tessellation" 
          x="0" 
          y="0" 
          width="80" 
          height="80" 
          patternUnits="userSpaceOnUse"
        >
          <polygon 
            points="40,0 80,40 40,80 0,40" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.06"
          />
          <circle 
            cx="40" 
            cy="40" 
            r="15" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.04" 
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tessellation)" />
    </svg>
  );
}

export function IslamicStarBurst() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      <defs>
        <pattern 
          id="starburst" 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          patternUnits="userSpaceOnUse"
        >
          <g transform="translate(50,50)">
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) * (Math.PI / 180);
              const x2 = Math.cos(angle) * 40;
              const y2 = Math.sin(angle) * 40;
              return (
                <line 
                  key={i}
                  x1="0" 
                  y1="0" 
                  x2={x2} 
                  y2={y2} 
                  stroke="currentColor" 
                  strokeWidth="0.3" 
                  opacity="0.05"
                />
              );
            })}
            <circle r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.06" />
            <circle r="20" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.04" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#starburst)" />
    </svg>
  );
}

export function OctagonalLattice() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      <defs>
        <pattern 
          id="octagonal-lattice" 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          patternUnits="userSpaceOnUse"
        >
          <polygon 
            points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.4" 
            opacity="0.06"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="20" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.3" 
            opacity="0.04"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="5" 
            fill="currentColor" 
            opacity="0.05"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#octagonal-lattice)" />
    </svg>
  );
}

export function InterlacingBands() {
  return (
    <svg 
      width="100%" 
      height="100%" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0"
    >
      <defs>
        <pattern 
          id="interlacing-bands" 
          x="0" 
          y="0" 
          width="60" 
          height="60" 
          patternUnits="userSpaceOnUse"
        >
          <path 
            d="M0,30 Q15,15 30,30 T60,30" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.06"
          />
          <path 
            d="M30,0 Q45,15 30,30 T30,60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5" 
            opacity="0.06"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#interlacing-bands)" />
    </svg>
  );
}
