import { getEnvVars } from "../config"

type ReverseGeocodeResult = {
	city: string
	region: string
	country: string
}

type StadiaFeature = {
	properties: {
		locality?: string
		county?: string
		region?: string
		country?: string
	}
}

type StadiaGeocodeResponse = {
	features: StadiaFeature[]
}

export async function reverseGeocode(
	lng: number,
	lat: number,
): Promise<ReverseGeocodeResult> {
	const { STADIA_API_KEY } = getEnvVars()
	const url = `https://api.stadiamaps.com/geocoding/v1/reverse?point.lon=${lng}&point.lat=${lat}&api_key=${STADIA_API_KEY}`
	const res = await fetch(url)

	if (!res.ok) throw new Error("Geocoding request failed")

	const data = (await res.json()) as StadiaGeocodeResponse
	if (!data.features.length) throw new Error("No geocoding results")

	const { properties } = data.features[0]

	return {
		city: properties.locality ?? properties.county ?? "",
		region: properties.region ?? "",
		country: properties.country ?? "",
	}
}

export function hasMoved(
	prev: [number, number],
	next: [number, number],
	thresholdMeters: number,
): boolean {
	const R = 6371000
	const lat1 = (prev[1] * Math.PI) / 180
	const lat2 = (next[1] * Math.PI) / 180
	const dLat = lat2 - lat1
	const dLng = ((next[0] - prev[0]) * Math.PI) / 180
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) > thresholdMeters
}
