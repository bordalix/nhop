import { showHeader } from './header'
import type { Query } from './query'

type Client = {
  name: string
  site: string
  path: {
    user?: string
    note?: string
  }
}

export const clients: Client[] = [
  {
    name: 'Coracle',
    site: 'https://coracle.social',
    path: { user: '/', note: '/' },
  },
  {
    name: 'Damus',
    site: 'https://damus.io',
    path: { user: '/', note: '/' },
  },
  {
    name: 'Iris',
    site: 'https://iris.to',
    path: { user: '/', note: '/' },
  },
  {
    name: 'Jumble',
    site: 'https://jumble.social',
    path: { user: '/', note: '/' },
  },
  {
    name: 'Nosotros',
    site: 'https://nosotros.app',
    path: { user: '/', note: '/' },
  },
  {
    name: 'Nosta',
    site: 'https://nosta.me',
    path: { user: '/' },
  },
  {
    name: 'Nostrudel',
    site: 'https://nostrudel.ninja',
    path: { user: '/u/', note: '/n/' },
  },
  {
    name: 'Nostter',
    site: 'https://nostter.app',
    path: { user: '/', note: '/' },
  },
  {
    name: 'Primal',
    site: 'https://primal.net',
    path: { user: '/p/', note: '/e/' },
  },
  {
    name: 'Snort',
    site: 'https://snort.social',
    path: { user: '/', note: '/' },
  },
  {
    name: 'YakiHonne',
    site: 'https://yakihonne.com',
    path: { user: '/profile/', note: '/note/' },
  },
]

export const showClients = (query: Query) => {
  // show header
  showHeader()
  // prepare clients links
  const a = (name: string, url: string) => `
    <a href="${url}" target="_blank" rel="noopener noreferrer">
      <p class="client-link">${name}</p>
    </a>
  `
  // build html
  let html = a('Default client', `nostr:${query.input}`)
  html += clients
    .map((c) => {
      const path = query.isUser ? c.path.user : c.path.note
      if (!path) return ''
      const url = `${c.site}${path}${query.input}`
      return a(c.name, url)
    })
    .join('')
  document.querySelector<HTMLDivElement>('#clients')!.innerHTML = `<div>${html}</div>`
}
