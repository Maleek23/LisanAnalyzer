export default function IslamicPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="islamic-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path
              d="M40 0 L50 10 L40 20 L30 10 Z M40 20 L50 30 L40 40 L30 30 Z M40 40 L50 50 L40 60 L30 50 Z M40 60 L50 70 L40 80 L30 70 Z M20 10 L30 20 L20 30 L10 20 Z M60 10 L70 20 L60 30 L50 20 Z M20 50 L30 60 L20 70 L10 60 Z M60 50 L70 60 L60 70 L50 60 Z M0 20 L10 30 L0 40 L-10 30 Z M80 20 L90 30 L80 40 L70 30 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
      </svg>
    </div>
  );
}
