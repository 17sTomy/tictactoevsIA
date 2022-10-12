const GAME_BOARD = document.querySelector(".game-container"),
    $BTN_RESET = document.querySelector(".game-restart"),
    NOTIFICATION = document.querySelector(".game-notification"),
    GAME_STATUS = ["", "", "", "", "", "", "", "", ""],
    WINNINGS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

let currentPlayer = "X",
    gameActive = true,
    draw = false,
    lockBoard = false,
    collocated


const mixArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let temporal = array[i];
        array[i] = array[randomIndex];
        array[randomIndex] = temporal;
    }
}

const play = position => {
    GAME_STATUS[position] = currentPlayer
    GAME_BOARD.children[position].textContent = currentPlayer
    checkWinner()
    lockBoard = false
    collocated = true
}

const generateRandomPosition = () => {
    randomPosition = Math.floor(Math.random() * 9)
    while (GAME_STATUS[randomPosition] !== "") {
        randomPosition = Math.floor(Math.random() * 9)
    }
    play(randomPosition)
    return
}

const checkPlaySecondOption = (chance) => {
    const chances = WINNINGS[chance]
    let position1 = chances[0],
        position2 = chances[1],
        position3 = chances[2]
    
    //Si tiene dos opciones libres, elige una
    if (GAME_STATUS[position1] === "O" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === ""){
        play(position2)
        return
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "O" && GAME_STATUS[position3] === ""){
        play(position1)
        return
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === "O"){
        play(position2)
        return
    }
}

const checkPlay = chance => {
    const chances = WINNINGS[chance]
    if (chances === undefined) {
        generateRandomPosition()
        return
    }
    let position1 = chances[0],
        position2 = chances[1],
        position3 = chances[2]
    
    //Oportunidades para ganar la partida
    if (GAME_STATUS[position1] === "O" && GAME_STATUS[position2] === "O" && GAME_STATUS[position3] === ""){
        play(position3)
        return
    }else if (GAME_STATUS[position1] === "O" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === "O"){
        play(position2)
        return
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "O" && GAME_STATUS[position3] === "O"){
        play(position1)
        return
    }

    //Oportunidades para no perder la partida
    else if (GAME_STATUS[position1] === "X" && GAME_STATUS[position2] === "X" && GAME_STATUS[position3] === ""){
        play(position3)
        return
    }else if (GAME_STATUS[position1] === "X" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === "X"){
        play(position2)
        return
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "X" && GAME_STATUS[position3] === "X"){
        play(position1)
        return
    }

    //Siempre colocarse en el medio si está desocupado
    else if (GAME_STATUS.includes("X") && !GAME_STATUS.includes("O") && GAME_STATUS[4] !== "X"){
        play(4)
        return
    }

    //Si el usuario se coloca en el medio, ponerse en una posicion random
    else if (GAME_STATUS.includes("X") && !GAME_STATUS.includes("O") && GAME_STATUS[4] === "X"){
        generateRandomPosition()
        return
    }
}

const IAgame = () => {
    collocated = false
    let i = 0
    while (!collocated && i <= WINNINGS.length){
        checkPlay(i)
        i++
    }    	

    j = 0
    while (!collocated && j <= WINNINGS.length){
        checkPlaySecondOption(j)
        j++
    }
}

const showMessagge = currentPlayer => {
    if (gameActive && !draw) {
        NOTIFICATION.textContent = (currentPlayer === "X") ? `Player "${currentPlayer}" turn...` : NOTIFICATION.textContent = `The AI is thinking...🤔`  
    }else if (!gameActive && !draw){
        NOTIFICATION.textContent = `Player "${currentPlayer}" wins!`  
    }else if (draw){
        NOTIFICATION.textContent = `Draw!`  
    }
}

const handlePlayerChange = () => {
    currentPlayer = (currentPlayer === "X") ? "O" : "X"  
    showMessagge(currentPlayer)
    if (currentPlayer === "O"){
        lockBoard = true
        setTimeout(() => {
            IAgame()
        }, 900);
    }
}

const handleCellPlayed = (clickedCellIndex, cellClicked) => {
    GAME_STATUS[clickedCellIndex] = currentPlayer
    cellClicked.innerText = currentPlayer
}

const checkWinner = () => {
    console.log(GAME_STATUS);
    for (chance of WINNINGS){
        posicion1 = chance[0]
        posicion2 = chance[1]
        posicion3 = chance[2]
        
        if ((GAME_STATUS[posicion1] && GAME_STATUS[posicion2] && GAME_STATUS[posicion3]) !== ""){
            if (GAME_STATUS[posicion1] === GAME_STATUS[posicion2] && GAME_STATUS[posicion2] === GAME_STATUS[posicion3]){
                gameActive = false
                showMessagge(currentPlayer)
                setTimeout(() => {
                    alert(`Player "${currentPlayer}" wins!`)
                }, 500);
                return
            }
        }
    }
    if (GAME_STATUS.indexOf("") === -1){
        draw = true
        showMessagge(currentPlayer)
        return
    }
    handlePlayerChange()
}

const handleCellClick = (event) => {
    if (lockBoard) return
    const cellClicked = event.target
    
    if (cellClicked.classList.contains("game-cell") && cellClicked.textContent === "" && gameActive){
        const clickedCellIndex = Array.from(cellClicked.parentNode.children).indexOf(cellClicked)
        handleCellPlayed(clickedCellIndex, cellClicked)
        checkWinner()
    }
}

const handleRestartGame = () => {
    resetGameStatus()
    gameActive = true
    draw = false
    currentPlayer = "X"
    showMessagge(currentPlayer)
    document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "")
}

const resetGameStatus = () => {
    i = WINNINGS.length
    while (i >= 0){
        GAME_STATUS[i] = ""
        i--
    }
    mixArray(WINNINGS)
}

$BTN_RESET.addEventListener('click', handleRestartGame)
GAME_BOARD.addEventListener('click', handleCellClick)
document.addEventListener("DOMContentLoaded", mixArray(WINNINGS))