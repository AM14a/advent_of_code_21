import * as fs from 'fs';

function parseInput() {
    const file = fs.readFileSync('day25/input.txt', 'utf8');
    const input = file.split('\n');
    return input;
}

function solution1() {
    const input = parseInput();
}

function solution2() {
    const input = parseInput();
}

console.log(solution1());
console.log(solution2());
