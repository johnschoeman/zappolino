import { Cards } from "../deck"

export type HandSetup = Cards.Cards<number>
export type HandSetupTactic = Cards.CardsTactic<number>
export type HandSetupStrategy = Cards.CardsStrategy<number>

export const initialTactic: HandSetupTactic = Cards.fromPartialTactic(() => 0)({
  ManeuverForward: 2,
  ManeuverLeft: 2,
  ManeuverRight: 2,
})

export const initialStrategy: HandSetupStrategy = Cards.fromPartialStrategy(
  () => 0,
)({
  Hoplite: 1,
})
