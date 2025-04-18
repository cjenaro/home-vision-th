import { data, useFetcher, useLoaderData } from "react-router";
import type { Route } from "./+types/saved";
import { getSavedHouses, removeHouse } from "~/utils/indexed-db";
import type { House } from "./houses";
import HouseMap from "~/components/map";
import { useState } from "react";

export async function clientAction({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const houseIdString = formData.get("houseId");
	const intent = formData.get("intent");

	if (typeof intent !== "string" || typeof houseIdString !== "string") {
		return data(
			{ success: false, message: "Invalid request" },
			{ status: 400 },
		);
	}

	const houseId = Number.parseInt(houseIdString, 10);
	if (Number.isNaN(houseId)) {
		return data(
			{ success: false, message: "Invalid house ID" },
			{ status: 400 },
		);
	}

	await removeHouse(houseId);

	return data({ success: true });
}

export async function clientLoader() {
	const savedHouses = await getSavedHouses();
	return { savedHouses };
}

function RemoveHouseButton({ houseId }: { houseId: number }) {
	const fetcher = useFetcher();
	const isSubmitting = fetcher.state === "submitting";

	return (
		<fetcher.Form method="post">
			<input type="hidden" name="houseId" value={houseId} />
			<input type="hidden" name="intent" value="remove" />
			<button
				type="submit"
				className="button-destructive"
				disabled={isSubmitting}
				aria-label="Remove house"
			>
				{isSubmitting ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6 animate-spin"
						aria-hidden="true"
					>
						<title>Loading</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-6"
						aria-hidden="true"
					>
						<title>Delete</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				)}
			</button>
		</fetcher.Form>
	);
}

export default function Saved() {
	const { savedHouses } = useLoaderData<typeof clientLoader>();
	const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
	const [order, setOrder] = useState<"asc" | "desc">("asc");

	function handleSort() {
		setOrder((o) => (o === "asc" ? "desc" : "asc"));
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
				Saved Houses
			</h1>
			<div className="overflow-x-auto shadow-md sm:rounded-lg border border-[hsl(var(--border))] dark:border-[hsl(var(--dark-border))]">
				<table className="w-full text-sm text-left text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--dark-muted-foreground))]">
					<thead className="text-xs text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--dark-muted-foreground))] uppercase bg-[hsl(var(--muted))] dark:bg-[hsl(var(--dark-muted))]">
						<tr>
							<th scope="col" className="px-6 py-3">
								Photo
							</th>
							<th scope="col" className="px-6 py-3">
								Address
							</th>
							<th scope="col" className="px-6 py-3 ">
								<span className="flex items-center gap-2">
									Price
									<button
										type="button"
										onClick={handleSort}
										className="cursor-pointer"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className={`size-6 ${
												order === "asc" ? "" : "rotate-180"
											}`}
										>
											<title>
												Sort in {order === "asc" ? "descending" : "ascending"}{" "}
												order
											</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m19.5 8.25-7.5 7.5-7.5-7.5"
											/>
										</svg>
									</button>
								</span>
							</th>
							<th scope="col" className="px-6 py-3">
								Homeowner
							</th>
							<th scope="col" className="px-6 py-3" />
						</tr>
					</thead>
					<tbody>
						{savedHouses
							.sort((a, b) => {
								if (order === "asc") return a.price - b.price;
								return b.price - a.price;
							})
							.map((house) => (
								<tr
									key={house.id}
									className="border-b border-[hsl(var(--border))] dark:border-[hsl(var(--dark-border))] bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] hover:bg-[hsl(var(--accent))] dark:hover:bg-[hsl(var(--dark-accent))] even:bg-[hsl(var(--muted))] dark:even:bg-[hsl(var(--dark-muted))]"
								>
									<td className="px-6 py-4">
										<img
											src={house.photoURL}
											alt={house.address}
											className="aspect-video w-20 object-cover rounded"
										/>
									</td>
									<td className="px-6 py-4 font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))] whitespace-nowrap">
										<button
											type="button"
											className="flex items-center gap-2 hover:underline text-[hsl(var(--primary))] dark:text-[hsl(var(--dark-primary))] hover:text-[hsl(var(--primary))]/90 dark:hover:text-[hsl(var(--dark-primary))]/90"
											onClick={() => setSelectedHouse(house)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-6"
											>
												<title>Location Pin</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
												/>
											</svg>
											{house.address}
										</button>
									</td>
									<td className="px-6 py-4 text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
										{house.price.toLocaleString("en-US", {
											style: "currency",
											currency: "USD",
										})}
									</td>
									<td className="px-6 py-4 text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
										{house.homeowner}
									</td>
									<td className="px-6 py-4">
										<RemoveHouseButton houseId={house.id} />
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>

			<div className="mt-8 w-full">
				<HouseMap houses={savedHouses} selectedHouse={selectedHouse} />
			</div>
		</div>
	);
}
