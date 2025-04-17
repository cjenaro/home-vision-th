import { useLayoutEffect, type Dispatch, type SetStateAction } from "react";
import * as Slider from "@radix-ui/react-slider";

interface PriceRangeProps {
	minAvailablePrice: number;
	maxAvailablePrice: number;
	priceRange: [number, number];
	setPriceRange: Dispatch<SetStateAction<[number, number]>>;
}

export function PriceRange({
	minAvailablePrice,
	maxAvailablePrice,
	priceRange,
	setPriceRange,
}: PriceRangeProps) {
	const [minPrice, maxPrice] = priceRange;

	function formatPrice(price: number) {
		return price.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		});
	}

	useLayoutEffect(() => {
		// there's an issue when setting absurdly high numbers where the
		// right thumb would be very hard to change, this way we set a value that makes
		// sense with the first loaded page of houses.
		if (minPrice < minAvailablePrice && maxAvailablePrice < maxPrice)
			setPriceRange([
				Math.max(minPrice, minAvailablePrice),
				Math.min(maxPrice, maxAvailablePrice),
			]);
	}, [minAvailablePrice, maxAvailablePrice, minPrice, maxPrice, setPriceRange]);

	return (
		<div className="flex flex-col gap-6 w-full">
			<Slider.Root
				className="relative flex items-center w-full touch-none select-none"
				value={priceRange}
				min={minAvailablePrice}
				max={maxAvailablePrice}
				step={1000}
				minStepsBetweenThumbs={1}
				onValueChange={(value) => setPriceRange(value as [number, number])}
			>
				<Slider.Track className="relative h-2 grow rounded-full bg-gray-200 dark:bg-gray-700">
					<Slider.Range className="absolute h-full rounded-full bg-[hsl(var(--foreground))] dark:bg-[hsl(var(--dark-foreground))]" />
				</Slider.Track>
				<Slider.Thumb
					className="group flex items-center justify-center h-10 w-fit px-2 min-w-20 rounded-full bg-white dark:bg-gray-800 border-2 border-[hsl(var(--primary))] shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2"
					aria-label="Minimum price"
				>
					<span className="text-xs font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
						{formatPrice(minPrice)}
					</span>
				</Slider.Thumb>
				<Slider.Thumb
					className="group flex items-center justify-center h-10 w-fit px-2 min-w-20 rounded-full bg-white dark:bg-gray-800 border-2 border-[hsl(var(--primary))] shadow-md hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2"
					aria-label="Maximum price"
				>
					<span className="text-xs font-medium text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
						{formatPrice(maxPrice)}
					</span>
				</Slider.Thumb>
			</Slider.Root>
		</div>
	);
}
