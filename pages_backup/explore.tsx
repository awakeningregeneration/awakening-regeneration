import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import useSWR from 'swr'
import mapboxgl from 'mapbox-gl'

const fetcher = (url:string) => fetch(url).then(r=>r.json())

export default function Explore() {
  const mapContainer = useRef<HTMLDivElement|null>(null)
  const mapRef = useRef<mapboxgl.Map|null>(null)
  const [selected, setSelected] = useState<any>(null)
  const { data } = useSWR('/api/listings?status=published', fetcher)
  const listings = data?.listings || []
  const center = [ -123.5, 39.3 ] as [number, number] // example Mendocino-ish

  useEffect(()=>{
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
    if (mapRef.current || !mapContainer.current) return
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: 8
    })
    mapRef.current = map
    return () => { map.remove() }
  },[])

  useEffect(()=>{
    const map = mapRef.current
    if (!map) return
    // remove old markers
    ;(map as any)._markers?.forEach((m:mapboxgl.Marker)=>m.remove())
    ;(map as any)._markers = []
    listings.forEach((l:any)=>{
      if (!l.lat || !l.lng) return
      const el = document.createElement('div')
      el.style.width='10px';el.style.height='10px';el.style.borderRadius='50%';el.style.background='#1e88e5'
      const mk = new mapboxgl.Marker(el).setLngLat([l.lng,l.lat]).addTo(map)
      el.onclick = () => setSelected(l)
      ;(map as any)._markers.push(mk)
    })
  },[listings])

  return (
    <main style={{height:'100vh'}}>
      <Head><title>Explore — Awakening Regeneration</title></Head>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', height:'100%'}}>
        <div ref={mapContainer} />
        <div style={{overflow:'auto', borderLeft:'1px solid #eee', padding:12}}>
          <h2 style={{margin:'8px 0'}}>Listings</h2>
          {listings.map((l:any)=>(
            <div key={l.id} style={{border:'1px solid #eee', borderRadius:8, padding:10, marginBottom:8}}>
              <div style={{fontWeight:600}}>{l.org?.name || 'Listing'}</div>
              <div style={{color:'#666'}}>{l.city || ''}</div>
              <a href={`/listing/${l.id}`}>View</a>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <div style={{position:'fixed', bottom:20, left:20, right:20, background:'#fff', border:'1px solid #ddd', borderRadius:12, padding:12}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <strong>{selected.org?.name || 'Listing'}</strong>
            <button onClick={()=>setSelected(null)}>Close</button>
          </div>
          <p>{selected.org?.description || ''}</p>
          <a href={`/listing/${selected.id}`}>Open</a>
        </div>
      )}
    </main>
  )
}
