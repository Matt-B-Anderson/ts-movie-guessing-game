import inquirer from "inquirer";
import chalk from "chalk";
import { fetchRandomMovie } from "./api/tmdb.js";
import type { UserFilters } from "./core/types.js";
import { generateClues } from "./core/clueGenerator.js";
import { sleep } from "./core/utils.js";

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

interface Guess {
    guess: string
}

async function playRound() {
	const filters = await promptFilters();

	process.stdout.write(
		chalk.gray("\nFinding a movie that matches your filters…\n")
	);
	const movie = await fetchRandomMovie(filters);

	if (!movie) {
		console.log(
			chalk.red(
				"\nNo results for those filters. Try widening them (e.g., remove rating or expand years)."
			)
		);
		return;
	}

	const clues = generateClues(movie);

	console.log(
		chalk.gray("\nOkay! You have 4 clues. Guess the title after each one.\n")
	);
	let won = false;

	for (let i = 0; i < clues.length; i++) {
		console.log(chalk.yellow(`Clue #${i + 1}: `) + clues[i] + "\n");
		const { guess } = await inquirer.prompt<Guess>([
			{ type: "input", name: "guess", message: "Your guess (or Enter to skip):" },
		]);

		if (!guess) {
			console.log(chalk.gray("Skipping…\n"));
		} else if (guess.trim().toLowerCase() === movie.title.toLowerCase()) {
			console.log(chalk.green("\n✅ Correct! Nice work."));
			won = true;
			break;
		} else {
			console.log(chalk.red("❌ Not it.\n"));
		}

		if (i < clues.length - 1) await sleep(300);
	}

	if (!won) {
		console.log(
			chalk.redBright(
				`\n😬 Out of clues! The movie was: ${chalk.bold(movie.title)} (${
					movie.year ?? "—"
				})\n`
			)
		);
	}
}

async function main() {
	let again = true;
	while (again) {
		await playRound();
		const { cont } = await inquirer.prompt([
			{
				type: "confirm",
				name: "cont",
				message: "Play again?",
				default: true,
			},
		]);
		again = cont;
	}
	console.log(chalk.cyan("\nThanks for playing!"));
}

main().catch((err) => {
	console.error("\nFatal error:", err?.response?.data ?? err);
	process.exit(1);
});
