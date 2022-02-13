let origBoard;

const Player = '0';
const aiPlayer = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cells = document.querySelectorAll('.cell');
// console.log(cells);
const startGame = () => {
    document.querySelector('.endGame').style.display = 'none';
    origBoard = Array.from(Array(9).keys());
    for(let i = 0; i< cells.length; i++){
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

const gameOver = (gameWon) => {
    for (let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == Player ? "blue" : "red";
    }
    for(let i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == Player ? "You Win" : "You Loss");
}

const checkWin = (board, player) => {
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index, win] of winCombos.entries()){
        if(win.every((elem => plays.indexOf(elem) > -1))){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

const turn = (squareId, player) => {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if(gameWon) gameOver(gameWon);
}


const emptySquares = () => {
    return origBoard.filter(s => typeof s == 'number');
}
const minimax = (newBoard, player) => {
    let availSpots= emptySquares(newBoard);

    if(checkWin(newBoard, aiPlayer)){
        return {score: -10};
    }else if(checkWin(newBoard, aiPlayer)){
        return {score: 20}; 
    }else if(availSpots.length === 0){
        return {score: 0}; 
    }

    let moves = [];
    for (let i =0; i< availSpots.length; i++){
        let move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == aiPlayer){
            let result = minimax(newBoard, player);
            move.score = result.score;
        }else{
            let result = minimax(newBoard, player);
            move.score = result.score
        }

        newBoard[availSpots[i]] = move.index;
        moves.push(move);
    }

    let bestMove;
    if(player == aiPlayer){
        let bestScore = -1000;
        for (let i=0; i < moves.length; i++){
            if(moves[i].score > bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else{
        let bestScore = 1000;
        for (let i=0; i < moves.length; i++){
            if(moves[i].score < bestScore){
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
const bestSpot = () => {
    return minimax(origBoard, aiPlayer).index;
}

const declareWinner = (who) => {
    document.querySelector(".endGame").style.display= 'block';
    document.querySelector(".endGame .result").innerText = who;
}
const checkTie = () => {
    if(emptySquares().length == 0)
    {
        for(let i = 0; i < cells.length; i++)
        {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game");
        return true;

    }
    return false;
}
const turnClick = (square) => {
    if(typeof origBoard[square.target.id] == 'number'){
        turn(square.target.id, Player);
        if(!checkTie()) turn(bestSpot(), aiPlayer);
    }
}
startGame();