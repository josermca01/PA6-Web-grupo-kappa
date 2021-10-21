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

      function rotate() {
        if (isHorizontal) {
          destroyer.classList.toggle('destroyer-container-vertical')
          submarino.classList.toggle('submarino-container-vertical')
          cruzador.classList.toggle('cruzador-container-vertical')
          navio.classList.toggle('navio-container-vertical')
          portaavioes.classList.toggle('portaavioes-container-vertical')
          isHorizontal = false
        }
        if (!isHorizontal) {
          destroyer.classList.toggle('destroyer-container')
          submarino.classList.toggle('submarino-container')
          cruzador.classList.toggle('cruzador-container')
          navio.classList.toggle('navio-container')
          portaavioes.classList.toggle('portaavioes-container')
          isHorizontal = true
        }
      }
      rotateButton.addEventListener('click', rotate)
})