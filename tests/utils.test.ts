import { describe, it, expect } from "vitest";
import {
	getDecade,
	maskTitle,
	toInitials,
	minsFormat,
} from "../src/core/utils.ts";

describe("utils", () => {
	it("decadeOf returns decade string", () => {
		expect(getDecade(1999)).toBe("1990s");
	});

	it("maskTitleInText replaces words case-insensitively", () => {
		const result = maskTitle("Inception", "Inception is great!");
		expect(result).not.toContain("Inception");
		expect(result).toContain("_________");
	});

	it("toInitials creates initials", () => {
		expect(toInitials("Leonardo DiCaprio")).toBe("L.D.");
	});

	it("minsToPretty formats minutes", () => {
		expect(minsFormat(148)).toBe("2h 28m");
	});
});
