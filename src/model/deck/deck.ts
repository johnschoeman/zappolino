import { Effect, Option, pipe, Random, ReadonlyArray } from "effect"

import * as Card from "./card"

export type Pile = Card.Card[]

export type Disc = Pile
export type Draw = Pile
export type Hand = Pile
export type Played = Pile

export type Deck = {
  hand: Hand
  draw: Draw
  disc: Disc
  playedCards: Played
}

export const show = (deck: Deck): string => {
  const { hand, draw, disc, playedCards } = deck
  return `hand: ${hand}, draw: ${draw}, disc: ${disc}, playedCards: ${playedCards}`
}

const initialDraw: Draw = [
  "Place",
  "Place",
  "MoveLeft",
  "MoveRight",
  "MoveForward",
  "Place",
  "Place",
  "MoveLeft",
  "MoveRight",
  "MoveForward",
  "Place",
]

export const initial: Deck = {
  hand: [],
  draw: initialDraw,
  disc: [],
  playedCards: [],
}

export const addCardToDiscard =
  (card: Card.Card) =>
  (deck: Deck): Deck => {
    const nextDiscard: Disc = pipe(deck.disc, ReadonlyArray.append(card))
    return {
      ...deck,
      disc: nextDiscard,
    }
  }

export const getCardAt =
  (cardIdx: number) =>
  (deck: Deck): Option.Option<Card.Card> => {
    return pipe(deck.hand[cardIdx], Option.fromNullable)
  }

export const playCard =
  (cardIdx: number) =>
  (deck: Deck): Deck => {
    const optionCard = pipe(deck.hand, ReadonlyArray.get(cardIdx))
    const nextHand = pipe(deck.hand, ReadonlyArray.remove(cardIdx))
    const nextPlayedCards = pipe(
      optionCard,
      Option.match({
        onNone: () => deck.playedCards,
        onSome: card => pipe(deck.playedCards, ReadonlyArray.append(card)),
      }),
    )

    return {
      ...deck,
      hand: nextHand,
      playedCards: nextPlayedCards,
    }
  }

export const draw =
  (n: number) =>
  (deck: Deck): Deck => {
    if (n === 0) {
      return deck
    }
    return pipe(
      deck,
      (deck_): [Deck, boolean] => [
        deck,
        ReadonlyArray.isEmptyArray(deck_.draw),
      ],
      ([deck_, isDrawPileEmpty]) => {
        if (isDrawPileEmpty) {
          return refillDrawPile(deck_)
        } else {
          return deck_
        }
      },
      drawWithoutRefill,
      deck_ => draw(n - 1)(deck_),
    )
  }

const drawWithoutRefill = (deck: Deck): Deck => {
  const { hand, draw: drawPile, disc, playedCards } = deck
  const nextHand = pipe(
    drawPile,
    ReadonlyArray.take(1),
    ReadonlyArray.prependAll(hand),
  )
  const nextDrawPile = pipe(drawPile, ReadonlyArray.drop(1))

  return {
    hand: nextHand,
    draw: nextDrawPile,
    disc,
    playedCards,
  }
}

export const discardPlayed = (deck: Deck): Deck => {
  const { hand, draw: drawPile, disc, playedCards } = deck
  const nextPlayedCards: Played = []
  const nextDisc: Disc = pipe(playedCards, ReadonlyArray.appendAll(disc))

  return {
    hand,
    draw: drawPile,
    disc: nextDisc,
    playedCards: nextPlayedCards,
  }
}

export const discardHand = (deck: Deck): Deck => {
  const { hand, draw: drawPile, disc, playedCards } = deck
  const nextHand: Hand = []
  const nextDisc: Disc = pipe(hand, ReadonlyArray.appendAll(disc))

  return {
    hand: nextHand,
    draw: drawPile,
    disc: nextDisc,
    playedCards,
  }
}

const refillDrawPile = (deck: Deck): Deck => {
  return {
    ...deck,
    draw: deck.disc,
    disc: [],
  }
}

export const shuffleDraw = (deck: Deck): Deck => {
  const s = Effect.gen(function* (_) {
    const { hand, draw: drawPile, disc, playedCards } = deck

    const shuffled = yield* _(Random.shuffle(drawPile))

    const nextDraw = pipe([], ReadonlyArray.appendAll(shuffled))

    const nextDeck: Deck = {
      hand,
      draw: nextDraw,
      disc,
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
