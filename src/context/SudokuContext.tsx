import React, { createContext, useContext, useState } from 'react'
import moment from 'moment'

interface SudokuContextProps {
  numberSelected: string
  setNumberSelected: React.Dispatch<React.SetStateAction<string>>
  gameArray: string[]
  setGameArray: React.Dispatch<React.SetStateAction<string[]>>
  difficulty: string
  setDifficulty: React.Dispatch<React.SetStateAction<string>>
  timeGameStarted: moment.Moment
  setTimeGameStarted: React.Dispatch<React.SetStateAction<moment.Moment>>
  fastMode: boolean
  setFastMode: React.Dispatch<React.SetStateAction<boolean>>
  cellSelected: number
  setCellSelected: React.Dispatch<React.SetStateAction<number>>
  initArray: string[]
  setInitArray: React.Dispatch<React.SetStateAction<string[]>>
  won: boolean
  setWon: React.Dispatch<React.SetStateAction<boolean>>
}

const SudokuContext = createContext<SudokuContextProps>({
  numberSelected: '0',
  setNumberSelected: () => {},
  gameArray: [],
  setGameArray: () => {},
  difficulty: 'Easy',
  setDifficulty: () => {},
  timeGameStarted: moment(),
  setTimeGameStarted: () => {},
  fastMode: false,
  setFastMode: () => {},
  cellSelected: -1,
  setCellSelected: () => {},
  initArray: [],
  setInitArray: () => {},
  won: false,
  setWon: () => {},
})

interface SudokuProviderProps {
  children: React.ReactElement
}

export const SudokuProvider = ({ children }: SudokuProviderProps) => {
  const [numberSelected, setNumberSelected] = useState<string>('0')
  const [gameArray, setGameArray] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<string>('Easy')
  const [timeGameStarted, setTimeGameStarted] = useState<moment.Moment>(moment())
  const [fastMode, setFastMode] = useState<boolean>(false)
  const [cellSelected, setCellSelected] = useState<number>(-1)
  const [initArray, setInitArray] = useState<string[]>([])
  const [won, setWon] = useState<boolean>(false)

  return (
    <SudokuContext.Provider value={
      {
        numberSelected,
        setNumberSelected,
        gameArray,
        setGameArray,
        difficulty,
        setDifficulty,
        timeGameStarted,
        setTimeGameStarted,
        fastMode,
        setFastMode,
        cellSelected,
        setCellSelected,
        initArray,
        setInitArray,
        won,
        setWon,
      }
    }>
      {children}
    </SudokuContext.Provider>
  )
}

export const useSudokuContext = (): SudokuContextProps => useContext(SudokuContext)

// Usage
// const { numberSelected, setNumberSelected } = useNumberValue();
