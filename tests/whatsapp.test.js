import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { whatsappDestination } from '../src/whatsapp.js'

test('WhatsApp handoff retains the configured recipient and encodes the visitor message', () => {
  const result = new URL(whatsappDestination('https://api.whatsapp.com/send?phone=919999999999', '  Hello & tell me about courses?  '))
  assert.equal(result.origin, 'https://api.whatsapp.com')
  assert.equal(result.searchParams.get('phone'), '919999999999')
  assert.equal(result.searchParams.get('text'), 'Hello & tell me about courses?')
  const wa = new URL(whatsappDestination('https://wa.me/919999999999?text=old', 'New message'))
  assert.equal(wa.pathname, '/919999999999')
  assert.equal(wa.searchParams.get('text'), 'New message')
})
