import { expect, test } from "bun:test"
import { pipe, ReadonlyArray, String } from "effect"

import { deckFactory } from "../../../factories"

import * as Deck from "./deck"

test("Deck.draw - when the draw pile is empty, it reshuffles the discard and then draws", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = []
  const disc: Deck.Disc = [
    "DeployHoplite",
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["DeployHoplite"]
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

test("Deck.draw - when given a count of 1, it draws a card and put it into the players hand", () => {
  const hand: Deck.Hand = []
  const draw: Deck.Draw = [
    "DeployHoplite",
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["DeployHoplite"]
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
  const hand: Deck.Hand = []
  const draw: Deck.Draw = [
    "DeployHoplite",
    "ManeuverLeft",
    "ManeuverRight",
    "ManeuverForward",
  ]
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(3)(deck)

  const expectedHand: Deck.Hand = [
    "DeployHoplite",
    "ManeuverLeft",
    "ManeuverRight",
  ]
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
  const hand: Deck.Hand = ["DeployHoplite", "DeployHoplite"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = []
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.draw(1)(deck)

  const expectedHand: Deck.Hand = ["DeployHoplite", "DeployHoplite"]
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
//   const hand: Deck.Hand = ["DeployHoplite", "ManeuverLeft", "DeployHoplite"]
//   const playedCards: Deck.Played = []
//   const deck: Deck.Deck = deckFactory.build({
//     hand,
//     playedCards,
//   })
//
//   const result = Deck.playCard(deck)
//
//   const expectedHand: Deck.Hand = ["DeployHoplite", "DeployHoplite"]
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
  const hand: Deck.Hand = ["DeployHoplite", "ManeuverLeft", "DeployHoplite"]
  const draw: Deck.Draw = []
  const disc: Deck.Disc = ["ManeuverRight"]
  const deck: Deck.Deck = deckFactory.build({ hand, draw, disc })

  const result = Deck.discardHand(deck)

  const expectedHand: Deck.Hand = []
  const expectedDraw: Deck.Draw = []
  const expectedDisc: Deck.Disc = [
    "DeployHoplite",
    "ManeuverLeft",
    "DeployHoplite",
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
  const draw: Deck.Draw = ["ManeuverRight", "ManeuverLeft", "DeployHoplite"]
  const deck: Deck.Deck = deckFactory.build({ draw })

  const expectedDraw: Deck.Draw = [
    "ManeuverRight",
    "DeployHoplite",
    "ManeuverLeft",
  ]

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
