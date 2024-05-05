import { Array, Effect, pipe, Random, Record } from "effect"

import * as Card from "./card"

export type CardsTactic<T> = Record<Card.TacticCard, T>
export type CardsStrategy<T> = Record<Card.StrategyCard, T>
export type Cards<T> = {
  cardsTactic: CardsTactic<T>
  cardsStrategy: CardsStrategy<T>
}

export type PartialCards<T> = {
  cardsTactic: Partial<CardsTactic<T>>
  cardsStrategy: Partial<CardsStrategy<T>>
}

export const map =
  <T, U>(f: (t: T) => U) =>
  ({ cardsTactic, cardsStrategy }: Cards<T>): Cards<U> => {
    return {
      cardsTactic: mapTactics(f)(cardsTactic),
      cardsStrategy: mapStrategy(f)(cardsStrategy),
    }
  }

export const mapTactics =
  <T, U>(f: (t: T) => U) =>
  (cards: CardsTactic<T>): CardsTactic<U> => {
    return Record.map<Card.TacticCard, T, U>(f)(cards)
  }

export const mapStrategy =
  <T, U>(f: (t: T) => U) =>
  (cards: CardsStrategy<T>): CardsStrategy<U> => {
    return Record.map<Card.StrategyCard, T, U>(f)(cards)
  }

export const toEntries = <T>(cards: Cards<T>): [Card.Card, T][] => {
  const { cardsTactic, cardsStrategy } = cards
  const tactics = Record.toEntries(cardsTactic)
  const strategies = Record.toEntries(cardsStrategy)

  return [...tactics, ...strategies]
}

type DefaultFn<T> = () => T

export const fromPartial =
  <T>(defaultFn: DefaultFn<T>) =>
  (cards: PartialCards<T>): Cards<T> => {
    const { cardsTactic, cardsStrategy } = cards
    const tactic = fromPartialTactic(defaultFn)(cardsTactic)
    const strategy = fromPartialStrategy(defaultFn)(cardsStrategy)

    return {
      cardsTactic: tactic,
      cardsStrategy: strategy,
    }
  }

export const fromPartialTactic =
  <T>(defaultFn: DefaultFn<T>) =>
  (cards: Partial<CardsTactic<T>>): CardsTactic<T> => {
    return {
      ...mapTactics(defaultFn)(emptyTactics),
      ...cards,
    }
  }

export const fromPartialStrategy =
  <T>(defaultFn: DefaultFn<T>) =>
  (cards: Partial<CardsStrategy<T>>): CardsStrategy<T> => {
    return {
      ...mapStrategy(defaultFn)(emptyStrategy),
      ...cards,
    }
  }

export const emptyTactics: CardsTactic<0> = {
  ManeuverLeft: 0,
  ManeuverRight: 0,
  ManeuverForward: 0,
  AssaultLeft: 0,
  AssaultRight: 0,
  AssaultForward: 0,
  Charge: 0,
  FlankLeft: 0,
  FlankRight: 0,
}

export const emptyStrategy: CardsStrategy<0> = {
  Hoplite: 0,
  Polis: 0,
  Koinas: 0,
  HellenicCraftsmen: 0,
  MilitaryReforms: 0,
  OracleOfDelphi: 0,
  PoliticalReforms: 0,
  TempleOfAthena: 0,
  TempleOfPoseidon: 0,
  TempleOfZeus: 0,
  OrganizedDeploy: 0,
  MilitaryMobilization: 0,
  AuxiliaryTroops: 0,
  Phalanx: 0,
  DemocraticFaction: 0,
  AgeanSea: 0,
  IonianSea: 0,
  Hellespont: 0,
  Forage: 0,
  Psiloi: 0,
  TheSenate: 0,
  TheFiveEphors: 0,
  TheTenStrategoi: 0,
  Provisions: 0,
  SupplyCache: 0,
  PersianSupport: 0,
  MilitaryTraining: 0,
  MilitaryLogistics: 0,
  ThraticanTactics: 0,
  OligarchicFaction: 0,
  VillageGranary: 0,
  WarSpoils: 0,
}

export const empty: Cards<0> = {
  cardsTactic: emptyTactics,
  cardsStrategy: emptyStrategy,
}

export const randomize =
  <T>(f: () => T) =>
  (countTactic: number) =>
  (countStrategy: number) =>
  (initialCards: Cards<T>): Cards<T> => {
    const { cardsStrategy, cardsTactic } = initialCards

    const nextStrategy = randomizeStrategy(f)(countStrategy)(cardsStrategy)
    const nextTactic = randomizeTactic(f)(countTactic)(cardsTactic)

    return {
      cardsStrategy: nextStrategy,
      cardsTactic: nextTactic,
    }
  }

export const randomizeTactic =
  <T>(f: () => T) =>
  (count: number) =>
  (initialCards: CardsTactic<T>): CardsTactic<T> => {
    const s = Effect.gen(function* (_) {
      const keys = pipe(initialCards, Record.keys)
      const shuffled = yield* _(Random.shuffle(keys))

      const nextKeys = pipe(shuffled, Array.take(count))

      const nextCards = pipe(
        nextKeys,
        Array.reduce<CardsTactic<T>, Card.TacticCard>(
          initialCards,
          (acc, card) => {
            acc[card] = f()
            return acc
          },
        ),
      )

      return nextCards
    })

    const result = Effect.runSync(s)

    return result
  }

export const randomizeStrategy =
  <T>(f: () => T) =>
  (count: number) =>
  (initialCards: CardsStrategy<T>): CardsStrategy<T> => {
    const s = Effect.gen(function* (_) {
      const keys = pipe(initialCards, Record.keys)
      const shuffled = yield* _(Random.shuffle(keys))

      const nextKeys = pipe(shuffled, Array.take(count))

      const nextCards = pipe(
        nextKeys,
        Array.reduce<CardsStrategy<T>, Card.StrategyCard>(
          initialCards,
          (acc, card) => {
            acc[card] = f()
            return acc
          },
        ),
      )

      return nextCards
    })

    const result = Effect.runSync(s)

    return result
  }
