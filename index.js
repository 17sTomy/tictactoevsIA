const GAME_BOARD = document.querySelector(".game-container"),
    $BTN_RESET = document.querySelector(".game-restart"),
    NOTIFICATION = document.querySelector(".game-notification"),
    GAME_STATUS = ["", "", "", "", "", "", "", "", ""],
    WINNINGS = [
        [0, 4, 8],
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6]
    ]

let currentPlayer = "X",
    gameActive = true,
    draw = false,
    lockBoard = false,
    located


const play = position => {
    GAME_STATUS[position] = currentPlayer
    GAME_BOARD.children[position].textContent = currentPlayer
    checkWinner()
    lockBoard = false
    located = true
}

const generateRandomPosition = () => {
    randomPosition = Math.floor(Math.random() * 9)
    while (GAME_STATUS[randomPosition] !== "") {
        randomPosition = Math.floor(Math.random() * 9)
    }
    return randomPosition
}

const goToCorners = () => {
    const corners = [0, 2, 6, 8]
    randomCorner = Math.floor(Math.random() * corners.length)
    while (GAME_STATUS[randomCorner] !== "") {
        randomCorner = Math.floor(Math.random() * corners.length)
    }
    return corners[randomCorner]
}

const checkPlay3 = chance => {
    const chances = WINNINGS[chance]
    let position1 = chances[0],
        position2 = chances[1],
        position3 = chances[2]
    
    //Si tiene dos opciones libres, elige una
    if (GAME_STATUS[position1] === "O" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === ""){
        play(position3)
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "O" && GAME_STATUS[position3] === ""){
        play(position1)
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === "O"){
        play(position1)
    }
}

const checkPlay2 = chance => {
    const chances = WINNINGS[chance]
    let position1 = chances[0],
        position2 = chances[1],
        position3 = chances[2]

    //Oportunidades para no perder la partida
    if (GAME_STATUS[position1] === "X" && GAME_STATUS[position2] === "X" && GAME_STATUS[position3] === ""){
        play(position3)
    }else if (GAME_STATUS[position1] === "X" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === "X"){
        play(position2)
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "X" && GAME_STATUS[position3] === "X"){
        play(position1)
    }
}

const checkPlay = chance => {
    const chances = WINNINGS[chance]
    let position1 = chances[0],
        position2 = chances[1],
        position3 = chances[2]
    
    //Oportunidades para ganar la partida
    if (GAME_STATUS[position1] === "O" && GAME_STATUS[position2] === "O" && GAME_STATUS[position3] === ""){
        play(position3)
    }else if (GAME_STATUS[position1] === "O" && GAME_STATUS[position2] === "" && GAME_STATUS[position3] === "O"){
        play(position2)
    }else if (GAME_STATUS[position1] === "" && GAME_STATUS[position2] === "O" && GAME_STATUS[position3] === "O"){
        play(position1)
    }
    //Siempre colocarse en el medio si está desocupado
    else if (GAME_STATUS.includes("X") && !GAME_STATUS.includes("O") && GAME_STATUS[4] !== "X"){
        play(4)
    }
    //Si el usuario se coloca en el medio, ponerse en alguna esquina
    else if (GAME_STATUS.includes("X") && !GAME_STATUS.includes("O") && GAME_STATUS[4] === "X"){
        let corner = goToCorners()
        play(corner)
    }
}

const IAgame = () => {
    located = false
    // Primero chequea si puede ganar
    let i = 0
    while (!located && i < WINNINGS.length){
        checkPlay(i)
        i++
    } 
    // Si no puede ganar, se fija si puede perder
    j = 0
    while (!located && j < WINNINGS.length){
        checkPlay2(j)
        j++
    }
    // Si no pierde, se coloca donde pueda tener una futura oportunidad
    k = 0
    while (!located && k < WINNINGS.length){
        checkPlay3(k)
        k++
    }
    // Si no puede hacer nada, elige un lugar desocupado al azar
    if (!located){
        let randomPosition = generateRandomPosition()
        play(randomPosition)
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

const handleCellClick = event => {
    if (lockBoard) return
    const cellClicked = event.target
    
    if (cellClicked.classList.contains("game-cell") && cellClicked.textContent === "" && gameActive){
        const clickedCellIndex = Array.from(cellClicked.parentNode.children).indexOf(cellClicked)
        handleCellPlayed(clickedCellIndex, cellClicked)
        checkWinner()
    }
}

const handleRestartGame = () => {
    location.reload()
}

$BTN_RESET.addEventListener('click', handleRestartGame)
GAME_BOARD.addEventListener('click', handleCellClick)