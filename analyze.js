import fs from 'fs/promises'
import path from 'path'

const DIR_PATH = path.join(process.cwd(), 'data');

const readFile = async (filename) => {
    try {
        await fs.access(path.join(DIR_PATH, filename));
        return await fs.readFile(path.join(DIR_PATH, filename), 'utf8');
    } catch(err) {
        console.error('Data file not found. Run: npm run simulation');
        throw Error('Data file not found');
    }
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
    try {
        const games = JSON.parse(await readFile('test.json'));
        runAnalysis(games);
    } catch(err) {
        console.error('Failed to analyze data. Exiting');
    }
}

main();
