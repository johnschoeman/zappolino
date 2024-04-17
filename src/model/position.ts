type Rank = "0" | "1" | "2" | "3" | "4"
type File = "A" | "B" | "C" | "D" | "E"

export type RankFile =
  | "A0"
  | "A1"
  | "A2"
  | "A3"
  | "A4"
  | "B0"
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "C0"
  | "C1"
  | "C2"
  | "C3"
  | "C4"
  | "D0"
  | "D1"
  | "D2"
  | "D3"
  | "D4"
  | "E0"
  | "E1"
  | "E2"
  | "E3"
  | "E4"

const allRankFile: RankFile[] = [
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "B0",
  "B1",
  "B2",
  "B3",
  "B4",
  "C0",
  "C1",
  "C2",
  "C3",
  "C4",
  "D0",
  "D1",
  "D2",
  "D3",
  "D4",
  "E0",
  "E1",
  "E2",
  "E3",
  "E4",
]

const isRankFile = (str: string): str is RankFile => {
  const result = allRankFile.includes(str as RankFile)
  return result
}

export type Position = { rowIdx: number; colIdx: number }

export const build = (rowIdx: number, colIdx: number): Position => {
  return { rowIdx, colIdx }
}

export const toRankFile = ({ rowIdx, colIdx }: Position): RankFile => {
  const rank = rowToRank(rowIdx)
  const file = colToFile(colIdx)

  const result = `${file}${rank}`

  if (isRankFile(result)) {
    return result
  } else {
    return "A0"
  }
}

const rowToRank = (rowIdx: number): Rank => {
  switch (rowIdx) {
    case 0:
      return "0"
    case 1:
      return "1"
    case 2:
      return "2"
    case 3:
      return "3"
    case 4:
      return "4"
    default:
      return "0"
  }
}

const colToFile = (colIdx: number): File => {
  switch (colIdx) {
    case 0:
      return "A"
    case 1:
      return "B"
    case 2:
      return "C"
    case 3:
      return "D"
    case 4:
      return "E"
    default:
      return "E"
  }
}
