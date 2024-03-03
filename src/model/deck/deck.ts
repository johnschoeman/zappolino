import { Effect, pipe, Option, Random, ReadonlyArray } from "effect"

type Card = "Place" | "MoveLeft" | "MoveRight" | "MoveForward"

export type Pile = Card[]

export type Disc = Pile
export type Draw = Pile
export type Hand = Pile
export type Played = Pile

export type Deck = {
  hand: Hand
  draw: Draw
  disc: Disc
  selectedCardIdx: Option.Option<number>
  playedCards: Played
}

export const initial: Deck = {
  hand: [],
  draw: [],
  disc: [],
  selectedCardIdx: Option.none(),
  playedCards: [],
}

export const draw =
  (n: number) =>
  (deck: Deck): Deck => {
    const { hand, draw: drawPile, disc, selectedCardIdx, playedCards } = deck
    const nextHand = pipe(
      drawPile,
      ReadonlyArray.take(n),
      ReadonlyArray.appendAll(hand),
    )
    const nextDrawPile = pipe(drawPile, ReadonlyArray.drop(n))

    return {
      hand: nextHand,
      draw: nextDrawPile,
      disc,
      selectedCardIdx,
      playedCards,
    }
  }

export const discardHand = (deck: Deck): Deck => {
  const { hand, draw: drawPile, disc, selectedCardIdx, playedCards } = deck
  const nextHand: Hand = []
  const nextDisc: Disc = pipe(hand, ReadonlyArray.appendAll(disc))

  return {
    hand: nextHand,
    draw: drawPile,
    disc: nextDisc,
    selectedCardIdx,
    playedCards,
  }
}

export const shuffleDiscIntoDraw = (deck: Deck): Deck => {
  const s = Effect.gen(function* (_) {
    const { hand, draw: drawPile, disc, selectedCardIdx, playedCards } = deck

    const shuffled = yield* _(Random.shuffle(disc))

    const nextDraw = pipe(drawPile, ReadonlyArray.appendAll(shuffled))

    const nextDeck: Deck = {
      hand,
      draw: nextDraw,
      disc: [],
      selectedCardIdx,
      playedCards,
    }

    return nextDeck
  })

  const result = Effect.runSync(s)

  return result
}

// Tactic
// Strategy
// Supply
