function main() {

    function containsCurrentPlayers(cell) {
        return cell.getElementsByTagName('i')[0].classList.contains(currentPlayer);
    }

    function handleCellHover() {
        deleteAllCellStyles();
        const hoveredCell = this;
        const hoveredCellId = hoveredCell.id;
        if (!containsCurrentPlayers(hoveredCell)) {
            return;
        }
        styleHoveredCell(hoveredCell);
        styleValidMoves(hoveredCellId);
    }

    function isMovable(el, source) {
        if (!el.classList.contains(currentPlayer)) {
            return false;
        }
        let cellId = source.id;
        let possibilities = possibleMoves(cellId).length;
        return (possibilities > 0);
    }
    var socket = io();
    function broadcastMove(el, target, source) {
        let movedIcon = source.getElementsByTagName('i')[0].getAttribute('class');
        let movedId = source.getAttribute('id');
        let targetId = target.getAttribute('id');

        let targetElements = target.getElementsByTagName('i');
        let iSourceTag = source.getElementsByTagName('i')[0];
        let iTargetTag = target.getElementsByTagName('i')[1];

        if (target === null) return;

        else move(movedIcon, targetElements, iSourceTag);

        let moveTo = JSON.stringify([movedIcon, movedId, targetId]);

        console.log(moveTo);
        socket.emit('move', moveTo);
    }

    function getMoveDataById(movedIcon, movedId, targetId) {
        let targetElements = document.getElementById(targetId).getElementsByTagName('i');
        let iSourceTag = document.getElementById(movedId).getElementsByTagName('i')[0];

        return [movedIcon, targetElements, iSourceTag]
    }

    function move(movedIcon, targetElements, iSourceTag) {
        targetElements[0].setAttribute('class', movedIcon);
        if (targetElements.length > 1) {
            targetElements[1].remove();
        }
        iSourceTag.removeAttribute('class');
        currentPlayer = oppositeColor(currentPlayer);
    }


    socket.on('test_event', function(msg){
        console.log(JSON.parse(msg));
        move(...getMoveDataById(...(JSON.parse(msg))));
    });




    let currentPlayer = 'white';

    let gameCells = document.getElementsByClassName('game-cell');
    let gameCellsArray = Array.from(gameCells);
    dragula(gameCellsArray, {
        moves: isMovable,
        accepts: isValidMove,
        copy: true
    }).on('drop', broadcastMove);

    for (let gameCell of gameCells) {
        $(gameCell ).mouseenter( handleCellHover );
    }
}

function deleteAllCellStyles() {
    let gameCells = document.getElementsByClassName('game-cell');
    for (let gameCell of gameCells) {
        gameCell.classList.remove('current-hover-cell')
    }
}

function isValidMove(el, target, source, sibling) {
    if (sibling !== null) {
        return false;
    }
    let validIds = possibleMoves(source.id);
    return validIds.includes(target.id);
}

function styleHoveredCell(hoveredCell) {
    hoveredCell.classList.toggle('current-hover-cell');
}

function styleValidMoves(hoveredCellId) {
    let validCellIds = possibleMoves(hoveredCellId);
    for (let validCellId of validCellIds) {
        let validCell = document.getElementById(validCellId);
        validCell.classList.toggle('current-hover-cell');
    }
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
    let actualAttribute = actualCell.getElementsByTagName('i')[0].classList;
    if (actualAttribute.contains('black')) {
        return 'black'
    } else if (actualAttribute.contains('white')) {
        return 'white'
    }
    return 'empty';
}

function checkCellOnTable(cellId) {
    let column = parseInt(cellId.slice(0,2));
    let row = parseInt(cellId.slice(2,));
    return (column <= 7 && column >=0 && row <= 7 && row >=0)
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
    if (row === 6 || row === 1)  {
        let checkedCell = column.toString() + ":" + (pointer+row).toString();
        if (checkCellContent(checkedCell) === 'empty') {
            actualDirections.push([0,2]);
        }
    }

    for (let direction of actualDirections) {
        let checkedColumn = column + direction[0]*pointer;
        let checkedRow = row + direction[1]*pointer;
        let checkedCell = checkedColumn.toString() + ':' + checkedRow.toString();
        if (checkCellOnTable(checkedCell) && checkCellContent(checkedCell) === 'empty') {
            result.push(checkedCell);
        }
    }

    actualDirections = [[1, 1], [-1, 1]];
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
    let actualAttribute = actualCell.getElementsByTagName('i')[0].classList;
    if (!actualAttribute.contains('fas')) {return []}
    let actualColor = (actualAttribute.contains('white')) ? 'white' : 'black';
    if (actualAttribute.contains('fa-chess-rook')) return type2Moves('rook', cellId, actualColor);
    else if (actualAttribute.contains('fa-chess-bishop')) return type2Moves('bishop', cellId, actualColor);
    else if (actualAttribute.contains('fa-chess-queen')) return type2Moves('queen', cellId, actualColor);
    else if (actualAttribute.contains('fa-chess-king')) return moveType3('king', cellId, actualColor);
    else if (actualAttribute.contains('fa-chess-knight')) return moveType3('knight', cellId, actualColor);
    else return moveTypePawn(cellId, actualColor);
}


function type2Moves(icon, cellId, actualColor ) {
    let actualCol = parseInt(cellId.slice(0, 2));
    let actualRow = parseInt(cellId.slice(2,));
    let directions = {
        'rook': [[0, 1], [0, -1], [1, 0], [-1, 0]],
        'bishop': [[1, -1], [-1, -1], [-1, 1], [1, 1]],
        'queen': [[0, 1], [0, -1], [1, 0], [-1, 0], [1, -1], [-1, -1], [-1, 1], [1, 1]]
    };
    let actualDirections = directions[icon];
    let result = [];
    let step = 1;
    let enemyColor = actualColor === 'white' ? 'black' : 'white';
    while (step < 8) {
        for (let direction of actualDirections) {
            let actualIndex = actualDirections.indexOf(direction);
            let checkedColumn = actualCol + direction[0] * step;
            let checkedRow = actualRow + direction[1] * step;
            let checkedCell = checkedColumn.toString() + ':' + checkedRow.toString();
            if (checkCellOnTable(checkedCell) && checkCellContent(checkedCell) === 'empty') {
                result.push(checkedCell);
            } else if(checkCellOnTable(checkedCell) && checkCellContent(checkedCell) === enemyColor){
                result.push(checkedCell);
                actualDirections.splice(actualIndex, 1, [0, 0]);
            } else
                actualDirections.splice(actualIndex, 1, [0, 0]);
        }step++;
    } return result
}


main();