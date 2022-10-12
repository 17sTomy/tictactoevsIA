const GAME_BOARD = document.querySelector(".game-container")
const $BTN_RESET = document.querySelector(".game-restart")
const NOTIFICATION = document.querySelector(".game-notification")
const GAME_STATUS = ["", "", "", "", "", "", "", "", ""]
const WINNINGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

let currentPlayer = "X"
let gameActive = true
let draw = false


const IAgame = () => {
    for (chance of WINNINGS){  
        posicion1 = chance[0]
        posicion2 = chance[1]
        posicion3 = chance[2]

        if (GAME_STATUS[posicion1] === "X" && GAME_STATUS[posicion2] === "X" && GAME_STATUS[posicion3] === ""){
            GAME_STATUS[posicion3] = currentPlayer
            GAME_BOARD.children[posicion3].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[posicion1] === "X" && GAME_STATUS[posicion2] === "" && GAME_STATUS[posicion3] === "X"){
            GAME_STATUS[posicion2] = currentPlayer
            GAME_BOARD.children[posicion2].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[posicion1] === "" && GAME_STATUS[posicion2] === "X" && GAME_STATUS[posicion3] === "X"){
            GAME_STATUS[posicion1] = currentPlayer
            GAME_BOARD.children[posicion1].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[posicion1] === "O" && GAME_STATUS[posicion2] === "O" && GAME_STATUS[posicion3] === ""){
            GAME_STATUS[posicion3] = currentPlayer
            GAME_BOARD.children[posicion3].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[posicion1] === "O" && GAME_STATUS[posicion2] === "" && GAME_STATUS[posicion3] === "O"){
            GAME_STATUS[posicion2] = currentPlayer
            GAME_BOARD.children[posicion2].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[posicion1] === "" && GAME_STATUS[posicion2] === "O" && GAME_STATUS[posicion3] === "O"){
            GAME_STATUS[posicion1] = currentPlayer
            GAME_BOARD.children[posicion1].textContent = currentPlayer
            checkWinner()
            return
        }else if ((GAME_STATUS[posicion1] === "X" || GAME_STATUS[posicion2] === "X" || GAME_STATUS[posicion3] === "X") &&  GAME_STATUS[4] === ""){
            GAME_STATUS[4] = currentPlayer
            GAME_BOARD.children[4].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[4] === "X" && !GAME_STATUS.includes("O")){
            randomPosition = Math.floor(Math.random() * 9)
            while (randomPosition === 4 || GAME_STATUS[randomPosition] !== "") {
                randomPosition = Math.floor(Math.random() * 9)
            }
            GAME_STATUS[randomPosition] = currentPlayer
            GAME_BOARD.children[randomPosition].textContent = currentPlayer
            checkWinner()
            return
        }else if (GAME_STATUS[posicion1] === "" && GAME_STATUS[posicion2] === "O" && GAME_STATUS[posicion3] === ""){
            randomPosition = Math.floor(Math.random() * 9)
            while (randomPosition === 4 || GAME_STATUS[randomPosition] !== "") {
                randomPosition = Math.floor(Math.random() * 9)
            }
            GAME_STATUS[randomPosition] = currentPlayer
            GAME_BOARD.children[randomPosition].textContent = currentPlayer
            checkWinner()
            return
        }
    }
}

const showMessagge = currentPlayer => {
    if (gameActive && !draw) {
        NOTIFICATION.textContent = `Player "${currentPlayer}" turn...`  
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
        NOTIFICATION.textContent = `The AI is thinking...🤔` 
        setTimeout(() => {
            IAgame()
        }, 1000);
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
    if (GAME_STATUS.indexOf("") == -1){
        draw = true
    }
    handlePlayerChange()
}

const handleCellClick = (event) => {
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
}

$BTN_RESET.addEventListener('click', handleRestartGame)
GAME_BOARD.addEventListener('click', handleCellClick)