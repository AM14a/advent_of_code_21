import * as fs from 'fs';

type InputRow = string;

function solution1(input: InputRow[]) {
    let gamma = 0;
    let eps = 0;
    const bits = input[0].length;
    for (let i = bits - 1; i >= 0; --i) {
        const ones: number = input.map((val) => parseInt(val, 2) & (1 << i)).filter((val) => val !== 0).length;
        const firstBitIsOne = ones > (input.length / 2);

        gamma = (gamma << 1) + (firstBitIsOne ? 1 : 0);
        eps = (eps << 1) + (firstBitIsOne ? 0 : 1);
    }
    return [gamma, eps];
}

function helper(cur: number[], bits: number, criterion: (n: number, arr: number[]) => boolean): number {
    for (let i = bits - 1; i >= 0 && cur.length > 1; --i) {
        const ones: number = cur.map((val) =>  val & (1 << i)).filter((val) => val !== 0).length;
        const firstBitIsOne = criterion(ones, cur);
        cur = cur.filter((val) => (firstBitIsOne ? (val & (1 << i)) !== 0 : (val & (1 << i)) === 0));
    }
    return cur[0];
}

function solution2(input: InputRow[]) {
    const bits = input[0].length;
    const gammaCriterion = (l, cur) => (l >= cur.length / 2);
    const gamma = helper(input.map((val) => parseInt(val, 2)), bits, gammaCriterion);

    const epsCriterion = (l, cur) => (l < cur.length / 2);
    const eps = helper(input.map((val) => parseInt(val, 2)), bits, epsCriterion);

    return [gamma, eps];
}

const file = fs.readFileSync('day03/input.txt', 'utf8');
const input = file.split('\n') as unknown as InputRow[];

const res1 = solution1(input);
console.log("1", res1, res1[0] * res1[1]);

const res2 = solution2(input);
console.log("2", res2, res2[0] * res2[1]);
