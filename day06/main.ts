import * as fs from 'fs';

function parseInput(): number[] {
    const file = fs.readFileSync('day06/input.txt', 'utf8');
    const input = file.split('\n');
    return input[0].split(",").map((val) => Number(val));
}

function solution1() {
    let fishes = parseInput();
    for (let i = 0; i < 80; ++i) {
        const newFishes = [];
        for (let fish of fishes) {
            if (fish === 0) {
                newFishes.push(8);
                newFishes.push(6);
            } else {
                newFishes.push(--fish);
            }
        }
        fishes = newFishes;
    }
    return fishes.length;
}

function solution2() {
    let fishes = parseInput();
    let fishesMap = [0,0,0,0,0,0,0,0,0];
    for (const fish of fishes) {
        ++fishesMap[fish];
    }
    for (let i = 0; i < 256; ++i) {
        const newFishes = [0,0,0,0,0,0,0,0,0];
        for (let j = 0; j < 9; ++j) {
            if (j === 0) {
                newFishes[8] = fishesMap[j];
                newFishes[6] += fishesMap[j];
            } else {
                newFishes[j - 1] += fishesMap[j];
            }
        }
        fishesMap = newFishes;
    }
    return fishesMap.reduce((prev, cur) => prev + cur, 0);
}

const res1 = solution1();
console.log(res1);
console.log(solution2());
