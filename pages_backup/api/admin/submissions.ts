import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const admin = supabaseAdmin()
  const { data, error } = await admin.from('submissions').select('*').in('status', ['new','review']).order('created_at', { ascending:false })
  if (error) return res.status(500).json({ error: error.message })
  res.json({ submissions: data })
}
