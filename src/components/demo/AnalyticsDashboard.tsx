import {
  ArrowLeft,
  ArrowUpRight,
  ChartNoAxesColumn,
  MessageSquare,
  Target,
  UserCheck,
  Users,
} from 'lucide-react'
import { motion } from 'motion/react'
import type { AnalyticsData, Lead, LeadStatus } from '../../types/demo'
import { MetricCard } from './MetricCard'
import { LeadTable } from './LeadTable'

const categories: LeadStatus[] = ['Qualified', 'Nurture', 'Low Intent']
export function AnalyticsDashboard({
  analytics,
  leads,
  onBack,
}: {
  analytics: AnalyticsData
  leads: Lead[]
  onBack: () => void
}) {
  const classified = Object.values(analytics.distribution).reduce((sum, count) => sum + count, 0)
  return (
    <div className="td-analytics">
      <div className="td-dashboard-heading">
        <div>
          <span className="td-section-label">FROM CONVERSATION TO CONVERSION</span>
          <h1 tabIndex={-1} data-demo-heading>
            AI Engagement Analytics
          </h1>
          <p>Real-time insights from your AI-powered engagement workflow.</p>
        </div>
        <button className="td-btn td-btn-secondary" onClick={onBack}>
          <ArrowLeft size={15} />
          Command Center
        </button>
      </div>
      <div className="td-metrics-grid">
        <MetricCard
          label="Leads Detected"
          value={analytics.leadsDetected}
          detail="Conversations captured"
          icon={Users}
        />
        <MetricCard
          label="AI Responses"
          value={analytics.aiResponses}
          detail="Replies delivered"
          icon={MessageSquare}
        />
        <MetricCard
          label="Qualified Leads"
          value={analytics.qualifiedLeads}
          detail="Scored 80 or above"
          icon={UserCheck}
        />
        <MetricCard
          label="Average Lead Score"
          value={analytics.averageLeadScore}
          suffix="/100"
          detail="Across scored conversations"
          icon={ChartNoAxesColumn}
        />
        <MetricCard
          label="Qualification Rate"
          value={analytics.qualificationRate}
          suffix="%"
          detail="Qualified / detected leads"
          icon={Target}
        />
      </div>
      <div className="td-analytics-middle">
        <section className="td-panel td-distribution">
          <div className="td-panel-heading">
            <div>
              <h2>Lead quality distribution</h2>
              <p>A clearer picture of your audience’s intent.</p>
            </div>
            <span className="td-badge td-badge-neutral">This session</span>
          </div>
          <div
            className="td-chart"
            role="img"
            aria-label={categories
              .map((category) => category + ': ' + analytics.distribution[category])
              .join(', ')}
          >
            {categories.map((category) => {
              const count = analytics.distribution[category]
              const percentage = classified ? (count / classified) * 100 : 0
              return (
                <div
                  className={'td-chart-row td-chart-' + category.toLowerCase().replaceAll(' ', '-')}
                  key={category}
                >
                  <span>
                    <i />
                    {category}
                  </span>
                  <div className="td-chart-track">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: percentage + '%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                  <strong>{count}</strong>
                  <small>{Math.round(percentage)}%</small>
                </div>
              )
            })}
          </div>
          <div className="td-chart-legend">
            <span>{classified} classified conversations</span>
            <span>{leads.length - classified} processing</span>
          </div>
        </section>
        <aside className="td-insight-card">
          <span className="td-insight-icon">
            <ArrowUpRight size={23} />
          </span>
          <span className="td-section-label">THE BIGGER PICTURE</span>
          <h2>
            {analytics.qualifiedLeads
              ? 'Your next opportunity is already in the conversation.'
              : 'Less manual sorting. More meaningful conversations.'}
          </h2>
          <p>
            {analytics.qualifiedLeads
              ? analytics.qualifiedLeads +
                ' high-intent prospects surfaced in this session. Your team can focus on the conversations most likely to move forward.'
              : 'Watch your AI identify buying signals, respond with context and bring the right prospects into focus.'}
          </p>
          <span className="td-insight-footer">Understand. Engage. Qualify.</span>
        </aside>
      </div>
      <LeadTable leads={leads} />
      <p className="td-analytics-footnote">
        Metrics reflect this demo session only. Qualified: 80–100 · Nurture: 55–79 · Low Intent:
        below 55.
      </p>
    </div>
  )
}
