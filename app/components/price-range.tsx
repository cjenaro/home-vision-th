import type { Dispatch, SetStateAction } from "react";
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
	return (
		<div className="flex  flex-col md:flex-row items-center gap-4">
			<div className="flex items-center gap-1">
				<span className="text-sm">Price:</span>
				<span className="text-sm min-w-16">
					{minPrice.toLocaleString("en-US", {
						style: "currency",
						currency: "USD",
					})}
				</span>
				<span className="text-sm">-</span>
				<span className="text-sm min-w-16">
					{maxPrice.toLocaleString("en-US", {
						style: "currency",
						currency: "USD",
					})}
				</span>
			</div>

			<Slider.Root
				className="relative flex items-center w-full  md:w-[120px] h-5 touch-none select-none"
				value={priceRange}
				min={minAvailablePrice}
				max={maxAvailablePrice}
				step={1000}
				minStepsBetweenThumbs={1}
				onValueChange={(value) => setPriceRange(value as [number, number])}
			>
				<Slider.Track className="relative h-1.5 grow rounded-full bg-gray-200 dark:bg-gray-700">
					<Slider.Range className="absolute h-full rounded-full bg-[hsl(var(--primary))]" />
				</Slider.Track>
				<Slider.Thumb
					className="block h-3 w-3 rounded-full bg-white border border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2"
					aria-label="Minimum price"
				/>
				<Slider.Thumb
					className="block h-3 w-3 rounded-full bg-white border border-[hsl(var(--primary))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] focus:ring-offset-2"
					aria-label="Maximum price"
				/>
			</Slider.Root>
		</div>
	);
}
