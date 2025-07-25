import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		clearMocks: true,
		setupFiles: ["./vitest.setup.ts"],
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov"],
			all: true,
		},
		include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
	},
})
