import { EndReason } from "~/routes/houses";

export function EndCard({
	onClick,
	endReason,
}: { onClick: () => void; endReason: EndReason }) {
	return (
		<div className="card h-full flex items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4 p-8 max-w-[40ch] mx-auto">
				<h3 className="text-center text-xl">
					{endReason === EndReason.NO_MORE_HOUSES
						? "You've reached the end of the list."
						: "There's been an error."}
				</h3>
				{endReason === EndReason.NO_MORE_HOUSES ? (
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						You've viewed all available houses.
					</p>
				) : (
					<p className="text-center text-sm text-gray-500 dark:text-gray-400">
						You can try again by clicking on the button below.
					</p>
				)}
				{endReason !== EndReason.NO_MORE_HOUSES && (
					<button
						onClick={onClick}
						type="button"
						className="button-primary mt-4 font-bold"
					>
						Try again
					</button>
				)}
			</div>
		</div>
	);
}
