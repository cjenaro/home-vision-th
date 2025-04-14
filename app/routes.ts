import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("houses", "routes/houses.ts"),
	route("saved", "routes/saved.tsx"),
	route("up", "routes/up.ts"),
] satisfies RouteConfig;
