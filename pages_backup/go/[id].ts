import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '../../../src/lib/supabase'

export default async function handler(req:NextApiRequest, res:NextApiResponse){
  const { id } = req.query as { id:string }
  if (!id) return res.status(400).send('Missing id')
  const admin = supabaseAdmin()
  const { data: l, error } = await admin.from('listings').select('id, org:orgs(website)').eq('id', id).maybeSingle()
  if (error || !l) return res.status(404).send('Not found')
  const target = (l.org && (l.org as any).website) || '/'
  await admin.from('clicks').insert({ listing_id: id, target_url: target })
  res.writeHead(302, { Location: target })
  res.end()
}
