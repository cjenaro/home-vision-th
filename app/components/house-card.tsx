import { useFetcher } from "react-router";
import type { House } from "~/routes/houses";
import { SaveIcon } from "./save-icon";

export function HouseCard({
  house,
  isSaved,
}: {
  house: House;
  isSaved: boolean;
}) {
  const fetcher = useFetcher();
  const intent = fetcher.formData?.get("intent");

  const isSaving = intent === "save";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden hover:scale-101 transition-transform duration-100 ease-in-out shadow-sm dark:shadow-gray-700/20 relative">
      <img
        src={house.photoURL}
        alt={house.address}
        loading="lazy"
        className="aspect-video w-full object-cover"
      />
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
            {/* if no intent it means no submission, show isSaved from session, if intent then optimistically update */}
            <SaveIcon isSaved={!intent ? isSaved : isSaving} />
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
