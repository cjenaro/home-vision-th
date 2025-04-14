import { useFetcher } from "react-router";
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
        {houses.map((house) => (
          <li key={house.id}>
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
