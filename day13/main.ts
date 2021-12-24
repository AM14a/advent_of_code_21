import * as fs from 'fs';

function parseInput(): {dots: Array<[number,number]>; folds: Array<[string, string]>} {
    const file = fs.readFileSync('day13/input.txt', 'utf8');
    const input = file.split('\n\n');
    const dots = input[0].split('\n').map((val) => val.split(',').map((v) => Number(v)) as [number, number])
    const folds = input[1].split('\n').map((val) => val.split(' ')[2].split('=') as [string, string]);
    return {dots, folds};
}

function solution1() {
    const input = parseInput();
    const dots = input.dots;
    const fold = input.folds[0];

    const points = new Set<string>();
    const addPoint = (x: number, y: number) => {
        points.add(`${x}_${y}`);
    };

    const foldPoint = (x: number, y: number): [number, number] => {
        const half = Number(fold[1]);
        if (fold[0] === "x") {
            return (x > half) ? [(2 * half - x), y] : [x, y];
        }
        return (y > half) ? [x, (2 * half - y)] : [x, y];

    };
    for (const dot of dots) {
        const point = foldPoint(dot[0], dot[1]);
        //console.log("p", dot, "-->", point);
        addPoint(point[0], point[1]);
    }

    return Array.from(points).length;
} // 781

function solution2() {
    const input = parseInput();
    const dots = input.dots;
    const folds = input.folds;

    let points = new Set<string>();
    for (const dot of dots) {
        points.add(`${dot[0]}_${dot[1]}`);
    }

    const foldPoint = (x: number, y: number, foldAxe: string, foldHalf: number): [number, number] => {
        if (foldAxe === "x") {
            return (x > foldHalf) ? [(2 * foldHalf - x), y] : [x, y];
        }
        return (y > foldHalf) ? [x, (2 * foldHalf - y)] : [x, y];

    };

    for (const fold of folds) {
        const newSet = new Set<string>();
        for (const point of Array.from(points)) {
            const dot = point.split("_").map((v) => Number(v));
            const newPoint = foldPoint(dot[0], dot[1], fold[0], Number(fold[1]));
            newSet.add(`${newPoint[0]}_${newPoint[1]}`);
        }
        points.clear();
        points = newSet;
    }

    for (let i = 0; i < 8; ++i) {
        const arr = [];
        for (let j = 0; j < 41; ++j) {
            if (points.has(`${j}_${i}`)) {
                arr.push("#");
            } else {
                arr.push(".");
            }
        }
        console.log(arr.join(""));
    }

    return Array.from(points).length;
} // PERCGJPB

console.log(solution1());
console.log(solution2());
