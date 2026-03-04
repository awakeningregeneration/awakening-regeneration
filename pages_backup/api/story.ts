import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAnon } from '../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const { id } = req.query
  if (!id) return res.status(400).json({ error:'Missing id' })
  const supa = supabaseAnon()
  const { data, error } = await supa.from('stories').select('*').eq('id', id).maybeSingle()
  if (error) return res.status(500).json({ error: error.message })
  return res.json({ story: data })
}
