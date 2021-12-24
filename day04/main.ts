import * as fs from 'fs';

type Board = number[][];
type Sequence = number[];
function parseInput(): [Sequence, Board[]] {
    const file = fs.readFileSync('day04/input.txt', 'utf8');
    const input = file.split('\n\n');
    const seq = input[0].split(",").map((val) => Number(val));
    const boards: Board[] = [];
    for (let i = 1; i < input.length; ++i) {
        const boardRaw = input[i];
        boards.push(boardRaw.split("\n").map((row) => row.trim().split(" ").map((val) => val.trim()).filter((val) => val !== "").map((val) => Number(val))));
    }
    return [seq, boards];
}

function fillBoard(board: Board, val: number) {
    for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board[i].length; ++j) {
            if (board[i][j] === val) {
                board[i][j] = NaN;
            }
        }
    }
    return board;
}

function calculateSum(board: Board): number {
    let sum = 0;
    for (let i = 0; i < board.length; ++i) {
        for (let j = 0; j < board.length; ++j) {
            if (!isNaN(board[i][j])) {
                sum += board[i][j];
            }
        }
    }
    return sum;
}

function checkBoard(board: Board) {
    for (let i = 0; i < board.length; ++i) {
        let nonNaN = board.map((row) => row[i]).filter((val) => !isNaN(val));
        if (nonNaN.length === 0) {
            return true;
        }
        nonNaN = board[i].filter((val) => !isNaN(val));
        if (nonNaN.length === 0) {
            return true;
        }
    }
    return false;
}

function solution1(seq: Sequence, boards: Board[]) {
    for (const val of seq) {
        for (let board of boards) {
            board = fillBoard(board, val);
            if (checkBoard(board)) {
                const sum = calculateSum(board);
                console.log(sum);
                console.log("val", val);
                return sum * val;
            }
        }
    }
    return NaN;
}

function solution2(seq: Sequence, boards: Board[]) {
    const unchecked  = new Set<number>();
    for (let i = 0; i < boards.length; ++i) {
        unchecked.add(i);
    }
    let cont = true;
    for (const val of seq) {
        for (let i = 0; i < boards.length; ++i) {
            let board = boards[i];
            board = fillBoard(board, val);
            if (unchecked.has(i) && checkBoard(board)) {
                unchecked.delete(i);
                if (!cont) {
                    const sum = calculateSum(board);
                    console.log(sum);
                    console.log("val", val);
                    return sum * val;
                }
            }
        }

        const arr = Array.from(unchecked);
        if (cont && arr.length === 1) {
            cont = false;
        }
    }
    return NaN;
}

const input = parseInput();
const copy = [...input[0]];
const copy2 = [...input[1]]
console.log(solution1(input[0], input[1]));
console.log(solution2(copy, copy2));