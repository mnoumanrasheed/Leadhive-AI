export type PlatformId = 'youtube' | 'whatsapp' | 'instagram' | 'facebook'
export interface Platform {
  id: PlatformId
  name: string
  label: string
  available: boolean
}
export interface DemoChannel {
  id: string
  name: string
  platform: PlatformId
  subscribers: string
}
export type BrandTone =
  'Professional & Helpful' | 'Friendly' | 'Consultative' | 'Concise' | 'Sales Focused'
export interface Persona {
  businessName: string
  website: string
  industry: string
  tone: BrandTone
  description: string
  instructions: string
  qualificationCriteria: string
  avoid: string
}
export interface DemoContent {
  id: string
  title: string
  duration: string
  views: string
  category: string
  published: string
}
export type LeadIntent =
  | 'Pricing Inquiry'
  | 'Demo Request'
  | 'Implementation'
  | 'General Inquiry'
  | 'Feature Question'
  | 'Low Intent'
export type LeadStatus = 'Qualified' | 'Nurture' | 'Low Intent'
export type AutomationStatus = 'Ready' | 'Active' | 'Paused' | 'Complete'
export interface DemoInteraction {
  id: string
  name: string
  initials: string
  contentId: string
  message: string
  intent: LeadIntent
  score: number
  response: string
}
export type ActivityStage = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
export interface ActivityEvent {
  id: string
  interactionId: string
  stage: ActivityStage
  timestamp: string
  label: string
}
export interface Lead extends DemoInteraction {
  stage: ActivityStage
  timestamp: string
  status: LeadStatus
  action: 'Pending' | 'Responded' | 'Follow-up'
}
export interface AnalyticsData {
  leadsDetected: number
  aiResponses: number
  qualifiedLeads: number
  averageLeadScore: number
  qualificationRate: number
  distribution: Record<LeadStatus, number>
}
