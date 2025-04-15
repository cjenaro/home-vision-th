# HomeVision Takehome

https://github.com/user-attachments/assets/db4cb6ee-a604-4916-9dc1-db2b04064849

## Stack

- 🔒 TypeScript
- 🎉 TailwindCSS for styling
- 📖 [React Router v7](https://reactrouter.com/)
- 📖 [Biome](https://biomejs.dev/) for linting and formatting
- 📖 [Kamal](https://kamal-deploy.org/) for deployment
- [MapLibre](https://visgl.github.io/react-map-gl) and [OpenFreeMap](https://openfreemap.org) for the map, [zippopotam](https://api.zippopotam.us) for zip to lat and long
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) to store the saved houses.

## Features

- Infinite loading of house listings
- Save houses to your own custom list using indexedDB
- Look at the saved houses on a map
- per page pagination
- Dark and light mode support
- server side rendering and client side fetching of data.
- retry logic for failed requests using [exponential backoff](https://medium.com/bobble-engineering/how-does-exponential-backoff-work-90ef02401c65)

## Decisions

### Architecture
- **React Router v7**: I really enjoy the architecture better than NextJS.
- **TypeScript**: Pretty much a standard, type safety is great and react-router has a typegen command for typed routes.
- **IndexedDB**: Initially was going with session storage but quickly ran out of space on the cookie, so storing on the client was better.
- **Server-Side Rendering**: Faster initial load.

### State Management
- **Client-Side State**: React's built in state together with react router's fetchers and loaders.

### Extra
- **Infinite Scroll**: Implemented with intersection observer for efficient events on the dom.

## Getting Started

![development](https://github.com/user-attachments/assets/1f829490-f2aa-4964-ab3b-825cc8313f27)

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Linting and Formatting

```bash
npm run lint        # Run Biome linter
npm run lint:fix    # Fix linting issues
npm run format      # Format code
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

The application is deployed to [Kamal](https://kamal-deploy.org/) to a VPS on Hetzner using the following command:

```bash
kamal deploy
```

To deploy the app there are two kamal secrets that need to be set:

- `KAMAL_REGISTRY_PASSWORD` - the password for the docker registry

These can be shared through a 1Password vault with the team,

The application is available at https://home-vision.woodpecker.rocks/

### Why Kamal?

Kamal is an open source tool great for small projects, it's easy to set up, fast to deploy and uses the already existing Dockerfile from the react-router template, it also provides SSL via Let's Encrypt.
