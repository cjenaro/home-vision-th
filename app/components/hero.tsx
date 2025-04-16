import { Logo } from "./logo";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(useGSAP, ScrollToPlugin);

export function Hero() {
	const sliderRef = useRef<HTMLDivElement>(null);

	useGSAP(() => {
		gsap.to(".bg-shape", {
			xPercent: "random(-100, 100)",
			yPercent: "random(-100, 100)",
			duration: 8,
			repeat: -1,
			yoyo: true,
			ease: "sine.inOut",
			delay: "random(0, 1)",
		});
	});

	function scrollToSlider() {
		if (sliderRef.current) {
			gsap.to(window, {
				duration: 0.4,
				scrollTo: {
					y: sliderRef.current,
					offsetY: 0,
				},
				ease: "power1.in",
			});
		}
	}

	return (
		<>
			<div className="min-h-[60vh] flex flex-col items-center justify-center mb-12 relative rounded-2xl overflow-hidden">
				<div className="absolute inset-0  z-0">
					<div className="absolute inset-0">
						<div className="bg-shape absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-indigo-200/40 dark:bg-indigo-800/20 blur-3xl" />
						<div className="bg-shape absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full bg-indigo-300/30 dark:bg-indigo-700/20 blur-3xl" />
						<div className="bg-shape absolute top-[40%] right-[20%] w-40 h-40 rounded-full bg-indigo-200/50 dark:bg-indigo-800/30 blur-2xl" />
						<div className="bg-shape absolute bottom-[30%] left-[25%] w-52 h-52 rounded-full bg-indigo-300/40 dark:bg-indigo-700/30 blur-2xl" />
					</div>
				</div>

				<div className="text-center max-w-3xl mx-auto px-4 py-16 z-10 flex flex-col items-center">
					<div className="w-62 mb-12">
						<Logo />
					</div>
					<h1 className="text-5xl md:text-6xl font-bold mb-6 text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
						Find Your Perfect Place to Call{" "}
						<span className="text-[hsl(var(--accent-foreground))] dark:text-[hsl(var(--dark-accent-foreground))]">
							Home
						</span>
					</h1>
					<p className="text-xl md:text-2xl mb-8 text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))] opacity-80">
						We don't just find houses, we find the place where your memories
						will be made.
					</p>
					<button
						onClick={scrollToSlider}
						className="button-primary text-lg px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
						type="button"
					>
						Discover Your Dream Home
					</button>
				</div>
				<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[hsl(var(--background))] dark:from-[hsl(var(--dark-background))] to-transparent" />
			</div>
			<div ref={sliderRef} className="h-30" />
		</>
	);
}
