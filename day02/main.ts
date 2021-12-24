import * as fs from 'fs';

function solution1(input: Array<[string, number]>) {
    let d = 0;
    let h = 0;
    for (const [com, val] of input) {
        if (com === "forward") {
            h += val;
        } else if (com === "up") {
            d -= val;
        } else if (com === "down") {
            d += val;
        }
    }
    return [d, h];
}

function solution2(input: Array<[string, number]>) {
    let d = 0;
    let h = 0;
    let aim = 0;
    for (const [com, val] of input) {
        if (com === "forward") {
            d += val * aim;
            h += val;
        } else if (com === "up") {
            aim -= val;
        } else if (com === "down") {
            aim += val;
        }
    }
    return [d, h];
}

const file = fs.readFileSync('day02/input.txt', 'utf8');
const input = file.split('\n').map((val) => val.split(" ")).map((val) => [val[0], Number(val[1])]) as unknown as Array<[string, number]>;

const res1 = solution1(input);
console.log(res1[0] * res1[1]);

const res2 = solution2(input);
console.log(res2[0] * res2[1]);
