import * as fs from 'fs';

function parseInput(): string[] {
    const file = fs.readFileSync('day18/input.txt', 'utf8');
    const input = file.split('\n');
    return input;
}

function matchNumber(str: string, startIndex: number | undefined = undefined): string {
    let kk = startIndex;
    while (!isNaN(Number(str[kk])) && kk < str.length) {
        ++kk;
    }
    return str.slice(startIndex, kk);
}

function explode(str: string): [string, number] {
    const stack: number[] = []; //index
    for (let i = 0; i < str.length; ++i) {
        if (str[i] === "[") {
            if (stack.length !== 3) {
                stack.push(i);
                continue;
            }

            const leftNumStr = matchNumber(str, i + 1);
            const left = Number(leftNumStr);

            if (isNaN(Number(str[i + leftNumStr.length + 2]))) {
                continue;
            }

            const rightNumStr = matchNumber(str, i + 2 + leftNumStr.length);
            const right = Number(rightNumStr);
            console.log("lr", i, " ", left, right)


            let leftNumStart = 0;
            let j = i - 1;
            for (; j >= 0; --j) {
                if (!isNaN(Number(str[j]))) {
                    let jj = j;
                    while (!isNaN(Number(str[jj])) && jj >= 0) {
                        --jj;
                    }
                    leftNumStart = jj + 1;
                    break;
                }
            }
            const leftNumber = Number(str.slice(leftNumStart, j + 1));

            let rightNumEnd = 0;
            let k = i + 5;
            for (; k < str.length; ++k) {
                if (!isNaN(Number(str[k]))) {
                    let kk = k;
                    while (!isNaN(Number(str[kk])) && kk < str.length) {
                        ++kk;
                    }
                    rightNumEnd = kk - 1;
                    break;
                }
            }
            const rightNumber = Number(str.slice(k, rightNumEnd + 1));
            //console.log(leftNumber, leftNumber + left, "--", rightNumber, rightNumber + right)

            const leftPart = (j >= 0 ? str.slice(0, leftNumStart) + String(leftNumber + left) : "");
            const middlePart = (str.slice(j + 1, k).replace(str.slice(i, i + 3 + leftNumStr.length + rightNumStr.length), "0"));
            const rightPart = (k < str.length ? String(rightNumber + right) + str.slice(rightNumEnd + 1) : "");

            //console.log("PARTS:\n", leftPart, "\n", middlePart, "\n", rightPart);
            let newStr = leftPart + middlePart + rightPart;

            console.log("explode", newStr);
            return [newStr, i];
        } else if (str[i] === "]") {
            stack.pop();
        }
    }
    return [str, str.length];
}
// [[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]
//

function split(str: string): [string, number] {
    for (let i = 0; i < str.length - 4; ++i) {
        if (!isNaN(Number(str[i]))) {
            if (!isNaN(Number(str[i + 1]))) {
                const numberStr = matchNumber(str, i);
                const number = Number(numberStr);
                const newStr = str.slice(0, i) + `[${Math.floor(number / 2)},${Math.ceil(number / 2)}]` + str.slice(i + numberStr.length);
                console.log("split", newStr)
                return [newStr, i];
            }
        }
    }
    return [str, str.length];
}

function reduce(str: string) {
    console.log(str);
    let newStrExp = explode(str); // not correct, the first action
    let newStrSpl = split(str); // not correct, the first action
    if (str !== newStrExp[0] || str !== newStrSpl[0]) {
        return newStrExp[1] < newStrSpl[1] ? reduce(newStrExp[0]) : reduce(newStrSpl[0]);
    }
    return str;
}

function add(str1: string, str2: string): string {
    return reduce(`[${str1},${str2}]`);
}

function calculateMagnitude(str: string): number {
    const res = 0;
    return res;
}

function solution1() {
    const input = parseInput();
    //console.log(reduce(input[0]))
    let val = input[0];
    for (let i = 1; i < input.length; ++i) {
        val = add(val, input[i]);
    }
    console.log(val);
    return calculateMagnitude(val);
}

function solution2() {
    const input = parseInput();
}

console.log(solution1());
//console.log(solution2());

reduce
[[[[4,0],[5,4]],[[7,0],[15,5]]],[10,[[0,[11,3]],[[6,3],[8,8]]]]]
explode
[[[[4,0],[5,4]],[[7,0],[15,5]]],[10,[[11,0],[[6,6],[8,8]]]]] 
first_index: 1664