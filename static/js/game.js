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

function checkCell(cellId) {
    //return 'white', 'black', 'empty'
    let actualCell = document.getElementById(`${cellId}`);
    let actualAttribute = actualCell.getElementsByTagName('i')[0].getAttribute('class');
    if (actualAttribute === null) {
        return 'empty'
    } else {
        return actualAttribute.slice(-5,);
    }
}

function possibleMoves(cellId) {
    let actualCell = document.getElementById(`${cellId}`);
    let actualAttribute = actualCell.getElementsByTagName('i')[0].getAttribute('class');
    if (actualAttribute === null) {return []}
    let actualIcon = actualAttribute.slice(13,17);
    let actualColor = actualAttribute.slice(-5,);
    switch (actualIcon) {
        case 'pawn':
            return pawnMoves(actualColor);
        case 'rook':
            return rookMoves(actualColor);
        case 'bish':
            return bishopMoves(actualColor);
        case 'quee':
            return queenMoves(actualColor);
        case 'king':
            return kingMoves(actualColor);
        case 'knig':
            return knightMoves(actualColor);
    }
}


main();