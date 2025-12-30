# nhop

Client side only substitute for njump.me

## Install and run

```bash
pnpm install
pnpm dev
```

## How to use

Needs '?' to use directly on the url:

http://localhost:5173?npub1...

Accepts:

- hex string - converts to `nevent`
- user@domain - converts to `npub`
- `nsec` - converts to `npub`
- `npub`, `naddr` and `nprofile` for user profiles
- `note` and `nevent` for notes

## Code logic

The application follows a simple flow:

1. **Entry Point** ([main.ts](src/main.ts)): Extracts the query parameter from the URL and creates a `Query` object. If no input is provided or an error occurs, it displays the home page; otherwise, it shows the requested content.

2. **Query Processing** ([query.ts](src/query.ts)): The `Query` class handles input normalization:

   - Converts 64-character hex strings to `nevent` format
   - Resolves NIP-05 addresses (user@domain) to `npub` using NIP-05 profile lookup
   - Validates the prefix against supported types
   - Determines if the input is a note or user profile
   - Parses NIP-19 encoded strings to extract hex identifiers and relay hints

3. **NIP-19 Parsing** ([parser.ts](src/parser.ts)): Decodes various Nostr identifier formats (`nevent`, `note`, `naddr`, `nsec`, `nprofile`, `npub`) into hex pubkeys/event IDs, extracting any embedded relay information.

4. **Data Fetching** ([fetch.ts](src/fetch.ts)): The `Fetcher` class queries Nostr relays using `nostr-tools`:

   - For users: fetches metadata (kind 0), relay lists (kind 10002), and recent notes (kind 1)
   - For notes: fetches the specific event by ID
   - Merges relay hints from the identifier with default relays

5. **Display** ([show.ts](src/show.ts)): Renders the fetched content:

   - User profiles show name, picture, bio, lightning address, recent notes, and relay list
   - Notes display the event content with formatting
   - Both include "Open in Client" buttons for various Nostr clients

6. **Relay Management** ([relays.ts](src/relays.ts)): Maintains a list of default relays and merges them with any relay hints extracted from identifiers or user profiles.
