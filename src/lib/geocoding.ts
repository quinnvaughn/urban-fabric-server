type ReverseGeocodeResult = {
	city: string
	region: string
	country: string
}

type NominatimResponse = {
	address: {
		city?: string
		town?: string
		village?: string
		hamlet?: string
		state?: string
		region?: string
		country?: string
	}
}

export async function reverseGeocode(
	lng: number,
	lat: number,
): Promise<ReverseGeocodeResult> {
	const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
	const res = await fetch(url, {
		headers: { "User-Agent": "urban-fabric-server" },
	})

	if (!res.ok) throw new Error("Geocoding request failed")

	const data = (await res.json()) as NominatimResponse
	const { address } = data

	return {
		city:
			address.city ?? address.town ?? address.village ?? address.hamlet ?? "",
		region: address.state ?? address.region ?? "",
		country: address.country ?? "",
	}
}
