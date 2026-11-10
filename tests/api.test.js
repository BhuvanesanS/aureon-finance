import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomBytes } from 'node:crypto'

test('public forms, admin, publication and persistence work together', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mubsa-api-test-'))
  process.env.DATA_DIR = dir
  const { createApiServer, setRuntimeEnv } = await import('../server/index.js')
  const password = randomBytes(20).toString('hex')
  setRuntimeEnv({ ADMIN_EMAIL:'test@example.test', ADMIN_PASSWORD:password, ADMIN_SESSION_SECRET:randomBytes(32).toString('hex') })
  let server = createApiServer()
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  let base = `http://127.0.0.1:${server.address().port}`
  let cookie = ''
  async function call(path, method='GET', body, auth=false) {
    const response = await fetch(base+path, { method, headers:{'Content-Type':'application/json', ...(auth ? {Cookie:cookie} : {})}, ...(body ? {body:JSON.stringify(body)} : {}) })
    return { status:response.status, data:await response.json(), cookie:response.headers.get('set-cookie') }
  }
  try {
    assert.equal((await call('/api/health')).status, 200)
    assert.equal((await call('/api/admin/dashboard')).status, 401)
    const login = await call('/api/admin/login','POST',{email:'test@example.test',password})
    assert.equal(login.status,200); cookie=login.cookie.split(';')[0]
    const config=(await call('/api/admin/content','GET',null,true)).data
    assert.equal(config.popupEnabled,true)
    assert.equal((await call('/api/admin/content','PUT',config)).status,401)
    config.popupTitle='Test welcome'
    config.contact={title:'Talk to our team',description:'Updated contact description',location:'Test office',email:'team@example.test',phone:'+910000000000'}
    config.faqs=[{category:'Seminars',question:'When is the session?',answer:'See the published schedule.'}]
    config.socialLinks=[{label:'Instagram',url:'https://www.instagram.com/example'}]
    config.registrationLabel='Register here'
    config.communityLabel='Join Telegram'
    config.courses[0]={...config.courses[0],name:'Foundations Course',description:'Updated course description',modules:[['Updated module','Updated syllabus',['First topic','Second topic']]]}
    config.gallery=[{title:'Approved portrait',city:'Dubai',image:'/client-portrait.jpg'}]
    config.testimonials=[{name:'Test learner',role:'Test only',quote:'A test quote, not production content.'}]
    assert.equal((await call('/api/admin/content','PUT',config,true)).status,200)
    assert.equal((await call('/api/admin/content','PUT',{...config,gallery:[{image:'javascript:alert(1)'}]},true)).status,422)
    assert.equal((await call('/api/admin/settings','PATCH',{telegramUrl:'https://t.me/example',whatsappUrl:''},true)).status,200)
    const publicContent=(await call('/api/site-content')).data
    assert.equal(publicContent.content.popupTitle,'Test welcome')
    assert.deepEqual(publicContent.content.contact,config.contact)
    assert.deepEqual(publicContent.content.faqs,config.faqs)
    assert.deepEqual(publicContent.content.socialLinks,config.socialLinks)
    assert.equal(publicContent.content.courses[0].name,'Foundations Course')
    assert.equal(publicContent.slides.find(s => s.id === 'course-basic').title,'Foundations Course')
    assert.equal((await call('/api/admin/content','PUT',{...config,socialLinks:[{label:'Bad',url:'javascript:alert(1)'}]},true)).status,422)
    assert.equal((await call('/api/admin/content','PUT',{...config,courses:[]},true)).status,422)
    assert.equal((await call('/api/admin/content','PUT',{...config,courses:[config.courses[0],config.courses[0]]},true)).status,422)
    assert.equal((await call('/api/admin/content','PUT',{...config,contact:{...config.contact,email:'invalid'}},true)).status,422)
    assert.equal((await call('/api/admin/content','PUT',{...config,faqs:[{category:'',question:'',answer:''}]},true)).status,422)
    assert.equal((await call('/api/admin/content','PUT',{registrationLabel:'Reserve my seat'},true)).status,200)
    assert.deepEqual((await call('/api/site-content')).data.content.contact,config.contact)
    const event = await call('/api/admin/webinars','POST',{title:'Local test webinar',startsAt:new Date(Date.now()+86400000).toISOString(),timeZone:'Asia/Kolkata',durationMinutes:60,joinUrl:'https://zoom.us/j/123456789',status:'draft'},true)
    assert.equal(event.status,201)
    assert.equal((await call('/api/site-content')).data.webinar,null)
    const webinar=event.data.webinar
    assert.equal((await call(`/api/admin/webinars/${webinar.id}`,'PATCH',{...webinar,status:'published',joinUrl:'https://zoom.us/j/987654321'},true)).status,200)
    assert.equal((await call('/api/site-content')).data.webinar.joinUrl,'https://zoom.us/j/987654321')
    assert.equal((await call('/api/webinar-registrations','POST',{webinarId:webinar.id})).status,422)
    const signup=await call('/api/webinar-registrations','POST',{webinarId:webinar.id,name:'Local Test',email:'local@example.test',phone:'+910000000000',city:'Other',profession:'Other',consent:true})
    assert.equal(signup.status,201)
    assert.equal(signup.data.delivery.email,'not_configured')
    const booking=await call('/api/booking-requests','POST',{fullName:'Local Test',email:'local@example.test',phone:'0000000000',course:'Foundations Course',message:'Local test only',consent:true})
    assert.equal(booking.status,201)
    let dashboard=await call('/api/admin/dashboard','GET',null,true)
    assert.equal(dashboard.data.registrations.length,1)
    assert.equal(dashboard.data.bookings.length,1)
    assert.equal((await call(`/api/admin/bookings/${dashboard.data.bookings[0].id}`,'PATCH',{status:'contacted'},true)).status,200)
    await new Promise(resolve => server.close(resolve))
    server=createApiServer()
    await new Promise(resolve => server.listen(0,'127.0.0.1',resolve))
    base=`http://127.0.0.1:${server.address().port}`
    dashboard=await call('/api/admin/dashboard','GET',null,true)
    assert.equal(dashboard.data.bookings[0].status,'contacted')
    assert.equal(dashboard.data.registrations[0].reference,signup.data.reference)
    assert.equal(JSON.parse(await readFile(join(dir,'records.json'),'utf8')).settings.content.popupTitle,'Test welcome')
    const seminarPayload={title:'In-person seminar',description:'Test schedule',startsAt:new Date(Date.now()+172800000).toISOString(),timeZone:'Asia/Kolkata',durationMinutes:90,status:'published',registrationUrl:'https://example.test/register',ctaLabel:'Register for seminar'}
    const seminar=await call('/api/admin/webinars','POST',seminarPayload,true)
    assert.equal(seminar.status,201)
    assert.equal(seminar.data.webinar.joinUrl,'')
    let published=(await call('/api/site-content')).data
    assert.equal(published.webinars.find(w => w.id === seminar.data.webinar.id).registrationUrl,seminarPayload.registrationUrl)
    assert.equal(published.slides.find(w => w.id === seminar.data.webinar.id).ctaLabel,seminarPayload.ctaLabel)
    assert.equal((await call('/api/admin/webinars','POST',{...seminarPayload,registrationUrl:'javascript:alert(1)'},true)).status,422)
    const revised={...seminarPayload,startsAt:new Date(Date.now()+259200000).toISOString(),registrationUrl:'',ctaLabel:'Book now'}
    assert.equal((await call(`/api/admin/webinars/${seminar.data.webinar.id}`,'PATCH',revised,true)).status,200)
    published=(await call('/api/site-content')).data
    assert.equal(published.webinars.find(w => w.id === seminar.data.webinar.id).startsAt,revised.startsAt)
    assert.equal(published.webinars.find(w => w.id === seminar.data.webinar.id).registrationUrl,'')
    assert.equal((await call('/api/webinar-registrations','POST',{webinarId:seminar.data.webinar.id,name:'Seminar Test',email:'seminar@example.test',phone:'+910000000000',city:'Other',profession:'Other',consent:true})).status,201)
    const saved=JSON.parse(await readFile(join(dir,'records.json'),'utf8'))
    assert.deepEqual(saved.settings.content.faqs,config.faqs)
    assert.equal(saved.settings.content.courses[0].name,'Foundations Course')
    const logout=await call('/api/admin/logout','POST',{},true)
    assert.match(logout.cookie,/Max-Age=0/)
  } finally { await new Promise(resolve => server.close(resolve)); await rm(dir,{recursive:true,force:true}) }
})
