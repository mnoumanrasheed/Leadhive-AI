import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Check, SlidersHorizontal, Sparkles } from 'lucide-react'
import { brandTones } from '../../data/demoData'
import { validatePersona } from '../../services/demoService'
import type { Persona } from '../../types/demo'
import { AiOrb, StepActions, StepHeading } from './DemoUI'

const fields: { key: keyof Persona; label: string; multiline?: boolean; maxLength: number }[] = [
  { key: 'businessName', label: 'Business / Brand Name', maxLength: 80 },
  { key: 'website', label: 'Website URL', maxLength: 250 },
  { key: 'industry', label: 'Industry', maxLength: 80 },
  { key: 'tone', label: 'Brand Tone', maxLength: 80 },
  { key: 'description', label: 'Business Description', multiline: true, maxLength: 1000 },
  { key: 'instructions', label: 'AI Response Instructions', multiline: true, maxLength: 1000 },
  {
    key: 'qualificationCriteria',
    label: 'Lead Qualification Criteria',
    multiline: true,
    maxLength: 1000,
  },
  { key: 'avoid', label: 'Things AI Should Avoid', multiline: true, maxLength: 1000 },
]
export function PersonaStep({
  persona,
  onChange,
  onBack,
  onNext,
}: {
  persona: Persona
  onChange: (persona: Persona) => void
  onBack: () => void
  onNext: () => void
}) {
  const [errors, setErrors] = useState<Partial<Record<keyof Persona, string>>>({})
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validatePersona(persona)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) document.getElementById('persona-' + firstError)?.focus()
    else onNext()
  }
  return (
    <>
      <StepHeading title="Configure Your AI">
        Tell LeadHive how your AI representative should communicate with potential customers.
      </StepHeading>
      <div className="td-persona-layout">
        <form
          id="td-persona-form"
          className="td-persona-form td-panel"
          onSubmit={submit}
          noValidate
        >
          <div className="td-form-title">
            <SlidersHorizontal size={17} />
            <h2>Your brand, your voice</h2>
            <span>All fields required</span>
          </div>
          <div className="td-fields">
            {fields.map((field) => {
              const props = {
                id: 'persona-' + field.key,
                value: persona[field.key],
                required: true,
                'aria-invalid': Boolean(errors[field.key]),
                'aria-describedby': errors[field.key] ? 'error-' + field.key : undefined,
                onChange: (
                  event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
                ) => {
                  onChange({ ...persona, [field.key]: event.target.value })
                  setErrors((previous) => ({ ...previous, [field.key]: undefined }))
                },
              }
              return (
                <div
                  className={'td-field ' + (field.multiline ? 'td-field-wide' : '')}
                  key={field.key}
                >
                  <label htmlFor={props.id}>{field.label}</label>
                  {field.key === 'tone' ? (
                    <select {...props}>
                      {brandTones.map((tone) => (
                        <option key={tone}>{tone}</option>
                      ))}
                    </select>
                  ) : field.multiline ? (
                    <textarea {...props} rows={3} maxLength={field.maxLength} />
                  ) : (
                    <input
                      {...props}
                      type={field.key === 'website' ? 'url' : 'text'}
                      maxLength={field.maxLength}
                      autoComplete={
                        field.key === 'businessName'
                          ? 'organization'
                          : field.key === 'website'
                            ? 'url'
                            : 'off'
                      }
                    />
                  )}
                  {errors[field.key] && (
                    <span className="td-field-error" id={'error-' + field.key}>
                      {errors[field.key]}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </form>
        <aside className="td-persona-preview">
          <span className="td-section-label">
            <Sparkles size={14} />
            YOUR AI REPRESENTATIVE
          </span>
          <AiOrb />
          <h2>
            {persona.businessName || 'Your brand'}
            <br />
            <span>with a human touch.</span>
          </h2>
          <p>A consistent voice. A clear purpose. Every conversation, thoughtfully handled.</p>
          <div className="td-voice-preview">
            <span>VOICE PREVIEW</span>
            <p>
              {persona.tone === 'Friendly'
                ? '“Hey there! Happy to help you find the right fit.”'
                : persona.tone === 'Concise'
                  ? '“Happy to help. What do you need?”'
                  : persona.tone === 'Consultative'
                    ? '“Tell me about your goals, and we can explore the right approach.”'
                    : persona.tone === 'Sales Focused'
                      ? '“Let’s find the right plan and discuss your next step.”'
                      : '“Absolutely. I can help you find the right solution for your business.”'}
            </p>
            <span className="td-badge td-badge-blue">{persona.tone}</span>
          </div>
          <div className="td-preview-checks">
            <span>
              <Check />
              Brand-aware replies
            </span>
            <span>
              <Check />
              Intent-based qualification
            </span>
            <span>
              <Check />
              Consistent communication
            </span>
          </div>
          <small>
            This demo previews your brand name and tone with sample responses. Your other guidelines
            are saved for this session.
          </small>
        </aside>
      </div>
      <StepActions onBack={onBack} form="td-persona-form" label="Save Persona & Continue" />
    </>
  )
}
