import { describe, it, expect } from "vitest";
import { generateClues } from "../src/core/clueGenerator.ts";
import type { Movie } from "../src/core/types.ts";

const mockMovie: Movie = {
	id: 1,
	title: "Inception",
	year: 2010,
	genres: ["Action", "Sci-Fi"],
	voteAverage: 8.8,
	runtime: 148,
	overview:
		"A thief who steals corporate secrets through dream-sharing technology is tasked with planting an idea.",
	director: "Christopher Nolan",
	topCastInitials: ["L.D.", "J.G.-L."],
};

describe("generateClues()", () => {
	it("returns 4 clues", () => {
		const clues = generateClues(mockMovie);
		expect(clues).toHaveLength(4);
	});

	it("clue 1 mentions genre or decade", () => {
		const clues = generateClues(mockMovie);
        const clue1 = clues[0]!;
		expect(/action|sci-fi|2010/i.test(clue1)).toBe(true);
	});

	it("clue 4 masks the title in the plot", () => {
		const clues = generateClues(mockMovie);
		const clue4 = clues[3]!;
		expect(clue4.toLowerCase()).not.toContain("inception");
	});
});
