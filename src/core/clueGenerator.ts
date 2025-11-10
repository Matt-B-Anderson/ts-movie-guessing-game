import type { Movie } from "./types.js";
import { getDecade, maskTitle, minsFormat } from "./utils.js";

export function generateClues(movie: Movie): string[] {
	const clues: string[] = [];

	// 1) Broad: genre + decade
	const decade = getDecade(movie.year);
	const genreWord = movie.genres?.[0] ?? "film";
	const c1 = [
		`This is a ${genreWord.toLowerCase()} from the ${
			decade ?? "unknown decade"
		}.`,
		`Think of a ${genreWord.toLowerCase()} released in the ${
			decade ?? "past"
		}.`,
		`A ${genreWord.toLowerCase()} picture from the ${
			decade ?? "some time ago"
		}.`,
	];
	clues.push(pick(c1));

	// 2) Context: rating + runtime
	const prettyRuntime = minsFormat(movie.runtime);
	const rating = movie.voteAverage
		? Math.round(movie.voteAverage * 10) / 10
		: null;
	const parts = [];
	if (rating) parts.push(`IMDb-style score around ${rating}`);
	if (prettyRuntime) parts.push(`runtime about ${prettyRuntime}`);
	const c2 = parts.length
		? [`It has a ${parts.join(" and ")}.`, `Expect a ${parts.join(" and ")}.`]
		: [
				`Critics and audiences have opinions, but that’s not the clue you need.`,
		  ];
	clues.push(pick(c2));

	// 3) Creator/actors
	const directorLast = movie.director ? lastName(movie.director) : null;
	const castHint = movie.topCastInitials?.length
		? `Top cast initials: ${movie.topCastInitials!.join(", ")}`
		: null;
	const c3 = [
		directorLast
			? `Directed by someone whose last name is ${directorLast}.`
			: `Direction is memorable, though we’ll keep names quiet.`,
		castHint ?? `The cast is recognizable.`,
	].join(" ");
	clues.push(c3);

	// 4) Masked plot
	const plot = movie.overview?.trim() || "No plot available.";
	const c4 = `Plot: ${maskTitle(movie.title, plot)}`;

	clues.push(c4);
	return clues;
}

function pick<T>(arr: T[]): T {
	// If the array is empty, throw an error or handle it gracefully
	if (arr.length === 0) {
		throw new Error("pick() called with an empty array");
	}
	return arr[Math.floor(Math.random() * arr.length)]!;
}

function lastName(full: string | undefined): string {
	if (!full) return "Unknown";
	const parts = full.trim().split(/\s+/);
	return parts[parts.length - 1] || "Unknown";
}
