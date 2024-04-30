// hoplPts -> Hoplite Points
// strtPts -> Strategy Points
// tactPts -> Tactic Points
// rescPts -> Resource Points
// drawPts -> Draw Points

export type PointsPool = {
  hoplPts: number
  strtPts: number
  tactPts: number
  rescPts: number
  drawPts: number
}

export const empty: PointsPool = {
  hoplPts: 0,
  strtPts: 0,
  tactPts: 0,
  rescPts: 0,
  drawPts: 0,
}

export const build = (partial: Partial<PointsPool>): PointsPool => {
  return {
    ...empty,
    ...partial,
  }
}

export const decreaseBy =
  (decreaseBy_: PointsPool) =>
  (poolPoints: PointsPool): PointsPool => {
    return combine(negate(decreaseBy_))(poolPoints)
  }

export const increaseBy =
  (increaseBy_: PointsPool) =>
  (poolPoints: PointsPool): PointsPool => {
    return combine(increaseBy_)(poolPoints)
  }

export const consumeStrategyPoint = decreaseBy(build({ strtPts: 1 }))
export const consumeHoplitePoint = decreaseBy(build({ hoplPts: 1 }))
export const consumeTacticPoint = decreaseBy(build({ tactPts: 1 }))
export const consumeDrawPoint = decreaseBy(build({ drawPts: 1 }))

const negate = (a: PointsPool): PointsPool => {
  return {
    hoplPts: -a.hoplPts,
    strtPts: -a.strtPts,
    tactPts: -a.tactPts,
    rescPts: -a.rescPts,
    drawPts: -a.drawPts,
  }
}

const combine =
  (a: PointsPool) =>
  (b: PointsPool): PointsPool => {
    return {
      hoplPts: a.hoplPts + b.hoplPts,
      strtPts: a.strtPts + b.strtPts,
      tactPts: a.tactPts + b.tactPts,
      rescPts: a.rescPts + b.rescPts,
      drawPts: a.drawPts + b.drawPts,
    }
  }
