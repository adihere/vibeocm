export function SlothBearIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Sloth bear head */}
      <circle cx="12" cy="10" r="7" />
      {/* Ears */}
      <circle cx="7.5" cy="6.5" r="1.5" />
      <circle cx="16.5" cy="6.5" r="1.5" />
      {/* Eyes */}
      <circle cx="9" cy="9" r="1" />
      <circle cx="15" cy="9" r="1" />
      {/* Nose */}
      <circle cx="12" cy="12" r="2" />
      {/* Mouth */}
      <path d="M10 14 Q 12 16, 14 14" />
      {/* Body */}
      <path d="M12 17 Q 12 21, 12 22" />
      {/* Arms */}
      <path d="M12 17 Q 8 19, 7 22" />
      <path d="M12 17 Q 16 19, 17 22" />
    </svg>
  )
}

