import { Either, Option, pipe, ReadonlyArray } from "effect"

import { Card, Deck } from "./deck"
import * as Game from "./game"
import * as GamePlayCard from "./gamePlayCard"
import * as Position from "./position"
import * as Supply from "./supply"

export const selectSupplyPile =
  (supplyPileIdx: number) =>
  (game: Game.Game): Game.Game => {
    const currentPlayer = game.currentPlayer
    const supply = game.supply
    const optionSupplyPile = pipe(supply, ReadonlyArray.get(supplyPileIdx))

    if (Option.isNone(optionSupplyPile)) {
      return game
    }

    const supplyPile = optionSupplyPile.value
    const { card, count } = supplyPile

    if (count === 0) {
      return game
    }

    const resourcePoints = game.turnPoints.resourcePoints
    const resourceCost = Card.toResourceCost(card)

    if (resourcePoints < resourceCost) {
      return game
    }

    const deck = Game.deckFor(currentPlayer)(game)

    const nextDeck = Deck.addCardToDiscard(card)(deck)

    const nextSupplyPile: Supply.SupplyPile = {
      ...supplyPile,
      count: supplyPile.count - 1,
    }

    const nextSupply: Supply.Supply = [...supply]
    nextSupply[supplyPileIdx] = nextSupplyPile

    return pipe(
      game,
      Game.updateDeckFor(currentPlayer)(nextDeck),
      Game.decreaseTurnPoints([0, 0, resourceCost]),
      Game.updateSupply(nextSupply),
    )
  }

export const selectHandCard =
  (cardIdx: number) =>
  (game: Game.Game): Game.Game => {
    return {
      ...game,
      selectedCardIdx: Option.some(cardIdx),
    }
  }

export const selectCommitResourceMat = (game: Game.Game): Game.Game => {
  return Game.commitSelectedCard(game)
}

export const selectPlayMat = (game: Game.Game): Game.Game => {
  const deck = Game.currentPlayerDeck(game)
  const card = pipe(
    game.selectedCardIdx,
    Option.andThen(cardIdx => {
      return Deck.getCardAt(cardIdx)(deck)
    }),
  )

  if (Option.isNone(card)) {
    return game
  }

  return pipe(
    game,
    GamePlayCard.validateHasCardCost(card.value),
    Either.andThen(GamePlayCard.playSelectMatCard(card.value)),
    Either.map(Game.consumeSelectedCard),
    Either.match({
      onLeft: () => game,
      onRight: nextGame => nextGame,
    }),
  )
}

export const selectCell =
  ({ rowIdx, colIdx }: Position.Position) =>
  (game: Game.Game): Game.Game => {
    const deck = Game.currentPlayerDeck(game)
    const card = pipe(
      game.selectedCardIdx,
      Option.andThen(cardIdx => {
        return Deck.getCardAt(cardIdx)(deck)
      }),
    )

    if (Option.isNone(card)) {
      return game
    }

    return pipe(
      game,
      GamePlayCard.validateHasCardCost(card.value),
      Either.andThen(
        GamePlayCard.playSelectPieceCard({ rowIdx, colIdx })(card.value),
      ),
      Either.map(Game.consumeSelectedCard),
      Either.match({
        onLeft: () => game,
        onRight: nextGame => nextGame,
      }),
    )
  }

export const endTurn = (game: Game.Game): Game.Game => {
  const player = game.currentPlayer
  const playerDeck = Game.currentPlayerDeck(game)
  const nextDeck = pipe(
    playerDeck,
    Deck.discardPlayed,
    Deck.discardHand,
    Deck.draw(5),
  )

  const result = pipe(
    game,
    Game.updateDeckFor(player)(nextDeck),
    Game.progressBoard,
    Game.unselectHandCard,
    Game.incrementTurnCount,
    Game.togglePlayer,
    Game.resetTurnPoints,
  )

  return result
}
