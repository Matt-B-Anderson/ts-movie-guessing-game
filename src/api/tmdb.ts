import axios from "axios";
import dotenv from "dotenv";
import { GENRE_NAME_TO_ID } from "../data/genres.ts";
import type { Movie, UserFilters } from "../core/types.ts";

dotenv.config();

const TMDB = axios.create({
	baseURL: "https://api.themoviedb.org/3",
	headers: {
		Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
		Accept: "application/json",
	},
});

// Simple function to convert user's filters to TMDB params
function filtersToParams(filters: UserFilters) {
	const params: Record<string, any> = {
		include_adult: false,
		include_vide: false,
		sort_by: "vote_count.desc",
		"vote_count.get": 200, // This will make sure there are movies with data
		page: 1,
	};
	if (filters.genre) {
		const id = GENRE_NAME_TO_ID[filters.genre.toLocaleLowerCase()];
		if (id) params.with_genres = id;
	}
	if (filters.minYear)
		params["primary_release_date.gte"] = `${filters.minYear}-01-01`;
	if (filters.maxYear)
		params["primary_release_date.lte"] = `${filters.maxYear}-12-31`;
	if (filters.minRating) params["vote_average.gte"] = filters.minRating;

	return params;
}

// Fetch a random movie that matches the filters if given
export async function fetchRandomMovie(
	filters: UserFilters
): Promise<Movie | null> {
	const params = filtersToParams(filters);

	// This will help get a variety of movies
	const first = await TMDB.get("/discover/movie", { params });
	const totalPages = Math.min(first.data?.total_pages ?? 1, 10); // Setting a limit so it won't be fetching forever
	const randomPage = Math.max(1, Math.floor(Math.random() * totalPages));
	const pageData =
		randomPage === 1
			? first.data
			: (
					await TMDB.get("/discover/movie", {
						params: { ...params, page: randomPage },
					})
		      ).data;

	const results: any[] = pageData?.results ?? [];
	if (!results.length) return null;

	const pick = results[Math.floor(Math.random() * results.length)];
	const [detailsRes, creditsRes] = await Promise.all([
		TMDB.get(`/movie/${pick.id}`),
		TMDB.get(`/movie/${pick.id}/credits`),
	]);

	const details = detailsRes.data;
	const credits = creditsRes.data;

	const director = credits?.crew?.find((c: any) => c.job === "Director")?.name;
	const cast = (credits?.cast ?? []).slice(0, 3).map((c: any) => c.name);

	const year = details.release_date
		? Number(details.release_date.slice(0, 4))
		: null;

	return {
		id: details.id,
		title: details.title,
		year,
		genres: (details.genres ?? []).map((g: any) => g.name),
		voteAverage:
			typeof details.vote_average === "number" ? details.vote_average : null,
		runtime: typeof details.runtime === "number" ? details.runtime : null,
		overview: details.overview ?? "",
		director,
		topCastInitials: cast.map((n: string) => {
			// This will handle names that are hyphenated
			return n
				.split(/\s+/)
				.map((p) => p[0]?.toUpperCase() + ".")
				.join("");
		}),
	};
}
