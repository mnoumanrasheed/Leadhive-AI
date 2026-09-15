import { motion, useReducedMotion } from 'motion/react'
import type { LucideIcon } from 'lucide-react'

export function MetricCard({
  label,
  value,
  suffix = '',
  detail,
  icon: Icon,
}: {
  label: string
  value: number
  suffix?: string
  detail: string
  icon: LucideIcon
}) {
  const reducedMotion = useReducedMotion()
  return (
    <div className="td-metric td-panel">
      <div className="td-metric-label">
        <span>{label}</span>
        <Icon size={17} />
      </div>
      <motion.strong
        key={value}
        initial={reducedMotion ? false : { opacity: 0.35, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {value}
        <span>{suffix}</span>
      </motion.strong>
      <small>{detail}</small>
    </div>
  )
}
