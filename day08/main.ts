import * as fs from 'fs';

function parseInput(): string[][] {
    const file = fs.readFileSync('day08/input.txt', 'utf8');
    const input = file.split('\n');
    return input.map((val) => val.split(" | ")[1].split(" "));
}

function solution1() {
    const pos = parseInput();
    const res = pos.map((val) => val.filter((val) => val.length === 2 || val.length === 3 || val.length === 4 || val.length === 7));
    return res.reduce((prev, cur) => prev + cur.length, 0);
}

function parseInput2(): Array<[string[], string[]]> {
    const file = fs.readFileSync('day08/input.txt', 'utf8');
    const input = file.split('\n');
    const strs = input.map((val) => val.split(" | ").map((v) => v.split(" ")));
    return strs as Array<[string[], string[]]>;
}

const digits = [
    [0, 1, 2, 4, 5, 6], // 0
    [2, 5], // 1
    [0, 2, 3, 4, 6], // 2
    [0, 2, 3, 5, 6], // 3
    [1, 2, 3, 5], // 4
    [0, 1, 3, 5, 6], // 5
    [0, 1, 3, 4, 5, 6], // 6
    [0, 2, 5], // 7
    [0, 1, 2, 3, 4, 5, 6], // 8
    [0, 1, 2, 3, 5, 6] // 9
];

function solveLine(val: [string[], string[]]): number {
    const hint  = val[0];
    const cipher = val[1];

    const one = hint.filter((val) => val.length === 2)[0];
    const four = hint.filter((val) => val.length === 4)[0];
    const seven = hint.filter((val) => val.length === 3)[0];
    const eight = hint.filter((val) => val.length === 7)[0];
    const nine  = hint.filter((val) => val.length === 6 && four.split("").every((v) => val.includes(v)))[0];
    const zero  = hint.filter((val) =>
        val.length === 6 &&
        !four.split("").every((v) => val.includes(v)) &&
        one.split("").every((v) => val.includes(v))
    )[0];
    const six = hint.filter((val) =>
        val.length === 6 &&
        !four.split("").every((v) => val.includes(v)) &&
        !one.split("").every((v) => val.includes(v))
    )[0];

    const map = ["", "", "", "", "", "", ""];
    map[0] = seven.split("").filter((val) => !one.split("").includes(val))[0];
    map[2] = eight.split("").filter((ch) => !six.split("").includes(ch))[0];
    map[3] = eight.split("").filter((ch) => !zero.split("").includes(ch))[0];
    map[4] = eight.split("").filter((ch) => !nine.split("").includes(ch))[0];
    map[5] = one.split("").filter((v) => v !== map[2])[0];
    map[1] = four.split("").filter((val) => val !== map[2] && val !== map[3] && val !== map[5])[0];
    map[6] = ["a", "b", "c", "d", "e", "f", "g"].filter((val) => !map.includes(val))[0];
    //console.log(map);

    const decipher = cipher.map((c) =>
        digits.findIndex((digit) =>
            digit.length === c.split("").length &&
            digit.every((val) => c.split("").includes(map[val])) === true
        )
    );
    //console.log(decipher);
    return Number(decipher.join(""));
}

function solution2() {
    const input = parseInput2();
    return input.map((val) => solveLine(val)).reduce((prev, cur) => prev + cur, 0);

}

const res1 = solution1();
console.log(res1);
console.log(solution2());
