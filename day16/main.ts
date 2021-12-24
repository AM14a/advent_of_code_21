import * as fs from 'fs';

function parseInput() {
    const file = fs.readFileSync('day16/input.txt', 'utf8');
    return file;
}

interface Packet {
    packet: string;
    version: number;
    type: number;
    total_version: number;
    value: number;
}

function parseNumber(binary: string): Packet {
    const version = parseInt(binary.slice(0, 3), 2);
    let curIndex = 6;
    let stop = false;
    let number = "";
    while (!stop) {
        stop = binary.slice(curIndex, curIndex + 1) === '0';
        number =  number + binary.slice(curIndex + 1, curIndex + 5);
        curIndex += 5;
    }
    return {
        version,
        type: 4,
        packet: binary.slice(0, curIndex),
        total_version: version,
        value: parseInt(number, 2)
    };
}

function calculateValue(type: number, packets: Packet[]) {
    switch (type) {
        case 0:
            return packets.reduce((prev, cur) => prev + cur.value, 0);
        case 1:
            return packets.reduce((prev, cur) => prev * cur.value, 1);
        case 2:
            return Math.min(...packets.map((val) => val.value));
        case 3:
            return Math.max(...packets.map((val) => val.value));
        case 5:
            return packets[0].value > packets[1].value ? 1 : 0;
        case 6:
            return packets[0].value < packets[1].value ? 1 : 0;
        case 7:
            return packets[0].value === packets[1].value ? 1 : 0;
    }
}

function parseOperator(binary: string): Packet {
    const version = parseInt(binary.slice(0, 3), 2);
    const type = parseInt(binary.slice(3, 6), 2);
    const i = parseInt(binary.slice(6, 7));
    if (i === 0) {
        const totalLength = parseInt(binary.slice(7, 22), 2);
        //console.log("I = 0, total length", totalLength);
        const packets: Packet[] = [];
        let curLength = 0;
        while (curLength < totalLength) {
            const packet = parsePacket(binary.slice(22 + curLength));
            packets.push(packet);
            //console.log(packet);
            curLength += packet.packet.length
        }

        return {
            version,
            type,
            packet: binary.slice(0, 22 + curLength),
            total_version: version + packets.reduce((prev, cur) => prev + cur.total_version, 0),
            value: calculateValue(type, packets)
        };
    } else {
        const totalNumber = parseInt(binary.slice(7, 18), 2);
        //console.log("I = 1, total number", totalNumber);
        const packets: Packet[] = [];
        let curLength = 0;
        for (let index = 0; index < totalNumber; ++index) {
            const packet = parsePacket(binary.slice(18 + curLength));
            //console.log(packet);
            packets.push(packet);
            curLength += packet.packet.length
        }
        return {
            version,
            type,
            packet: binary.slice(0, 18 + curLength),
            total_version: version + packets.reduce((prev, cur) => prev + cur.total_version, 0),
            value: calculateValue(type, packets)
        };
    }
}

function parsePacket(binary: string): Packet {
    const type = parseInt(binary.slice(3, 6), 2);
    if (type === 4) {
        console.log("number", type);
        return parseNumber(binary);
    } else {
        console.log("operator", type);
        return parseOperator(binary);
    }
}

function solution1() {
    const input = parseInput();
    const binary = input.split('').map(i =>
        parseInt(i, 16).toString(2).padStart(4, '0')).join('');
    //(parseInt(input, 16).toString(2)).padStart(8 * input.length, "0");
    console.log(input, binary);
    const res = parsePacket(binary);
    console.log("result", res);
    return res.total_version;
}

function solution2() {
    const input = parseInput();
    const binary = input.split('').map(i =>
        parseInt(i, 16).toString(2).padStart(4, '0')).join('');
    //(parseInt(input, 16).toString(2)).padStart(8 * input.length, "0");
    console.log("\n\n", input, binary);
    const res = parsePacket(binary);
    console.log("RESULT", res);
    return res.value;
}

console.log(solution1());
console.log(solution2());
