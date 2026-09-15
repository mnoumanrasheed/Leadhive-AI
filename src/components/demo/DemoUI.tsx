import { Youtube, Instagram, Facebook } from './PlatformIcons'
import { ArrowLeft, ArrowRight, Sparkles, MessageCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import type { LeadStatus, PlatformId } from '../../types/demo'

export const platformIcons = {
  youtube: Youtube,
  whatsapp: MessageCircle,
  instagram: Instagram,
  facebook: Facebook,
}
export function PlatformIcon({ platform, size = 26 }: { platform: PlatformId; size?: number }) {
  const Icon = platformIcons[platform]
  return <Icon size={size} aria-hidden="true" />
}
export function StepHeading({
  title,
  children,
  badge,
}: {
  title: string
  children: ReactNode
  badge?: string
}) {
  return (
    <div className="td-step-heading">
      {badge && (
        <span className="td-eyebrow">
          <Sparkles size={14} />
          {badge}
        </span>
      )}
      <h1 tabIndex={-1} data-demo-heading>
        {title}
      </h1>
      <p>{children}</p>
    </div>
  )
}
export function StepActions({
  onBack,
  onNext,
  disabled,
  label = 'Continue',
  note,
  form,
}: {
  onBack?: () => void
  onNext?: () => void
  disabled?: boolean
  label?: string
  note?: string
  form?: string
}) {
  return (
    <div className="td-step-actions">
      {onBack ? (
        <button className="td-btn td-btn-quiet" onClick={onBack}>
          <ArrowLeft size={16} />
          Back
        </button>
      ) : (
        <span className="td-action-note">{note}</span>
      )}
      <button
        className="td-btn td-btn-primary"
        onClick={onNext}
        disabled={disabled}
        type={form ? 'submit' : 'button'}
        form={form}
      >
        {label}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={'td-badge td-status-' + status.toLowerCase().replaceAll(' ', '-')}>
      {status}
    </span>
  )
}
export function AiOrb({ compact = false }: { compact?: boolean }) {
  return (
    <div className={'td-orb-wrap' + (compact ? ' is-compact' : '')} aria-hidden="true">
      <div className="td-orb-ring" />
      <div className="td-orb-ring td-orb-ring-inner" />
      <div className="td-orb">
        <Sparkles size={compact ? 24 : 34} strokeWidth={1.5} />
      </div>
      <span className="td-orb-satellite" />
    </div>
  )
}
