import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (u:string)=>fetch(u).then(r=>r.json())

export default function StoryPage(){
  const { query } = useRouter()
  const { id } = query
  const { data } = useSWR(id ? `/api/story?id=${id}` : null, fetcher)
  const s = data?.story
  if (!id) return null
  if (!s) return <div style={{padding:16}}>Loading…</div>
  return (
    <main style={{maxWidth:800, margin:'40px auto', padding:'0 16px'}}>
      <h1>{s.title}</h1>
      <div>{s.body_markdown}</div>
    </main>
  )
}
