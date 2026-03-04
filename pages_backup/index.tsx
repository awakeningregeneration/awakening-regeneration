import Link from 'next/link'
import Head from 'next/head'
import useSWR from 'swr'

type Story = { id:string; title:string; cover_image_url?:string|null }

const fetcher = (url:string) => fetch(url).then(r=>r.json())

export default function Home() {
  const { data } = useSWR<{stories:Story[]}>('/api/stories?featured=1', fetcher)
  const stories = data?.stories || []
  return (
    <main style={{maxWidth:900, margin:'40px auto', padding:'0 16px'}}>
      <Head>
        <title>Awakening Regeneration</title>
        <meta name="description" content="Find regenerative businesses and initiatives near you." />
      </Head>
      <h1 style={{fontSize:32, marginBottom:8}}>Awakening Regeneration</h1>
      <p style={{color:'#555', marginBottom:24}}>Discover regenerative places in your county. Read their stories. Go support them.</p>
      <p style={{marginBottom:24}}>
        <Link href="/explore">🌍 Open the Map</Link> &nbsp;|&nbsp; <Link href="/submit">➕ Submit a Listing</Link>
      </p>
      <h2 style={{fontSize:22, margin:'24px 0'}}>Featured Stories</h2>
      <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))'}}>
        {stories.map(s => (
          <Link key={s.id} href={`/stories/${s.id}`} style={{border:'1px solid #eee', padding:12, borderRadius:10, textDecoration:'none'}}>
            <div style={{fontWeight:600, color:'#111'}}>{s.title}</div>
          </Link>
        ))}
        {stories.length===0 && <div>No featured stories yet.</div>}
      </div>
    </main>
  )
}
