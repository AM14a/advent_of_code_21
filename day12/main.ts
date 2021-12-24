import * as fs from 'fs';

type Graph = Map<string, string[]>;

function parseInput() {
    const file = fs.readFileSync('day12/input.txt', 'utf8');
    const input = file.split('\n');
    const graph: Graph = new Map();

    input.forEach((line) => {
        const vs = line.split("-");
        const a = graph.get(vs[0]);
        if (a === undefined) {
            graph.set(vs[0], [vs[1]]);
        } else {
            a.push(vs[1]);
        }

        const b = graph.get(vs[1]);
        if (b === undefined) {
            graph.set(vs[1], [vs[0]]);
        } else {
            b.push(vs[0]);
        }
    });
    return graph;
}

const START = "start";
const END = "end";

const isVisited = (a: string, visited: Set<string>) => visited.has(a);
const visit = (a: string, visited: Set<string>) => {
    if (a.toLowerCase() === a) {
        visited.add(a);
    }
}

let paths = 0;
function searchPath(graph: Graph, stack: string[], visited: Set<string>) {
    const v = stack[stack.length - 1];
    if (v === END) {
        //console.log("\nEND", stack, "\n");
        paths += 1;
        return;
    }

    const copy = new Set(visited);

    visit(v, copy);
    const neighbours = graph.get(v);
    //console.log(v, stack);
    for (const nv of neighbours) {
        if (!isVisited(nv, copy)) {
            const copyStack = [...stack, nv];
            searchPath(graph, copyStack, copy);
        }
    }
}

function solution1() {
    const graph = parseInput();
    const visited = new Set<string>();
    searchPath(graph, [START], visited);
    return paths;
}

const isVisited2 = (a: string, visited: Map<string, number>) => {
    const val = visited.get(a) ?? 0;
    if (val === 0) {
        return false;
    }
    if (a === START || a === END || val > 1) {
        return true;
    }
    const usedTwice = visited.get("USED_TWICE") ?? 0;
    return usedTwice ? true : false;
};

const visit2 = (a: string, visited: Map<string, number>) => {
    if (a.toLowerCase() === a) {
        const cur = (visited.get(a) ?? 0);
        if (cur > 0) {
            visited.set("USED_TWICE", 1);
        }
        visited.set(a, cur + 1);
    }
}

let paths2 = 0;
function searchPath2(graph: Graph, stack: string[], visited: Map<string, number>) {
    const v = stack[stack.length - 1];
    if (v === END) {
        //console.log("END", stack, "\n");
        paths2 += 1;
        return;
    }

    const copy = new Map(visited);

    visit2(v, copy);
    const neighbours = graph.get(v);
    //console.log(v, stack, copy);
    for (const nv of neighbours) {
        if (!isVisited2(nv, copy)) {
            const copyStack = [...stack, nv];
            searchPath2(graph, copyStack, copy);
        }
    }
}


function solution2() {
    const graph = parseInput();
    console.log(graph);
    const visited = new Map<string, number>();
    searchPath2(graph, [START], visited);
    return paths2;
}

console.log(solution1());
console.log(solution2());
