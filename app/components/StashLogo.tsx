interface Props {
  className?: string
}

export default function StashLogo({ className = "w-5 h-5" }: Props) {
  return (
    <svg
      viewBox="0 0 20 15"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="0"  width="20" height="3" rx="1.5" />
      <rect x="3" y="6"  width="14" height="3" rx="1.5" />
      <rect x="6" y="12" width="8"  height="3" rx="1.5" />
    </svg>
  )
}
