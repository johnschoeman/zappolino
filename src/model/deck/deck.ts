import { pipe, Effect, Random, ReadonlyArray } from "effect"

type Card = "Place" | "MoveLeft" | "MoveRight" | "MoveForward"

export type Pile = Card[]

export type Disc = Pile
export type Draw = Pile
export type Hand = Pile

export type Deck = [Hand, Draw, Disc]

export const draw =
  (n: number) =>
  ([hand, drawPile, discard]: Deck): Deck => {
    const nextHand = pipe(
      drawPile,
      ReadonlyArray.take(n),
      ReadonlyArray.appendAll(hand),
    )
    const nextDrawPile = pipe(drawPile, ReadonlyArray.drop(n))

    return [nextHand, nextDrawPile, discard]
  }

export const discardHand = ([hand, drawPile, disc]: Deck): Deck => {
  const nextHand: Hand = []
  const nextDisc: Disc = pipe(hand, ReadonlyArray.appendAll(disc))

  return [nextHand, drawPile, nextDisc]
}

export const shuffleDiscIntoDraw = ([
  hand,
  drawPile,
  discPile,
]: Deck): Deck => {
  const s = Effect.gen(function* (_) {
    const shuffled = yield* _(Random.shuffle(discPile))

    const nextDraw = pipe(drawPile, ReadonlyArray.appendAll(shuffled))

    const nextDeck: Deck = [hand, nextDraw, []]

    return nextDeck
  })

  const result = Effect.runSync(s)

  return result
}

// Tactic
// Strategy
// Supply
