import { Array, Effect, Option, pipe, Random } from "effect"

import * as Card from "./card"
import * as Hand from "./hand"

export type Pile = Card.Card[]

export type Disc = Pile
export type Draw = Pile
export type Played = Pile
export type Commited = Pile

export type Deck = {
  hand: Hand.Hand
  draw: Draw
  disc: Disc
  playedCards: Played
  commitedCards: Commited
}

export const show = (deck: Deck): string => {
  const { hand, draw, disc, playedCards } = deck
  return `hand: ${hand}, draw: ${draw}, disc: ${disc}, playedCards: ${playedCards}`
}

const initialDraw: Draw = []

export const initial: Deck = {
  hand: Hand.defaultInitialHand,
  draw: initialDraw,
  disc: [],
  playedCards: [],
  commitedCards: [],
}

export const build = (hand: Hand.Hand): Deck => {
  return {
    ...initial,
    hand,
  }
}

export const addCardToDiscard =
  (card: Card.Card) =>
  (deck: Deck): Deck => {
    const nextDiscard: Disc = pipe(deck.disc, Array.append(card))
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

export const consumeCard =
  (cardIdx: number) =>
  (deck: Deck): Deck => {
    const optionCard = pipe(deck.hand, Array.get(cardIdx))
    const nextHand = pipe(deck.hand, Array.remove(cardIdx))
    const nextPlayedCards = pipe(
      optionCard,
      Option.match({
        onNone: () => deck.playedCards,
        onSome: card => pipe(deck.playedCards, Array.prepend(card)),
      }),
    )

    return {
      ...deck,
      hand: nextHand,
      playedCards: nextPlayedCards,
    }
  }

export const commitCard =
  (cardIdx: number) =>
  (deck: Deck): Deck => {
    const optionCard = pipe(deck.hand, Array.get(cardIdx))
    const nextHand = pipe(deck.hand, Array.remove(cardIdx))
    const nextCommitedCards = pipe(
      optionCard,
      Option.match({
        onNone: () => deck.commitedCards,
        onSome: card => pipe(deck.commitedCards, Array.prepend(card)),
      }),
    )

    return {
      ...deck,
      hand: nextHand,
      commitedCards: nextCommitedCards,
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
      (deck_): [Deck, boolean] => [deck, Array.isEmptyArray(deck_.draw)],
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
  const { hand, draw: drawPile, disc, playedCards, commitedCards } = deck
  const nextHand = pipe(drawPile, Array.take(1), Array.prependAll(hand))
  const nextDrawPile = pipe(drawPile, Array.drop(1))

  return {
    hand: nextHand,
    draw: nextDrawPile,
    disc,
    playedCards,
    commitedCards,
  }
}

export const discardPlayed = (deck: Deck): Deck => {
  const { hand, draw: drawPile, disc, playedCards, commitedCards } = deck
  const nextDisc: Disc = [...commitedCards, ...playedCards, ...disc]

  return {
    hand,
    draw: drawPile,
    disc: nextDisc,
    playedCards: [],
    commitedCards: [],
  }
}

export const discardHand = (deck: Deck): Deck => {
  const { hand, draw: drawPile, disc, playedCards, commitedCards } = deck
  const nextHand: Hand.Hand = []
  const nextDisc: Disc = pipe(hand, Array.appendAll(disc))

  return {
    hand: nextHand,
    draw: drawPile,
    disc: nextDisc,
    playedCards,
    commitedCards,
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
    const { hand, draw: drawPile, disc, playedCards, commitedCards } = deck

    const shuffled = yield* _(Random.shuffle(drawPile))

    const nextDraw = pipe([], Array.appendAll(shuffled))

    const nextDeck: Deck = {
      hand,
      draw: nextDraw,
      disc,
      playedCards,
      commitedCards,
    }

    return nextDeck
  })

  const result = Effect.runSync(s)

  return result
}
