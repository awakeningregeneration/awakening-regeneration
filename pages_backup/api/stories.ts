import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAnon } from '../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const supa = supabaseAnon()
  const featured = req.query.featured ? true : false
  let q = supa.from('stories').select('*').order('published_at', { ascending:false }).limit(12)
  if (featured) q = q.eq('featured', true)
  const { data, error } = await q
  if (error) return res.status(500).json({ error: error.message })
  res.json({ stories: data })
}
