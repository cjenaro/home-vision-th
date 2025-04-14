import { useLoaderData } from "react-router";
import { data, useFetcher, useNavigate } from "react-router";
import type { Route } from "./+types/home";
import { useState, useEffect, useRef } from "react";
import type { House } from "./houses";
import { getSession, commitSession } from "~/session.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const savedHouses = session.get("savedHouses") || [];

  const uniqueHousesMap = new Map<number, House>();
  savedHouses.forEach((house: House) => {
    if (house && typeof house.id === "number") {
      uniqueHousesMap.set(house.id, house);
    }
  });

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

function SaveIcon({ isSaved }: { isSaved: boolean }) {
  if (isSaved) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-6 text-indigo-500"
      >
        <path
          fillRule="evenodd"
          d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
          clipRule="evenodd"
        />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 text-indigo-500"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
      />
    </svg>
  );
}

function HouseCard({ house, isSaved }: { house: House; isSaved: boolean }) {
  const fetcher = useFetcher();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:scale-101 transition-transform duration-100 ease-in-out shadow-sm dark:shadow-gray-700/20 relative">
      <div className="relative pb-[56.25%]">
        <img
          src={house.photoURL}
          alt={house.address}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {house.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-2">{house.address}</p>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Homeowner: {house.homeowner}
        </p>
      </div>
      <div className="flex justify-end p-4">
        <fetcher.Form method="post">
          <input type="hidden" name="house" value={JSON.stringify(house)} />
          <input
            type="hidden"
            name="intent"
            value={isSaved ? "remove" : "save"}
          />

          <button
            type="submit"
            className="bg-gray-100 dark:bg-gray-800 absolute top-0 right-4 font-medium p-2 rounded-b-md transition-colors cursor-pointer"
            disabled={fetcher.state !== "idle"}
          >
            <SaveIcon isSaved={isSaved} />
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}

function HouseCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse h-full">
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

export function ErrorBoundary() {
  const navigate = useNavigate();
  return (
    <div className="container grid place-items-center px-4 py-16 text-center min-h-screen mx-auto">
      <div className="bg-white/10 dark:bg-white/5 border border-red-300 dark:border-red-800 rounded-lg p-8 max-w-md flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-12 mx-auto mb-4 text-red-500 dark:text-red-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Something went wrong
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
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
