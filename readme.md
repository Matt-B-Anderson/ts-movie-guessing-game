# Overview
- This is a fun terminal/console based game that gives the users clues to guess the name of a movie based on user given filters like genre, year, etc. This was made using TypeScript and    interacts with the TMDB API. Since the TMDB API has some strict typing I decided to use TypeScript as opposed to JavaScript This allowed for using types for the Movies and Filters as well as the use of interfaces for some functions. I wanted to create this because I have seen many videos of people playing clue-based guessing games and I wanted to create my own. 

[Software Demo Video](https://youtu.be/LZaLVFeFqlk)

# Development Environment

- Node v22
- TypeScript
- dovenv
- axios
- tsx
- inquirer
- jest
- @types/node
- @types/jest
- ts-jest

# Useful Websites

- [TypeScript Lang](https://www.typescriptlang.org/)
- [W3Schools](https://www.w3schools.com/typescript/typescript_intro.php)

# Future Work

- Add difficutles to the game, i.e. Easy, Medium, Hard
    - Easy with 5 clues, medium 4, and hard 3
- Add a daily challenge, uses a date seed to generate a random movie for each day and tracks streaks.
- Add AI/NLP to generate clues for the movies