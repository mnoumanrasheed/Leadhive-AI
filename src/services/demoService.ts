import {
  activityStageLabels,
  demoChannel,
  demoContents,
  demoInteractions,
  demoPlatforms,
} from '../data/demoData'
import type {
  ActivityEvent,
  ActivityStage,
  AnalyticsData,
  DemoInteraction,
  Lead,
  LeadStatus,
  Persona,
} from '../types/demo'

export function getLeadStatus(score: number): LeadStatus {
  return score >= 80 ? 'Qualified' : score >= 55 ? 'Nurture' : 'Low Intent'
}

export function validatePersona(persona: Persona): Partial<Record<keyof Persona, string>> {
  const errors: Partial<Record<keyof Persona, string>> = {}
  for (const [key, value] of Object.entries(persona)) {
    if (!value.trim()) errors[key as keyof Persona] = 'Please complete this field.'
  }
  try {
    const url = new URL(persona.website)
    if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.'))
      throw new Error('Invalid website')
  } catch {
    errors.website = 'Enter a full website URL, such as https://example.com.'
  }
  return errors
}

function createResponse(interaction: DemoInteraction, persona: Persona): string {
  const response = interaction.response.replaceAll('{brand}', persona.businessName.trim())
  switch (persona.tone) {
    case 'Friendly':
      return 'Happy to help! ' + response
    case 'Consultative':
      return 'Let’s explore what would work for you. ' + response
    case 'Concise':
      return response.split(/(?<=\.) /)[0]
    case 'Sales Focused':
      return response + ' Let’s discuss the next step with our team.'
    default:
      return 'Absolutely. ' + response
  }
}

// Local adapter boundary: replace these methods with API-backed adapters in a later phase.
export const demoService = {
  getSetup: () => ({ platforms: demoPlatforms, channel: demoChannel, contents: demoContents }),
  getInteractions: (contentIds: string[], persona: Persona): DemoInteraction[] =>
    demoInteractions
      .filter((item) => contentIds.includes(item.contentId))
      .map((item) => ({ ...item, response: createResponse(item, persona) })),
  createEvent(interaction: DemoInteraction, stage: ActivityStage, tick: number): ActivityEvent {
    return {
      id: interaction.id + '-' + stage,
      interactionId: interaction.id,
      stage,
      label: activityStageLabels[stage],
      timestamp: new Date(Date.UTC(2026, 8, 14, 10, 30, tick * 2)).toISOString(),
    }
  },
  getLeads(interactions: DemoInteraction[], events: ActivityEvent[]): Lead[] {
    const latest = new Map<string, ActivityEvent>()
    for (const event of events) latest.set(event.interactionId, event)
    return interactions.flatMap((item) => {
      const event = latest.get(item.id)
      return event
        ? [
            {
              ...item,
              stage: event.stage,
              timestamp: event.timestamp,
              status: getLeadStatus(item.score),
              action: event.stage < 5 ? 'Pending' : item.score < 80 ? 'Follow-up' : 'Responded',
            } satisfies Lead,
          ]
        : []
    })
  },
  getAnalytics(leads: Lead[]): AnalyticsData {
    const scored = leads.filter((lead) => lead.stage >= 3)
    const classified = leads.filter((lead) => lead.stage >= 6)
    const qualifiedLeads = classified.filter((lead) => lead.status === 'Qualified').length
    return {
      leadsDetected: leads.length,
      aiResponses: leads.filter((lead) => lead.stage >= 5).length,
      qualifiedLeads,
      averageLeadScore: scored.length
        ? Math.round(scored.reduce((total, lead) => total + lead.score, 0) / scored.length)
        : 0,
      qualificationRate: leads.length ? Math.round((qualifiedLeads / leads.length) * 1000) / 10 : 0,
      distribution: {
        Qualified: qualifiedLeads,
        Nurture: classified.filter((lead) => lead.status === 'Nurture').length,
        'Low Intent': classified.filter((lead) => lead.status === 'Low Intent').length,
      },
    }
  },
}
