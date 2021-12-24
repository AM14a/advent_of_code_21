import * as fs from 'fs';
import {minBy} from "lodash";

function parseInput(): number[][] {
    const file = fs.readFileSync('day15/input.txt', 'utf8');
    const input = file.split('\n').map((line) => line.split("").map((val) => Number(val)));
    return input;
}

function solution1() {
    const input = parseInput();
    //console.log(input);
    const visited = new Set<string>();
    const visit = (a: number, b: number) => visited.add(`${a}_${b}`);
    visit(0, 0);
    const isVisited = (a: number, b: number) => visited.has(`${a}_${b}`);
    let priorityQueue = [{i: 0, j: 0, sum: 0, path: `0_0`}];
    const getMin = () => minBy(priorityQueue, "sum");
    while (priorityQueue.length !== 0) {
        const next = getMin();
        const i = next.i;
        const j = next.j;

        priorityQueue = priorityQueue.filter((val) => val.i !== i || val.j !== j);
        //console.log(next,priorityQueue.length);

        if (i === input.length - 1 && j === input[0].length - 1) {
            console.log(next);
            return next.sum;
        }

        for (const diff of [-1, 1]) {
            const newToVisit: number[][] = [];
            if (i + diff >= 0 && i + diff < input.length && !isVisited(i + diff, j)) {
                newToVisit.push([i + diff, j]);
            }

            if (j + diff >= 0 && j + diff < input[0].length && !isVisited(i, j + diff)) {
                newToVisit.push([i, j + diff]);
            }

            for (const newP of newToVisit) {
                const newI = newP[0];
                const newJ = newP[1];
                visit(newI, newJ);

                //const newPath = [...next.path, {i: i + diffI, j: j + diffJ}];
                const newPath = next.path + ` ${newI}_${newJ}`;

                priorityQueue.push({
                    i: newI,
                    j: newJ,
                    sum: next.sum + input[newI][newJ],
                    path: newPath
                });
            }
        }
    }
    return 0;
}

function solution2() {
    const inputPart = parseInput();
    const maxILength = inputPart.length * 5;
    const maxJLength = inputPart[0].length * 5;
    const getValueAtIndex = (a: number, b: number) => {
        const initialValue = inputPart[a % inputPart.length][b % inputPart[0].length];
        const delta = Math.floor(a / inputPart.length) + Math.floor(b / inputPart[0].length);
        const newValue = (initialValue + delta);
        return newValue > 9 ? (newValue % 10) + 1 : newValue;
    }

    const visited = new Set<string>();
    const visit = (a: number, b: number) => visited.add(`${a}_${b}`);
    visit(0, 0);
    const isVisited = (a: number, b: number) => visited.has(`${a}_${b}`);
    let priorityQueue = [{i: 0, j: 0, sum: 0, path: `0_0`}];
    const getMin = () => minBy(priorityQueue, "sum");
    while (priorityQueue.length !== 0) {
        const next = getMin();
        const i = next.i;
        const j = next.j;

        priorityQueue = priorityQueue.filter((val) => val.i !== i || val.j !== j);
        //console.log(next,priorityQueue.length);

        if (i === maxILength - 1 && j === maxJLength - 1) {
            console.log(next);
            return next.sum;
        }

        for (const diff of [-1, 1]) {
            const newToVisit: number[][] = [];
            if (i + diff >= 0 && i + diff < maxILength && !isVisited(i + diff, j)) {
                newToVisit.push([i + diff, j]);
            }

            if (j + diff >= 0 && j + diff < maxJLength && !isVisited(i, j + diff)) {
                newToVisit.push([i, j + diff]);
            }

            for (const newP of newToVisit) {
                const newI = newP[0];
                const newJ = newP[1];
                visit(newI, newJ);

                //const newPath = [...next.path, {i: i + diffI, j: j + diffJ}];
                const newPath = next.path + ` ${newI}_${newJ}`;

                priorityQueue.push({
                    i: newI,
                    j: newJ,
                    sum: next.sum + getValueAtIndex(newI, newJ),
                    path: newPath
                });
            }
        }
    }
    return 0;
}

console.log(solution1());
console.log(solution2());
