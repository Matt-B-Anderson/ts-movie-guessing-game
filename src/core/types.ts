export type Movie = {
    id: number,
    title: string,
    year: string,
    genre: string,
    director?: string
}

export type UserFilters = {
    genre?: string,
    minYear?: number,
    maxYear?: number,
    minRating?: number
}