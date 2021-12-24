import * as fs from 'fs';

function parseInput() {
    const file = fs.readFileSync('day07/input.txt', 'utf8');
    const input = file.split('\n');
    return input[0].split(",").map((val) => Number(val));
}

function solution1() {
    const pos = parseInput();
    const map = new Map();
    for (let val = Math.min(...pos); val < Math.max(...pos) + 1; ++val) {
        if (map.has(val)) {
            continue;
        }

        const sum = pos.reduce((prev, cur) => prev + Math.abs(cur - val), 0);
        map.set(val, sum);
    }
    const values: number[] = Array.from(map.values());
    console.log(values);
    return Math.min(...values);
}

function solution2() {
    const pos = parseInput();
    let min = Number.MAX_SAFE_INTEGER;
    for (let val = Math.min(...pos); val < Math.max(...pos) + 1; ++val) {
        const sum = pos.reduce((prev, cur) => prev + (Math.abs(cur - val) * (Math.abs(cur - val) + 1) / 2), 0);
        if (min > sum) {
            min = sum;
        }
    }
    return min;
}

const res1 = solution1();
console.log(res1);
console.log(solution2());
