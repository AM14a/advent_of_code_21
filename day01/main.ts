import * as fs from 'fs';

function solution1(numbers: number[]) {
    let count = 0;
    for (let i = 1; i < numbers.length; ++i) {
        if (numbers[i] > numbers[i - 1]) {
            ++count;
        }
    }
    return count;
}

function solution2(numbers: number[]) {
    let count = 0;
    let prevWindow = numbers[0] + numbers[1] + numbers[2];
    for (let i = 1; i < numbers.length - 2; ++i) {
        const curWindow = prevWindow + numbers[i + 2] - numbers[i - 1]
        if (curWindow > prevWindow) {
            ++count;
        }
        prevWindow = curWindow;
    }
    return count;
}

const file = fs.readFileSync('day01/input.txt', 'utf8');
const numbers: number[] = file.split('\n').map((val) => Number(val)) as unknown as number[];

console.log(solution1(numbers));
console.log(solution2(numbers));
