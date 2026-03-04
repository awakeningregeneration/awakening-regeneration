import { useRouter } from 'next/router'
import useSWR from 'swr'

const fetcher = (url:string) => fetch(url).then(r=>r.json())

export default function ListingPage() {
  const router = useRouter()
  const { id } = router.query
  const { data } = useSWR(id ? `/api/listings?id=${id}` : null, fetcher)
  const l = data?.listing
  if (!id) return null
  if (!l) return <div style={{padding:16}}>Loading…</div>
  const target = l.org?.website || '#'
  return (
    <main style={{maxWidth:800, margin:'40px auto', padding:'0 16px'}}>
      <h1>{l.org?.name || 'Listing'}</h1>
      <p>{l.org?.description}</p>
      <p>{l.address} {l.city}</p>
      <p>
        <a href={`/go/${l.id}`}>Support / Visit Website</a>
      </p>
    </main>
  )
}
