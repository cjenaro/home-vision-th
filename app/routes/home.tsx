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
    <div>
      <h2 className="text-2xl font-bold fixed top-0 right-0">{fetcher.data?.page}</h2>
      {houses.map((house) => (
        <div key={house.id}>
          <h3>{house.address}</h3>
          <img
            src={house.photoURL}
            alt={house.address}
            width="200"
            loading="lazy"
          />
          <p>Price: ${house.price}</p>
          <p>Homeowner: {house.homeowner}</p>
        </div>
      ))}
      <div ref={loadMoreRef} className="h-2" />
      {fetcher.state === "loading" && <p>Loading more houses...</p>}
    </div>
  );
}
