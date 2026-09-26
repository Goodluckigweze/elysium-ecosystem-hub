# Contributing to Elysium Ecosystem Hub

Thanks for helping improve the Elysium Testnet directory.

## Before you start

For a new project listing, make sure you have:

- The public project name
- One existing category from the filter list
- A short, accurate description
- A working public URL

## Development workflow

1. Fork the repository and create a focused branch.
2. Install dependencies with `pnpm install`.
3. Make your change in `artifacts/elysium-ecosystem-hub`.
4. Run:

   ```bash
   pnpm --filter @workspace/elysium-ecosystem-hub run typecheck
   PORT=20924 BASE_PATH=/ pnpm --filter @workspace/elysium-ecosystem-hub run build
   ```

5. Check the result on both desktop and mobile widths.
6. Open a pull request with a short summary of the change.

## Project data

The directory is intentionally easy to maintain. Add project entries to the `PROJECTS` array in `artifacts/elysium-ecosystem-hub/src/App.tsx`. Avoid adding duplicate listings or changing category labels without updating the filter list.

## Pull requests

Please keep pull requests small and explain:

- What changed
- Why it helps users
- How you verified it

## Code of conduct

Be respectful, specific, and constructive. The goal is to make the Elysium ecosystem easier for everyone to explore.