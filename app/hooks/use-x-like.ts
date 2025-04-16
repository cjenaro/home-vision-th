import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useMemo, useRef } from "react";

gsap.registerPlugin(useGSAP);

export function useXLike({ condition }: { condition: boolean }) {
	const scope = useRef<HTMLDivElement>(null);

	// i was first making this random but didn't like the result
	const particles = useMemo(
		() => [
			// Top-left group
			[-16, -14],
			[-14, -15],
			[-12, -13],

			// Top-center group
			[0, -15],

			// Top-right group
			[11, -14],
			[12, -16],
			[14, -15],

			// Middle-left group
			[-16, 0],

			// Middle-right group
			[13, 0],

			// Bottom-left group
			[-15, 11],
			[-13, 13],
			[-11, 15],

			// Bottom-center group
			[0, 16],

			// Bottom-right group
			[10, 12],
			[12, 14],
			[14, 16],
		],
		[],
	);

	useGSAP(
		() => {
			if (condition) {
				const tl = gsap.timeline();
				// Set all particles to the start position
				tl.set("button .particle", {
					opacity: 0,
					scale: 1,
					rotation: 0,
					x: 0,
					y: 0,
				});
				// Animate the circle that expands first and then dissapears.
				tl.set("button .background-span", {
					opacity: 1,
					scale: 0,
					backgroundImage:
						"radial-gradient(circle, transparent 0%, transparent 0%, var(--color-indigo-500) 0%, var(--color-indigo-500) 100%, transparent 100%)",
				});
				tl.to("button .background-span", {
					scale: 0.8,
					duration: 0.2,
					ease: "back.out(1.2)",
				});
				tl.to("button .background-span", {
					backgroundImage:
						"radial-gradient(circle, transparent 0%, transparent 100%, var(--color-indigo-500) 0%, var(--color-indigo-500) 100%, transparent 100%)",
					duration: 0.4,
					ease: "linear",
				});
				tl.set("button .background-span", {
					scale: 0,
					opacity: 0,
				});

				// Animate the particles to the end position
				tl.to(
					"button .particle",
					{
						opacity: 1,
						scale: "random(0.9, 1.1)",
						rotation: "random([360, -360])",
						duration: 0.4,
						x: (i) => particles[i][0],
						y: (i) => particles[i][1],
						ease: "power2.inOut",
						stagger: {
							amount: 0.1,
							ease: "rand",
						},
					},
					"-=0.2",
				);

				// remove particles
				tl.to(
					"button .particle",
					{
						opacity: 0,
						duration: 0.5,
						ease: "linear",
						stagger: {
							amount: 0.1,
							ease: "rand",
						},
					},
					"-=0.2",
				);
			}
		},
		{ dependencies: [condition], scope },
	);

	return { scope, particles };
}
