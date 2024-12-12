import React, { createContext, useContext, useState } from "react";
import moment from "moment";

interface SudokuContextProps {
  numberSelected: string;
  setNumberSelected: React.Dispatch<React.SetStateAction<string>>;
  gameArray: string[];
  setGameArray: React.Dispatch<React.SetStateAction<string[]>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
  timeGameStarted: moment.Moment;
  setTimeGameStarted: React.Dispatch<React.SetStateAction<moment.Moment>>;
  elapsedTime: number;
  setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
  fastMode: boolean;
  setFastMode: React.Dispatch<React.SetStateAction<boolean>>;
  cellSelected: number;
  setCellSelected: React.Dispatch<React.SetStateAction<number>>;
  initArray: string[];
  setInitArray: React.Dispatch<React.SetStateAction<string[]>>;
  won: boolean;
  setWon: React.Dispatch<React.SetStateAction<boolean>>;
}

const SudokuContext = createContext<SudokuContextProps>({
  numberSelected: "0",
  setNumberSelected: () => {},
  gameArray: [],
  setGameArray: () => {},
  difficulty: "easy",
  setDifficulty: () => {},
  timeGameStarted: moment(),
  setTimeGameStarted: () => {},
  elapsedTime: 0,
  setElapsedTime: () => {},
  fastMode: false,
  setFastMode: () => {},
  cellSelected: -1,
  setCellSelected: () => {},
  initArray: [],
  setInitArray: () => {},
  won: false,
  setWon: () => {},
});

interface SudokuProviderProps {
  children: React.ReactElement;
}

export const SudokuProvider = ({ children }: SudokuProviderProps) => {
  const [numberSelected, setNumberSelected] = useState<string>("0");
  const [gameArray, setGameArray] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<string>("easy");
  const [timeGameStarted, setTimeGameStarted] =
    useState<moment.Moment>(moment());
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [fastMode, setFastMode] = useState<boolean>(false);
  const [cellSelected, setCellSelected] = useState<number>(-1);
  const [initArray, setInitArray] = useState<string[]>([]);
  const [won, setWon] = useState<boolean>(false);

  return (
    <SudokuContext.Provider
      value={{
        numberSelected,
        setNumberSelected,
        gameArray,
        setGameArray,
        difficulty,
        setDifficulty,
        timeGameStarted,
        setTimeGameStarted,
        elapsedTime,
        setElapsedTime,
        fastMode,
        setFastMode,
        cellSelected,
        setCellSelected,
        initArray,
        setInitArray,
        won,
        setWon,
      }}
    >
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudokuContext = (): SudokuContextProps =>
  useContext(SudokuContext);
