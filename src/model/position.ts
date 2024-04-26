import { String } from "effect"

export type Rank = "0" | "1" | "2" | "3" | "4" | "5" | "6"
export type File = "A" | "B" | "C" | "D" | "E"

const allRank = ["0", "1", "2", "3", "4", "5", "6"]
const allFile = ["A", "B", "C", "D", "E"]

export type RankFile = {
  rank: Rank
  file: File
}

export const isRank = (str: string): str is Rank => {
  return allRank.includes(str as Rank)
}

export const isFile = (str: string): str is File => {
  return allFile.includes(str as File)
}

export type Position = { rowIdx: number; colIdx: number }

export const build = (rowIdx: number, colIdx: number): Position => {
  return { rowIdx, colIdx }
}

export const buildRankFile = (rank: Rank, file: File): RankFile => {
  return { rank, file }
}

export const toRankFile = ({ rowIdx, colIdx }: Position): RankFile => {
  const rank = rowToRank(rowIdx)
  const file = colToFile(colIdx)

  const result = {
    file,
    rank,
  }
  return result
}

export const rowToRank = (rowIdx: number): Rank => {
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
    case 5:
      return "5"
    case 6:
      return "6"
    default:
      return "0"
  }
}

export const colToFile = (colIdx: number): File => {
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
      return "A"
  }
}

export const showRankFile = ({ file, rank }: RankFile): string => {
  return `${file}${rank}`
}

const parseRank = (str: string): Rank => {
  switch (str) {
    case "0":
      return "0"
    case "1":
      return "1"
    case "2":
      return "2"
    case "3":
      return "3"
    case "4":
      return "4"
    case "5":
      return "5"
    case "6":
      return "6"
    default:
      return "0"
  }
}

export const parseFile = (str: string): File => {
  switch (str) {
    case "A":
      return "A"
    case "B":
      return "B"
    case "C":
      return "C"
    case "D":
      return "D"
    case "E":
      return "E"
    default:
      return "A"
  }
}

export const parseRankFile = (str: string): RankFile => {
  const [fileStr, rankStr] = String.split("")(str)

  const rank = parseRank(rankStr ?? "")
  const file = parseFile(fileStr ?? "")

  return { rank, file }
}
