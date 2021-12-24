import * as fs from 'fs';

interface Limits {
    min: number;
    max: number;
}

function parseInput(): [Limits, Limits] {
    const file = fs.readFileSync('day17/input.txt', 'utf8');
    const limits: [[string, string], [string, string]] = file
        .split('=')
        .slice(1)
        .map((val) =>
            val.split(",")[0]
                .split("..")
        ) as [[string, string], [string, string]];

    return [
        {min: Number(limits[0][0]), max: Number(limits[0][1])},
        {min: Number(limits[1][0]), max: Number(limits[1][1])}
    ];
}

function findRangeForX(limits: Limits) {
    return [
        Math.ceil(Math.sqrt(2 * limits.min + 1/4) - 1/2),
        limits.max
    ];
}

function findRangeForY(limits: Limits) {
    return [
        limits.min,
        -limits.min
    ];
}

function yAfterKSteps(init: number, k: number) {
    return init * k - k * (k - 1) / 2;
}

function xAfterKSteps(init: number, k: number) {
    return Math.min(init * (init + 1) / 2, init * k - k * (k - 1) / 2);
}

function findStepsRangeForY(init: number, limits: Limits): [number, number] {
    let curY = 0;
    let kMin = 2 * init + 1;
    while (curY > limits.max) {
        ++kMin
        curY = yAfterKSteps(init, kMin);
        //console.log("init", init, curY, kMin)
    }
    let kMax = kMin - 1;
    while (curY >= limits.min) {
        ++kMax;
        curY = yAfterKSteps(init, kMax);
    }
    return [kMin, kMax - 1];
}

function findStepsRangeForX(init: number, limits: Limits): [number, number] {
    let curX = 0;
    let kMin = 0;
    while (curX < limits.min && kMin <= init) {
        ++kMin
        curX = xAfterKSteps(init, kMin);
        //console.log("init", init, curX, kMin)
    }
    let kMax = kMin - 1;
    while (curX <= limits.max && kMax <= init) {
        ++kMax;
        curX = xAfterKSteps(init, kMax);
    }
    if (curX <= limits.max) {
        return [kMin, Number.MAX_SAFE_INTEGER];
    }
    return [kMin, kMax - 1];
}

function rangesIntersect(first: [number, number], second: [number, number]) {
    return (first[1] >= second[0] && first[1] <= second[1]) ||
        (first[0] >= second[0] && first[0] <= second[1]) ||
        (second[0] >= first[0] && second[0] <= first[1]) ||
        (second[1] >= first[0] && second[1] <= first[1]);
}


function solution1() {
    const input = parseInput();
    const rangeX = findRangeForX(input[0]);
    const rangeY = findRangeForY(input[1]);
    console.log(rangeY, rangeX);
    for (let i = rangeY[1]; i >= rangeY[0]; --i) {
        const stepsRangeForY = findStepsRangeForY(i, input[1]);
        console.log("TADA", i, stepsRangeForY, input[1]);
        if (stepsRangeForY[0] > stepsRangeForY[1]) {
            continue;
        }
        for (let j = rangeX[0]; j <= rangeX[1]; ++j) {
            const stepsRangeForX = findStepsRangeForX(j, input[0]);
            console.log(j, stepsRangeForX, input[0]);

            if (rangesIntersect(stepsRangeForX, stepsRangeForY)) {
                console.log("result", i);
                return i * (i + 1) / 2;
            }
        }
    }
    return 0;
}

function solution2() {
    const input = parseInput();
    const rangeX = findRangeForX(input[0]);
    const rangeY = findRangeForY(input[1]);

    let res = 0;
    for (let i = rangeY[1]; i >= rangeY[0]; --i) {
        const stepsRangeForY = findStepsRangeForY(i, input[1]);
        //console.log("TADA", i, stepsRangeForY, input[1]);
        if (stepsRangeForY[0] > stepsRangeForY[1]) {
            continue;
        }
        for (let j = rangeX[0]; j <= rangeX[1]; ++j) {
            const stepsRangeForX = findStepsRangeForX(j, input[0]);
            if (stepsRangeForX[0] > stepsRangeForX[1]) {
                continue;
            }
            //console.log(j, stepsRangeForX, input[0]);

            if (rangesIntersect(stepsRangeForX, stepsRangeForY)) {
                res += 1;
                //console.log("result", {j, i});
                //return i * (i + 1) / 2;
            }
        }
    }
    return res;
}

console.log(solution1());
console.log(solution2());
