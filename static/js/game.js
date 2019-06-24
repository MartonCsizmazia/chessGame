function main() {
    let trialCell = document.getElementById('icon-0:0');
    trialCell.setAttribute('class', 'fas fa-chess-king');

    let containers = document.querySelectorAll('.game-cell');
    let containersArray = Array.from(containers);
    dragula(containersArray);

}

main();