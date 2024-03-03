import { pipe, ReadonlyArray, String } from "effect"
import { expect, test } from "bun:test"

import * as Deck from "./deck"

test("Deck.draw - when given a count of 1, it draws a card and put it into the players hand", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = ["Place", "MoveLeft", "MoveRight", "MoveForward"]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = [hand, draw, disc]

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["Place"]
  const expectedDraw: Deck.Draw = ["MoveLeft", "MoveRight", "MoveForward"]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = [expectedHand, expectedDraw, expectedDisc]

  expect(result).toEqual(expected)
})

test("Deck.draw - when given a count of 3, it draws the 3 cards and puts them into the players hand", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = ["Place", "MoveLeft", "MoveRight", "MoveForward"]
  const disc: Deck.Disc = []

  const deck: Deck.Deck = [hand, draw, disc]

  const result = Deck.draw(3)(deck)

  const expectedHand: Deck.Hand = ["Place", "MoveLeft", "MoveRight"]
  const expectedDraw: Deck.Draw = ["MoveForward"]
  const expectedDiscard: Deck.Disc = []
  const expected: Deck.Deck = [expectedHand, expectedDraw, expectedDiscard]

  expect(result).toEqual(expected)
})

test("Deck.draw - when the draw pile is empty, it does nothing", () => {
  const hand: Deck.Hand = ["Place", "Place"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = []

  const deck: Deck.Deck = [hand, draw, disc]

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["Place", "Place"]
  const expectedDraw: Deck.Draw = []
  const expectedDiscard: Deck.Disc = []
  const expected: Deck.Deck = [expectedHand, expectedDraw, expectedDiscard]

  expect(result).toEqual(expected)
})

test("Deck.discardHand - it moves the hand into the discard pile", () => {
  const hand: Deck.Hand = ["Place", "MoveLeft", "Place"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = ["MoveRight"]

  const deck: Deck.Deck = [hand, draw, disc]

  const result = Deck.discardHand(deck)

  const expectedHand: Deck.Hand = []
  const expectedDraw: Deck.Draw = []
  const expectedDiscard: Deck.Disc = ["Place", "MoveLeft", "Place", "MoveRight"]
  const expected: Deck.Deck = [expectedHand, expectedDraw, expectedDiscard]

  expect(result).toEqual(expected)
})

test("Deck.shuffleDiscIntoDraw - It shuffles the discard into the draw", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = []
  const disc: Deck.Disc = ["MoveRight", "MoveLeft", "Place"]

  const deck: Deck.Deck = [hand, draw, disc]

  const expectedDraw: Deck.Draw = ["MoveRight", "Place", "MoveLeft"]
  const expectedHand: Deck.Hand = []
  const expectedDisc: Deck.Disc = []

  const [resultHand, resultDraw, resultDisc] = Deck.shuffleDiscIntoDraw(deck)

  expect(resultHand).toEqual(expectedHand)
  expect(resultDisc).toEqual(expectedDisc)
  expectPileToHaveSameCards(resultDraw, expectedDraw)
})

const expectPileToHaveSameCards = (pileA: Deck.Pile, pileB: Deck.Pile) => {
  const pileASorted = pipe(pileA, ReadonlyArray.sort(String.Order))
  const pileBSorted = pipe(pileB, ReadonlyArray.sort(String.Order))

  expect(pileASorted).toEqual(pileBSorted)
}
