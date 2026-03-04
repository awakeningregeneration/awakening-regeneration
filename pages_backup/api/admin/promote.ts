import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if (req.method !== 'POST') return res.status(405).end()
  const { id } = req.body || {}
  if (!id) return res.status(400).json({ error: 'Missing id' })
  const admin = supabaseAdmin()
  // Load submission
  const { data: sub, error: err1 } = await admin.from('submissions').select('*').eq('id', id).single()
  if (err1 || !sub) return res.status(404).json({ error: 'Submission not found' })
  const p = sub.payload_json || {}
  // Create org
  const { data: org, error: err2 } = await admin.from('orgs').insert({
    name: p.org_name || p.org?.name || 'Untitled',
    website: p.website || p.org?.website || null,
    email: p.email || p.contact?.email || null,
    description: p.description || null
  }).select('*').single()
  if (err2) return res.status(500).json({ error: err2.message })
  // Create listing (region is optional during MVP; set null or a default)
  const { data: listing, error: err3 } = await admin.from('listings').insert({
    org_id: org.id,
    address: p.address || null,
    city: p.city || null,
    volunteer_friendly: !!p.volunteer,
    pickup: !!p.pickup,
    status: 'published',
    price: p.price || null
  }).select('*').single()
  if (err3) return res.status(500).json({ error: err3.message })
  // Mark submission approved
  await admin.from('submissions').update({ status: 'approved' }).eq('id', id)
  res.json({ ok:true, listing })
}
