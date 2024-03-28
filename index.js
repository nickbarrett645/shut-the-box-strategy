import fs from 'fs/promises';

const main = async () => {
    console.log('Shut the box game strategy simulation');

    await runGame();

}

const runGame = async () => {
    let notAtLimit = true;
    const LIMIT = 45;
    const START_SCORE = 0;
    let currentScore = START_SCORE;
    const board = {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true};
    const games = [];
    let game = {rounds: []};
    let round = {rolls: []};

    while(notAtLimit) {
        let roll = {};
        const rollValue = rollDice(canRollMultiDice(board));
        console.info(`rollValue: ${rollValue}`);
        roll.rollValue = rollValue;
        let moves = calculateMoves(board, rollValue);
        roll.moves = moves;
        if(!moves.length) {
            console.log('No available moves!');
            const roundScore = sumScore(board);
            currentScore+= roundScore;
            round.rolls.push(roll);
            game.rounds.push(round);

            if(currentScore >= LIMIT) {
                notAtLimit = false;
                games.push(game);
                await writeData('test.json', games); 
            } else {
                resetBoard(board);
                round = getNewRound();
            }
        } else {
            makeMove(board,moves, roll);
            round.rolls.push(roll)
            printBoard(board);
            if(boxIsShut(board)) {
                console.info('Box is shut!');
                resetBoard(board);
                round = getNewRound();
            }
        }

        console.info(currentScore);
    }
}

const getNewRound = () => {
    return {rolls: []};
}

const rollDice = (multiDice = false) => {
    if(multiDice) {
         return Math.floor(Math.random() * (6 - 1) + 1) + Math.floor(Math.random() * (6 - 1) + 1);
    } else {
        return Math.floor(Math.random() * (6 - 1) + 1);
    }
}

const sumScore = (board) => {
    return Object.entries(board).filter(num => num[1]).reduce((acc, curr) => acc+Number.parseInt(curr, 10),0)
}

const makeMove = (board, moves, roll) => {
    console.log(`Move: ${moves[0]}`);
    roll.moveMade = moves[0];
    moves[0].forEach(num => board[num] = false)
    return board;
}

const resetBoard = (board) => {
    Object.keys(board).forEach(key => board[key] = true)
    return board;
}

const canRollMultiDice = (board) => {
    return board['7'] || board['8'] || board['9'];
}

const calculateMoves = (board, sum) => {
    const moves = [];
    if(board[sum]) {
        moves.push([sum]);
    }

    for(let lower = 0, upper = sum; lower < upper; lower++, upper--){
        if(board[lower] && board[upper]) {
            moves.push([lower, upper]);
        }
    }

    if(sum === 6) {
        if(board['1'] && board['2'] && board['3']) {
            moves.push([1,2,3]);
        }
    } else if(sum === 7) {
        if(board['1'] && board['2'] && board['4']) {
            moves.push([1,2,4]);
        }
    } else if(sum === 8) {
        if(board['1'] && board['2'] && board['5']) {
            moves.push([1,2,5]);
        }
        if(board['1'] && board['3'] && board['4']) {
            moves.push([1,3,4]);
        }
    } else if(sum === 9) {
        if(board['1'] && board['2'] && board['6']) {
            moves.push([1,2,6]);
        }
        if(board['1'] && board['3'] && board['5']) {
            moves.push([1,3,5]);
        }
        if(board['2'] && board['3'] && board['4']) {
            moves.push([2,3,4]);
        }
    } else if(sum === 10) { 
        if(board['1'] && board['2'] && board['7']) {
            moves.push([1,2,7]);
        }
        if(board['1'] && board['3'] && board['6']) {
            moves.push([1,3,6]);
        }
        if(board['2'] && board['3'] && board['5']) {
            moves.push([2,3,5]);
        }
        if(board['1'] && board['2'] && board['3'] && board['4']) {
            moves.push([1,2,3,4]);
        }
    } else if(sum === 11) {
        if(board['1'] && board['2'] && board['8']) {
            moves.push([1,2,8]);
        }
        if(board['1'] && board['3'] && board['7']) {
            moves.push([1,3,7]);
        }
        if(board['1'] && board['4'] && board['6']) {
            moves.push([1,4,6]);
        }
        if(board['2'] && board['4'] && board['5']) {
            moves.push([2,4,5]);
        }
        if(board['1'] &&board['2'] &&  board['3'] && board['5']) {
            moves.push([1,2,3,5]);
        }
    } else if(sum === 12) {
        if(board['1'] && board['2'] && board['9']) {
            moves.push([1,2,9]);
        }
        if(board['1'] && board['3'] && board['8']) {
            moves.push([1,3,8]);
        }
        if(board['1'] && board['4'] && board['7']) {
            moves.push([1,4,7]);
        }
        if(board['2'] && board['3'] && board['7']) {
            moves.push([2,3,7]);
        }
        if(board['1'] && board['5'] && board['6']) {
            moves.push([1,5,6]);
        }
        if(board['2'] && board['4'] && board['6']) {
            moves.push([2,4,6]);
        }
        if(board['3'] && board['4'] && board['5']) {
            moves.push([3,4,5]);
        }
        if(board['1'] && board['2']  && board['4'] && board['5']) {
            moves.push([1,2,4,5]);
        }
        if(board['1'] &&board['2'] &&  board['3'] && board['6']) {
            moves.push([1,2,3,6]);
        }
    }

    return moves;
}

const printBoard = (board) => {
    let boardCharacters = ['|'];
    Object.entries(board).forEach(num => {
        if(num[1]) {
            boardCharacters.push(` ${num[0]} |`);
        } else {
            boardCharacters.push(' X |');
        }
    });

    const boardStr = boardCharacters.join('');
    console.log(boardStr);

}


const boxIsShut = (board) => {
    return Object.entries(board).every(num => !num[1])
}

const writeData = async (fileName, data) => {
    try {
        await fs.writeFile(fileName, JSON.stringify(data), 'utf8');
        console.info('Successfully wrote file');
    } catch(err) {
        console.log('Failed to write file');
        console.error(err);
    }
}

/** 
 * Things we can strategize
 * how many dice to role
 * which move to make when a number of moves are available
 */
const strategies = {
    first:{}
}
main();
