function main() {
    let containers = document.getElementsByClassName('game-cell');
    let containersArray = Array.from(containers);
    dragula(containersArray);

    let gameCells = document.getElementsByClassName('game-cell');
    for (let gameCell of gameCells) {
        gameCell.addEventListener('mouseover', handleCellHover);
        gameCell.addEventListener('mouseout', handleCellHover);
    }

}

function possibleMoves(hoveredCellId) { //TODO remove before merge
    return ['1:1'];
}

function handleCellHover(event) {
    const hoveredCell = this;
    const hoveredCellId = hoveredCell.id;
    // style actual cell
    console.log(hoveredCellId); // debug
    hoveredCell.classList.toggle('current-hover-cell');
    // style valid moves
    let validCellIds = possibleMoves(hoveredCellId);
    for (let validCellId of validCellIds) {
        let validCell = document.getElementById(validCellId);
        validCell.classList.toggle('current-valid-move');
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

main();