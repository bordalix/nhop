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
  const a = (name: string, url: string) => `
    <a href="${url}" target="_blank" rel="noopener noreferrer">
      <p class="client-link">${name}</p>
    </a>
  `
  let html = a('Default client', `nostr:${query.input}`)
  html += clients
    .map((c) => {
      const path = query.isUser ? c.path.user : c.path.note
      if (!path) return ''
      const url = `${c.site}${path}${query.input}`
      return a(c.name, url)
    })
    .join('')
  document.querySelector<HTMLDivElement>('#clients')!.innerHTML = html
  document.querySelector<HTMLDivElement>('#header')!.innerHTML = `
    <button popovertarget="clients">
      <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 32 32">
        <path
          fill="none"
          stroke-width="2"
          stroke="var(--purple)"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5 17v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-8m-11 3V3.5M22 9l-6-6l-6 6"
        />
      </svg>
    </button>
  `
}
