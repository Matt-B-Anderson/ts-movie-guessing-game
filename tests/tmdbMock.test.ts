import { describe, it, expect, jest } from "@jest/globals";
import * as tmdb from "../src/api/tmdb.ts";

describe("fetchRandomMovie()", () => {
	it("handles empty API response", async () => {
		jest.spyOn(tmdb as any, "fetchRandomMovie").mockResolvedValueOnce(null);
		const result = await tmdb.fetchRandomMovie({});
		expect(result).toBeNull();
	});
});
