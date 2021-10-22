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
    let isHorizontal = true
    const startButton = document.querySelector('#start')
    const rotateButton = document.querySelector('#rotate')
    //criação do board
    function board(grid,squares){
        for(let i = 0; i<tamanho*tamanho;i++){
            const square = document.createElement('div')
            square.dataset.id = i
            grid.appendChild(square)
            squares.push(square)
        }
    }

    board(gridplayer,playersqures)
    board(gridmaquina,maquinasquares)

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
        let shipClass = shipNameWithLastId.slice(0, -2)
        console.log(shipClass)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
        let shipLastId = lastShipIndex + parseInt(this.dataset.id)
        console.log(shipLastId)
        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

        shipLastId = shipLastId - selectedShipIndex

        
        const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)
        console.log(shipLastId)

        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                playersqures[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken',shipClass)
            }
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i = 0; i < draggedShipLength; i++) {
                playersqures[parseInt(this.dataset.id) - selectedShipIndex + tamanho*i].classList.add('taken', shipClass)
            }
        } else return

        gridpdisplay.removeChild(draggedShip)
    }

    function dragEnd() {
        // console.log('dragend')
    }
})