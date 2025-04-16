import MaplibreMap, { Marker, useMap } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import { useEffect } from "react";
import type { House } from "~/routes/houses";

export default function HousesMap({
	houses,
	selectedHouse,
}: {
	houses: House[];
	selectedHouse: House | null;
}) {
	return (
		<MaplibreMap
			initialViewState={{
				longitude: -100,
				latitude: 40,
				zoom: 4,
			}}
			style={{ width: "100%", height: 400 }}
			mapStyle="https://tiles.openfreemap.org/styles/liberty"
		>
			{houses.map((house) => (
				<HouseMarker
					key={house.id}
					house={house}
					isSelected={selectedHouse?.id === house.id}
				/>
			))}
		</MaplibreMap>
	);
}

export function HouseMarker({
	house,
	isSelected,
}: {
	house: House;
	isSelected: boolean;
}) {
	const [place, setPlace] = useState<{
		longitude: string;
		latitude: string;
	}>();

	const { current: map } = useMap();

	useEffect(() => {
		const zipcode = house.address.split(" ").pop();
		async function fetchPlace() {
			const response = await fetch(`https://api.zippopotam.us/us/${zipcode}`, {
				cache: "force-cache",
			});
			const data = await response.json();
			setPlace(data.places[0]);
		}
		fetchPlace();
	}, [house.address]);

	useEffect(() => {
		if (isSelected && map) {
			map.flyTo({
				center: [Number(place?.longitude), Number(place?.latitude)],
				zoom: 15,
			});
		}
	}, [isSelected, map, place]);

	if (!place) return null;

	return (
		<Marker
			longitude={Number(place.longitude)}
			latitude={Number(place.latitude)}
			anchor="bottom"
		>
			<img
				src={house.photoURL}
				alt={house.address}
				className="aspect-video w-32 object-cover rounded-lg shadow-lg"
			/>
		</Marker>
	);
}
