import fs from 'fs/promises'
import path from 'path'

const DIR_PATH = path.join(process.cwd(), 'data');

const readFile = async (filename) => {
    return await fs.readFile(path.join(DIR_PATH, filename), 'utf8');
}


const runAnalysis = (games) => {
    const totalGames = games.length;
    const totalRounds = games.reduce((acc, curr) => acc + curr.rounds.length, 0);
    console.info(`Games run: ${totalGames}`);
    console.info(`Average number of rounds per game: ${totalRounds/totalGames}`);
    const totalRolls = games.map(game => {
        return game.rounds.reduce((acc, curr) => acc + curr.rolls.length, 0);
    }).reduce((acc, curr) => acc + curr, 0);
    console.info(`Average rolls per round ${totalRolls/totalRounds}`);
}

const main = async () => {
    const games = JSON.parse(await readFile('test.json'));
    runAnalysis(games);
}

main();
