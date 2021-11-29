document.addEventListener('DOMContentLoaded', () => {
  const userGrid = document.querySelector('.grid-user')
  const computerGrid = document.querySelector('.grid-computer')
  const displayGrid = document.querySelector('.grid-display')
  const ships = document.querySelectorAll('.ship')
  const destroyer = document.querySelector('.destroyer-container')
  const submarine = document.querySelector('.submarine-container')
  const cruiser = document.querySelector('.cruiser-container')
  const battleship = document.querySelector('.battleship-container')
  const carrier = document.querySelector('.carrier-container')
  const startButton = document.querySelector('#start')
  const rotateButton = document.querySelector('#rotate')
  const turnDisplay = document.querySelector('#whose-go')
  const infoDisplay = document.querySelector('#info')
  const setupButtons = document.getElementById('setup-buttons')
  const userSquares = []
  const computerSquares = []
  let isHorizontal = true
  let isGameOver = false
  let currentPlayer = 'user'
  const width = 10
  let playerNum = 0
  let ready = false
  let enemyReady = false
  let allShipsPlaced = false
  let shotFired = -1

  //Barcos
  const shipArray = [
    {
      name: 'destroyer',
      directions: [
        [0, 1],
        [0, width]
      ]
    },
    {
      name: 'submarine',
      directions: [
        [0, 1, 2],
        [0, width, width*2]
      ]
    },
    {
      name: 'cruiser',
      directions: [
        [0, 1, 2],
        [0, width, width*2]
      ]
    },
    {
      name: 'battleship',
      directions: [
        [0, 1, 2, 3],
        [0, width, width*2, width*3]
      ]
    },
    {
      name: 'carrier',
      directions: [
        [0, 1, 2, 3, 4],
        [0, width, width*2, width*3, width*4]
      ]
    },
  ]

  createBoard(userGrid, userSquares)
  createBoard(computerGrid, computerSquares)

  // Modos de jogo
  if (gameMode === 'singlePlayer') {
    startSinglePlayer()
  } else {
    startMultiPlayer()
  }

  // Multiplayer
  function startMultiPlayer() {
    const socket = io();

    // NUmero do jogador
    socket.on('player-number', num => {
      if (num === -1) {
        infoDisplay.innerHTML = "Sorry, the server is full"
      } else {
        playerNum = parseInt(num)
        if(playerNum === 1) currentPlayer = "enemy"

        console.log(playerNum)

        // Pega status dos jogadores
        socket.emit('check-players')
      }
    })

    // Conexão de outro player o desconexão
    socket.on('player-connection', num => {
      console.log(`Player number ${num} has connected or disconnected`)
      playerConnectedOrDisconnected(num)
    })

    // Turno do inimigo
    socket.on('enemy-ready', num => {
      enemyReady = true
      playerReady(num)
      if (ready) {
        playGameMulti(socket)
        setupButtons.style.display = 'none'
      }
    })

    // Checa status do player
    socket.on('check-players', players => {
      players.forEach((p, i) => {
        if(p.connected) playerConnectedOrDisconnected(i)
        if(p.ready) {
          playerReady(i)
          if(i !== playerReady) enemyReady = true
        }
      })
    })

    // Timeout
    socket.on('timeout', () => {
      infoDisplay.innerHTML = 'You have reached the 10 minute limit'
    })

    // Botão de preparo
    startButton.addEventListener('click', () => {
      if(allShipsPlaced) playGameMulti(socket)
      else infoDisplay.innerHTML = "Please place all ships"
    })

    // Setup event de tiro
    computerSquares.forEach(square => {
      square.addEventListener('click', () => {
        if(currentPlayer === 'user' && ready && enemyReady) {
          shotFired = square.dataset.id
          socket.emit('fire', shotFired)
        }
      })
    })

    // Tiro recebido
    socket.on('fire', id => {
      enemyGo(id)
      const square = userSquares[id]
      socket.emit('fire-reply', square.classList)
      playGameMulti(socket)
    })

    // Tiro recebido do outro jogador
    socket.on('fire-reply', classList => {
      revealSquare(classList)
      playGameMulti(socket)
    })

    function playerConnectedOrDisconnected(num) {
      let player = `.p${parseInt(num) + 1}`
      document.querySelector(`${player} .connected`).classList.toggle('active')
      if(parseInt(num) === playerNum) document.querySelector(player).style.fontWeight = 'bold'
    }
  }

  // Single Player
  function startSinglePlayer() {
    generate(shipArray[0])
    generate(shipArray[1])
    generate(shipArray[2])
    generate(shipArray[3])
    generate(shipArray[4])

    startButton.addEventListener('click', () => {
      setupButtons.style.display = 'none'
      playGameSingle()
    })
  }

  //Criação do Board
  function createBoard(grid, squares) {
    for (let i = 0; i < width*width; i++) {
      const square = document.createElement('div')
      square.dataset.id = i
      grid.appendChild(square)
      squares.push(square)
    }
  }

  //Barcos do computador em lugares aleatórios
  function generate(ship) {
    let randomDirection = Math.floor(Math.random() * ship.directions.length)
    let current = ship.directions[randomDirection]
    if (randomDirection === 0) direction = 1
    if (randomDirection === 1) direction = 10
    let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)))

    const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'))
    const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1)
    const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0)

    if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => computerSquares[randomStart + index].classList.add('taken', ship.name))

    else generate(ship)
  }
  

  //Rotação dos barcos
  function rotate() {
    if (isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical')
      submarine.classList.toggle('submarine-container-vertical')
      cruiser.classList.toggle('cruiser-container-vertical')
      battleship.classList.toggle('battleship-container-vertical')
      carrier.classList.toggle('carrier-container-vertical')
      isHorizontal = false
      // console.log(isHorizontal)
      return
    }
    if (!isHorizontal) {
      destroyer.classList.toggle('destroyer-container-vertical')
      submarine.classList.toggle('submarine-container-vertical')
      cruiser.classList.toggle('cruiser-container-vertical')
      battleship.classList.toggle('battleship-container-vertical')
      carrier.classList.toggle('carrier-container-vertical')
      isHorizontal = true
      // console.log(isHorizontal)
      return
    }
  }
  rotateButton.addEventListener('click', rotate)

  //Mexe os barcos
  ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragstart', dragStart))
  userSquares.forEach(square => square.addEventListener('dragover', dragOver))
  userSquares.forEach(square => square.addEventListener('dragenter', dragEnter))
  userSquares.forEach(square => square.addEventListener('dragleave', dragLeave))
  userSquares.forEach(square => square.addEventListener('drop', dragDrop))
  userSquares.forEach(square => square.addEventListener('dragend', dragEnd))

  let selectedShipNameWithIndex
  let draggedShip
  let draggedShipLength

  ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
    selectedShipNameWithIndex = e.target.id
    // console.log(selectedShipNameWithIndex)
  }))

  function dragStart() {
    draggedShip = this
    draggedShipLength = this.childNodes.length
    // console.log(draggedShip)
  }

  function dragOver(e) {
    e.preventDefault()
  }

  function dragEnter(e) {
    e.preventDefault()
  }

  function dragLeave() {
    // console.log('drag leave')
  }

  function dragDrop() {
    let shipNameWithLastId = draggedShip.lastChild.id
    //console.log('shipNameWithLastId   '  + shipNameWithLastId)
    let shipClass = shipNameWithLastId.slice(0, -2)
    //console.log(shipClass)
    let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
    //console.log('lastShipIndex   '+  lastShipIndex)
    let shipLastId = lastShipIndex + parseInt(this.dataset.id)
    //console.log(lastShipIndex)
    selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))
    //console.log(selectedShipIndex)
    shipLastId = shipLastId - selectedShipIndex
    //console.log('shipLastId   '+shipLastId)
  
    
    const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
    let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
    //console.log(this.dataset.id)
    let podeColocarNavioParaBaixo =  ((draggedShipLength - (selectedShipIndex +1)) * width) + parseInt(this.dataset.id) < 100
  
    let podeColocarNavioParaCima = parseInt(this.dataset.id) - (selectedShipIndex * width) > 0 
  
    if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
        for(let i = 0;i < draggedShipLength; i++){
            if(userSquares[parseInt(shipLastId) - i].classList.contains('taken'))
            return
        }
        for (let i = 0; i < draggedShipLength; i++) {
          let directionClass
          if (i === 0) directionClass = 'start'
          if (i === draggedShipLength - 1) directionClass = 'end'
            userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass)
        }
    } else if (!isHorizontal && podeColocarNavioParaBaixo && podeColocarNavioParaCima) {
        for(let i = 0;i < draggedShipLength; i++){
          //console.log(i+'quadrado')
          //console.log(Math.abs(width*i-parseInt(shipLastId)+1))
            if(userSquares[parseInt(this.dataset.id - selectedShipIndex*width) + (width*i)].classList.contains('taken'))
            return
        }
        for (let i = 0; i < draggedShipLength; i++) {
          let directionClass
          if (i === 0) directionClass = 'start'
          if (i === draggedShipLength - 1) directionClass = 'end'
            userSquares[parseInt(this.dataset.id - selectedShipIndex*width) + (width*i)].classList.add('taken', 'vertical', directionClass, shipClass)
        }
    } else return
  
    displayGrid.removeChild(draggedShip)
  
    if(!displayGrid.querySelector('.ship'))
    allShipsPlaced=true
  }

  function dragEnd() {
    // console.log('dragend')
  }

  // Lógica para MultiPlayer
  function playGameMulti(socket) {
    setupButtons.style.display = 'none'
    if(isGameOver) return
    if(!ready) {
      socket.emit('player-ready')
      ready = true
      playerReady(playerNum)
    }

    if(enemyReady) {
      if(currentPlayer === 'user') {
        turnDisplay.innerHTML = 'Sua Vez'
      }
      if(currentPlayer === 'enemy') {
        turnDisplay.innerHTML = "Vez do Oponente"
      }
    }
  }

  function playerReady(num) {
    let player = `.p${parseInt(num) + 1}`
    document.querySelector(`${player} .ready`).classList.toggle('active')
  }

  // Lógica para Single Player
  function playGameSingle() {
    if (isGameOver) return
    if (currentPlayer === 'user') {
      turnDisplay.innerHTML = 'Sua Vez'
      computerSquares.forEach(square => square.addEventListener('click', function(e) {
        shotFired = square.dataset.id
        revealSquare(square.classList)
      }))
    }
    if (currentPlayer === 'enemy') {
      turnDisplay.innerHTML = 'Vez do Oponente'
      setTimeout(enemyGo, 1000)
    }
  }

  let destroyerCount = 0
  let submarineCount = 0
  let cruiserCount = 0
  let battleshipCount = 0
  let carrierCount = 0

  function revealSquare(classList) {
    const enemySquare = computerGrid.querySelector(`div[data-id='${shotFired}']`)
    const obj = Object.values(classList)
    if(enemySquare.classList.contains('boom')||enemySquare.classList.contains('miss'))
    return
    if (!enemySquare.classList.contains('boom') && currentPlayer === 'user' && !isGameOver) {
      if (obj.includes('destroyer')) destroyerCount++
      if (obj.includes('submarine')) submarineCount++
      if (obj.includes('cruiser')) cruiserCount++
      if (obj.includes('battleship')) battleshipCount++
      if (obj.includes('carrier')) carrierCount++
    }
    if (obj.includes('taken')) {
      enemySquare.classList.add('boom')
    } else {
      enemySquare.classList.add('miss')
    }
    checkForWins()
    currentPlayer = 'enemy'
    if(gameMode === 'singlePlayer') playGameSingle()
  }

  let cpuDestroyerCount = 0
  let cpuSubmarineCount = 0
  let cpuCruiserCount = 0
  let cpuBattleshipCount = 0
  let cpuCarrierCount = 0


  function enemyGo(square) {
    if (gameMode === 'singlePlayer') square = Math.floor(Math.random() * userSquares.length)
    if(userSquares[square].classList.contains('boom')||userSquares[square].classList.contains('miss')){
        setTimeout(enemyGo,1000)
        return
      }
    if (!userSquares[square].classList.contains('boom')) {
      const hit = userSquares[square].classList.contains('taken')
      userSquares[square].classList.add(hit ? 'boom' : 'miss')
      if (userSquares[square].classList.contains('destroyer')) cpuDestroyerCount++
      if (userSquares[square].classList.contains('submarine')) cpuSubmarineCount++
      if (userSquares[square].classList.contains('cruiser')) cpuCruiserCount++
      if (userSquares[square].classList.contains('battleship')) cpuBattleshipCount++
      if (userSquares[square].classList.contains('carrier')) cpuCarrierCount++
      checkForWins()
    } else if (gameMode === 'singlePlayer') enemyGo()
    currentPlayer = 'user'
    turnDisplay.innerHTML = 'Sua Vez'
  }

  function checkForWins() {
    let enemy = 'computer'
    if(gameMode === 'multiPlayer') enemy = 'enemy'
    if (destroyerCount === 2) {
      infoDisplay.innerHTML = `Voce Afundou o destroyer inimigo`
      destroyerCount = 10
    }
    if (submarineCount === 3) {
      infoDisplay.innerHTML = `Voce Afundou o submarino inimigo`
      submarineCount = 10
    }
    if (cruiserCount === 3) {
      infoDisplay.innerHTML = `Voce Afundou o cruzador inimigo`
      cruiserCount = 10
    }
    if (battleshipCount === 4) {
      infoDisplay.innerHTML = `Voce Afundou o navio inimigo`
      battleshipCount = 10
    }
    if (carrierCount === 5) {
      infoDisplay.innerHTML = `Você afundou o Porta-aviões inimigo`
      carrierCount = 10
    }
    if (cpuDestroyerCount === 2) {
      infoDisplay.innerHTML = `O seu Destroyer afundou`
      cpuDestroyerCount = 10
    }
    if (cpuSubmarineCount === 3) {
      infoDisplay.innerHTML = `O seu Submarino afundou`
      cpuSubmarineCount = 10
    }
    if (cpuCruiserCount === 3) {
      infoDisplay.innerHTML = `O seu Cruzador afundou`
      cpuCruiserCount = 10
    }
    if (cpuBattleshipCount === 4) {
      infoDisplay.innerHTML = `O seu Navio afundou`
      cpuBattleshipCount = 10
    }
    if (cpuCarrierCount === 5) {
      infoDisplay.innerHTML = `O seu Porta-aviões afundou`
      cpuCarrierCount = 10
    }

    if ((destroyerCount + submarineCount + cruiserCount + battleshipCount + carrierCount) === 50) {
      infoDisplay.innerHTML = "VOCÊ VENCEU"
      gameOver()
    }
    if ((cpuDestroyerCount + cpuSubmarineCount + cpuCruiserCount + cpuBattleshipCount + cpuCarrierCount) === 50) {
      infoDisplay.innerHTML = `O INIMIGO VENCEU`
      gameOver()
    }
  }

  

  function reloadGame() {
    window.location.reload();
  }

  function gameOver() {
    isGameOver = true
    setupButtons.innerHTML = 'Recomeçar'
    document.getElementById('setup-buttons').style.display='block'
    setupButtons.addEventListener('click', reloadGame)
  }
})
