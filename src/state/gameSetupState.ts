import { createSignal } from "solid-js"

import * as GameSetup from "@app/model/gameSetup/gameSetup"
import * as HandSetup from "@app/model/gameSetup/handSetup"
import * as SupplySetup from "@app/model/gameSetup/supplySetup"

export const [gameSetup, setGameSetup] = createSignal<GameSetup.GameSetup>(
  GameSetup.initial,
)

export const setHandSetupTactic = (
  handSetupTactic: HandSetup.HandSetupTactic,
): void => {
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, handSetupTactic }
  setGameSetup(nextGameSetup)
}

export const setHandSetupStrategy = (
  handSetupStrategy: HandSetup.HandSetupStrategy,
): void => {
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, handSetupStrategy }
  setGameSetup(nextGameSetup)
}

export const setHandSize = (handSize: number): void => {
  const nextGameSetup = { ...gameSetup() }
  nextGameSetup.startingHandSize = handSize
  setGameSetup(nextGameSetup)
}

export const setSupplySetupTactic = (
  supplySetupTactic: SupplySetup.SupplySetupTactic,
): void => {
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplySetupTactic }
  setGameSetup(nextGameSetup)
}

export const checkAllTacticSupplyPiles = (): void => {
  const supplySetupTactic = SupplySetup.allCheckedTactic()
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplySetupTactic }
  setGameSetup(nextGameSetup)
}

export const uncheckAllTacticSupplyPiles = (): void => {
  const supplySetupTactic = SupplySetup.allUncheckedTactic()
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplySetupTactic }
  setGameSetup(nextGameSetup)
}

export const randomizeTacticSupplyPiles = (): void => {
  const currentGameSetup = { ...gameSetup() }
  const nextGameSetup = GameSetup.randomizeSupplySetupTactic(currentGameSetup)
  setGameSetup(nextGameSetup)
}

export const setSupplySetupStrategy = (
  supplySetupStrategy: SupplySetup.SupplySetupStrategy,
): void => {
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplySetupStrategy }
  setGameSetup(nextGameSetup)
}

export const checkAllStrategySupplyPiles = (): void => {
  const supplySetupStrategy = SupplySetup.allCheckedStrategy()
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplySetupStrategy }
  setGameSetup(nextGameSetup)
}

export const uncheckAllStrategySupplyPiles = (): void => {
  const supplySetupStrategy = SupplySetup.allUncheckedStrategy()
  const currentGameSetup = gameSetup()
  const nextGameSetup = { ...currentGameSetup, supplySetupStrategy }
  setGameSetup(nextGameSetup)
}

export const randomizeStrategySupplyPiles = (): void => {
  const currentGameSetup = { ...gameSetup() }
  const nextGameSetup = GameSetup.randomizeSupplySetupStrategy(currentGameSetup)
  setGameSetup(nextGameSetup)
}
