/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: "ts-jest/presets/default-esm",
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]sx?$": ["ts-jest", { useESM: true }],
	},
	extensionsToTreatAsEsm: [".ts"],
	moduleFileExtensions: ["ts", "tsx", "js"],
};
