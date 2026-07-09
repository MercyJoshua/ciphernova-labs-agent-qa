type XeroLogoProps = {
  size?: number;
  className?: string;
};

export default function XeroLogo({ size = 28, className }: XeroLogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      fill="white"
    >
      <path
        d="M6 4 L14 4 L20 13 L26 4 L34 4 L24 18 L34 32 L26 32 L20 23 L18 26 L22 32 L14 32 L16 28 L12 22 L6 32 L-0 32 L10 18 L0 4 L6 4 Z M16 18 L20 24 L24 18 L20 12 Z"
        fillRule="evenodd"
      />
    </svg>
  );
}
