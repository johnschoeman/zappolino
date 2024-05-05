import { expect, test } from "bun:test"
import { Array, pipe, String } from "effect"

import { deckFactory } from "../../../factories"

import * as Deck from "./deck"
import * as Hand from "./hand"

test("Deck.draw - when the draw pile is empty, it reshuffles the discard and then draws", () => {
  const hand: Hand.Hand = []
  const draw: Deck.Draw = []
  const disc: Deck.Disc = [
    "Hoplite",
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Hand.Hand = ["Hoplite"]
  const expectedDraw: Deck.Draw = [
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
    commitedCards: [],
  }

  expect(result.hand.length).toEqual(expected.hand.length)
  expect(result.draw.length).toEqual(expected.draw.length)
  expect([...result.draw, ...result.hand].sort()).toEqual(
    [...expected.hand, ...expected.draw].sort(),
  )
})

test("Deck.draw - when given a count of 1, it draws a card and put it into the players hand", () => {
  const hand: Hand.Hand = []
  const draw: Deck.Draw = [
    "Hoplite",
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Hand.Hand = ["Hoplite"]
  const expectedDraw: Deck.Draw = [
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
    commitedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.draw - when given a count of 3, it draws the 3 cards and puts them into the players hand", () => {
  const hand: Hand.Hand = []
  const draw: Deck.Draw = [
    "Hoplite",
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(3)(deck)

  const expectedHand: Hand.Hand = ["Hoplite", "ManeuverLeft", "ManeuverRight"]
  const expectedDraw: Deck.Draw = ["ManeuverForward"]
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
    commitedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.draw - when the draw pile is empty, it does nothing", () => {
  const hand: Hand.Hand = ["Hoplite", "Hoplite"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Hand.Hand = ["Hoplite", "Hoplite"]
  const expectedDraw: Deck.Draw = []
  const expectedDisc: Deck.Disc = []
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
    commitedCards: [],
  }

  expect(result).toEqual(expected)
})

// test("Deck.playCard - it moves the currently selected card into the played cards list", () => {
//   const hand: Deck.Hand = ["Hoplite", "ManeuverLeft", "Hoplite"]
//   const playedCards: Deck.Played = []
//   const deck: Deck.Deck = deckFactory.build({
//     hand,
//     playedCards,
//   })
//
//   const result = Deck.playCard(deck)
//
//   const expectedHand: Deck.Hand = ["Hoplite", "Hoplite"]
//   const expectedPlayedCards: Deck.Played = ["ManeuverLeft"]
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
  const hand: Hand.Hand = ["Hoplite", "ManeuverLeft", "Hoplite"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = ["ManeuverRight"]
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.discardHand(deck)

  const expectedHand: Hand.Hand = []
  const expectedDraw: Deck.Draw = []
  const expectedDisc: Deck.Disc = [
    "Hoplite",
    "ManeuverLeft",
    "Hoplite",
    "ManeuverRight",
  ]
  const expected: Deck.Deck = {
    hand: expectedHand,
    draw: expectedDraw,
    disc: expectedDisc,
    playedCards: [],
    commitedCards: [],
  }

  expect(result).toEqual(expected)
})

test("Deck.shuffleDraw - It shuffles the draw pile", () => {
  const draw: Deck.Draw = ["ManeuverRight", "ManeuverLeft", "Hoplite"]
  const deck: Deck.Deck = deckFactory.build({ draw })

  const expectedDraw: Deck.Draw = ["ManeuverRight", "Hoplite", "ManeuverLeft"]

  const { draw: resultDraw } = Deck.shuffleDraw(deck)

  expectPileToHaveSameCards(resultDraw, expectedDraw)
})

const expectPileToHaveSameCards = (
  pileA: Deck.Pile,
  pileB: Deck.Pile,
): void => {
  const pileASorted = pipe(pileA, Array.sort(String.Order))
  const pileBSorted = pipe(pileB, Array.sort(String.Order))

  expect(pileASorted).toEqual(pileBSorted)
}
