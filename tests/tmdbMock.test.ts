import { describe, it, expect, vi } from "vitest";
import * as tmdb from "../src/api/tmdb.ts";

describe("fetchRandomMovie()", () => {
	it("handles empty API response", async () => {
		vi.spyOn(tmdb as any, "fetchRandomMovie").mockResolvedValueOnce(null);
		const result = await tmdb.fetchRandomMovie({});
		expect(result).toBeNull();
	});
});
