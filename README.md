# HomeVision Takehome

| House Listing | Saved Houses |
|------------|-----------|
| ![Screen Shot 2025-04-14 at 16 30 33](https://github.com/user-attachments/assets/03ffbf9b-8c11-4be1-9d57-feca19d63cb0) | ![Screen Shot 2025-04-14 at 16 30 44](https://github.com/user-attachments/assets/e7d6f8f5-f30e-4642-8ffe-a5a2be9ae28d) | ![Screen Shot 2025-04-14 at 16 30 44](https://github.com/user-attachments/assets/e7d6f8f5-f30e-4642-8ffe-a5a2be9ae28d) |

## Stack

- 🔒 TypeScript
- 🎉 TailwindCSS for styling
- 📖 [React Router v7](https://reactrouter.com/)


## Features

- Infinite loading of house listings
- Save houses to your own custom list on the cookie session
- per page pagination
- Dark and light mode support
- server side rendering and client side fetching of data.
- retry logic for failed requests using [exponential backoff](https://medium.com/bobble-engineering/how-does-exponential-backoff-work-90ef02401c65)
- link to google maps with search API

## Getting Started

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

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```
