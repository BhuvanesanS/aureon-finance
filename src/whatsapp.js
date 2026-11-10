export function whatsappDestination(url, message) {
  const destination = new URL(url)
  if (message.trim()) destination.searchParams.set('text', message.trim())
  return destination.href
}
