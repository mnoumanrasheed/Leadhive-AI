import { motion } from 'motion/react'
import { Check, MessageCircle, Sparkles, Target } from 'lucide-react'

type HeroPipelineVisualProps = { active: boolean }

function FacebookIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.8 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5H17V3.7c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.1H7.8V13h2.7v8h3.3Z"/></svg> }
function YouTubeIcon() { return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2C1.9 9 1.9 12 1.9 12s0 3 .5 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.5-1.8.5-4.8.5-4.8s0-3-.5-4.8ZM9.9 15.1V8.9l5.4 3.1-5.4 3.1Z"/></svg> }

const channels = [
  { label: 'WhatsApp', className: 'whatsapp', icon: MessageCircle },
  { label: 'Facebook', className: 'facebook', icon: FacebookIcon },
  { label: 'Instagram', className: 'instagram', icon: MessageCircle },
  { label: 'YouTube', className: 'youtube', icon: YouTubeIcon },
  { label: 'Web chat', className: 'webchat', icon: MessageCircle },
]

export function HeroPipelineVisual({ active }: HeroPipelineVisualProps) {
  return (
    <div className="pipeline-visual" aria-label="Lead intelligence pipeline">
      <div className="pipeline-header"><span>Live Lead Intelligence</span><i>Analysing now</i></div>
      <div className="pipeline-flow">
        <div className="pipeline-inputs">
          <small>Incoming conversations</small>
          {channels.map((channel, index) => {
            const ChannelIcon = channel.icon
            return <motion.div className={`pipeline-channel ${channel.className}`} key={channel.label} animate={active ? { opacity: [.55, 1, .55] } : { opacity: 1 }} transition={{ duration: 2.4, delay: index * .35, repeat: active ? Infinity : 0 }}>
              <ChannelIcon /> {channel.label}
            </motion.div>
          })}
        </div>
        <div className="pipeline-line line-one"><motion.i animate={active ? { x: ['0%', '260%'], opacity: [0, 1, 0] } : { opacity: 1 }} transition={{ duration: 2.4, delay: .4, repeat: active ? Infinity : 0, repeatDelay: 4 }} /></div>
        <div className="pipeline-engine">
          <span className="pipeline-symbol"><Sparkles /></span>
          <small>LeadHive AI</small>
          <strong>Commercial intent</strong>
          <div><span>Budget</span><span>Timeline</span><span>Fit</span></div>
        </div>
        <div className="pipeline-line line-two"><motion.i animate={active ? { x: ['0%', '260%'], opacity: [0, 1, 0] } : { opacity: 1 }} transition={{ duration: 2.2, delay: 2.7, repeat: active ? Infinity : 0, repeatDelay: 4.2 }} /></div>
        <div className="pipeline-output">
          <small>Sales-ready opportunity</small>
          <span className="pipeline-target"><Target /></span>
          <strong>20-site rollout</strong>
          <p><Check /> High qualification score</p>
        </div>
      </div>
      <div className="pipeline-footer"><span>Context retained</span><span>Qualification active</span><span>Handover ready</span></div>
    </div>
  )
}