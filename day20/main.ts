import * as fs from 'fs';

interface Input {
    algo: number[];
    input_image: number[][];
}

function parseInput(): Input {
    const file = fs.readFileSync('day20/input.txt', 'utf8');
    const input = file.split('\n\n');
    const algo = input[0].split("").map((val) => val === "." ? 0 : 1);
    const image = input[1].split("\n").map((line) =>
        line.split("").map((val) => val === "." ? 0 : 1)
    );

    const l = image.length + 6;
    const w = image[0].length + 6;
    const extendedImage: number[][] = [];
    for (let i = 0; i < l; ++i) {
        const extendedLine: number[] = [];
        for (let j = 0; j < w; ++j) {
            if (i < 3 || i >= image.length + 3 || j < 3 || j >= image[0].length + 3) {
                extendedLine.push(0);
                continue;
            }
            extendedLine.push(image[i - 3][j - 3]);
        }
        extendedImage.push(extendedLine);
    }
    return {algo, input_image: extendedImage};
}

function transform(algo: number[], image: number[][], borderIs1: number): number[][] {
    const newImage = [...image.map((v) => [...v])];
    for (let i = 1; i < image.length - 1; ++i) {
        newImage[i][0] = borderIs1;
        newImage[i][image[0].length - 1] = borderIs1;
    }
    for (let j = 0; j < image[0].length; ++j) {
        newImage[0][j] = borderIs1;
        newImage[image.length - 1][j] = borderIs1;
    }

    for (let i = 1; i < image.length - 1; ++i) {
        for (let j = 1; j < image[0].length - 1; ++j) {
            const newVal = parseInt([
                ...image[i - 1].slice(j - 1, j + 2),
                ...image[i].slice(j - 1, j + 2),
                ...image[i + 1].slice(j - 1, j + 2)
            ].join(""), 2);
            //console.log("vvvv", i, j, newVal)
            newImage[i][j] = algo[newVal];
        }
    }
    //console.log("New image");
    //console.log(newImage.map((val) => val.map((v) => v === 0 ? ".": "#").join("")).join("\n"))
    return newImage;
}

function solution1() {
    const input = parseInput();
    //console.log("INPUT");
    //console.log(input.input_image.map((val) => val.map((v) => v === 0 ? ".": "#").join("")).join("\n"))
    const first = input.algo[0];
    const second = first === 0 ? 0 : input.algo[input.algo.length - 1];
    const newImage = transform(input.algo, transform(input.algo, input.input_image, first), second);

    let lights = 0;
    for (let i = 0; i < newImage.length; ++i) {
        for (let j = 0; j < newImage[0].length; ++j) {
            lights += newImage[i][j];
        }
    }
    return lights;
}

function parseInput2(): Input {
    const file = fs.readFileSync('day20/input.txt', 'utf8');
    const input = file.split('\n\n');
    const algo = input[0].split("").map((val) => val === "." ? 0 : 1);
    const image = input[1].split("\n").map((line) =>
        line.split("").map((val) => val === "." ? 0 : 1)
    );

    const l = image.length + 120;
    const w = image[0].length + 120;
    const extendedImage: number[][] = [];
    for (let i = 0; i < l; ++i) {
        const extendedLine: number[] = [];
        for (let j = 0; j < w; ++j) {
            if (i < 60 || i >= image.length + 60 || j < 60 || j >= image[0].length + 60) {
                extendedLine.push(0);
                continue;
            }
            extendedLine.push(image[i - 60][j - 60]);
        }
        extendedImage.push(extendedLine);
    }
    return {algo, input_image: extendedImage};
}

function solution2() {
    const input = parseInput2(); // TODO parse input + 60
    //console.log("INPUT");
    //console.log(input.input_image.map((val) => val.map((v) => v === 0 ? ".": "#").join("")).join("\n"))

    let curImage = input.input_image
    let cur = input.algo[0];
    for (let i = 0; i < 50; ++i) {
        curImage = transform(input.algo, curImage, cur);
        cur = (cur === 0) ? input.algo[0] : input.algo[input.algo.length - 1];
    }

    let lights = 0;
    for (let i = 0; i < curImage.length; ++i) {
        for (let j = 0; j < curImage[0].length; ++j) {
            lights += curImage[i][j];
        }
    }
    return lights;
}

console.log(solution1());
console.log(solution2());
