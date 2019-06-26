function main() {

    let containers = document.querySelectorAll('.game-cell');
    let containersArray = Array.from(containers);
    dragula(containersArray);

}

function winCheck() {
    let gameCells = document.getElementsByClassName('game-cell');
    let kingCount = 0;
    for (let cell of gameCells) {
        let actualAttribute = cell.getElementsByTagName('i')[0].getAttribute('class');
        if (actualAttribute && 'fas fa-chess-king' === actualAttribute.slice(0,17)) {
            kingCount ++;
        }
    }
    return (kingCount === 2);
}

function oppositeColor(color) {
    return color === 'white' ? 'black' : 'white'
}

function checkCellContent(cellId) {
    //return 'white', 'black', 'empty'
    let actualCell = document.getElementById(`${cellId}`);
    let actualAttribute = actualCell.getElementsByTagName('i')[0].getAttribute('class');
    if (actualAttribute === null) {
        return 'empty'
    } else {
        return actualAttribute.slice(-5,);
    }
}

function checkCellOnTable(cellId) {
    let column = parseInt(cellId.slice(0,2));
    let row = parseInt(cellId.slice(2,));
    return (column <= 7 && column >=0 && row <= 7 && row >0)
}

function moveType3(icon, cellId, actualColor) {
    let directions = {'king': [[1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],
                      'knight': [[-1, -2], [-1, 2], [1, -2], [1, 2], [-2, 1], [-2, -1], [2, -1], [2, 1]]};
    let actualDirections = directions[icon];
    let column = parseInt(cellId.slice(0,2));
    let row = parseInt(cellId.slice(2,));
    let result = [];
    for (let direction of actualDirections) {
        let checkedColumn = column + direction[0];
        let checkedRow = row + direction[1];
        let checkedCell = checkedColumn.toString() + ':' + checkedRow.toString();
        if (checkCellOnTable(checkedCell) && checkCellContent(checkedCell) !== actualColor) {
            result.push(checkedCell);
        }
    }
    return result
}

function moveTypePawn(cellId, actualColor) {
    let result = [];
    let pointer = actualColor === 'white' ? 1 : -1;
    let column = parseInt(cellId.slice(0,2));
    let row = parseInt(cellId.slice(2,));

    let actualDirections = [[0,1]];
    if (row in [1, 6]) {
        actualDirections.push([0,2]);
    }
    for (let direction of actualDirections) {
        let checkedColumn = column + direction[0]*pointer;
        let checkedRow = row + direction[1]*pointer;
        let checkedCell = checkedColumn.toString() + ':' + checkedRow.toString();
        if (checkCellOnTable(checkedCell) && checkCellContent(checkedCell) === 'empty') {
            result.push(checkedCell);
        }
    }

    actualDirections = [[1, 1], [1, -1]];
    for (let direction of actualDirections) {
        let checkedColumn = column + direction[0]*pointer;
        let checkedRow = row + direction[1]*pointer;
        let checkedCell = checkedColumn.toString() + ':' + checkedRow.toString();
        if (checkCellOnTable(checkedCell) && checkCellContent(checkedCell) === oppositeColor(actualColor)) {
            result.push(checkedCell);
        }
    }
    return result;
}

function possibleMoves(cellId) {
    let actualCell = document.getElementById(`${cellId}`);
    let actualAttribute = actualCell.getElementsByTagName('i')[0].getAttribute('class');
    if (actualAttribute === null) {return []}
    let actualIcon = actualAttribute.slice(13,17);
    let actualColor = actualAttribute.slice(-5,);
    switch (actualIcon) {
        case 'pawn':
            return moveTypePawn(cellId, actualColor);
        case 'rook':
            return rookMoves(actualColor);
        case 'bish':
            return bishopMoves(actualColor);
        case 'quee':
            return queenMoves(actualColor);
        case 'king':
            return moveType3('king', cellId, actualColor);
        case 'knig':
            return moveType3('knight', cellId, actualColor);
    }
}


main();