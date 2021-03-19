import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Page2048() {
  const [score, setScore] = useState(0)
  const canvasRef = useRef()

  useEffect(() => {
    startGame(canvasRef, setScore)
  }, [])

  return <div style={{width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
    <Head>
        <title>Dev's JS: 2048</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <header style={{fontSize: '42px', margin: '2rem 0'}}>
      Score: {score}
    </header>
    <canvas ref={canvasRef} width="350" height="350"/>
    <p style={{fontWeight: 300, maxWidth: '400px', paddingTop: '2rem', fontSize: '14px'}}>
      <strong>Instructions:</strong> Use WASD to move tiles Up, Down, Left, Right. Combine same numbers to increase your score!
    </p>
  </div>
}

const SQUARE_SIZE = 80, GAP = 10, ANIM_SPEED = 8;

const TILE_COLORS = {
  2: '#d9dfff',
  4: '#cdd4ff',
  8: '#b3bffe',
  16: '#9aaafe',
  32: '#8e9ffe',
  64: '#8194fe',
  128: '#748afe',
  256: '#e2efa7',
  512: '#dbeb91',
  1024: '#d4e77b',
  2048: '#cce365'
}

let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
]

let animOffset = {
  x: 0,
  y: 0
}

let context, setScoreCallback, score = 0

const startGame = (canvas, setScore) => {
  context = canvas.current.getContext('2d')
  setScoreCallback = setScore

  addTile()

  window.addEventListener("keydown", handleKeyDown, false)

  window.requestAnimationFrame(loop)
}

const addTile = () => {
  let x = Math.floor(Math.random() * grid.length)
  let y = Math.floor(Math.random() * grid.length)

  while (grid[x][y] !== 0) {
    x = Math.floor(Math.random() * grid.length)
    y = Math.floor(Math.random() * grid.length)
  }

  grid[x][y] = 2
}

const handleKeyDown = (event) => {
  if (Math.abs(animOffset.x) > 0 || Math.abs(animOffset.y) > 0) return

  switch (event.keyCode) {
    case 87:
      animOffset = {
        x: 0,
        y: -1
      }
      break
    case 83:
      animOffset = {
        x: 0,
        y: 1
      }
      break
    case 68:
      animOffset = {
        x: 1,
        y: 0
      }
      break
    case 65:
      animOffset = {
        x: -1,
        y: 0
      }
      break
  }
}

const loop = (timestamp) => {
  update()
  drawBoard(context)
  drawPieces(context)

  window.requestAnimationFrame(loop)
}

const update = () => {
  if (animOffset.x < 0) animOffset.x -= ANIM_SPEED
  else if (animOffset.x > 0) animOffset.x += ANIM_SPEED

  if (animOffset.y < 0) animOffset.y -= ANIM_SPEED
  else if (animOffset.y > 0) animOffset.y += ANIM_SPEED

  if (Math.abs(animOffset.x) > (SQUARE_SIZE + GAP) || Math.abs(animOffset.y) > (SQUARE_SIZE + GAP)) { 
    const moveX = animOffset.x > 0 ? 1 : animOffset.x < 0 ? -1 : 0
    const moveY = animOffset.y > 0 ? 1 : animOffset.y < 0 ? -1 : 0

    const newGrid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]

    let didMove = false

    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid.length; y++) {
        if (canMove(x, y) && grid[x][y] > 0) { 
          didMove = true
          if (grid[x + moveX][y + moveY] === grid[x][y] && !canMove(x + moveX, y + moveY))  {
            score += grid[x][y] * 2
            newGrid[x + moveX][y + moveY] = grid[x][y] * 2
          }
          else newGrid[x + moveX][y + moveY] = grid[x][y] 
        } else if (grid[x][y] !== 0 && newGrid[x][y] === 0) {
          newGrid[x][y] = grid[x][y]
        }
      }
    }

    grid = newGrid

    if (didMove) {
      animOffset = {
        x: moveX,
        y: moveY
      }
    } else {
      animOffset = {
        x: 0,
        y: 0
      }
      addTile()
    }
  }

  setScoreCallback(score)
}

const drawBoard = (context) => {
  context.clearRect(0, 0, 350, 350)

  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = '42px Arial'

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      context.fillStyle = 'gray'
      context.fillRect(x * (SQUARE_SIZE + GAP), y * (SQUARE_SIZE + GAP), SQUARE_SIZE, SQUARE_SIZE)
    }
  }
}

const drawPieces = (context) => {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid.length; y++) {
      const value = grid[x][y]
      if (value === 0) continue

      const cellCanMove = canMove(x, y)

      context.fillStyle = TILE_COLORS[value]  
      context.fillRect(x * (SQUARE_SIZE + GAP) + (cellCanMove ? animOffset.x : 0), y * (SQUARE_SIZE + GAP) + (cellCanMove ?animOffset.y : 0), SQUARE_SIZE, SQUARE_SIZE)

      context.fillStyle = 'black'  
      context.fillText(value.toString(), 
        x * (SQUARE_SIZE + GAP) + (SQUARE_SIZE / 2) + (cellCanMove ? animOffset.x : 0), 
        y * (SQUARE_SIZE + GAP) + (SQUARE_SIZE / 2) + (cellCanMove ? animOffset.y : 0)
      )
    }
  }
}

const canMove = (x, y) => {
  const moveX = animOffset.x > 0 ? 1 : animOffset.x < 0 ? -1 : 0
  const moveY = animOffset.y > 0 ? 1 : animOffset.y < 0 ? -1 : 0

  if (x + moveX < 0 || x + moveX > (grid.length - 1)) return false
  if (y + moveY < 0 || y + moveY > (grid.length - 1)) return false

  const curValue = grid[x][y]
  const targetValue = grid[x + moveX][y + moveY]

  if (targetValue !== 0 && targetValue !== curValue && !canMove(x + moveX, y + moveY)) return false

  return true
}