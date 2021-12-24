import * as fs from 'fs';

function parseInput(): [number, number] {
    const file = fs.readFileSync('day21/input.txt', 'utf8');
    return file.split('\n').map((val) => Number(val.split(" ")[4])) as [number, number];
}

interface Player {
    pos: number;
    score: number;
}

function addTurn(player: Player, die: number): Player {
    const addedPos = (player.pos + die) % 10;
    const newPos = addedPos === 0 ? 10 : addedPos;
    return {
        pos: newPos,
        score: player.score + newPos
    };
}

function solution1() {
    const input = parseInput();
    const players: [Player, Player] = [{pos: input[0], score: 0}, {pos: input[1], score: 0}]
    console.log(players);

    let turn = 1;
    let die = 0
    for (; turn < 1000; ++turn) {
        if (turn % 2 === 1) {
            players[0] = addTurn(players[0], 3 * die + 6);
            if (players[0].score >= 1000) {
                console.log("player 1", turn, players);
                return 3 * turn * players[1].score;
            }
        } else {
            players[1] = addTurn(players[1], 3 * die + 6);
            if (players[1].score >= 1000) {
                console.log("player 2", turn, players);
                return 3 * turn * players[0].score;
            }
        }
        die = die + 3;
    }
    return 0;
} //512442

function quantumRoll(addValue: (players: [Player, Player], turn: 0 | 1) => void, players: [Player, Player], playerIndex: 0 | 1) {
    let wins = 0;
    const player = players[playerIndex];
    for (let i = 1; i < 4; ++i) {
        for (let j = 1; j < 4; ++j) {
            for (let k = 1; k < 4; ++k) {
                const newPlayer = addTurn(player, i + j + k);
                if (newPlayer.score >= 21) {
                    wins += 1;
                    continue;
                }
                const newPlayers: [Player, Player] = (playerIndex === 0) ? [newPlayer, players[1]] : [players[0], newPlayer];
                addValue(newPlayers, playerIndex);
            }
        }
    }
    return wins;
}

function solution2() {
    const input = parseInput();
    const players: [Player, Player] = [{pos: input[0], score: 0}, {pos: input[1], score: 0}]
    console.log(players);

    const map = new Map<string, number>();
    const addVal = (players: [Player, Player], turn: 0 | 1, val: number) => {
        const key = JSON.stringify({players, turn});
        map.set(key, (map.get(key) ?? 0) + val)
    };
    const removeVal = (key: string) => {
        map.delete(key);
    }
    addVal(players, 1, 1);

    let firstWin = 0;
    let secondWin = 0;
    let mapArr = Array.from(map.entries());
    while (mapArr.length !== 0) {
        //console.log("next step", map, firstWin, secondWin, mapArr[0])
        const parsed = JSON.parse(mapArr[0][0]);
        const turn = (parsed.turn + 1) % 2
        const curPlayers = parsed.players;

        const occur = mapArr[0][1];
        const modAddVal = (players: [Player, Player], turn: 0 | 1) => addVal(players, turn, occur);
        if (turn % 2 === 0) {
            firstWin += occur * quantumRoll(modAddVal, curPlayers, 0);
        } else {
            secondWin += occur * quantumRoll(modAddVal, curPlayers, 1);
        }
        removeVal(mapArr[0][0]);
        mapArr = Array.from(map.entries());
    }
    console.log(map, firstWin, secondWin)
    return firstWin > secondWin ? firstWin : secondWin;
}

console.log(solution1());
console.log(solution2());

// 444356092776315 341960390180808
// 444356092776315 341960390180808