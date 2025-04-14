import { useLoaderData } from "react-router";
import { data, useFetcher } from "react-router";
import type { Route } from "./+types/home";
import { useState, useEffect, useRef } from "react";
import type { House } from "./houses";
import { getSession, commitSession } from "~/session.server";
import { HouseCardSkeleton } from "~/components/house-card-skeleton";
import { HouseCard } from "~/components/house-card";
import { Link } from "react-router";

function debounce<T>(func: (...args: T[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: T[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const savedHouses = session.get("savedHouses") || [];

  const uniqueHousesMap = new Map<number, House>();
  for (const house of savedHouses) {
    if (house && typeof house.id === "number") {
      uniqueHousesMap.set(house.id, house);
    }
  }

  return data({ savedHouses: Array.from(uniqueHousesMap.values()) });
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const houseString = formData.get("house");
  const intent = formData.get("intent");

  if (
    !["save", "remove"].includes(intent?.toString() || "") ||
    typeof houseString !== "string"
  ) {
    return data(
      { success: false, message: "Invalid request" },
      { status: 400 }
    );
  }

  let house: House;
  try {
    house = JSON.parse(houseString);
    if (typeof house?.id !== "number" || typeof house?.address !== "string") {
      throw new Error("Invalid house data format");
    }
  } catch (error) {
    return data(
      { success: false, message: "Invalid house data" },
      { status: 400 }
    );
  }

  const houseId = house.id;

  const savedHouses: House[] = session.get("savedHouses") || [];

  const existingIndex = savedHouses.findIndex((h) => h.id === houseId);

  if (intent === "remove") {
    if (existingIndex !== -1) {
      savedHouses.splice(existingIndex, 1);
    }
  } else if (intent === "save") {
    if (existingIndex === -1) {
      savedHouses.push(house);
    }
  }

  session.set("savedHouses", savedHouses);

  return data(
    { success: true },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Home() {
  const fetcher = useFetcher<{ houses: House[]; page?: number }>();
  const { savedHouses } = useLoaderData<typeof loader>();
  const [houses, setHouses] = useState<House[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const lastProcessedPageRef = useRef<number>(0);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      const newHouses = fetcher.data.houses;
      const currentPage = fetcher.data.page;

      // only update the houses if the page has changed.
      if (
        currentPage !== undefined &&
        currentPage !== lastProcessedPageRef.current
      ) {
        if (newHouses && newHouses.length > 0) {
          setHouses((prevHouses) => [...prevHouses, ...newHouses]);
        }
        lastProcessedPageRef.current = currentPage;
      }
    }
  }, [fetcher.state, fetcher.data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && fetcher.state === "idle") {
          fetcher.load(
            `/houses?page=${(fetcher.data?.page || 0) + 1}&per_page=${perPage}`
          );
        }
      },
      { threshold: 0.0, rootMargin: "0px 0px 500px 0px" }
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
  }, [perPage, fetcher.state, fetcher.load, fetcher.data?.page]);

  function handlePerPageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newPerPage = Number.parseInt(event.target.value, 10);
    if (Number.isNaN(newPerPage) || newPerPage <= 0) return;

    setPerPage(newPerPage);

    setHouses([]);
    lastProcessedPageRef.current = 0;
    fetcher.load(`/houses?page=${1}&per_page=${newPerPage}`);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
        Available Houses
      </h1>
      <div className="flex justify-center mb-8 items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md p-2 w-fit mx-auto text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))]">
        <label htmlFor="perPage">Per Page:</label>
        <input
          id="perPage"
          className="w-24 p-2 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))] bg-transparent"
          type="number"
          name="per_page"
          defaultValue={10}
          onChange={debounce(handlePerPageChange, 1000)}
        />
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house, index) => (
          <li
            key={house.id}
            className="opacity-0 animate-fade-in"
            style={{
              animationDelay: `${(index % 10) * 100}ms`,
            }}
          >
            <HouseCard
              house={house}
              isSaved={savedHouses.some((h) => h.id === house.id)}
            />
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

export function ErrorBoundary() {
  return (
    <div className="container grid place-items-center px-4 py-16 text-center min-h-screen mx-auto">
      <div className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--dark-background))] border border-[hsl(var(--destructive))] dark:border-[hsl(var(--dark-destructive))] rounded-lg p-8 max-w-md flex flex-col items-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12 mx-auto mb-4 text-[hsl(var(--destructive))] dark:text-[hsl(var(--dark-destructive))]"
        >
          <title>Warning</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))] mb-3">
          Something went wrong
        </h2>
        <p className="text-[hsl(var(--foreground))] dark:text-[hsl(var(--dark-foreground))] opacity-80 dark:opacity-70 mb-6">
          We couldn't load the house listings. Please try again.
        </p>
        <Link to="/" className="button-primary flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <title>Refresh</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
          Refresh Page
        </Link>
      </div>
    </div>
  );
}
