import { builder } from "../../graphql/builder"

export type MapView = {
	lat: number
	lng: number
	zoom: number
}

builder.simpleObject("MapView", {
	fields: (t) => ({
		lat: t.float(),
		lng: t.float(),
		zoom: t.int(),
	}),
})
