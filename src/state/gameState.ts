import { createSignal } from "solid-js"
import { pipe } from "effect"

import { Deck, Game, GameAction, Hand, Position, Supply } from "@app/model"

import * as GameSetupState from "./gameSetupState"

type Started = {
  _tag: "Started"
}
type NotStarted = {
  _tag: "NotStarted"
}
type GameStatus = NotStarted | Started

const initialGameStatus: GameStatus = { _tag: "NotStarted" }

export const [gameStatus, setGameStatus] =
  createSignal<GameStatus>(initialGameStatus)
export const [game, setGame] = createSignal<Game.Game>(Game.initial)

export const startGame = (): void => {
  const { handCount, supplyPiles, startingHandSize } =
    GameSetupState.gameSetup()
  const initialHand = Hand.build(handCount)
  const initialDeck = Deck.build(initialHand, startingHandSize)
  const initialSupply = Supply.build(supplyPiles)

  const game_ = Game.build(initialDeck, initialSupply, startingHandSize)

  setGame(game_)
  setGameStatus({ _tag: "Started" })
}

export const endGame = (): void => {
  setGameStatus({ _tag: "NotStarted" })
}

export const isGameStarted = (): boolean => {
  return gameStatus()._tag === "Started"
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

// ---- Game Actions

export const selectCommitResourceMat = (): void => {
  pipe(game(), GameAction.selectCommitResourceMat, setGame)
}

export const selectPlayMat = (): void => {
  pipe(game(), GameAction.selectPlayMat, setGame)
}

export const selectHandCard = (idx: number): void => {
  pipe(game(), GameAction.selectHandCard(idx), setGame)
}

export const selectCell = (position: Position.Position): void => {
  pipe(game(), GameAction.selectCell(position), setGame)
}

export const endTurn = (): void => {
  pipe(game(), GameAction.endTurn, setGame)
}

export const selectSupplyPile = (idx: number): void => {
  pipe(game(), GameAction.selectSupplyPile(idx), setGame)
}

export const drawCard = (): void => {
  pipe(game(), GameAction.drawCard, setGame)
}
