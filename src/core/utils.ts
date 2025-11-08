export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));


// Simple function to get the decade a movie was made in for clues
export function getDecade(year?: number | null): string | null {
    if (!year || isNaN(year)) return null;
    const d = Math.floor(year / 10) * 10;
    return `${d}s`;
}

// Simple function to mask the title of a movie
export function mastTitle(title: string, text: string): string {
    // Replacing every case-insensitive word with underscores of the same length
    let masked = text;
    const words = title.split(/\s+/).filter(Boolean);
    for (const w of words) {
        const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        masked = masked.replace(re, "_".repeat(w.length));
    }
    return masked;
}

// Simple function to turn a name into initials
export function toInitials(fullName: string): string {
    return fullName
        .split(/\s+/)
        .filter(Boolean)
        .map(p => (p.length ? p[0]?.toUpperCase() + "." : ""))
        .join("");
}

// Simple function for converting mintues from hours for runtime
export function minsFormat(runtime: number | null): string | null {
    if (!runtime || runtime <= 0) return null;
    const h = Math.floor(runtime / 60);
    const m = runtime % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`
}