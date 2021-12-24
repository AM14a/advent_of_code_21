import * as fs from 'fs';

function parseInput(): number[][] {
    const file = fs.readFileSync('day11/input.txt', 'utf8');
    const input = file.split('\n');
    return input.map((val) => val.split("").map((ch) => Number(ch)));
}

function flash(input: number[][], a: number, b: number) {
    for (let i = -1; i <= 1; ++i) {
        if (a + i < 0 || a + i >= input.length) {
            continue;
        }

        for (let j = -1; j <= 1; ++j) {
            if (b + j < 0 || b + j >= input[0].length) {
                continue;
            }

            input[a + i][b + j] += 1;
        }
    }
    return input;
}

function iterateAndCalculateFlashes(input: number[][]): [number[][], number] {
    let flashes = 0;

    input = input.map((val) => val.map((a) => a + 1));

    let newFlashes = 0;
    const flashed = new Set<string>();
    const makeFlush = (a, b) => flashed.add(`${a}_${b}`);
    const isFlashed = (a, b) => flashed.has(`${a}_${b}`);
    do {
        newFlashes = 0;
        for (let i = 0; i < input.length; ++i) {
            for (let j = 0; j < input.length; ++j) {
                if (!isFlashed(i, j) && input[i][j] > 9) {
                    makeFlush(i, j);
                    input = flash(input, i, j);
                    newFlashes += 1;
                }
            }
        }
        flashes += newFlashes;
    } while (newFlashes !== 0)

    for (const val of Array.from(flashed)) {
        const [i, j] = val.split("_");
        input[i][j] = 0;
    }
    return [input, flashes];
}

function solution1() {
    let input = parseInput();
    let flashes = 0;
    for (let i = 0; i < 100; ++i) {
        const res = iterateAndCalculateFlashes(input);
        input = res[0];
        flashes += res[1];
    }
    return flashes;
}

function solution2() {
    let input = parseInput();
    for (let i = 0; i < 10000; ++i) {
        const res = iterateAndCalculateFlashes(input);
        input = res[0];
        let stop = false;
        for (let a = 0; a < input.length && !stop; ++a) {
            for (let b = 0; b < input[0].length && !stop; ++b) {
                if (input[a][b] !== 0) {
                    stop = true;
                }
            }
        }
        if (!stop) {
            return i;
        }
    }
    return 0;
}

console.log(solution1());
console.log(solution2());
