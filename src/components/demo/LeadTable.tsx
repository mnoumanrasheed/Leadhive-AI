import { MessageSquare, Users } from 'lucide-react'
import type { Lead } from '../../types/demo'
import { StatusBadge } from './DemoUI'

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <section className="td-panel td-leads-panel">
      <div className="td-panel-heading">
        <div>
          <h2>Conversation intelligence</h2>
          <p>Every lead, with the context to take the next step.</p>
        </div>
        <span className="td-badge td-badge-neutral">{leads.length} leads</span>
      </div>
      {leads.length === 0 ? (
        <div className="td-table-empty">
          <Users size={26} />
          <h3>Your leads will appear here</h3>
          <p>Start the AI demo in the command center to generate activity.</p>
        </div>
      ) : (
        <table className="td-lead-table">
          <caption className="td-sr-only">Leads detected in this demo session</caption>
          <thead>
            <tr>
              <th scope="col">Lead</th>
              <th scope="col">Intent</th>
              <th scope="col">Score</th>
              <th scope="col">AI Action</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr key={lead.id}>
                <td data-label="Lead">
                  <div className="td-table-person">
                    <span className={'td-avatar td-avatar-' + (index % 4)}>{lead.initials}</span>
                    <div>
                      <strong>{lead.name}</strong>
                      <small>YouTube comment</small>
                    </div>
                  </div>
                </td>
                <td data-label="Intent">{lead.stage >= 2 ? lead.intent : 'Analyzing…'}</td>
                <td data-label="Score">
                  <span className="td-table-score">
                    {lead.stage >= 3 ? (
                      <>
                        <strong>{lead.score}</strong>
                        <span className="td-score-track">
                          <i style={{ width: lead.score + '%' }} />
                        </span>
                      </>
                    ) : (
                      '—'
                    )}
                  </span>
                </td>
                <td data-label="AI Action">
                  <span className="td-table-action">
                    <MessageSquare size={13} />
                    {lead.action}
                  </span>
                </td>
                <td data-label="Status">
                  {lead.stage >= 6 ? (
                    <StatusBadge status={lead.status} />
                  ) : (
                    <span className="td-badge td-badge-neutral">Processing</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
