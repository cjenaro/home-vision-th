import type { Route } from "./+types/houses";
import { data } from "react-router";

export type House = {
  homeowner: string;
  address: string;
  price: number;
  photoURL: string;
  id: number;
};

const MAX_RETRIES = 3;
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  let page = parseInt(url.searchParams.get("page") || "1", 10);
  let per_page = parseInt(url.searchParams.get("per_page") || "1000", 10);

  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const apiUrl = new URL(
        "https://staging.homevision.co/api_project/houses"
      );
      apiUrl.searchParams.set("page", page.toString());
      apiUrl.searchParams.set("per_page", per_page.toString());

      const response = await fetch(apiUrl.toString());

      if (response.ok) {
        const house_data = await response.json();

        if (!house_data.houses) {
          throw new Error("No houses found");
        }

        return data({
          houses: house_data.houses as House[],
          page,
        });
      }
    } catch (error) {
      console.error(
        `Attempt ${attempt + 1} failed for page ${page}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    // [exponential backoff](https://medium.com/bobble-engineering/how-does-exponential-backoff-work-90ef02401c65)
    const delay = 500 * Math.pow(2, attempt) + Math.random() * 100;
    await new Promise((resolve) => setTimeout(resolve, delay));
    attempt++;
  }

  console.error(`All attempts failed for page ${page}. Returning empty data.`);

  return data({ houses: [], page });
}
