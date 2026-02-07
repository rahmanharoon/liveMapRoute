export default {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src", "<rootDir>/tests"],
	moduleNameMapper: {
		"^@components/(.*)$": "<rootDir>/src/components/$1",
		"^@pages/(.*)$": "<rootDir>/src/pages/$1",
		"^@utils/(.*)$": "<rootDir>/src/utils/$1",
		"^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
		"^@store/(.*)$": "<rootDir>/src/store/$1",
		"^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
		"^@services/(.*)$": "<rootDir>/src/services/$1",
		"^@styles/(.*)$": "<rootDir>/src/styles/$1",
		"^@assets/(.*)$": "<rootDir>/src/assets/$1",
		"\\.(css|scss|sass)$": "identity-obj-proxy",
		"\\.(svg|png|jpg|jpeg|gif|webp)$": "<rootDir>/tests/mocks/fileMock.js",
	},
	setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/main.tsx",
		"!src/vite-env.d.ts",
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},
};
