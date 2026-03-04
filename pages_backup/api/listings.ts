import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAnon } from '../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const supa = supabaseAnon()
  const { id, status } = req.query
  if (id) {
    const { data, error } = await supa
      .from('listings')
      .select('*, org:orgs(*)')
      .eq('id', id)
      .maybeSingle()
    if (error) return res.status(500).json({ error: error.message })
    return res.json({ listing: data })
  }
  let q = supa.from('listings').select('*, org:orgs(*)')
  if (status) q = q.eq('status', String(status))
  const { data, error } = await q.limit(500)
  if (error) return res.status(500).json({ error: error.message })
  res.json({ listings: data })
}
