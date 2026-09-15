import { ArrowLeft, FlaskConical } from 'lucide-react'

export function DemoHeader() {
  return (
    <header className="td-header">
      <div className="td-header-inner">
        <a href="/" className="td-brand" aria-label="LeadHive AI home">
          <span className="td-brand-mark">
            <img src="/LeadHive%20AI%20Logo.png" alt="" />
          </span>
          <span>
            LeadHive<span className="td-brand-ai"> AI</span>
          </span>
        </a>
        <span className="td-environment">
          <FlaskConical size={13} /> Interactive demo
        </span>
        <a className="td-back-site" href="/">
          <ArrowLeft size={15} />
          <span>Back to Website</span>
        </a>
      </div>
    </header>
  )
}
