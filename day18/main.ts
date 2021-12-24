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
    shift?: Shift;
}

function populateRightValue(str: any, val: number): any {
    if (typeof str === "number") {
        return str + val;
    }
    return [str[0], populateRightValue(str[1], val)];
}

function populateLeftValue(str: any, val: number): any {
    if (typeof str === "number") {
        return str + val;
    }
    return [populateLeftValue(str[0], val), str[1]];
}

function explode(str: any, stackLevel: number = 0): Transformation {
    if (typeof str === "number") {
        return {
            new_str: str,
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
                //console.log("      updated part", JSON.stringify(str), res, i, str[1], updatedRightPart)
                return {
                    new_str: [res.new_str, updatedRightPart],
                    shift: res.shift?.left ? {left: res.shift.left} : undefined
                };
            } else {
                let updatedLeftPart = str[0];
                if (res.shift?.left) {
                    updatedLeftPart = populateRightValue(updatedLeftPart, res.shift.left);
                }
                //console.log("    updated part", JSON.stringify(str), res, i, str[0], updatedLeftPart)
                return {
                    new_str: [updatedLeftPart, res.new_str],
                    shift: res.shift?.right ? {right: res.shift.right} : undefined
                };
            }
        }

        if (stackLevel < 3) {
            continue;
        }
        const left = str[i][0];
        const right = str[i][1];
        if (i === 0) {
            const updatedRightPart = populateLeftValue(str[1], right);
            return {
                new_str: [0, updatedRightPart],
                shift: {left}
            };
        } else if (i === 1) {
            const updatedLeftPart = populateRightValue(str[0], left);
            return {
                new_str: [updatedLeftPart, 0],
                shift: {right}
            };
        }
    }
    return {
        new_str: str,
    };
}

function split(str: any, stackLevel: number = 0): Transformation {
    if (typeof str === "number" ) {
        const replacement = str > 9 ? [Math.floor(str / 2), Math.ceil(str / 2)] : str;
        return {
            new_str: replacement,
        };
    }

    for (let i = 0; i < 2; ++i) {
        const val = split(str[i], stackLevel + 1);
        if (JSON.stringify(val.new_str) !== JSON.stringify(str[i])) {
            if (i === 0) {
                return {
                    new_str: [val.new_str, str[1]]
                }
            } else {
                return {
                    new_str: [str[0], val.new_str]
                }
            }
        }
    }
    return {
        new_str: str,
    };
}

function reduce(str: any) {
    //console.log("\n  reduce\n    ", JSON.stringify(str));
    let newStrExp = explode(str);
    if (JSON.stringify(str) !== JSON.stringify(newStrExp.new_str)) {
        //console.log("    explode\n    ", JSON.stringify(newStrExp.new_str));//, `\n    first_index: ${newStrExp.first_index}`);
        return reduce(newStrExp.new_str);
    }
    let newStrSpl = split(str);
    if (JSON.stringify(str) !== JSON.stringify(newStrSpl.new_str)) {
        //console.log("    split\n    ", JSON.stringify(newStrSpl.new_str));//, `\n    first_index: ${newStrSpl.first_index}`)
        return reduce(newStrSpl.new_str);
    }
    return str;
}


//function reduce1(str: any) {
//    console.log("\n  reduce\n    ", JSON.stringify(str));
//    let newStrExp = explode(str);
//    console.log("    explode\n    ", JSON.stringify(newStrExp.new_str), `\n    first_index: ${newStrExp.first_index}`);
//    let newStrSpl = split(str);
//    console.log("    split\n    ", JSON.stringify(newStrSpl.new_str), `\n    first_index: ${newStrSpl.first_index}`)
//    if (JSON.stringify(str) !== JSON.stringify(newStrExp.new_str) ||
//        JSON.stringify(str) !== JSON.stringify(newStrSpl.new_str)) {
//        return newStrExp.first_index < newStrSpl.first_index ? reduce(newStrExp.new_str) : reduce(newStrSpl.new_str);
//    }
//    return str;
//}

function add(str1: any, str2: any): any {
    //console.log("adding", JSON.stringify([str1, str2]))
    return reduce([str1, str2]);
}

function calculateMagnitude(str: any): number {
    if (typeof str === "number") {
        return str;
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
    let max = 0;
    for (let i = 0; i < input.length; ++i) {
        for (let j = 0; j < input.length; ++j) {
            if (j === i) {
                continue;
            }
            max = Math.max(max, calculateMagnitude(add(input[i], input[j])));
        }
    }
    return max;
}

console.log(solution1());
console.log(solution2());
