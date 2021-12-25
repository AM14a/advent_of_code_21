import * as fs from 'fs';

function parseInput() : Instruction[] {
    const file = fs.readFileSync('day24/input.txt', 'utf8');
    return file.split('\n').map((line) => {
        const split = line.split(" ");
        return {op: split[0] as Operation, var1: split[1], var2: split[2]};
    });
}

enum Operation {
    INP = "inp",
    ADD = "add",
    MUL = "mul",
    DIV = "div",
    MOD = "mod",
    EQL = "eql"
}
interface InstructionBase {
    op: Operation;
    var1: string;
}
interface InstructionInp extends InstructionBase {
    op: Operation.INP;
}
interface InstructionOther extends InstructionBase {
    op: Operation.ADD | Operation.MUL | Operation.DIV | Operation.MOD | Operation.EQL;
    var2: string;
}
type Instruction = InstructionInp | InstructionOther;

function parseInstructions(userInput: number, xAdd: number, yAdd: number, zShift: number, z: number): number {
    let outputZ = zShift === 1 ? z : Math.floor(z / 26);
    const x = (userInput === ((z % 26) + xAdd)) ? 0 : 1;
    if (x === 1) {
        outputZ = outputZ * 26 + (userInput + yAdd);
    }
    return outputZ;
}

//const prefixCache = new Map<string, number>();
//
//function getPrecomputedPrefix(userInputs: number[]): {z: number, next_i: number} {
//    for (let i = 7; i >= 0; --i) {
//        const cached = prefixCache.get(userInputs.slice(0, i).join(""));
//        if (cached !== undefined) {
//            return {z: cached, next_i: i + 1};
//        }
//    }
//    return {z: 0, next_i: 0};
//}
//
//function addPrecomputedPrefix(userInputs: number[], outputZ: number) {
//    prefixCache.set(userInputs.join(""), outputZ);
//}

function decreaseDigit(userInputs: number[], index: number) {
    while (index >= 0) {
        if (userInputs[index] === 1) {
            --index;
            continue;
        }
        --userInputs[index];
        for (let k = index + 1; k < 14; ++k) {
            userInputs[k] = 9;
        }
        break;
    }
}

function solution1() {
    console.time("Part 1");
    const input = parseInput();
    const xAdds = input.filter((val, index) => (index % 18) === 5).map((val) => Number((val as InstructionOther).var2))
    const yAdds = input.filter((val, index) => (index % 18) === 15).map((val) => Number((val as InstructionOther).var2))
    const zShifts = input.filter((val, index) => (index % 18) === 4).map((val) => Number((val as InstructionOther).var2))
    const maxZ = zShifts.map((val, i) => zShifts.slice(i).reduce((prev, cur) => prev * cur, 1));

    let logIndex = 0;
    const userInputs = "99999999999999".split("").map((val) => Number(val));
    console.time("Main cycle");
    while (userInputs.join("") !== "11111111111111") {
        let z = 0;
        let i = 0;
        for (; i < 14; ++i) {
            if (z >= maxZ[i]) {
                decreaseDigit(userInputs, i);
                break;
            }
            z = parseInstructions(
                userInputs[i],
                xAdds[i],
                yAdds[i],
                zShifts[i],
                z
            );
        }

        ++logIndex;
        if (logIndex > 100000000) {
            console.log("current check", Number(userInputs.join("")));
            logIndex = 0;
        }

        if (z === 0) {
            console.timeEnd("Part 1");
            return userInputs.join("");
        }

        decreaseDigit(userInputs, userInputs.length - 1);
    }
}

function increaseDigit(userInputs: number[], index: number) {
    while (index >= 0) {
        if (userInputs[index] === 9) {
            --index;
            continue;
        }
        ++userInputs[index];
        for (let k = index + 1; k < 14; ++k) {
            userInputs[k] = 1;
        }
        break;
    }
}

function solution2() {
    console.time("Part 2");
    const input = parseInput();
    const xAdds = input.filter((val, index) => (index % 18) === 5).map((val) => Number((val as InstructionOther).var2))
    const yAdds = input.filter((val, index) => (index % 18) === 15).map((val) => Number((val as InstructionOther).var2))
    const zShifts = input.filter((val, index) => (index % 18) === 4).map((val) => Number((val as InstructionOther).var2))
    const maxZ = zShifts.map((val, i) => zShifts.slice(i).reduce((prev, cur) => prev * cur, 1));

    let logIndex = 0;
    const userInputs = "11111111111111".split("").map((val) => Number(val));
    console.time("Main cycle");
    while (userInputs.join("") !== "99999999999999") {
        let z = 0;
        let i = 0;
        let skip = false;
        for (; i < 14; ++i) {
            if (z >= maxZ[i]) {
                increaseDigit(userInputs, i);
                skip = true;
                break;
            }
            z = parseInstructions(
                userInputs[i],
                xAdds[i],
                yAdds[i],
                zShifts[i],
                z
            );
        }

        //++logIndex;
        //if (logIndex > 10000000) {
        //    console.log("current check", Number(userInputs.join("")));
        //    logIndex = 0;
        //}

        if (skip) {
            continue;
        }

        if (z === 0) {
            console.timeEnd("Part 2");
            return userInputs.join("");
        }

        increaseDigit(userInputs, userInputs.length - 1);
    }
}

console.log(solution1());
console.log(solution2());
