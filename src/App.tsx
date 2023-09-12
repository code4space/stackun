import { useEffect, useRef, useState } from 'react'
import './App.scss'
import Stopwatch from './stopwatch';

function App() {
  const [puzzle, setPuzzle] = useState<(Array<any>)[]>([]);
  const [direction, setDirection] = useState<string>('')
  const [activeIndex, setActiveIndex] = useState<number[]>([])
  const [isWin, setIsWin] = useState<Boolean>(false)
  const [resetStopwatch, setResetStopwatch] = useState<boolean>(false)
  const [countMove, setCountMove] = useState<number>(0)

  console.log(activeIndex)
  function scramble() {
    let array = [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, '']
    ]

    let i = 100
    while (i > 0) {
      const random = Math.ceil(Math.random() * 4),
        findEmpty = array.flat().findIndex(el => el === ''),
        indexY = Math.floor(findEmpty / 4),
        indexX = findEmpty % 4

      if (random === 1) {
        if (array[indexY][indexX - 1]) {
          [array[indexY][indexX - 1], array[indexY][indexX]] = [array[indexY][indexX], array[indexY][indexX - 1]]
          i--
        }
      } else if (random === 2) {
        if (array[indexY][indexX + 1]) {
          [array[indexY][indexX + 1], array[indexY][indexX]] = [array[indexY][indexX], array[indexY][indexX + 1]]
          i--
        }
      } else if (random === 3) {
        if (array[indexY - 1]) {
          [array[indexY - 1][indexX], array[indexY][indexX]] = [array[indexY][indexX], array[indexY - 1][indexX]]
          i--
        }
      } else if (random === 4) {
        if (array[indexY + 1]) {
          [array[indexY + 1][indexX], array[indexY][indexX]] = [array[indexY][indexX], array[indexY + 1][indexX]]
          i--
        }
      }
    }
    const findEmpty = array.flat().findIndex(el => el === ''),
      indexY = Math.floor(findEmpty / 4),
      indexX = findEmpty % 4
    setActiveIndex([indexY, indexX])
    setPuzzle(array)
  }

  const containerRef: any = useRef(null);

  useEffect(() => {
    scramble()
    containerRef.current?.focus();
  }, [])

  function handleclick(index1: number, index2: number): void {
    if (isWin) return
    let puzzleArea = [...puzzle]
    setCountMove(prevState => prevState + 1)

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
      }, 50);

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

  function handleKeyPress(index1: number, index2: number, e: any): void {
    var key = e.key;
    if (key === 'ArrowUp') index1 += 1
    else if (key === 'ArrowDown') index1 -= 1
    else if (key === 'ArrowLeft') index2 += 1
    else if (key === 'ArrowRight') index2 -= 1
    if (index2 > 3 || index2 < 0 || index1 > 3 || index1 < 0) return
    handleclick(index1, index2)
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

  useEffect(() => {
    const handleDocumentKeyDown = (e: any) => {
      if (isWin) return; // Don't handle key events when the game is won
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); // Prevent browser scrolling with arrow keys
        const index1 = activeIndex[0];
        const index2 = activeIndex[1];
        handleKeyPress(index1, index2, e);
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
    };
  }, [activeIndex, isWin]);

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
                if (typeof el1 === 'string') return <button key={el1} className='empty-space' onKeyDown={(e) => handleKeyPress(index1, index2, e)} tabIndex={0} autoFocus />
              }
              if (index1 === activeIndex[0] && index2 === activeIndex[1]) {
                return <span key={el1} className={direction} onClick={() => handleclick(index1, index2)} ref={containerRef}>{el1}</span>
              }
              return <span key={el1} onClick={() => handleclick(index1, index2)}>{el1}</span>
            })
          })}
        </div>
      </div>
      <div className="bottom-content">
        <Stopwatch reset={resetStopwatch} isRunning={!isWin} />
        <div className='stopwatch'>Move: {countMove}</div>
        {isWin && <button onClick={reset}>Reset</button>}
      </div>
      <div className="joy-stick">
        <span style={{ transform: 'rotate(180deg)' }} onClick={() => handleKeyPress(activeIndex[0], activeIndex[1], { key: 'ArrowLeft' })}>&#10148;</span>
        <div>
          <span style={{ transform: 'rotate(-90deg)' }} onClick={() => handleKeyPress(activeIndex[0], activeIndex[1], { key: 'ArrowUp' })}>&#10148;</span>
          <span style={{ transform: 'rotate(90deg)' }} onClick={() => handleKeyPress(activeIndex[0], activeIndex[1], { key: 'ArrowDown' })}>&#10148;</span>
        </div>
        <span onClick={() => handleKeyPress(activeIndex[0], activeIndex[1], { key: 'ArrowRight' })}>&#10148;</span>
      </div>

    </div>
  )
}

export default App
