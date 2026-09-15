import type { BrandTone, DemoChannel, DemoContent, DemoInteraction, Persona, Platform } from '../types/demo'

export const primaryLead = {
  name: 'Amelia Carter',
  initials: 'AC',
  role: 'Operations Director',
  company: 'Northstar Retail',
  message: 'We’re planning a 20-site rollout next month. Can you share enterprise pricing?',
  purchaseIntent: 'High',
  deployment: '20 locations',
  region: 'UK',
  timeline: 'Next month',
  score: 92,
} as const

export const additionalLeads = [
  {
    name: 'Daniel Brooks',
    initials: 'DB',
    role: 'Procurement Lead',
    company: 'Vertex Commercial',
    note: 'Pricing requested · WhatsApp',
    score: 84,
  },
  {
    name: 'Priya Shah',
    initials: 'PS',
    role: 'Growth Director',
    company: 'Meridian Group',
    note: 'Demo requested · Instagram',
    score: 78,
  },
] as const

export const salesRepresentative = {
  name: 'Jordan Blake',
  initials: 'JB',
  role: 'Enterprise Sales',
} as const

export const qualificationSignals = [
  ['Purchase Intent', primaryLead.purchaseIntent],
  ['Deployment', primaryLead.deployment],
  ['Region', primaryLead.region],
  ['Timeline', primaryLead.timeline],
] as const


// Marketing examples above remain independent of the interactive demo.
export const demoPlatforms: Platform[] = [
  { id: 'youtube', name: 'YouTube', label: 'Turn comments into conversations', available: true },
  { id: 'whatsapp', name: 'WhatsApp', label: 'Make every message count', available: false },
  { id: 'instagram', name: 'Instagram', label: 'Connect beyond the feed', available: false },
  { id: 'facebook', name: 'Facebook', label: 'Grow your community into customers', available: false },
]
export const demoChannel: DemoChannel = { id: 'leadhive-demo', name: 'LeadHive Demo Channel', platform: 'youtube', subscribers: '12.8K subscribers' }
export const brandTones: BrandTone[] = ['Professional & Helpful', 'Friendly', 'Consultative', 'Concise', 'Sales Focused']
export const defaultPersona: Persona = {
  businessName: 'LeadHive AI', website: 'https://leadhive-ai.com', industry: 'AI Automation', tone: 'Professional & Helpful',
  description: 'LeadHive helps businesses automate customer engagement, identify intent and qualify leads using AI-powered workflows.',
  instructions: 'Respond clearly, professionally and helpfully. Answer questions briefly and guide high-intent users toward a demo or consultation.',
  qualificationCriteria: 'Pricing questions, demo requests, implementation queries and clear purchase intent should be treated as strong buying signals.',
  avoid: 'Do not make false claims, do not promise unsupported features and do not provide confidential information.',
}
export const demoContents: DemoContent[] = [
  { id: 'walkthrough', title: 'Product Walkthrough', duration: '04:32', views: '8.2K views', category: 'PRODUCT TOUR', published: 'Sep 10, 2026' },
  { id: 'automation', title: 'AI Automation Demo', duration: '06:18', views: '5.6K views', category: 'WORKFLOW IN ACTION', published: 'Sep 08, 2026' },
  { id: 'overview', title: 'LeadHive Overview', duration: '03:45', views: '12.4K views', category: 'MEET LEADHIVE', published: 'Sep 04, 2026' },
]
export const demoInteractions: DemoInteraction[] = [
  { id: 'sarah', name: 'Sarah M.', initials: 'SM', contentId: 'walkthrough', message: 'Can someone explain your pricing plans?', intent: 'Pricing Inquiry', score: 86, response: '{brand} offers flexible plans based on your engagement volume and automation requirements. I can help you identify the most suitable option.' },
  { id: 'ahmed', name: 'Ahmed K.', initials: 'AK', contentId: 'automation', message: 'We manage a growing sales team. Could we book a demo for next week?', intent: 'Demo Request', score: 92, response: 'A walkthrough of {brand} would be a great next step. Share your team size and preferred time with our team so we can tailor the conversation to your workflow.' },
  { id: 'john', name: 'John D.', initials: 'JD', contentId: 'overview', message: 'Interesting idea. How does lead qualification work?', intent: 'General Inquiry', score: 59, response: '{brand} identifies signals such as pricing questions and demo requests, then scores conversations to help your team prioritize follow-up.' },
  { id: 'emily', name: 'Emily R.', initials: 'ER', contentId: 'automation', message: 'We need to automate inbound qualification this quarter. What does implementation involve?', intent: 'Implementation', score: 81, response: 'Implementation planning starts with your channels, qualification criteria and response guidelines. Our team can help map those requirements for {brand} and discuss a suitable rollout.' },
  { id: 'daniel', name: 'Daniel T.', initials: 'DT', contentId: 'walkthrough', message: 'Can we customize the tone and choose which content to monitor?', intent: 'Feature Question', score: 68, response: 'Yes. In this {brand} demo, you can configure your brand tone and select the content for the engagement workflow. Your choices shape this demo session.' },
  { id: 'hassan', name: 'Hassan A.', initials: 'HA', contentId: 'overview', message: 'Nice video! Just browsing today.', intent: 'Low Intent', score: 32, response: 'Thank you for taking a look at {brand}. If any questions come up as you explore, we are happy to help.' },
  { id: 'olivia', name: 'Olivia P.', initials: 'OP', contentId: 'walkthrough', message: 'We handle around 2,000 enquiries a month. Can your team discuss a plan with us?', intent: 'Pricing Inquiry', score: 89, response: 'That context is helpful. The {brand} team can review your enquiry volume and qualification needs with you. A consultation is a useful next step to explore a suitable plan.' },
]
export const activityStageLabels = ['New comment detected', 'Analyzing message…', 'Intent detected', 'Lead score calculated', 'AI generating response…', 'AI response delivered', 'Qualification complete', 'Demo CRM status updated'] as const
export const workflowStages = ['Message received', 'Intent analysis', 'Lead scoring', 'Response generation', 'Qualified / Nurture'] as const

