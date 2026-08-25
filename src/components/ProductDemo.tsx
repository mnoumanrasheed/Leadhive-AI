import { ArrowRight, Camera, Check, MessageCircle, MoreHorizontal } from 'lucide-react'

export function ProductDemo() {
  return (
    <div className="product-window" aria-label="LeadHive qualification interface preview">
      <div className="window-bar">
        <div className="window-brand"><span className="mark">L</span><strong>LeadHive</strong></div>
        <div className="window-status"><i /> Live qualification</div>
        <MoreHorizontal aria-hidden="true" />
      </div>
      <div className="product-layout">
        <aside className="conversation-list">
          <div className="ui-label"><span>Conversations</span><b>24</b></div>
          <button className="conversation active">
            <span className="channel-badge instagram"><Camera /></span>
            <span><strong>Hassan Ali</strong><small>Need 20 units for our...</small></span>
            <time>Now</time>
          </button>
          <button className="conversation">
            <span className="avatar amber">SM</span>
            <span><strong>Sara Malik</strong><small>Can you share pricing?</small></span>
            <time>4m</time>
          </button>
          <button className="conversation">
            <span className="channel-badge whatsapp"><MessageCircle /></span>
            <span><strong>Bilal Khan</strong><small>Looking for a demo...</small></span>
            <time>8m</time>
          </button>
          <div className="conversation-fade" />
        </aside>

        <div className="conversation-view">
          <div className="conversation-head">
            <div><span className="avatar blue">HA</span><span><strong>Hassan Ali</strong><small>Instagram · active now</small></span></div>
            <span className="priority">High intent</span>
          </div>
          <div className="chat-thread">
            <span className="timestamp">Today, 10:42 AM</span>
            <div className="chat-bubble">Need 20 units for our Lahore branches next month. Can someone share the business pricing?</div>
            <div className="ai-reply"><span className="mark small">L</span><p>Absolutely. How many branches will need delivery?</p></div>
          </div>
          <div className="composer">LeadHive is handling this conversation <i /><i /><i /></div>
        </div>

        <aside className="intelligence-panel">
          <div className="ui-label"><span>Opportunity</span><em>Auto-updated</em></div>
          <div className="score-row">
            <div className="score-ring"><strong>92</strong><small>/ 100</small></div>
            <div><span className="hot-label">Hot opportunity</span><small>Ready for sales</small></div>
          </div>
          <div className="data-list">
            <div><span>Purchase intent</span><strong><Check /> High</strong></div>
            <div><span>Quantity</span><strong>20 units</strong></div>
            <div><span>Location</span><strong>Lahore</strong></div>
            <div><span>Timeline</span><strong>Next month</strong></div>
          </div>
          <div className="assignment">
            <span className="avatar navy">AK</span>
            <div><small>Assigned to</small><strong>Ahmed Khan</strong></div>
            <ArrowRight />
          </div>
        </aside>
      </div>
    </div>
  )
}
