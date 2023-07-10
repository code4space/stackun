import { useEffect, useState } from 'react'
import './App.scss'
import Stopwatch from './stopwatch';

function App() {
  const [puzzle, setPuzzle] = useState<(Array<any>)[]>([]);
  const [direction, setDirection] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState<number[]>([])
  const [isWin, setIsWin] = useState<Boolean>(false)
  const [resetStopwatch, setResetStopwatch] = useState<boolean>(false)

  function scramble() {
    let numbers = Array.from({ length: 15 }, (_, i) => {
      return i + 1
    })

    let randomArrayNumber: Array<any> = []
    let result: Array<any> = []

    for (let i = 0; i < 15; i++) {
      let temp
      let randomNumber = Math.floor(Math.random() * numbers.length)
      temp = numbers.splice(randomNumber, 1)[0]
      randomArrayNumber.push(temp)
      if (randomArrayNumber.length === 4) {
        result.push(randomArrayNumber)
        randomArrayNumber = []
      }
    }
    randomArrayNumber.push('')
    result.push(randomArrayNumber)
    setPuzzle(result)
  }

  useEffect(() => {
    let numbers = Array.from({ length: 15 }, (_, i) => {
      return i + 1
    })

    let randomArrayNumber: Array<any> = []
    let result: Array<any> = []

    for (let i = 0; i < 15; i++) {
      let temp
      let randomNumber = Math.floor(Math.random() * numbers.length)
      temp = numbers.splice(randomNumber, 1)[0]
      randomArrayNumber.push(temp)
      if (randomArrayNumber.length === 4) {
        result.push(randomArrayNumber)
        randomArrayNumber = []
      }
    }
    randomArrayNumber.push('')
    result.push(randomArrayNumber)
    setPuzzle(result)
  }, [])

  function handleclick(index1: number, index2: number): void {
    if (isWin) return
    let puzzleArea = [...puzzle]

    function move(direction: 'top' | 'left' | 'right' | 'bottom') {
      setActiveIndex([index1, index2])
      setDirection(direction)
      const timer = setTimeout(() => {
        const updatedPuzzle = [...puzzle];
        if (direction === 'bottom') {
          updatedPuzzle[index1 + 1][index2] = puzzle[index1][index2];
          updatedPuzzle[index1][index2] = '';
        } else if (direction === 'right') {
          puzzleArea[index1][index2 + 1] = puzzleArea[index1][index2]
          puzzleArea[index1][index2] = ''
        } else if (direction === 'left') {
          puzzleArea[index1][index2 - 1] = puzzleArea[index1][index2]
          puzzleArea[index1][index2] = ''
        } else if (direction === 'top') {
          updatedPuzzle[index1 - 1][index2] = puzzle[index1][index2];
          updatedPuzzle[index1][index2] = '';
        }
        setPuzzle(updatedPuzzle);
        setDirection('')
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }

    if (puzzleArea[index1 + 1] && typeof puzzleArea[index1 + 1][index2] === 'string') {
      move('bottom')
    }
    else if (puzzleArea[index1 - 1] && typeof puzzleArea[index1 - 1][index2] === 'string') {
      move('top')
    }
    else if (puzzleArea[index1] && typeof puzzleArea[index1][index2 + 1] === 'string') {
      move('right',)
    }
    else if (puzzleArea[index1] && typeof puzzleArea[index1][index2 - 1] === 'string') {
      move('left')
    }
  }

  function reset(): void {
    scramble()
    setIsWin(false)
    setResetStopwatch(true)
    setTimeout(() => {
      setResetStopwatch(false)
    }, 100)
  }

  useEffect(() => {
    let correctPuzzle: any[][] = Array.from({ length: 4 }, (_, i) => {
      return Array.from({ length: 4 }, (_, k) => {
        return i * 4 + k + 1
      })
    })
    correctPuzzle[3][3] = ''
    if (JSON.stringify(correctPuzzle) === JSON.stringify(puzzle)) {
      setIsWin(true)
    }
  }, [puzzle]);

  return (
    <div className='center'>
      <h1>STACKUN</h1>
      <div className="border">
        <div className="container">
          {puzzle.map((el, index1) => {
            return el.map((el1, index2) => {
              if (isWin) {
                if (typeof el1 === 'string') return <span key={el1}>&#8862;</span>
              } else {
                if (typeof el1 === 'string') return <span key={el1} className='empty-space'></span>
              }
              if (index1 === activeIndex[0] && index2 === activeIndex[1]) {
                return <span key={el1} className={direction} onClick={() => handleclick(index1, index2)}>{el1}</span>
              }
              return <span key={el1} onClick={() => handleclick(index1, index2)}>{el1}</span>
            })
          })}
        </div>
      </div>
      <div className="bottom-content">
        <Stopwatch reset={resetStopwatch} isRunning={!isWin} />
        {isWin && <button onClick={reset}>Reset</button>}
      </div>

    </div>
  )
}

export default App
