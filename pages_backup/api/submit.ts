import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAnon, supabaseAdmin } from '../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  if (req.method !== 'POST') return res.status(405).end()
  const { payload } = req.body || {}
  if (!payload) return res.status(400).json({ error: 'Missing payload' })
  const admin = supabaseAdmin()
  const { data, error } = await admin.from('submissions').insert({
    payload_json: payload,
    email: (payload.email || null)
  }).select('*').single()
  if (error) return res.status(500).json({ error: error.message })
  // TODO: send email via Resend
  res.json({ ok: true, submission: data })
}
