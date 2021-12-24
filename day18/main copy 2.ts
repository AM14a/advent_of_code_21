import * as fs from 'fs';

function parseInput() {
    const file = fs.readFileSync('day18/input.txt', 'utf8');
    const input = file.split('\n');
    return input.map((line) => JSON.parse(line));
}

interface Shift {
    right?: number;
    left?: number;
}

interface Transformation {
    new_str: any;
    first_index: number;
    shift?: Shift;
}

function populateRightValue(str: any, val: number): any {
    if (typeof str === "number") {
        return str + val;
    }
    return [str[0], populateRightValue(str[str.length - 1], val)];
}

function populateLeftValue(str: any, val: number): any {
    if (typeof str === "number") {
        return str + val;
    }
    return [populateRightValue(str[0], val), str[1]];
}

function explode(str: any, stackLevel: number = 0): Transformation {
    if (typeof str === "number") {
        return {
            new_str: str,
            first_index: 0
        };
    }

    if (str.length > 2) {
        console.log("ACHTUNG", JSON.stringify(str));
    }

    for (let i = 0; i < 2; ++i) {
        if (typeof str[i] === "number") {
            continue;
        }

        if (typeof str[i][0] !== "number" || typeof str[i][1] !== "number") {
            const res = explode(str[i], stackLevel + 1);
            if (JSON.stringify(res.new_str) === JSON.stringify(str[i])) {
                continue;
            }
            if (i === 0) {
                let updatedRightPart = str[1];
                if (res.shift?.right) {
                    updatedRightPart = populateLeftValue(updatedRightPart, res.shift.right);
                }
                //console.log("updated part", i, str[1], updatedRightPart)
                return {
                    new_str: [res.new_str, updatedRightPart],
                    first_index: i * Math.pow(2, 4 - stackLevel) + res.first_index
                };
            } else {
                let updatedLeftPart = str[0];
                if (res.shift?.left) {
                    updatedLeftPart = populateRightValue(updatedLeftPart, res.shift.left);
                }
                //console.log("updated part", i, str[0], updatedLeftPart)
                return {
                    new_str: [updatedLeftPart, res.new_str],
                    first_index: i * Math.pow(2, 4 - stackLevel) + res.first_index
                };
            }
        }

        if (stackLevel < 2) {
            continue;
        }

        const left = str[i][0];
        const right = str[i][1];
        if (i === 0) {
            const updatedRightPart = populateLeftValue(str[1], right);
            return {
                new_str: [0, updatedRightPart],
                first_index: i * Math.pow(2, 4 - stackLevel),
                shift: {left}
            };
        } else if (i === 1) {
            const updatedLeftPart = populateRightValue(str[0], left);
            return {
                new_str: [updatedLeftPart, 0],
                first_index: i * Math.pow(2, 4 - stackLevel),
                shift: {right}
            };
        }
    }
    return {
        new_str: str,
        first_index: str.length * Math.pow(2, 4 - stackLevel)
    };
}

function split(str: any, stackLevel: number = 0): Transformation {
    if (typeof str === "number" ) {
        const replacement = str > 9 ? [Math.floor(str / 2), Math.ceil(str / 2)] : str;
        return {
            new_str: replacement,
            first_index: 0
        };
    }

    for (let i = 0; i < 2; ++i) {
        const val = split(str[i], stackLevel + 1);
        if (JSON.stringify(val.new_str) !== JSON.stringify(str[i])) {
            if (i === 0) {
                return {
                    new_str: [val.new_str, str[1]],
                    first_index: i * Math.pow(2, 4 - stackLevel) + val.first_index
                }
            } else {
                return {
                    new_str: [str[0], val.new_str],
                    first_index: i * Math.pow(2, 4 - stackLevel) + val.first_index
                }
            }
        }
    }
    return {
        new_str: str,
        first_index: str.length * Math.pow(2, 4 - stackLevel)
    };
}

function reduce(str: any) {
    console.log("reduce", JSON.stringify(str));
    let newStrExp = explode(str);
    console.log("  explode", JSON.stringify(newStrExp))
    let newStrSpl = split(str);
    console.log("  split", JSON.stringify(newStrSpl))
    if (JSON.stringify(str) !== JSON.stringify(newStrExp.new_str) ||
        JSON.stringify(str) !== JSON.stringify(newStrSpl.new_str)) {
        //console.log("update", JSON.stringify(str), JSON.stringify(newStrExp.new_str), JSON.stringify(newStrSpl.new_str),
        //    JSON.stringify(str) !== JSON.stringify(newStrExp.new_str),
        //    JSON.stringify(str) !== JSON.stringify(newStrSpl.new_str)
        //);
        return newStrExp.first_index < newStrSpl.first_index ? reduce(newStrExp.new_str) : reduce(newStrSpl.new_str);
    }
    return str;
}

function add(str1: any, str2: any): any {
    console.log("adding", JSON.stringify([str1, str2]))
    return reduce([str1, str2]);
}

function calculateMagnitude(str: any): number {
    if (typeof str === "string") {
        return Number(str);
    }
    let res = 0;
    for (let i = 0; i < str.length; ++i) {
        res += (i === 0 ? 3 : 2) * calculateMagnitude(str[i]);
    }
    return res;
}

function solution1() {
    const input = parseInput();
    let val = input[0];
    for (let i = 1; i < input.length; ++i) {
        val = add(val, input[i]);
    }
    console.log(JSON.stringify(val));
    return calculateMagnitude(val);
}

function solution2() {
    const input = parseInput();
}

console.log(solution1());
//console.log(solution2());
