import * as fs from 'fs';

interface Coord {
    x: number;
    y: number;
}

function parseInput(): Array<[Coord, Coord]> {
    const file = fs.readFileSync('day05/input.txt', 'utf8');
    const input = file.split('\n');
    return input.map((line) => line.split(" -> ").map((val) => {
        const coords = val.split(",")
        return {
            x: Number(coords[0]),
            y: Number(coords[1])
        }
    })) as Array<[Coord, Coord]>;
}

function buildKey(coord: Coord): string {
    return `x:${coord.x},y:${coord.y}`;
}

function solution1() {
    const lines = parseInput();
    const map = new Map<string, number>();
    for (const line of lines) {
        if (line[0].x === line[1].x) {
            for (let i = Math.min(line[0].y, line[1].y); i <= Math.max(line[0].y, line[1].y); ++i) {
                const coord = {x: line[0].x, y: i};
                let v = map.get(buildKey(coord));
                if (v === undefined) {
                    map.set(buildKey(coord), 1);
                } else {
                    map.set(buildKey(coord), v + 1);
                }
            }
        } else if (line[0].y === line[1].y) {
            for (let i = Math.min(line[0].x, line[1].x); i <= Math.max(line[0].x, line[1].x); ++i) {
                const coord = {x: i, y: line[0].y};
                let v = map.get(buildKey(coord));
                if (v === undefined) {
                    map.set(buildKey(coord), 1);
                } else {
                    map.set(buildKey(coord), v + 1);
                }
            }
        }
    }

    const objs = Array.from(map.entries());
    return objs.filter((val) => val[1] > 1).length;
}

function iterate(first: Coord, second: Coord, map: Map<string, number>) {
    const xSign = Math.sign(-first.x + second.x);
    const ySign = Math.sign(-first.y + second.y);
    for (let i = 0; i <= Math.max(Math.abs(first.x - second.x), Math.abs(first.y - second.y)); ++i) {
        const coord = {
            x: first.x + xSign * i,
            y: first.y + ySign * i
        };

        let v = map.get(buildKey(coord));
        if (v === undefined) {
            map.set(buildKey(coord), 1);
        } else {
            map.set(buildKey(coord), v + 1);
        }
    }
}

function solution2() {
    const lines = parseInput();
    const map = new Map<string, number>();
    for (const line of lines) {
        if (line[0].x !== line[1].x && line[0].y !== line[1].y &&
            Math.abs(line[0].x - line[1].x) !== Math.abs(line[0].y - line[1].y)) {
            continue;
        }
        iterate(line[0], line[1], map);
    }

    const objs = Array.from(map.entries());
    return objs.filter((val) => val[1] > 1).length;
}

console.log(solution1());
console.log(solution2());
