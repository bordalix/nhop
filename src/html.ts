import { Query } from './query'
import { Fetcher } from './fetch'
import { clients, type UserContent } from './types'
import { pretty } from './pretty'
import { nip19 } from 'nostr-tools'

export const home = ({ error }: { error?: string }) => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>
      <h1>nhop</h1>
      ${error ? `<p><strong style="color:red;">${error}</strong></p>` : ''}
      <p>Welcome to nhop! Please enter your key below to validate it.</p>
      <input id="keyInput" type="text" placeholder="Enter your key here" />
      <button id="validateButton">Validate Key</button>
      <p id="result" style="color:red;"></p>
    </div>
  `
  document.querySelector<HTMLButtonElement>('#validateButton')!.onclick =
    () => {
      const input = document.querySelector<HTMLInputElement>('#keyInput')!.value
      const result = document.querySelector<HTMLParagraphElement>('#result')!
      const query = new Query(input)
      const error = query.error()
      if (error) result.innerText = error
      else show(query)
    }
}

export const show = (query: Query) => {
  showClients(query)
  // prettier-ignore
  return query.isUser()
    ? showUser(query)
    : query.isNote()
    ? showNote(query)
    : null
}

const showUser = (query: Query) => {
  new Fetcher(query)
    .fetchUser()
    .then(({ user }) => {
      // component to display content fields
      const field = (type: string) => {
        if (!user[type as keyof UserContent]) return ''
        // prepare field data
        let data = Array.isArray(user[type as keyof UserContent])
          ? (user[type as keyof UserContent] as string[]).join('<br />')
          : (user[type as keyof UserContent] as string)
        // add links for website field
        if (type === 'website')
          data = `<a href="${data}" target="_blank" rel="noopener noreferrer">${data}</a>`
        // return field html
        return `
          <div style="margin-bottom: 1rem;">
            <h2>${type}:</h2>
            <p style="margin:0">${data}</p>
          </div>
        `
      }
      // component to display notes
      const notesList = () => {
        if (!user.notes || user.notes.length === 0) return '<p>No notes.</p>'
        // prepare notes list
        const notes = user.notes.map((n) => ({
          note: nip19.noteEncode(n.id),
          text: n.content,
        }))
        return `
          <h2>latest notes:</h2>
          <ul>
            ${notes
              .map((n) => `<li><a href="?${n.note}">${n.text}</a></li>`)
              .join('')}
          </ul>
        `
      }
      // render user content
      document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
        <div class="user-profile">
          <h1 class="user-name">${user.name}</h1>
          <img
            class="user-picture"
            src="${user.picture || 'https://via.placeholder.com/150'}"
            alt="User Picture"
          />
          <div class="user-details">
            ${field('about')}
            ${field('lud16')}
            ${field('npub')}
            ${field('username')}
            ${field('website')}
            ${field('relays')}
          </div>
          <div class="user-notes">
            ${notesList()}
          </div>
        </div>
      `
    })
    .catch((err) => {
      document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div>
        <h1>Error</h1>
        <p style="color:red;">${err.message}</p>
      </div>
    `
    })
}

const showNote = (query: Query) => {
  new Fetcher(query).fetchNote().then((event) => {
    const npub = nip19.npubEncode(event.pubkey)
    const note = nip19.noteEncode(event.id)
    document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
      <div class="note-display">
        <h1>Note</h1>
        <div class="note-metadata">
          <p><strong>Author:</strong> <a href="?${npub}">${npub}</a></p>
          <p><strong>Note:</strong> <a href="?${note}">${note}</a></p>
          <p><strong>When:</strong> ${pretty.time(event.created_at)}</p>
        </div>
        <div class="note-content">
          ${pretty.html(event.content)}
        </div>
      </div>
    `
  })
}

const showClients = (query: Query) => {
  const a = (name: string, url: string) => `
    <a href="${url}" rel="noopener noreferrer">
      <p class="client-link">${name}</p>
    </a>
  `
  let html = a('Default client', `nostr:${query.input}`)
  html += clients.map((c) => a(c.name, `${c.url}/${query.input}`)).join('')
  document.querySelector<HTMLDivElement>('#clients')!.innerHTML = html
}
