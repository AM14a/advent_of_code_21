import * as fs from 'fs';

interface Board {
    length: number;
    width: number;
    horizontal: Set<string>;
    vertical: Set<string>;
}

function parseInput(): Board {
    const file = fs.readFileSync('day25/input.txt', 'utf8');
    const input = file.split('\n');
    const horizontal = new Set<string>();
    const vertical = new Set<string>();
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input[0].length; ++j) {
            if (input[i][j] === ">") {
                horizontal.add(`${i}_${j}`);
            } else if (input[i][j] === "v") {
                vertical.add(`${i}_${j}`);
            }
        }
    }
    return {
        length: input.length,
        width: input[0].length,
        horizontal,
        vertical
    };
}

function isCellOccupied(coord: [number, number], input: Board) {
    const coordStr = `${coord[0]}_${coord[1]}`;
    return input.horizontal.has(coordStr) || input.vertical.has(coordStr);
}

function solution1() {
    console.time("Part 1");
    const input = parseInput();
    let counter = 0;
    while (true) {
        //console.log("step", counter);//, Array.from(input.horizontal.keys()), Array.from(input.vertical.keys()));
        ++counter;
        //for (let i = 0; i < input.length; ++i) {
        //    let line = "";
        //    for (let j = 0; j < input.width; ++j) {
        //        if (input.horizontal.has(`${i}_${j}`)) {
        //            line += ">";
        //        } else if (input.vertical.has(`${i}_${j}`)) {
        //            line += "v";
        //        } else {
        //            line += "."
        //        }
        //    }
        //    console.log(line);
        //}

        let stop = true;
        const horizontalCoords = Array.from(input.horizontal.keys()).map((val) => val.split("_").map(Number) as [number, number]);
        for (const cuc of horizontalCoords) {
            const nextCoord = [cuc[0], (cuc[1] + 1) % input.width] as [number, number];
            if (!isCellOccupied(nextCoord, input)) {
                stop = false;
                cuc[1] = nextCoord[1];
            }
        }
        input.horizontal = new Set(horizontalCoords.map((a) => a.join("_")));

        const verticalCoords = Array.from(input.vertical.keys()).map((val) => val.split("_").map(Number) as [number, number]);
        for (const cuc of verticalCoords) {
            const nextCoord = [(cuc[0] + 1) % input.length, cuc[1]] as [number, number];
            if (!isCellOccupied(nextCoord, input)) {
                stop = false;
                cuc[0] = nextCoord[0];
            }
        }
        input.vertical = new Set(verticalCoords.map((a) => a.join("_")));

        if (stop) {
            console.timeEnd("Part 1");
            return counter;
        }

    }
}

function solution2() {
    const input = parseInput();
}

console.log(solution1());
console.log(solution2());
