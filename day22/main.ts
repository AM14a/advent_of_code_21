import * as fs from 'fs';

interface Coord {
    x: number;
    y: number;
    z: number;
}

interface Range {
    min_coord: Coord;
    max_coord: Coord;
    on: boolean;
}

function parseInput() {//: Range[] {
    const file = fs.readFileSync('day22/input.txt', 'utf8');
    const input = file
        .split('\n')
        .map((line) => {
            const split = line.split(" ");
            const on = split[0] === "on";
            const coords = split[1]
            .split(",")
            .map((val) => val.split("=")[1].split("..").map((v) => Number(v)));
            return {
                min_coord: {
                    x: coords[0][0],
                    y: coords[1][0],
                    z: coords[2][0]
                },
                max_coord: {
                    x: coords[0][1],
                    y: coords[1][1],
                    z: coords[2][1]
                },
                on
            };
        });
    return input;
}

function solution1() {
    const input = parseInput();
    const cubes = new Set<string>();
    const addCube = (coord: Coord) => cubes.add(JSON.stringify(coord));
    const removeCube = (coord: Coord) => cubes.delete(JSON.stringify(coord));
    for (const range of input) {
        const minCube = range.min_coord;
        const maxCube = range.max_coord;
        const on = range.on;
        for (let i = minCube.x; i <= maxCube.x; ++i) {
            if (i > 50 || i < -50) {
                continue;
            }
            for (let j = minCube.y; j <= maxCube.y; ++j) {
                if (j > 50 || j < -50) {
                    continue;
                }
                for (let k = minCube.z; k <= maxCube.z; ++k) {
                    if (k > 50 || k < -50) {
                        continue;
                    }
                    const coord = {x: i, y: j, z: k};
                    on ? addCube(coord) : removeCube(coord);
                }
            }
        }
    }
    return Array.from(cubes.keys()).length;
} // 647062

function calculateLength(ranges: Range[], openZRangeIndexes: number[]): number {
    const zToCubes = new Map<number, number[]>();
    for (const i of openZRangeIndexes) {
        const range = ranges[i];
        zToCubes.set(range.min_coord.z, [...(zToCubes.get(range.min_coord.z) ?? []), i]);
        zToCubes.set(range.max_coord.z + 1, [...(zToCubes.get(range.max_coord.z + 1) ?? []), i]); // ends are not included
    }
    const zCoords = Array.from(zToCubes.entries()).sort((a, b) => a[0] - b[0]);

    let length = 0;
    let openRangeIndexes: number[] = [];
    let lastZCoord: number | undefined = undefined;
    for (let i = 0; i < zCoords.length; ++i) {
        const curZCoord = zCoords[i][0];
        if (lastZCoord !== undefined) {
            length += (curZCoord - lastZCoord); // TODO: check what about edge value?
        }

        const rangeIndexes = zCoords[i][1];
        for (const index of rangeIndexes) {
            if (curZCoord === ranges[index].min_coord.z) {
                openRangeIndexes.push(index);
            } else {
                openRangeIndexes = openRangeIndexes.filter((val) => val !== index);
            }
        }

        const dominantRangeIndex = openRangeIndexes.length ? openRangeIndexes.sort((a, b) => b - a)[0] : undefined;
        lastZCoord = (dominantRangeIndex !== undefined && ranges[dominantRangeIndex].on) ? curZCoord : undefined;
    }

    return length;
}

function calculateArea(ranges: Range[], openRangeIndexes: number[]): number {
    const yToCubes = new Map<number, number[]>();
    for (const i of openRangeIndexes) {
        const range = ranges[i];
        yToCubes.set(range.min_coord.y, [...(yToCubes.get(range.min_coord.y) ?? []), i]);
        yToCubes.set(range.max_coord.y + 1, [...(yToCubes.get(range.max_coord.y + 1) ?? []), i]); // ends are not included
    }
    const yCoords = Array.from(yToCubes.entries()).sort((a, b) => a[0] - b[0]);

    let area = 0;
    let openZRangeIndexes: number[] = [];
    let lastVal: {y_coord: number, length: number} | undefined = undefined;
    for (let i = 0; i < yCoords.length; ++i) {
        const curYCoord = yCoords[i][0];
        if (lastVal !== undefined) {
            area += (curYCoord - lastVal.y_coord) * lastVal.length; // TODO: check what about edge value?
        }

        const rangeIndexes = yCoords[i][1];
        for (const index of rangeIndexes) {
            if (curYCoord === ranges[index].min_coord.y) {
                openZRangeIndexes.push(index);
            } else {
                openZRangeIndexes = openZRangeIndexes.filter((val) => val !== index);
            }
        }

        lastVal = {
            y_coord: curYCoord,
            length: calculateLength(ranges, openZRangeIndexes)
        };
    }
    return area;
}

function solution2() {
    const input = parseInput();
    const xToCubes = new Map<number, number[]>();
    for (let i = 0; i < input.length; ++i) {
        const range = input[i];
        if (xToCubes.get(range.min_coord.x) || xToCubes.get(range.max_coord.x)) {
            console.log("wow", range.min_coord, range.max_coord);
        }
        xToCubes.set(range.min_coord.x, [...(xToCubes.get(range.min_coord.x) ?? []), i]);
        xToCubes.set(range.max_coord.x + 1, [...(xToCubes.get(range.max_coord.x + 1) ?? []), i]); // ends are not included
    }

    const xCoords = Array.from(xToCubes.entries()).sort((a, b) => a[0] - b[0]);

    let lights = 0;
    let openRangeIndexes: number[] = [];
    let lastVal: {x_coord: number, area: number} | undefined = undefined;
    for (let i = 0; i < xCoords.length; ++i) {
        const curXCoord = xCoords[i][0];
        if (lastVal !== undefined) {
            lights += (curXCoord - lastVal.x_coord) * lastVal.area; // TODO: check what about edge value?
        }
        const rangeIndexes = xCoords[i][1];
        for (const index of rangeIndexes) {
            if (curXCoord === input[index].min_coord.x) {
                openRangeIndexes.push(index);
            } else {
                openRangeIndexes = openRangeIndexes.filter((val) => val !== index);
            }
        }
        //console.log("open ranges", openRangeIndexes.length);

        lastVal = {
            x_coord: curXCoord,
            area: calculateArea(input, openRangeIndexes)
        };
    }
    return lights;
}

//2758514936282235
//4604132577019636
//console.log(solution1());
console.log(solution2());
