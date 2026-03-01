import { describe, expect, test } from 'vitest';
import { newGameFactory, nextGame } from './2048';
import type { Tiles } from './2048';

function numberOfTiles(tiles: Tiles, cnt: number) {
    const nonEmptyTiles = tiles.flatMap((row, x) => {
        return row.reduce((acc, tile, y) => (tile > 0 ? [...acc, [x, y]] : acc), []);
    });

    expect(nonEmptyTiles).to.have.length(cnt);
    expect(
        nonEmptyTiles.every(
            (coord) => tiles[coord[0]][coord[1]] === 4 || tiles[coord[0]][coord[1]] === 2
        )
    ).to.be.true;
}

export function getColumn(tiles: Tiles, column: number): number[] {
    return tiles.map((row) => row[column]);
}

function gameFactory(tiles: Tiles, score = 0) {
    return {
        tiles,
        won: false,
        play: true,
        score
    };
}

describe('board setup', function () {
    test('the game begins with 4 by 4 matrix with two tiles of either 2 or 4, won false, play true', function () {
        const { tiles, score, won, play } = newGameFactory();
        expect(won).to.be.false;
        expect(play).to.be.true;
        expect(score).to.equal(0);
        expect(tiles).toHaveLength(4);
        expect(tiles.every((row) => row.length === 4)).to.be.true;
        expect(
            tiles.flatMap((row) => row).every((tile) => tile === 0 || tile === 2 || tile === 4)
        ).toBeTruthy();
        numberOfTiles(tiles, 2);
    });

    test('a two (90%) or a four (10%) appears in a random empty space after each turn', function () {
        const game = nextGame(newGameFactory(), 'down');
        if (game.score > 0) {
            //bit of a hack, but sometimes tiles merge on next
            numberOfTiles(game.tiles, 2);
        } else {
            numberOfTiles(game.tiles, 3);
        }
    });
});

describe('each tile moves as far as possible in the direction of the move', function () {
    test('left', function () {
        const tiles: Tiles = [
            [1, 0, 0, 0],
            [2, 1, 0, 0],
            [2, 0, 1, 0],
            [0, 2, 0, 1]
        ];
        const game = nextGame(gameFactory(tiles), 'left');
        // cannot match entire matrix, because random new tiles my be inserted
        expect(getColumn(game.tiles, 0)).to.deep.equal([1, 2, 2, 2]);
        expect(getColumn(game.tiles, 1).slice(1)).to.deep.equal([1, 1, 1]);
    });

    test('right', function () {
        const tiles: Tiles = [
            [0, 0, 0, 1],
            [0, 0, 1, 2],
            [0, 1, 0, 2],
            [1, 0, 2, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'right');
        expect(getColumn(game.tiles, 3)).to.deep.equal([1, 2, 2, 2]);
        expect(getColumn(game.tiles, 2).slice(1)).to.deep.equal([1, 1, 1]);
    });

    test('up', function () {
        const tiles: Tiles = [
            [1, 2, 2, 0],
            [0, 1, 0, 2],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        const game = nextGame(gameFactory(tiles), 'up');
        expect(game.tiles[0]).to.deep.equal([1, 2, 2, 2]);
        expect(game.tiles[1].slice(1)).to.deep.equal([1, 1, 1]);
    });

    test('down', function () {
        const tiles: Tiles = [
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [0, 1, 0, 2],
            [1, 2, 2, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.tiles[3]).to.deep.equal([1, 2, 2, 2]);
        expect(game.tiles[2].slice(1)).to.deep.equal([1, 1, 1]);
    });
});

describe('mergin', function () {
    test('if two tiles of the same number collide they will merge into a tile with the total value of both', function () {
        const tiles: Tiles = [
            [0, 0, 0, 1],
            [0, 0, 1, 0],
            [1, 1, 0, 1],
            [0, 1, 1, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.tiles[3]).to.deep.equal([1, 2, 2, 2]);
    });
    test('the resulting tile cannot merge again', function () {
        const tiles: Tiles = [
            [1, 2, 0, 1],
            [0, 0, 1, 1],
            [0, 1, 0, 2],
            [0, 1, 1, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.tiles[2][1]).to.equal(2);
        expect(game.tiles[2][3]).to.equal(2);
        expect(game.tiles[3]).to.deep.equal([1, 2, 2, 2]);
    });

    test('if three tiles with the same value slide together, only the two tiles farthest along the direction will combine', function () {
        const tiles: Tiles = [
            [0, 1, 1, 1],
            [1, 0, 1, 1],
            [1, 1, 0, 1],
            [0, 1, 1, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.tiles[2].slice(1)).to.deep.equal([1, 1, 1]);
        expect(game.tiles[3]).to.deep.equal([2, 2, 2, 2]);
    });

    test('if four tiles with the same value collide, the first and the last two will combine', function () {
        const tiles: Tiles = [
            [0, 2, 1, 1],
            [1, 2, 1, 1],
            [1, 2, 0, 1],
            [0, 2, 1, 1]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.tiles[2].slice(1)).to.deep.equal([4, 1, 2]);
        expect(game.tiles[3]).to.deep.equal([2, 4, 2, 2]);
    });
});

describe('winning', function () {
    test('score should increases whenever two tile combine by the value of the new tile', function () {
        const tiles: Tiles = [
            [0, 2, 1, 1],
            [1, 2, 1, 1],
            [1, 2, 0, 1],
            [0, 2, 1, 1]
        ];
        const game = nextGame(gameFactory(tiles, 10), 'down');
        expect(game.score).to.equal(26);
    });

    test('the game is won when a value of 2048 appears on the board', function () {
        const tiles: Tiles = [
            [0, 2, 1, 0],
            [1, 2, 1, 1024],
            [1, 2, 0, 1024],
            [0, 2, 1, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.won).to.toBeTruthy();
    });

    test('the game is won when a value of 2048 appears on the board', function () {
        const tiles: Tiles = [
            [0, 2, 1, 512],
            [1, 2, 1, 512],
            [1, 2, 0, 512],
            [0, 2, 1, 512]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.won).to.toBeFalsy();
    });

    test('players can continue playing after winning', function () {
        const tiles: Tiles = [
            [0, 2, 1, 0],
            [1, 2, 1, 1024],
            [1, 2, 0, 1024],
            [0, 2, 1, 0]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.won).toBeTruthy();
        expect(game.play).toBeTruthy();
    });

    test('when there are no empty places and no adjacent tiles with the same value, the game ends', function () {
        const tiles: Tiles = [
            [1, 2, 1, 2],
            [2, 1, 2, 1],
            [1, 2, 1, 2],
            [2, 1, 2, 1]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.play).toBeFalsy();
    });

    test('when there are no empty places, but there is a horizontal move, game does not end', function () {
        const tiles: Tiles = [
            [1, 2, 2, 1],
            [2, 1, 3, 4],
            [1, 2, 1, 2],
            [2, 1, 2, 1]
        ];
        const game = nextGame(gameFactory(tiles), 'down');
        expect(game.play).toBeTruthy();
    });

    test('when there are no empty places, but there is a vertical move, game does not end', function () {
        const tiles: Tiles = [
            [1, 4, 2, 1],
            [2, 1, 2, 3],
            [1, 2, 1, 2],
            [2, 1, 2, 1]
        ];
        const game = nextGame(gameFactory(tiles), 'left');
        expect(game.play).toBeTruthy();
    });
});
