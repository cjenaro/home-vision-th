import type { Route } from "./+types/houses";
import { data } from "react-router";

export type House = {
	homeowner: string;
	address: string;
	price: number;
	photoURL: string;
	id: number;
};

export enum EndReason {
	NO_MORE_HOUSES = "NO_MORE_HOUSES",
	ERROR = "ERROR",
	EMPTY_RESPONSE = "EMPTY_RESPONSE",
}

const MAX_RETRIES = 3;
export async function loader({ request }: Route.LoaderArgs) {
	const url = new URL(request.url);
	const page = Number.parseInt(url.searchParams.get("page") || "1", 10);

	let attempt = 0;

	while (attempt < MAX_RETRIES) {
		try {
			const apiUrl = new URL(
				"https://staging.homevision.co/api_project/houses",
			);
			apiUrl.searchParams.set("page", page.toString());

			const response = await fetch(apiUrl.toString());

			if (response.ok) {
				const house_data = await response.json();

				if (!house_data.ok) {
					throw new Error("No houses found");
				}

				// reached end of houses
				if (!house_data.houses || house_data.houses.length === 0) {
					console.log("Reached end of houses");
					return data({
						end: true,
						houses: [],
						page,
						endReason: EndReason.NO_MORE_HOUSES,
					});
				}

				return data({
					houses: house_data.houses as House[],
					page,
					end: false,
				});
			}
		} catch (error) {
			console.error(
				`Attempt ${attempt + 1} failed for page ${page}: ${
					error instanceof Error ? error.message : "Unknown error"
				}`,
			);
		}

		// [exponential backoff](https://medium.com/bobble-engineering/how-does-exponential-backoff-work-90ef02401c65)
		const delay = 500 * 2 ** attempt + Math.random() * 100;
		await new Promise((resolve) => setTimeout(resolve, delay));
		attempt++;
	}

	console.error(`All attempts failed for page ${page}. Returning empty data.`);
	return data({
		houses: [],
		page,
		end: true,
		endReason: EndReason.ERROR,
	});
}
