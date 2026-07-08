type StackIconProps = {
  className?: string;
};

export default function StackIcon({ className = "w-5 h-5" }: StackIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
