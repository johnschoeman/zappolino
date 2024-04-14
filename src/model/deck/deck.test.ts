import { expect, test } from "bun:test"
import { pipe, ReadonlyArray, String } from "effect"

import { deckFactory } from "../../../factories"

import * as Deck from "./deck"

test("Deck.draw - when the draw pile is empty, it reshuffles the discard and then draws", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = []
  const disc: Deck.Disc = ["Place", "MoveLeft", "MoveRight", "MoveForward"]
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["Place"]
  const expectedDraw: Deck.Draw = ["MoveLeft", "MoveRight", "MoveForward"]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.draw - when given a count of 1, it draws a card and put it into the players hand", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = ["Place", "MoveLeft", "MoveRight", "MoveForward"]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["Place"]
  const expectedDraw: Deck.Draw = ["MoveLeft", "MoveRight", "MoveForward"]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.draw - when given a count of 3, it draws the 3 cards and puts them into the players hand", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = ["Place", "MoveLeft", "MoveRight", "MoveForward"]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(3)(deck)

  const expectedHand: Deck.Hand = ["Place", "MoveLeft", "MoveRight"]
  const expectedDraw: Deck.Draw = ["MoveForward"]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.draw - when the draw pile is empty, it does nothing", () => {
  const hand: Deck.Hand = ["Place", "Place"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["Place", "Place"]
  const expectedDraw: Deck.Draw = []
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
  }

  expect(result).toEqual(expected)
})

// test("Deck.playCard - it moves the currently selected card into the played cards list", () => {
//   const hand: Deck.Hand = ["Place", "MoveLeft", "Place"]
//   const playedCards: Deck.Played = []
//   const deck: Deck.Deck = deckFactory.build({
//     hand,
//     playedCards,
//   })
//
//   const result = Deck.playCard(deck)
//
//   const expectedHand: Deck.Hand = ["Place", "Place"]
//   const expectedPlayedCards: Deck.Played = ["MoveLeft"]
//   const expected: Deck.Deck = {
//     hand: expectedHand,
//     playedCards: expectedPlayedCards,
//     draw: [],
//     disc: [],
//   }
//
//   expect(result).toEqual(expected)
// })

test("Deck.discardHand - it moves the hand into the discard pile", () => {
  const hand: Deck.Hand = ["Place", "MoveLeft", "Place"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = ["MoveRight"]
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.discardHand(deck)

  const expectedHand: Deck.Hand = []
  const expectedDraw: Deck.Draw = []
  const expectedDisc: Deck.Disc = ["Place", "MoveLeft", "Place", "MoveRight"]
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.shuffleDraw - It shuffles the draw pile", () => {
  const draw: Deck.Draw = ["MoveRight", "MoveLeft", "Place"]
  const deck: Deck.Deck = deckFactory.build({ draw })

  const expectedDraw: Deck.Draw = ["MoveRight", "Place", "MoveLeft"]

  const { draw: resultDraw } = Deck.shuffleDraw(deck)

  expectPileToHaveSameCards(resultDraw, expectedDraw)
})

const expectPileToHaveSameCards = (
  pileA: Deck.Pile,
  pileB: Deck.Pile,
): void => {
  const pileASorted = pipe(pileA, ReadonlyArray.sort(String.Order))
  const pileBSorted = pipe(pileB, ReadonlyArray.sort(String.Order))

  expect(pileASorted).toEqual(pileBSorted)
}
