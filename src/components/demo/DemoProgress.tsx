import { Check } from 'lucide-react'
import { motion } from 'motion/react'

const steps = ['Platform', 'Channel', 'AI persona', 'Content']
export function DemoProgress({ step }: { step: number }) {
  return (
    <nav className="td-progress" aria-label="Demo setup progress">
      <div className="td-progress-top">
        <span>YOUR WORKSPACE, IN A FEW STEPS</span>
        <strong>Step {step} of 4</strong>
      </div>
      <div
        className="td-progress-track"
        role="progressbar"
        aria-label="Setup progress"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={step}
      >
        <motion.div
          initial={false}
          animate={{ width: (step / 4) * 100 + '%' }}
          transition={{ duration: 0.35 }}
        />
      </div>
      <ol>
        {steps.map((label, index) => (
          <li
            key={label}
            className={index + 1 <= step ? 'is-reached' : ''}
            aria-current={index + 1 === step ? 'step' : undefined}
          >
            <span className="td-step-number">
              {index + 1 < step ? <Check size={12} /> : '0' + (index + 1)}
            </span>
            {label}
          </li>
        ))}
      </ol>
    </nav>
  )
}
