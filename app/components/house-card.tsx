import { useFetcher, useRouteLoaderData } from "react-router";
import type { House } from "~/routes/houses";
import { SaveIcon } from "./save-icon";
import type { clientLoader } from "~/root";
import { useXLike } from "~/hooks/use-x-like";

export function HouseCard({
	house,
	isSaved,
}: {
	house: House;
	isSaved: boolean;
}) {
	const fetcher = useFetcher({ key: `save-house-${house.id}` });
	const rootLoaderData = useRouteLoaderData<typeof clientLoader>("root");
	const intent = fetcher.formData?.get("intent");

	const isSaving = intent === "save";

	const { scope: card, particles } = useXLike({ condition: isSaving });
	return (
		<div
			ref={card}
			className="card hover:scale-101 transition-transform duration-100 ease-in-out h-full"
		>
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
			<div>
				<fetcher.Form method="post">
					<input type="hidden" name="house" value={JSON.stringify(house)} />
					<input
						type="hidden"
						name="intent"
						value={isSaved ? "remove" : "save"}
					/>
					{rootLoaderData && (
						<input
							type="hidden"
							name="optimisticCount"
							value={
								Number(rootLoaderData.savedHousesCount) + (isSaved ? -1 : 1)
							}
						/>
					)}
					<button
						type="submit"
						className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] absolute top-0 right-4 font-medium p-2 rounded-b-md transition-colors cursor-pointer border-b border-l border-r border-gray-200 dark:border-gray-700"
						disabled={fetcher.state !== "idle"}
					>
						<span className="background-span size-8 pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] rounded-full opacity-0" />
						<SaveIcon isSaved={!intent ? isSaved : isSaving} />

						{particles.map((i, index) => (
							<span
								key={`${i[0]}-${i[1]}`}
								className={`size-0.5 absolute rounded-full ${
									index % 2 === 0 ? "bg-indigo-500" : "bg-indigo-400"
								} opacity-0 particle top-1/2 left-1/2`}
							/>
						))}
					</button>
				</fetcher.Form>
			</div>
		</div>
	);
}
