document.addEventListener('DOMContentLoaded',()=>{
    const gridplayer = document.querySelector('.grid-usuario')
    const gridmaquina = document.querySelector('.grid-maquina')
    const gridpdisplay = document.querySelector('.grid-display')
    const ships = document.querySelectorAll('.ship')
    const destroyer = document.querySelector('.destroyer-container')
    const submarino = document.querySelector('.submarino-container')
    const cruzador = document.querySelector('.cruzador-container')
    const navio = document.querySelector('.navio-container')
    const portaavioes = document.querySelector('.portaavioes-container')
    const playersqures = []
    const maquinasquares = []
    const tamanho = 10
    var contador = 1
    let isHorizontal = true
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    let isGameOver = false
    let currentPlayer = 'user'
    const turnDisplay = document.querySelector('#whose-go')
    const infoDisplay = document.querySelector('#info')
    //criação do board
    function board(grid,squares,visible){
        for(let i = 0; i<tamanho*tamanho;i++){
            const square = document.createElement('div')
            square.dataset.id = i
            if(visible) square.classList.add('hidden')
            grid.appendChild(square)
            squares.push(square)
        }
    }

    board(gridplayer,playersqures, false)
    board(gridmaquina,maquinasquares, true)

    //Barcos
    const arraybarcos = [
        {
            name : 'destroyer',
            directions : [
                [0,1],
                [0,tamanho]
            ]
        },
        {
            name : 'submarino',
            directions : [
                [0,1,2],
                [0,tamanho,tamanho*2]
            ]
        },
        {
            name : 'cruzador',
            directions : [
                [0,1,2],
                [0,tamanho,tamanho*2]
            ]
        },
        {
            name : 'navio',
            directions : [
                [0,1,2,3],
                [0,tamanho,tamanho*2,tamanho*3]
            ]
        },
        {
            name : 'portaavioes',
            directions : [
                [0,1,2,3,4],
                [0,tamanho,tamanho*2,tamanho*3,tamanho*4]
            ]
        }
    ]

    //criando grid da maquina
    function generate(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length)
        let current = ship.directions[randomDirection]
        if (randomDirection === 0) direction = 1
        if (randomDirection === 1) direction = 10
        let randomStart = Math.abs(Math.floor(Math.random() * maquinasquares.length - (ship.directions[0].length * direction)))
    
        const isTaken = current.some(index => maquinasquares[randomStart + index].classList.contains('taken'))
        const isAtRightEdge = current.some(index => (randomStart + index) % tamanho === tamanho)
        const isAtLeftEdge = current.some(index => (randomStart + index) % tamanho === 0)
    
        if (!isTaken && !isAtRightEdge && !isAtLeftEdge) current.forEach(index => maquinasquares[randomStart + index].classList.add('taken', ship.name))
    
        else generate(ship)
      }

      generate(arraybarcos[0])
      generate(arraybarcos[1])
      generate(arraybarcos[2])
      generate(arraybarcos[3])
      generate(arraybarcos[4])

      //função de rotação dos barcos para colocar na grid
      function rotate() {
        if (isHorizontal) {
          destroyer.classList.toggle('destroyer-container-vertical')
          submarino.classList.toggle('submarino-container-vertical')
          cruzador.classList.toggle('cruzador-container-vertical')
          navio.classList.toggle('navio-container-vertical')
          portaavioes.classList.toggle('portaavioes-container-vertical')
          isHorizontal = false
          console.log(isHorizontal)
          return
        }
        if (!isHorizontal) {
          destroyer.classList.toggle('destroyer-container-vertical')
          submarino.classList.toggle('submarino-container-vertical')
          cruzador.classList.toggle('cruzador-container-vertical')
          navio.classList.toggle('navio-container-vertical')
          portaavioes.classList.toggle('portaavioes-container-vertical')
          isHorizontal = true
          console.log(isHorizontal)
          return
        }
      }
      rotateButton.addEventListener('click', rotate)


      ships.forEach(ship=> ship.addEventListener('dragstart',dragStart))
      playersqures.forEach(square=> square.addEventListener('dragstart',dragStart))
      playersqures.forEach(square=> square.addEventListener('dragover',dragOver))
      playersqures.forEach(square=> square.addEventListener('dragenter',dragEnter))
      playersqures.forEach(square=> square.addEventListener('dragleave',dragLeave))
      playersqures.forEach(square=> square.addEventListener('drop',dragDrop))
      playersqures.forEach(square=> square.addEventListener('dragend',dragEnd))

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
        let podeColocarNavioParaBaixo =  ((draggedShipLength - (selectedShipIndex +1)) * tamanho) + parseInt(this.dataset.id) < 100

        let podeColocarNavioParaCima = parseInt(this.dataset.id) - (selectedShipIndex * tamanho) > 0 

        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for(let i = 0;i < draggedShipLength; i++){
                if(playersqures[parseInt(shipLastId) - i].classList.contains('taken'))
                return
            }
            for (let i = 0; i < draggedShipLength; i++) {
                playersqures[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken',shipClass)
            }
        } else if (!isHorizontal && podeColocarNavioParaBaixo && podeColocarNavioParaCima) {
            for(let i = 0;i < draggedShipLength; i++){
              //console.log(i+'quadrado')
              //console.log(Math.abs(tamanho*i-parseInt(shipLastId)+1))
                if(playersqures[Math.abs(tamanho*i-parseInt(shipLastId))].classList.contains('taken'))
                return
            }
            for (let i = 0; i < draggedShipLength; i++) {
                playersqures[parseInt(this.dataset.id - selectedShipIndex*tamanho) + (tamanho*i)].classList.add('taken', shipClass)
            }
        } else return

        gridpdisplay.removeChild(draggedShip)
    }

    function dragEnd() {
        // console.log('dragend')
    }

    //Game logic
    function playGame() {
        if (isGameOver) return
        if (currentPlayer === 'user') {
          turnDisplay.innerHTML = 'Sua vez'
          maquinasquares.forEach(square => square.addEventListener('click', function(e) {
            revealSquare(square)
          }))
        }
        if (currentPlayer === 'computer') {
          turnDisplay.innerHTML = 'Vez do computador'
          setTimeout(computerGo,1000)
        }
        gridpdisplay.remove()
      }
      startButton.addEventListener('click', playGame)
    
      let destroyerCount = 0
      let submarinoCount = 0
      let cruzadorCount = 0
      let navioCount = 0
      let portaavioesCount = 0
    
    
      function revealSquare(square) {
        //console.log(contador++)
        if(square.classList.contains('boom')||square.classList.contains('miss'))
        return
        if (!square.classList.contains('boom')) {
          if (square.classList.contains('destroyer')) destroyerCount++
          if (square.classList.contains('submarino')) submarinoCount++
          if (square.classList.contains('cruzador')) cruzadorCount++
          if (square.classList.contains('navio')) navioCount++
          if (square.classList.contains('portaavioes')) portaavioesCount++
        }
        if(square.classList.contains('hidden')) square.classList.remove('hidden')
        if (square.classList.contains('taken')) {
          square.classList.add('boom')
        } else {
          square.classList.add('miss')
        }
        checkForWins()
        currentPlayer = 'computer'
        playGame()
      }
    
      let cpuDestroyerCount = 0
      let cpuSubmarinoCount = 0
      let cpuCruzadorCount = 0
      let cpuNavioCount = 0
      let cpuPortaavioesCount = 0
    
    
      function computerGo() {
        let random = Math.floor(Math.random() * playersqures.length)
        if(playersqures[random].classList.contains('boom')||playersqures[random].classList.contains('miss'))
        setTimeout(computerGo,1000)
        if (!playersqures[random].classList.contains('boom') && playersqures[random].classList.contains('taken')) {
          playersqures[random].classList.add('boom')
          //console.log('acertou')
          if (playersqures[random].classList.contains('destroyer')) cpuDestroyerCount++
          if (playersqures[random].classList.contains('submarino')) cpuSubmarinoCount++
          if (playersqures[random].classList.contains('cruzador')) cpuCruzadorCount++
          if (playersqures[random].classList.contains('navio')) cpuNavioCount++
          if (playersqures[random].classList.contains('portaavioes')) cpuPortaavioesCount++
          checkForWins()
        }
        else if(!playersqures[random].classList.contains('miss')&&!playersqures[random].classList.contains('taken')){
            //console.log('errou')
            playersqures[random].classList.add('miss')
        }
        currentPlayer = 'user'
        turnDisplay.innerHTML = 'Sua vez'
      }
    
      function checkForWins() {
        if (destroyerCount === 2) {
          infoDisplay.innerHTML = 'Você destruiu um Destroyer'
          destroyerCount = 10
        }
        if (submarinoCount === 3) {
          infoDisplay.innerHTML = 'Você destruiu um Submarino'
          submarinoCount = 10
        }
        if (cruzadorCount === 3) {
          infoDisplay.innerHTML = 'Você destruiu um Cruzador'
          cruzadorCount = 10
        }
        if (navioCount === 4) {
          infoDisplay.innerHTML = 'Você destruiu um Navio'
          navioCount = 10
        }
        if (portaavioesCount === 5) {
          infoDisplay.innerHTML = 'Você destruiu um Porta-aviões'
          portaavioesCount = 10
        }
        if (cpuDestroyerCount === 2) {
          infoDisplay.innerHTML = 'O seu Destroyer afundou'
          destroyerCount = 10
        }
        if (cpuSubmarinoCount === 3) {
          infoDisplay.innerHTML = 'O seu Submarino afundou'
          cpuSubmarinoCount = 10
        }
        if (cpuCruzadorCount === 3) {
          infoDisplay.innerHTML = 'O seu Cruzador afundou'
          cpuCruzadorCount = 10
        }
        if (cpuNavioCount === 4) {
          infoDisplay.innerHTML = 'O seu Navio afundou'
          cpuNavioCount = 10
        }
        if (cpuPortaavioesCount === 5) {
          infoDisplay.innerHTML = 'O seu Porta-aviões afundou'
          cpuPortaavioesCount = 10
        }
        if ((destroyerCount + submarinoCount + cruzadorCount + navioCount + portaavioesCount) === 50) {
          infoDisplay.innerHTML = "VOCÊ VENCEU"
          gameOver()
        }
        if ((cpuDestroyerCount + cpuSubmarinoCount + cpuCruzadorCount + cpuNavioCount + cpuPortaavioesCount) === 50) {
          infoDisplay.innerHTML = "O COMPUTADOR VENCEU"
          gameOver()
        }
      }

      function reloadGame() {
        window.location.reload();
      }
    
      function gameOver() {
        isGameOver = true
        startButton.removeEventListener('click', playGame)
        startButton.innerHTML = 'Recomeçar'
        startButton.addEventListener('click', reloadGame)
      }
})