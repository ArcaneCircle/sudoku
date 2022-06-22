/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type'
import { Header } from './components/layout/Header'
import { GameSection } from './components/layout/GameSection'
import { StatusSection } from './components/layout/StatusSection'
import getUniqueSudoku from './generator/sudoku'
import { useSudokuContext } from './context/SudokuContext'

/**
 * Game is the main React component.
 */
export const Game: React.FC<{}> = () => {
  useEffect(() => {
    window.highscores.init('Sudoku', 'scoreboard')
  }, [])

  // Is scoreboard empty?
  const isEmpty = document.querySelector('#scoreboard')?.innerHTML === ''

  /**
   * All the variables for holding state:
   * gameArray: Holds the current state of the game.
   * initArray: Holds the initial state of the game.
   * solvedArray: Holds the solved position of the game.
   * difficulty: Difficulty level - 'Easy', 'Medium', 'Hard' or 'Expert'.
   * numberSelected: The Number selected in the Status section.
   * timeGameStarted: Time the current game was started.
   * mistakesMode: Is Mistakes allowed or not?
   * fastMode: Is Fast Mode enabled?
   * cellSelected: If a game cell is selected by the user, holds the index.
   * history: history of the current game, for 'Undo' purposes.
   * overlay: Is the 'Game Solved' overlay enabled?
   * won: Is the game 'won'?
   */
  const {
    numberSelected, setNumberSelected,
    gameArray, setGameArray,
    difficulty, setDifficulty,
    setTimeGameStarted,
    fastMode, setFastMode,
    cellSelected, setCellSelected,
    initArray, setInitArray,
    won, setWon,
  } = useSudokuContext()
  const [history, setHistory] = useState<string[][]>([])
  const [solvedArray, setSolvedArray] = useState<string[]>([])
  const [overlay, setOverlay] = useState<boolean>(false)

  /**
   * Calculate new score based on game difficulty
   * @param difficulty Difficulty level - 'Easy', 'Medium', 'Hard' or 'Expert'.
   */
  function calculateScore(difficulty: Difficulty) {
    switch (difficulty) {
      case 'easy':
        return 5
      case 'medium':
        return 50
      case 'hard':
        return 100
      case 'expert':
        return 250
      default:
        return 5
    }
  }

  /**
   * Creates a new game and initializes the state variables.
   */
  function _createNewGame(e?: React.ChangeEvent<HTMLSelectElement>) {
    const [temporaryInitArray, temporarySolvedArray] = getUniqueSudoku(difficulty as Difficulty, e)

    const state = {
      initArray: temporaryInitArray,
      currentArray: temporaryInitArray,
      solvedArray: temporarySolvedArray,
      historyArray: [] as string[][],
    }

    window.localStorage.setItem('sudoku-state', JSON.stringify(state))

    setInitArray(temporaryInitArray)
    setGameArray(temporaryInitArray)
    setSolvedArray(temporarySolvedArray)
    setNumberSelected('0')
    setTimeGameStarted(moment())
    setCellSelected(-1)
    setHistory([])
    setWon(false)
  }

  /**
   * save the current game state to local storage
   * @param state current game state
   */
  function _saveState(initArray: string[], currentArray: string[], solvedArray: string[], historyArray: string[][]) {
    const state = {
      initArray,
      currentArray,
      solvedArray,
      historyArray,
    }
    window.localStorage.setItem('sudoku-state', JSON.stringify(state))
  }

  /**
   * Continues a game from the last state.
   * @param initArray The initial state of the game.
   * @param currentArray The last state of the game.
   * @param solvedArray The solved state of the game.
   * @param historyArray The last selected number.
   */
  function _continueGame(initArray: string[], currentArray: string[], solvedArray: string[], historyArray: string[][]) {
    setInitArray(initArray)
    setGameArray(currentArray)
    setSolvedArray(solvedArray)
    setNumberSelected('0')
    setTimeGameStarted(moment())
    setCellSelected(-1)
    setHistory(historyArray)
    setWon(false)
  }

  /**
   * Checks if the game is solved.
   */
  function _isSolved(index: number, value: string) {
    if (gameArray.every((cell: string, cellIndex: number) => {
      if (cellIndex === index)
        return value === solvedArray[cellIndex]
      else
        return cell === solvedArray[cellIndex]
    }))
      return true

    return false
  }

  /**
   * Fills the cell with the given 'value'
   * Used to Fill / Erase as required.
   */
  function _fillCell(index: number, value: string) {
    if (initArray[index] === '0') {
      // Direct copy results in interesting set of problems, investigate more!
      const tempArray = gameArray.slice()
      const tempHistory = history ? history.slice() : []

      // Can't use tempArray here, due to Side effect below!!
      tempHistory.push(gameArray.slice())
      setHistory(tempHistory)

      tempArray[index] = value
      setGameArray(tempArray)
      _saveState(initArray, tempArray, solvedArray, tempHistory)
      if (_isSolved(index, value)) {
        setOverlay(true)
        const oldScore = window.highscores.getScore()
        const newScore = oldScore + calculateScore(difficulty as Difficulty)
        window.highscores.setScore(newScore, false)
        setWon(true)
      }
    }
  }

  /**
   * A 'user fill' will be passed on to the
   * _fillCell function above.
   */
  function _userFillCell(index: number, value: string) {
    _fillCell(index, value)
  }

  /**
   * On Click of 'New Game' link,
   * create a new game.
   */
  function onClickNewGame() {
    _createNewGame()
  }

  /**
   * On Click of a Game cell.
   */
  function onClickCell(indexOfArray: number) {
    if (fastMode && numberSelected !== '0')
      _userFillCell(indexOfArray, numberSelected)

    if (!fastMode)
      setCellSelected(indexOfArray)
  }

  /**
   * On Change Difficulty,
   * 1. Update 'Difficulty' level
   * 2. Create New Game
   */
  function onChangeDifficulty(e: React.ChangeEvent<HTMLSelectElement>) {
    setDifficulty(e.target.value)
    _createNewGame(e)
  }

  /**
   * On Click of Number in Status section,
   * either fill cell or set the number.
   */
  function onClickNumber(number: string) {
    if (fastMode) {
      setNumberSelected(number)
      _saveState(initArray, gameArray, solvedArray, history)
    }
    else if (cellSelected !== -1) { _userFillCell(cellSelected, number) }
  }

  /**
   * On Click Undo,
   * try to Undo the latest change.
   */
  function onClickUndo() {
    if (history.length) {
      const tempHistory = history.slice()
      const tempArray = tempHistory.pop()
      setHistory(tempHistory)
      if (tempArray !== undefined) {
        _saveState(initArray, gameArray, solvedArray, tempHistory)
        setGameArray(tempArray)
      }
    }
  }

  /**
   * On Click Erase,
   * try to delete the cell.
   */
  function onClickErase() {
    if (cellSelected !== -1 && gameArray[cellSelected] !== '0')
      _fillCell(cellSelected, '0')
  }

  /**
   * Toggle Fast Mode
   */
  function onClickFastMode() {
    if (fastMode)
      setNumberSelected('0')

    setCellSelected(-1)
    setFastMode(!fastMode)
  }

  /**
   * Close the overlay on Click.
   */
  function onClickOverlay() {
    setOverlay(false)
    if (won)
      _createNewGame()
  }

  /**
   * On load, create a New Game or continue the previous one.
   */
  useEffect(() => {
    // store state in localStorage
    const state = window.localStorage.getItem('sudoku-state')
    if (state) {
      const parsedState = JSON.parse(state)
      _continueGame(parsedState.initArray, parsedState.currentArray, parsedState.solvedArray, parsedState.historyArray)
    }
    else {
      _createNewGame()
    }
    // eslint-disable-next-line eslint-comments/no-unlimited-disable
  }, [])

  return (
    <>
      <div className={overlay ? 'mycontainer blur' : 'mycontainer'}>
        <Header onClick={onClickNewGame} />
        <div className="innercontainer">
          <GameSection
            onClick={(indexOfArray: number) => onClickCell(indexOfArray)}
          />
          <StatusSection
            onClickNumber={(number: string) => onClickNumber(number)}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChangeDifficulty(e)}
            onClickUndo={onClickUndo}
            onClickErase={onClickErase}
            onClickFastMode={onClickFastMode}
            onClickScoreboard={() => setOverlay(true)}
          />
        </div>
        {/* <Footer /> */}
      </div>
      <div className={overlay
        ? 'overlay overlay--visible'
        : 'overlay'
      }
        onClick={onClickOverlay}
      >
        <h2 className="overlay__text">
          {won ? <>You <span className="overlay__textspan1">solved</span> <span className="overlay__textspan2">it!</span></> : <>S<span className="overlay__textspan1">c</span><span className="overlay__textspan2">o</span>r<span className="overlay__textspan1">e</span><span className="overlay__textspan2">b</span>o<span className="overlay__textspan1">a</span><span className="overlay__textspan2">r</span>d</>}
        </h2>
        {(isEmpty && !won) && <h2 className="score-row">No scores yet!</h2>}
        <div id="scoreboard"></div>
      </div>
    </>
  )
}
