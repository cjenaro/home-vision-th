import type { House } from "~/routes/houses";

const DB_NAME = "home-vision";
const STORE_NAME = "saved-houses";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: "id" });
			}
		};
	});
}

export async function getSavedHousesCount(): Promise<number> {
	if (typeof window === "undefined") return 0;

	try {
		const db = await openDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(STORE_NAME, "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.count();

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.error("Error getting saved houses count:", error);
		return 0;
	}
}

export async function getSavedHouses(): Promise<House[]> {
	if (typeof window === "undefined") return [];

	try {
		const db = await openDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(STORE_NAME, "readonly");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.getAll();

			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.error("Error getting saved houses:", error);
		return [];
	}
}

export async function saveHouse(house: House): Promise<void> {
	if (typeof window === "undefined") return;

	try {
		const db = await openDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(STORE_NAME, "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.put(house);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.error("Error saving house:", error);
	}
}

export async function removeHouse(houseId: number): Promise<void> {
	if (typeof window === "undefined") return;

	try {
		const db = await openDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction(STORE_NAME, "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			const request = store.delete(houseId);

			request.onsuccess = () => resolve();
			request.onerror = () => reject(request.error);
		});
	} catch (error) {
		console.error("Error removing house:", error);
	}
}
