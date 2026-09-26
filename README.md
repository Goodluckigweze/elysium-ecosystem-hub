# Elysium Ecosystem Hub

The community-maintained directory for discovering projects, infrastructure, and tools on the Elysium Testnet.

## What it does

Elysium Ecosystem Hub gives builders and users one clear place to find useful testnet apps:

- Browse the Elysium Testnet ecosystem in a responsive directory.
- Filter projects by category.
- Search by project name, category, or description.
- Open projects directly in a new tab.
- Submit a new project through the community submission form.
- Access the official bridge, explorer, and documentation from the footer.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- pnpm workspaces

The hub is a client-side application with no database, authentication, or server-side project directory. The directory data lives in `artifacts/elysium-ecosystem-hub/src/App.tsx`.

## Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm 9 or newer

### Install

```bash
pnpm install
```

### Run locally

```bash
PORT=20924 BASE_PATH=/ pnpm --filter @workspace/elysium-ecosystem-hub run dev
```

Open [http://localhost:20924](http://localhost:20924).

### Typecheck and build

```bash
pnpm --filter @workspace/elysium-ecosystem-hub run typecheck
PORT=20924 BASE_PATH=/ pnpm --filter @workspace/elysium-ecosystem-hub run build
```

The production files are written to `artifacts/elysium-ecosystem-hub/dist/public`.

## Adding or updating a project

Project entries are kept in the `PROJECTS` array in:

```text
artifacts/elysium-ecosystem-hub/src/App.tsx
```

Each entry follows this shape:

```ts
{
  name: "Project name",
  category: "Faucet",
  description: "A short, useful description.",
  link: "https://example.com",
}
```

Use one of the existing category labels so filtering stays consistent. Keep descriptions short, factual, and useful to someone discovering the project for the first time.

## Deploying with Vercel

This repository includes a root `vercel.json` for Vercel deployments. To deploy:

1. Push or import the repository into GitHub.
2. In Vercel, choose **Add New Project** and import the GitHub repository.
3. Keep the repository root as the project root.
4. Deploy using the detected configuration.

Vercel will build the Vite app and serve the generated static files. You can then attach a custom domain from the Vercel project settings, such as `ecosystem.yourdomain.com`.

## Replit deployment

The app also includes its Replit artifact configuration and can be previewed or published directly from Replit.

## Contributing

Contributions are welcome. Before opening a pull request:

1. Keep the change focused.
2. Run the typecheck and production build commands above.
3. Confirm the app remains usable on mobile and desktop.
4. Update the README when a change affects setup or maintenance.

For directory additions, include the project name, category, short description, and a working public link.

## License

This project is available under the MIT License. See [LICENSE](./LICENSE).