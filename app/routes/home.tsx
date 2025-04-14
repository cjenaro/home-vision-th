import { useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useState, useEffect, useRef } from "react";
import type { House } from "./houses";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home Vision" },
    { name: "description", content: "Home Vision's take home challenge" },
  ];
}

export default function Home() {
  const fetcher = useFetcher();
  const [houses, setHouses] = useState<House[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const data = fetcher.data?.houses;

      if (data && data.length > 0) {
        setHouses((prevHouses) => [...prevHouses, ...data]);
      }
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && fetcher.state === "idle") {
          fetcher.load(`/houses?page=${(fetcher.data?.page || 0) + 1}`);
        }
      },
      { threshold: 0.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreRef, fetcher.state]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Houses</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house, index) => (
          <li
            key={house.id}
            className="opacity-0 animate-fade-in"
            style={{
              animationDelay: `${(index % 10) * 100}ms`,
            }}
          >
            <HouseCard house={house} />
          </li>
        ))}
        {fetcher.state === "loading" && (
          <li>
            <HouseCardSkeleton />
          </li>
        )}
      </ul>
      <div ref={loadMoreRef} className="h-2" />
    </div>
  );
}

function HouseCard({ house }: { house: House }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden hover:scale-101 transition-transform duration-100 ease-in-out">
      <div className="relative pb-[56.25%]">
        <img
          src={house.photoURL}
          alt={house.address}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-blue-600 mb-2">
          {house.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h3>
        <p className="text-gray-700 mb-2">{house.address}</p>
        <p className="text-gray-600 text-sm">Homeowner: {house.homeowner}</p>
      </div>
    </div>
  );
}

function HouseCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse h-full">
      <div className="relative pb-[56.25%]">
        <div className="absolute inset-0 w-full h-full bg-gray-200" />
      </div>
      <div className="p-4">
        <div className="w-24 h-6 bg-gray-200 rounded mb-3" />
        <div className="w-32 h-4 bg-gray-200 rounded mb-2" />
        <div className="w-24 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const navigate = useNavigate();
  return (
    <div className="container grid place-items-center px-4 py-16 text-center min-h-screen mx-auto">
      <div className="bg-white/10 border border-red-300 rounded-lg p-8 max-w-md flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12 mx-auto mb-4 text-red-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-100 mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-300 mb-6">
          We couldn't load the houses. Please try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors cursor-pointer flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh Page
        </button>
      </div>
    </div>
  );
}
