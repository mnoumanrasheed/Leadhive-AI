import {
  Check,
  Circle,
  MessageSquare,
  ScanLine,
  ChartNoAxesColumn,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { workflowStages } from '../../data/demoData'
import type { ActivityStage, AutomationStatus } from '../../types/demo'

const icons = [MessageSquare, ScanLine, ChartNoAxesColumn, Sparkles, UserCheck]
export function ProcessVisualizer({
  stage,
  status,
  name,
}: {
  stage?: ActivityStage
  status: AutomationStatus
  name?: string
}) {
  const current =
    stage === undefined
      ? -1
      : stage <= 0
        ? 0
        : stage <= 2
          ? 1
          : stage === 3
            ? 2
            : stage <= 5
              ? 3
              : 4
  return (
    <section className="td-process td-panel" aria-label="AI processing workflow">
      <div className="td-process-header">
        <span className="td-section-label">
          <Sparkles size={14} />
          THE AI WORKFLOW
        </span>
        <span>
          {status === 'Paused'
            ? 'Workflow paused'
            : status === 'Complete'
              ? 'All conversations processed'
              : name
                ? 'Processing · ' + name
                : 'Waiting for your first conversation'}
        </span>
      </div>
      <ol className="td-workflow">
        {workflowStages.map((label, index) => {
          const Icon = icons[index]
          const done = current > index || (index === 4 && stage === 7)
          return (
            <li
              key={label}
              className={done ? 'is-done' : index === current ? 'is-current' : ''}
              aria-current={index === current ? 'step' : undefined}
            >
              <span className="td-workflow-icon">
                {done ? <Check size={17} /> : <Icon size={17} />}
              </span>
              <span>{label}</span>
              <span className="td-workflow-marker">
                {done ? (
                  'Complete'
                ) : index === current ? (
                  status === 'Paused' ? (
                    'Paused'
                  ) : (
                    'In progress'
                  )
                ) : (
                  <Circle size={6} />
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
