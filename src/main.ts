import { home, show } from './show.ts'
import { Query } from './query.ts'
import './style.css'

const query = await Query.create(window.location.search)

if (!query.input) {
  home({})
} else if (query.error) {
  home({ error: query.error })
} else {
  show(query)
}
