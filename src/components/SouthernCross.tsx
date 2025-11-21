export default function SouthernCross() {
  return (
    <svg
      className="southern-cross-overlay"
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stars of the Southern Cross constellation */}
      {/* Alpha Crucis (bottom) */}
      <circle cx="200" cy="300" r="8" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
      </circle>

      {/* Beta Crucis (left) */}
      <circle cx="120" cy="200" r="7" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2.5s" repeatCount="indefinite" />
      </circle>

      {/* Gamma Crucis (top) */}
      <circle cx="200" cy="100" r="7" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.65;1;0.65" dur="2.8s" repeatCount="indefinite" />
      </circle>

      {/* Delta Crucis (right) */}
      <circle cx="280" cy="200" r="6" fill="#FFD700" opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="3.2s" repeatCount="indefinite" />
      </circle>

      {/* Epsilon Crucis (center-right, smaller) */}
      <circle cx="240" cy="240" r="4" fill="#FFD700" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.7s" repeatCount="indefinite" />
      </circle>

      {/* Connecting lines */}
      <line x1="200" y1="300" x2="120" y2="200" stroke="#00FF41" strokeWidth="1" opacity="0.3" />
      <line x1="120" y1="200" x2="200" y2="100" stroke="#00FF41" strokeWidth="1" opacity="0.3" />
      <line x1="200" y1="100" x2="280" y2="200" stroke="#00FF41" strokeWidth="1" opacity="0.3" />
      <line x1="280" y1="200" x2="200" y2="300" stroke="#00FF41" strokeWidth="1" opacity="0.3" />
      <line x1="280" y1="200" x2="240" y2="240" stroke="#00FF41" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}
