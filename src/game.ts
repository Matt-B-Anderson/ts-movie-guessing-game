import inquirer from "inquirer";
import chalk from "chalk";
import { fetchRandomMovie } from "./api/tmdb.ts";
import type { UserFilters, Guess } from "./core/types.ts";
import { GameSession } from "./core/GameSession.ts";

interface FilterAnswers {
	genre?: string;
	minYear?: number;
	maxYear?: number;
	minRating?: number;
}

async function promptFilters(): Promise<UserFilters> {
	console.clear();
	console.log(chalk.bold.cyan("🎬 Movie Guess — Terminal Edition\n"));

	const ans = await inquirer.prompt<FilterAnswers>([
		{
			type: "input",
			name: "genre",
			message: "Genre (optional, e.g. Action, Drama):",
			filter: (s) => s?.trim() || undefined,
		},
		{
			type: "input",
			name: "minYear",
			message: "Min year (optional):",
			filter: (s) => (s ? Number(s) : undefined),
			validate: (v: string) => {
				const n = Number(v);
				return !v || !isNaN(n) || "Enter a number";
			},
		},
		{
			type: "input",
			name: "maxYear",
			message: "Max year (optional):",
			filter: (s) => (s ? Number(s) : undefined),
			validate: (v: string) => {
				const n = Number(v);
				return !v || !isNaN(n) || "Enter a number";
			},
		},
		{
			type: "input",
			name: "minRating",
			message: "Min rating 0–10 (optional):",
			filter: (s) => (s ? Number(s) : undefined),
			validate: (v: string) => {
				const n = Number(v);
				return (
					!v ||
					(!isNaN(n) && n >= 0 && n <= 10) ||
					"Enter a number between 0–10"
				);
			},
		},
	]);
	return ans;
}

async function playRound() {
	const filters = await promptFilters();
	const movie = await fetchRandomMovie(filters);
	if (!movie) throw new Error("No movies found for those filters!");
	const session = new GameSession(movie);
	await session.play();
}

async function main(): Promise<void> {
	await playRound();
	const { cont } = await inquirer.prompt([
		{ type: "confirm", name: "cont", message: "Play again?", default: true },
	]);

	if (cont) {
		// This will recursively call main instead of using a while loop for game play
		return main();
	}

	console.log(chalk.cyan("\nThanks for playing!"));
}

main().catch((err) => {
	console.error("\nFatal error:", err?.response?.data ?? err);
	process.exit(1);
});
