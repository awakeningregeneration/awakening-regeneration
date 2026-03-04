import { FormEvent, useState } from 'react'

export default function SubmitPage() {
  const [status, setStatus] = useState<string>('ready')

  async function onSubmit(e:FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const payload = Object.fromEntries(formData.entries())
    setStatus('sending')
    const res = await fetch('/api/submit', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ payload })
    })
    setStatus(res.ok ? 'ok' : 'error')
    if (res.ok) form.reset()
  }

  return (
    <main style={{maxWidth:700, margin:'40px auto', padding:'0 16px'}}>
      <h1>Submit a Listing</h1>
      <form onSubmit={onSubmit}>
        <label>Contact Email<br/><input name="email" type="email" required/></label><br/>
        <label>Organization Name<br/><input name="org_name" required/></label><br/>
        <label>Website<br/><input name="website" type="url"/></label><br/>
        <label>Address<br/><input name="address"/></label><br/>
        <label>City<br/><input name="city"/></label><br/>
        <label>Category<br/><input name="category"/></label><br/>
        <label>Description<br/><textarea name="description" rows={5}></textarea></label><br/>
        <label>Volunteer Friendly?<br/><input name="volunteer" type="checkbox" /></label><br/>
        <label>Pickup Available?<br/><input name="pickup" type="checkbox" /></label><br/>
        <button type="submit">Send</button>
      </form>
      {status==='sending' && <p>Sending…</p>}
      {status==='ok' && <p>Thanks! We received your submission.</p>}
      {status==='error' && <p>Something went wrong. Please try again.</p>}
    </main>
  )
}
