export interface LeadPayload {
  name: string
  email: string
  projectType: string
  budget: string
  message: string
  lang: string
  files?: File[]
}

/**
 * Lead submission endpoint. Any JSON POST target works without files:
 * - Formspree:  VITE_LEAD_ENDPOINT=https://formspree.io/f/<form-id>
 * - Webhook:    VITE_LEAD_ENDPOINT=https://hooks.example.com/leads
 * - Custom API: VITE_LEAD_ENDPOINT=https://api.webgiants.studio/leads
 *
 * When files are attached, the request is sent as multipart/form-data
 * (Formspree and most custom APIs accept this).
 */
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT as string | undefined

function leadFields(payload: LeadPayload) {
  return {
    name: payload.name,
    email: payload.email,
    projectType: payload.projectType,
    budget: payload.budget,
    message: payload.message,
    lang: payload.lang,
  }
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const files = payload.files ?? []
  const fields = leadFields(payload)

  if (!LEAD_ENDPOINT) {
    // No endpoint configured yet: keep the UX flow intact in development,
    // but make the gap loud in the console.
    console.warn('[leads] VITE_LEAD_ENDPOINT is not set — lead was NOT transmitted:', {
      ...fields,
      files: files.map((f) => ({ name: f.name, size: f.size, type: f.type })),
    })
    await new Promise((r) => setTimeout(r, 700))
    return
  }

  let res: Response

  if (files.length > 0) {
    const body = new FormData()
    for (const [key, value] of Object.entries(fields)) {
      body.append(key, value)
    }
    for (const file of files) {
      body.append('attachment', file, file.name)
    }
    // Let the browser set multipart boundary — do not set Content-Type manually.
    res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    })
  } else {
    res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(fields),
    })
  }

  if (!res.ok) {
    throw new Error(`Lead submission failed with status ${res.status}`)
  }
}
