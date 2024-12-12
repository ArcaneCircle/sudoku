import { getSudoku } from "sudoku-gen";
import type { Difficulty } from "sudoku-gen/dist/types/difficulty.type";

const getUniqueSudoku = (
  difficulty: Difficulty,
  e?: React.ChangeEvent<HTMLSelectElement>,
) => {
  let currentDifficulty = difficulty;
  if (e) currentDifficulty = e.target.value as Difficulty;
  const sudoku = getSudoku(currentDifficulty);
  const initArray = sudoku.puzzle.replace(/\-/g, "0").split("");
  const solvedArray = sudoku.solution.split("");
  return [initArray, solvedArray];
};

export default getUniqueSudoku;
