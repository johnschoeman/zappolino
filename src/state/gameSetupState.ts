import { createSignal } from "solid-js"

import { GameSetup, Hand, Supply } from "@app/model"

export const [gameSetup, setGameSetup] = createSignal<GameSetup.GameSetup>(
  GameSetup.initial,
)

export const setHandCount = (handCount: Hand.HandCount): void => {
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, handCount }
  setGameSetup(nextGameSetup)
}

export const setSupplyPiles = (
  supplyPiles: Supply.CheckedSupplyPiles,
): void => {
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplyPiles }
  setGameSetup(nextGameSetup)
}

export const checkAllSupplyPiles = (): void => {
  const supplyPiles = Supply.allChecked()
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplyPiles }
  setGameSetup(nextGameSetup)
}

export const uncheckAllSupplyPiles = (): void => {
  const supplyPiles = Supply.allUnchecked()
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplyPiles }
  setGameSetup(nextGameSetup)
}

export const setHandSize = (handSize: number): void => {
  const nextGameSetup = { ...gameSetup() }
  nextGameSetup.startingHandSize = handSize
  setGameSetup(nextGameSetup)
}

export const randomizeSupplyPiles = (): void => {
  const currentGameSetup = { ...gameSetup() }
  const nextGameSetup = GameSetup.randomizeSupplyPiles(currentGameSetup)
  setGameSetup(nextGameSetup)
}
