import inquirer from "inquirer";
import chalk from "chalk";
import type { Movie, Guess } from "./types.ts";
import { generateClues } from "./clueGenerator.ts";

export class GameSession {
	private movie: Movie;
	private clues: string[];
	private guessed = false;

	constructor(movie: Movie) {
		this.movie = movie;
		this.clues = generateClues(movie);
	}

	public async play(): Promise<void> {
		console.log(
			chalk.gray("\nOkay! You have 4 clues. Guess after each one.\n")
		);

		for (let i = 0; i < this.clues.length; i++) {
			console.log(chalk.yellow(`Clue #${i + 1}: `) + this.clues[i] + "\n");

			const { guess } = await inquirer.prompt<Guess>([
				{ type: "input", name: "guess", message: "Your guess (or Enter to skip):" },
			]);

			if (guess?.trim().toLowerCase() === this.movie.title.toLowerCase()) {
				console.log(chalk.green("\n✅ Correct! Nice work."));
				this.guessed = true;
				break;
			} else {
				console.log(chalk.red("❌ Not it.\n"));
			}
		}

		if (!this.guessed) {
			console.log(
				chalk.redBright(
					`\n😬 Out of clues! The movie was: ${chalk.bold(this.movie.title)} (${
						this.movie.year ?? "—"
					})\n`
				)
			);
		}
	}
}
