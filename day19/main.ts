import * as fs from 'fs';

interface Vector {
    x: number;
    y: number;
    z: number;
}

type Scan = Vector[];

function parseInput(): Scan[] {
    const file = fs.readFileSync('day19/input.txt', 'utf8');
    const input = file.split('\n\n');
    return input.map((scan) => {
        const lines = scan.split("\n").slice(1);
        return lines.map((line) => {
            const coord = line.split(",").map((val) => Number(val))
            return {
                x: coord[0],
                y: coord[1],
                z: coord[2]
            }
        });
    })
}

const permutations = [
    {x: "x", y: "y", z: "z"},
    {x: "y", y: "z", z: "x"},
    {x: "z", y: "x", z: "y"},

    {x: "x", y: "z", z: "y"},
    {x: "y", y: "x", z: "z"},
    {x: "z", y: "y", z: "x"},
];

function calculateVectorToScanner(scan1: Scan, scan2: Scan, beacons: Set<string>): Scan | undefined {
    const addBeacon = (vec: Vector) => {beacons.add(JSON.stringify(vec))};
    for (const perm of permutations) {
        for (let sign = 0; sign < 8; ++sign) {
            const deltas = new Map<string, number>();
            const addDelta = (vec: Vector) => deltas.set(JSON.stringify(vec), (deltas.get(JSON.stringify(vec)) ?? 0) + 1);

            const xSign = sign < 4 ? 1 : -1;
            const ySign = (Math.floor(sign / 2) % 2 === 0) ? 1 : -1;
            const zSign = sign % 2 === 0 ? 1 : -1;

            const transformCoord = (vec: Vector) => {
                return {
                    x: vec[perm["x"]] * xSign,
                    y: vec[perm["y"]] * ySign,
                    z: vec[perm["z"]] * zSign
                }
            }

            for (let i = 0; i < scan1.length; ++i) {
                for (let j = 0; j < scan2.length; ++j) {
                    const coord = transformCoord(scan2[j]);
                    addDelta({
                        x: scan1[i].x - coord.x,
                        y: scan1[i].y - coord.y,
                        z: scan1[i].z - coord.z
                    });
                }
            }

            const maxs = Array.from(deltas.entries()).filter((val) => val[1] >= 3);
            if (maxs.length !== 0) {
                const max = JSON.parse(maxs[0][0]);
                const newScan: Scan = [];
                for (let j = 0; j < scan2.length; ++j) {
                    const coord = transformCoord(scan2[j]);
                    const transformedVec = {
                        x: max.x + coord.x,
                        y: max.y + coord.y,
                        z: max.z + coord.z
                    }
                    newScan.push(transformedVec);
                    addBeacon(transformedVec);
                }
                //console.log("beacons", Array.from(beacons.values()).length);
                return newScan;
            }
        }
    }
    return undefined;
}

function solution1() {
    const input = parseInput();
    const beacons = new Set<string>();
    const addBeacon = (vec: Vector) => {beacons.add(JSON.stringify(vec))};
    for (const coord of input[0]) {
        addBeacon(coord);
    }

    const checkedSet = new Set<number>();
    checkedSet.add(0);
    const queue: Array<{scan: Scan, scan_index: number}> = [{scan: input[0], scan_index: 0}];
    while (queue.length) {
        const lastVal = queue[queue.length - 1];
        queue.pop();
        const scan = lastVal.scan;
        for (let j = 1; j < input.length; ++j) {
            if (checkedSet.has(j)) {
                continue;
            }
            //console.log("pair with", lastVal.scan_index, j)
            const res = calculateVectorToScanner(scan, input[j], beacons);
            if (res) {
                queue.push({scan: res, scan_index: j});
                checkedSet.add(j);
            }
        }
    }
    return Array.from(beacons).length;
}

function calculateVectorToScanner2(scan1: Scan, scan2: Scan): {scan: Scan, shift: Vector} | undefined {
    for (const perm of permutations) {
        for (let sign = 0; sign < 8; ++sign) {
            const deltas = new Map<string, number>();
            const addDelta = (vec: Vector) => deltas.set(JSON.stringify(vec), (deltas.get(JSON.stringify(vec)) ?? 0) + 1);

            const xSign = sign < 4 ? 1 : -1;
            const ySign = (Math.floor(sign / 2) % 2 === 0) ? 1 : -1;
            const zSign = sign % 2 === 0 ? 1 : -1;

            const transformCoord = (vec: Vector) => {
                return {
                    x: vec[perm["x"]] * xSign,
                    y: vec[perm["y"]] * ySign,
                    z: vec[perm["z"]] * zSign
                }
            }

            for (let i = 0; i < scan1.length; ++i) {
                for (let j = 0; j < scan2.length; ++j) {
                    const coord = transformCoord(scan2[j]);
                    addDelta({
                        x: scan1[i].x - coord.x,
                        y: scan1[i].y - coord.y,
                        z: scan1[i].z - coord.z
                    });
                }
            }

            const maxs = Array.from(deltas.entries()).filter((val) => val[1] >= 3);
            if (maxs.length !== 0) {
                const max = JSON.parse(maxs[0][0]);
                const newScan: Scan = [];
                for (let j = 0; j < scan2.length; ++j) {
                    const coord = transformCoord(scan2[j]);
                    const transformedVec = {
                        x: max.x + coord.x,
                        y: max.y + coord.y,
                        z: max.z + coord.z
                    }
                    newScan.push(transformedVec);
                }
                return {scan: newScan, shift: max};
            }
        }
    }
    return undefined;
}


function solution2() {
    const input = parseInput();

    const shifts: Vector[] = [{x: 0, y: 0, z: 0}];

    const checkedSet = new Set<number>();
    checkedSet.add(0);
    const queue: Array<{scan: Scan, scan_index: number}> = [{scan: input[0], scan_index: 0}];
    while (queue.length) {
        const lastVal = queue[queue.length - 1];
        queue.pop();
        const scan = lastVal.scan;
        for (let j = 1; j < input.length; ++j) {
            if (checkedSet.has(j)) {
                continue;
            }
            //console.log("pair with", lastVal.scan_index, j)
            const res = calculateVectorToScanner2(scan, input[j]);
            if (res) {
                queue.push({scan: res.scan, scan_index: j});
                shifts.push(res.shift);
                checkedSet.add(j);
            }
        }
    }

    let max = 0;
    for (let i = 0; i < shifts.length; ++i) {
        for (let j = 0; j < shifts.length; ++j) {
            const cur =
                Math.abs(shifts[i].x - shifts[j].x) +
                Math.abs(shifts[i].y - shifts[j].y) +
                Math.abs(shifts[i].z - shifts[j].z);
            max = Math.max(max, cur);
        }
    }
    return max;
}

console.log(solution1());
console.log(solution2());
