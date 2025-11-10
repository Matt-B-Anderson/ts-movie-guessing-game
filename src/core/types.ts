export type Movie = {
	id: number;
	title: string;
	year: number | null;
	genres: string[];
	voteAverage: number | null;
	runtime: number | null;
	overview: string;
	director?: string;
	topCastInitials?: string[];
};

export type UserFilters = {
	genre?: string;
	minYear?: number;
	maxYear?: number;
	minRating?: number;
};

export type Guess = {
    guess: string;
}