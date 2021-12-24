import * as fs from 'fs';

function parseInput(): number[][] {
    const file = fs.readFileSync('day09/input.txt', 'utf8');
    const input = file.split('\n');
    return input.map((val) => val.split("").map((v) => Number(v)));
}

function solution1() {
    const input = parseInput();
    let risk = 0;
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            if ((i === 0 || (input[i][j] < input[i - 1][j])) &&
                (i === input.length - 1 || (input[i][j] < input[i + 1][j])) &&
                (j === 0 || (input[i][j] < input[i][j - 1])) &&
                (j === input[0].length - 1 || (input[i][j] < input[i][j + 1]))
            ) {
                risk += input[i][j] + 1;
            }
        }
    }
    return risk;
}

function calculateBasin(input: number[][], ii: number, jj: number): number {
    const visited = new Set<string>();
    const markVisited = (a: number, b: number) => visited.add(`${a}_${b}`);
    const isVisited = (a: number, b: number) => visited.has(`${a}_${b}`);
    let queue: Array<[number, number]> = [[ii, jj]];
    const pushToQueue = (a: number, b: number) => {
        if (input[a][b] !== 9) {
            queue.push([a, b]);
        }
    }
    while (queue.length !== 0) {
        const i = queue[0][0];
        const j = queue[0][1];
        //if (input[i][j] !== 8) {
            if ((i !== 0 && !isVisited(i - 1, j) && (input[i][j] <= input[i - 1][j]))) {
                //queue.push([i - 1, j]);
                pushToQueue(i - 1, j);
            }

            if (i !== input.length - 1 && !isVisited(i + 1, j) && (input[i][j] <= input[i + 1][j])) {
                //queue.push([i + 1, j]);
                pushToQueue(i + 1, j);
            }

            if (j !== 0 && !isVisited(i, j - 1) && (input[i][j] <= input[i][j - 1])) {
                //queue.push([i, j - 1]);
                pushToQueue(i, j - 1);
            }

            if (j !== input[0].length - 1 && !isVisited(i, j + 1) && (input[i][j] <= input[i][j + 1])) {
                //queue.push([i, j + 1]);
                pushToQueue(i, j + 1);
            }
        //}

        markVisited(i, j);
        queue = queue.slice(1);
    }
    console.log([ii, jj], visited);
    return Array.from(visited).length;
}

// 1050192
function solution2() {
    const input = parseInput();
    const basinLength: number[] = [];
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            if ((i === 0 || (input[i][j] < input[i - 1][j])) &&
                (i === input.length - 1 || (input[i][j] < input[i + 1][j])) &&
                (j === 0 || (input[i][j] < input[i][j - 1])) &&
                (j === input[0].length - 1 || (input[i][j] < input[i][j + 1]))
            ) {
                basinLength.push(calculateBasin(input, i, j));
            }
        }
    }
    basinLength.sort((a, b) => b - a);
    console.log(basinLength);
    return basinLength[0] * basinLength[1] * basinLength[2];
}

const res1 = solution1();
console.log(res1);
console.log(solution2());
