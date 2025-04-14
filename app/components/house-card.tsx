import { useFetcher } from "react-router";
import type { House } from "~/routes/houses";
import { SaveIcon } from "./save-icon";

export function HouseCard({
	house,
	isSaved,
}: {
	house: House;
	isSaved: boolean;
}) {
	const fetcher = useFetcher();
	const intent = fetcher.formData?.get("intent");

	const isSaving = intent === "save";

	return (
		<div className="card hover:scale-101 transition-transform duration-100 ease-in-out">
			<img
				src={house.photoURL}
				alt={house.address}
				loading="lazy"
				className="aspect-video w-full object-cover"
			/>
			<div className="p-4">
				<h3 className="text-xl font-bold text-[hsl(var(--primary))] dark:text-[hsl(var(--dark-primary))] mb-2">
					{house.price.toLocaleString("en-US", {
						style: "currency",
						currency: "USD",
					})}
				</h3>
				<p className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))] mb-2">
					{house.address}
				</p>
				<p className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))] text-sm opacity-80 dark:opacity-70">
					Homeowner: {house.homeowner}
				</p>
			</div>
			<div className="flex justify-end p-4">
				<fetcher.Form method="post">
					<input type="hidden" name="house" value={JSON.stringify(house)} />
					<input
						type="hidden"
						name="intent"
						value={isSaved ? "remove" : "save"}
					/>

					<button
						type="submit"
						className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] absolute top-0 right-4 font-medium p-2 rounded-b-md transition-colors cursor-pointer border-b border-l border-r border-gray-200 dark:border-gray-700"
						disabled={fetcher.state !== "idle"}
					>
						<SaveIcon isSaved={!intent ? isSaved : isSaving} />
					</button>
				</fetcher.Form>
			</div>
		</div>
	);
}
