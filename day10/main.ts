import * as fs from 'fs';

function parseInput() {
    const file = fs.readFileSync('day10/input.txt', 'utf8');
    const input = file.split('\n');
    return input;
}

const map = {
    ")": 3,
    "]": 57,
    "}": 1197,
    ">": 25137
};

const bracketMap = {
    "(": ")",
    "[": "]",
    "{": "}",
    "<": ">"
};

const openers = Object.keys(bracketMap);
const closers = Object.values(bracketMap);

function isOpener(ch: string): boolean {
    return openers.includes(ch);
}

function isMatch(cur: string, last: string): boolean {
    return bracketMap[last] === cur;
}

function solution1() {
    const input = parseInput();
    let res = 0;
    for (const line of input) {
        const stack = [];
        for (const ch of line) {
            if (isOpener(ch)) {
                stack.push(ch);
                continue;
            }
            const prev = stack[stack.length - 1];
            if (!prev || !isMatch(ch, prev)) {
                res += map[ch];
                break;
            } else {
                stack.pop();
            }
        }
    }
    return res;
}

const otherMap = {
    "(": 1,
    "[": 2,
    "{": 3,
    "<": 4
};

function solution2() {
    const input = parseInput();
    let results: number[] = [];
    for (const line of input) {
        const stack = [];
        let incomplete = true;
        for (const ch of line) {
            if (isOpener(ch)) {
                stack.push(ch);
                continue;
            }
            const prev = stack[stack.length - 1];
            if (!prev || !isMatch(ch, prev)) {
                incomplete = false;
                break;
            } else {
                stack.pop();
            }
        }
        if (incomplete && stack.length !== 0) {
            let curRes = 0;
            for (let i = stack.length - 1; i >= 0; --i) {
                curRes = curRes * 5 + otherMap[stack[i]];
            }
            results.push(curRes);
        }
    }
    results = results.sort((a, b) => a - b);
    return results[(results.length - 1) / 2];
}

const res1 = solution1();
console.log(res1);
console.log(solution2());
