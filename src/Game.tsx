/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import moment from 'moment'
import type { Difficulty } from 'sudoku-gen/dist/types/difficulty.type'
import { Header } from './components/layout/Header'
import { GameSection } from './components/layout/GameSection'
import { StatusSection } from './components/layout/StatusSection'
// import { Footer } from './components/layout/Footer'
// import { getUniqueSudoku } from './solver/UniqueSudoku'
import getUniqueSudoku from './generator/sudoku'
import { useSudokuContext } from './context/SudokuContext'

/**
 * Game is the main React component.
 */
export const Game: React.FC<{}> = () => {
  useEffect(() => {
    window.highscores.init('Sudoku', 'scoreboard')
  }, [])

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
    setWon,
  } = useSudokuContext()
  const [mistakesMode, setMistakesMode] = useState<boolean>(false)
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
      const tempHistory = history.slice()

      // Can't use tempArray here, due to Side effect below!!
      tempHistory.push(gameArray.slice())
      setHistory(tempHistory)

      tempArray[index] = value
      setGameArray(tempArray)

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
    if (mistakesMode) {
      if (value === solvedArray[index]) {
        _fillCell(index, value)
      }
      else {
        // TODO: Flash - Mistakes not allowed in Mistakes Mode
      }
    }
    else {
      _fillCell(index, value)
    }
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
    if (fastMode)
      setNumberSelected(number)
    else if (cellSelected !== -1)
      _userFillCell(cellSelected, number)
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
      if (tempArray !== undefined)
        setGameArray(tempArray)
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
   * On Click Hint,
   * fill the selected cell if its empty or wrong number is filled.
   */
  function onClickHint() {
    if (cellSelected !== -1)
      _fillCell(cellSelected, solvedArray[cellSelected])
  }

  /**
   * Toggle Mistakes Mode
   */
  function onClickMistakesMode() {
    setMistakesMode(!mistakesMode)
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
    _createNewGame()
  }

  /**
   * On load, create a New Game.
   */
  useEffect(() => {
    _createNewGame()
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
            onClickHint={onClickHint}
            onClickMistakesMode={onClickMistakesMode}
            onClickFastMode={onClickFastMode}
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
          You <span className="overlay__textspan1">solved</span> <span className="overlay__textspan2">it!</span>
        </h2>
        <div id="scoreboard"></div>
      </div>
    </>
  )
}
