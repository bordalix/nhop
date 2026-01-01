export const pretty = {
  date: (unix: number): string => {
    return new Date(unix * 1000).toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  },
  hour: (unix: number): string => {
    return new Date(unix * 1000).toLocaleTimeString('en-us', {
      timeZone: 'UTC',
      timeZoneName: 'short',
    })
  },
  html: (content: string): string => {
    if (content.match(/https:\/\//)) {
      for (const match of content.match(/https:\/\/.*/g) || []) {
        content = content.replace(match, `<a href="${match}">${match}</a>`)
      }
    }
    if (content.match(/nostr:/)) {
      for (const match of content.match(/nostr:.*/g) || []) {
        const id = match.split(':')[1]
        content = content.replace(match, `<a href="/?${id}">${match}</a>`)
      }
    }
    return content.replace(/\n/g, '<br />')
  },
  time: (unix: number): string => {
    return `${pretty.date(unix)} at ${pretty.hour(unix)}`
  },
}
