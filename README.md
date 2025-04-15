# HomeVision Takehome

## Stack

- 🔒 TypeScript
- 🎉 TailwindCSS for styling
- 📖 [React Router v7](https://reactrouter.com/)
- 📖 [Biome](https://biomejs.dev/) for linting and formatting
- 📖 [Kamal](https://kamal-deploy.org/) for deployment
- [MapLibre](https://visgl.github.io/react-map-gl) and [OpenFreeMap](https://openfreemap.org)

## Features

- Infinite loading of house listings
- Save houses to your own custom list using indexedDB
- Look at the saved houses on a map
- per page pagination
- Dark and light mode support
- server side rendering and client side fetching of data.
- retry logic for failed requests using [exponential backoff](https://medium.com/bobble-engineering/how-does-exponential-backoff-work-90ef02401c65)

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
