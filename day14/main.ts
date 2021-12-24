import * as fs from 'fs';

function parseInput(): {source: string, rules: Map<string, string>} {
    const file = fs.readFileSync('day14/input.txt', 'utf8');
    const input = file.split('\n\n');

    const source = input[0];
    const rulesMap = new Map<string, string>();
    input[1]
        .split("\n")
        .map((val) => val.split(" -> ") as [string, string])
        .forEach((rule) => rulesMap.set(rule[0], rule[1]));

    return {source, rules: rulesMap};
}

function solution1() {
    const input = parseInput();

    let source = input.source;
    const rules = input.rules;
    for (let i = 0; i < 10; ++i) {
        const sourceL = source.length
        for (let i  = sourceL - 2; i >= 0; --i) {
            const newCh = rules.get(source[i] + source[i + 1]);
            source = source.slice(0, i + 1) + newCh + source.slice(i + 1);
        }
        //console.log(source);
    }
    const map = new Map<string, number>();
    source.split("").forEach((ch) => map.set(ch, (map.get(ch) ?? 0) + 1));
    const values = Array.from(map).map((val) => val[1]).sort((a, b) => a - b);
    return values[values.length - 1] - values[0];
}

function solution2() {
    const input = parseInput();

    const source = input.source;
    const firstCh = source[0];
    const lastCh = source[source.length - 1];
    const rules = input.rules;
    let pairs = new Map<string, number>();
    for (let i  = source.length - 2; i >= 0; --i) {
        const pair = source[i] + source[i + 1];
        pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
    }

    for (let i = 0; i < 40; ++i) {
        const newPairs = new Map<string, number>();
        for (const pairCount of Array.from(pairs)) {
            const pair = pairCount[0];
            const count = pairCount[1];

            const newCh = rules.get(pair);
            const first = pair[0] + newCh;
            const second = newCh + pair[1];
            newPairs.set(first, (newPairs.get(first) ?? 0) + count);
            newPairs.set(second, (newPairs.get(second) ?? 0) + count);
        }
        pairs = newPairs;
        //console.log(pairs);
    }


    const map = new Map<string, number>();
    for (const pairCount of Array.from(pairs)) {
        const pair = pairCount[0];
        const count = pairCount[1];
        map.set(pair[0], (map.get(pair[0]) ?? 0) + count);
        map.set(pair[1], (map.get(pair[1]) ?? 0) + count);
    }

    const keys = Array.from(map).map((val) => val[0]);
    for (const key of keys) {
        if (key === firstCh || key === lastCh) {
            //console.log(firstCh, lastCh, key, map.get(key))
            map.set(key, (map.get(key) + 1) / 2);
        } else {
            map.set(key, (map.get(key)) / 2);
        }
    }
    const values = Array.from(map).map((val) => val[1]).sort((a, b) => a - b);
    console.log(values);
    return values[values.length - 1] - values[0];
}

console.log(solution1());
console.log(solution2());
