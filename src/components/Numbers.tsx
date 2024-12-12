import { useSudokuContext } from "../context/SudokuContext";

interface NumbersProps {
  onClickNumber: (number: string) => void;
}

/**
 * React component for the Number Selector in the Status Section.
 */
export const Numbers = ({ onClickNumber }: NumbersProps) => {
  const { numberSelected, gameArray } = useSudokuContext();
  return (
    <div className="status__numbers">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => {
        const numberTimes = gameArray.filter(
          (arrayNumber) => number.toString() === arrayNumber,
        ).length;
        if (numberSelected === number.toString()) {
          return (
            <div
              className={
                numberTimes > 8
                  ? "status__number disabled_number"
                  : "status__number status__number--selected"
              }
              key={number}
              onClick={() => onClickNumber(number.toString())}
            >
              {number}
            </div>
          );
        } else {
          return (
            <div
              className={
                numberTimes > 8
                  ? "status__number disabled_number"
                  : "status__number"
              }
              key={number}
              onClick={() => onClickNumber(number.toString())}
            >
              {number}
            </div>
          );
        }
      })}
    </div>
  );
};
