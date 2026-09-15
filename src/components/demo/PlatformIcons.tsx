import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }
export function Youtube({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor" />
      <path d="m10 8.5 6 3.5-6 3.5z" fill="white" />
    </svg>
  )
}
export function Instagram({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
export function Facebook({ size = 24, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 22v-9h3l.5-4H14V7c0-1 .5-1.5 1.5-1.5H18V2h-3c-3.2 0-5 1.8-5 5v2H7v4h3v9z" />
    </svg>
  )
}
