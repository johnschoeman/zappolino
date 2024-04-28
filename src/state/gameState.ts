import { createSignal } from "solid-js"
import { pipe } from "effect"

import { Deck, Game, Hand, Supply } from "@app/model"

import * as GameSetupState from "./gameSetupState"

type Started = {
  _tag: "Started"
}
type NotStarted = {
  _tag: "NotStarted"
}
type GameFoo = NotStarted | Started

const initialGameFoo: GameFoo = { _tag: "NotStarted" }

export const [gameFoo, setGameFoo] = createSignal<GameFoo>(initialGameFoo)
export const [game, setGame] = createSignal<Game.Game>(Game.initial)

export const startGame = (): void => {
  const { handCount, supplyPiles } = GameSetupState.gameSetup()
  const initialHand = Hand.build(handCount)
  const initialDeck = Deck.build(initialHand)
  const initialSupply = Supply.build(supplyPiles)
  console.log({ initialSupply, supplyPiles })

  const game_ = Game.build(initialDeck, initialSupply)

  setGame(game_)
  setGameFoo({ _tag: "Started" })
}

export const endGame = (): void => {
  setGameFoo({ _tag: "NotStarted" })
}

export const isGameStarted = (): boolean => {
  return gameFoo()._tag === "Started"
}

export const currentPlayerDeck = (): Deck.Deck => {
  return pipe(game(), Game.currentPlayerDeck)
}

export const playedCards = (): Deck.Played => {
  return pipe(game(), Game.currentPlayerDeck, deck => deck.playedCards)
}

export const commitedResourceCards = (): Deck.Commited => {
  return pipe(game(), Game.currentPlayerDeck, deck => deck.commitedCards)
}
