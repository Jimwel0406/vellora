export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 105 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Vellora"
    >
      {/* Stylized V mark with a node dot */}
      <path
        d="M4 8L16 36L28 8"
        stroke="currentColor"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="6" r="3.5" fill="currentColor" />

      {/* Wordmark: ellora */}
      <text
        x="38"
        y="29.5"
        fill="currentColor"
        fontFamily="Inter, ui-sans-serif, system-ui, sans-serif"
        fontSize="26"
        fontWeight="500"
        letterSpacing="-0.5"
      >
        ellora
      </text>

      {/* Decorative underline swoosh */}
      <path
        d="M4 38C12 38 20 36 28 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  );
}
