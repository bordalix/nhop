import { home, show } from './html.ts'
import { Query } from './query.ts'
import './style.css'

const query = await Query.create(window.location.search)

if (!query.input) {
  home({})
} else if (query.isValid()) {
  show(query)
} else {
  home({ error: query.error() })
}
