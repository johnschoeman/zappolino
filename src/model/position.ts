export type Position = { rowIdx: number; colIdx: number }

export const build = (rowIdx: number, colIdx: number): Position => {
  return { rowIdx, colIdx }
}
