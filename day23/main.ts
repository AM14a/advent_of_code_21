const fieldArray = [
    "0_2", "1_2", "2_2", "3_2", "4_2", "5_2", "6_2", "7_2", "8_2", "9_2", "10_2",
        "2_1", "2_0",
        "4_1", "4_0",
        "6_1", "6_0",
        "8_1", "8_0"
    ];
const fieldSet = new Set(fieldArray);

const initialVal = {
    a: ["2_1", "4_0"],
    b: ["6_1", "8_0"],
    c: ["4_1", "8_1"],
    d: ["2_0", "6_0"]
};

function solution1() {
    let inPlace = 0;
    while (inPlace < 8) {

    }
}

//function solution2() {
//    const input = parseInput();
//}

console.log(solution1());
console.log(solution2());
