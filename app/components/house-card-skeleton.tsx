export function HouseCardSkeleton() {
	return (
		<div className="card animate-pulse h-full">
			<div className="relative pb-[56.25%]">
				<div className="absolute inset-0 w-full h-full bg-gray-200 dark:bg-gray-700" />
			</div>
			<div className="p-4">
				<div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
				<div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
				<div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
			</div>
		</div>
	);
}
