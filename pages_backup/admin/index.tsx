import useSWR from 'swr'

const fetcher = (u:string) => fetch(u).then(r=>r.json())

export default function AdminPage(){
  const { data, mutate } = useSWR('/api/admin/submissions', fetcher)
  const subs = data?.submissions || []
  async function promote(id:string){
    const res = await fetch('/api/admin/promote', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ id })
    })
    if (res.ok) mutate()
  }
  return (
    <main style={{maxWidth:900, margin:'40px auto', padding:'0 16px'}}>
      <h1>Admin — Submissions</h1>
      <p style={{color:'#666'}}>Minimal admin. Protect with auth/RLS in production.</p>
      {subs.map((s:any)=>(
        <div key={s.id} style={{border:'1px solid #eee', borderRadius:8, padding:12, marginBottom:10}}>
          <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(s.payload_json, null, 2)}</pre>
          <button onClick={()=>promote(s.id)}>Promote → Publish</button>
        </div>
      ))}
      {subs.length===0 && <div>No submissions.</div>}
    </main>
  )
}
