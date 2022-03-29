module Deck exposing (..)

import Card exposing (Card(..))
import List.Extra
import Random
import Random.List


type alias Deck =
    { hand : List Card
    , drawPile : List Card
    , discard : List Card
    }


initialCards : List Card
initialCards =
    [ Place
    , Place
    , Place
    , FlankLeft
    , FlankLeft
    , FlankRight
    , FlankRight
    , Charge
    , Charge
    , Charge
    ]


initialDeck : Deck
initialDeck =
    { hand = []
    , drawPile = initialCards
    , discard = []
    }


handSize : Int
handSize =
    3


discardHand : Deck -> Deck
discardHand deck =
    let
        oldHand =
            deck.hand

        nextDiscard =
            List.concat [ oldHand, deck.discard ]
    in
    { deck | hand = [], discard = nextDiscard }


drawOneCard : Deck -> Deck
drawOneCard deck =
    let
        oldHand =
            deck.hand

        oldUnplayed =
            deck.drawPile

        ( nextCard, nextUnplayed ) =
            List.Extra.splitAt 1 oldUnplayed

        nextHand =
            nextCard ++ oldHand
    in
    { deck
        | hand = nextHand
        , drawPile = nextUnplayed
    }


mergeDiscardPile : Deck -> Deck
mergeDiscardPile deck =
    let
        drawPile =
            deck.drawPile

        discard =
            deck.discard

        nextUnplayed =
            List.concat [ drawPile, discard ]
    in
    { deck | drawPile = nextUnplayed, discard = [] }


shuffledDeck : Deck -> Random.Generator Deck
shuffledDeck deck =
    let
        unplayedCards =
            deck.drawPile
    in
    Random.map (updateUnplayed deck) (shuffledCards unplayedCards)


updateUnplayed : Deck -> List Card.Card -> Deck
updateUnplayed deck cards =
    { deck | drawPile = cards }


shuffledCards : List Card.Card -> Random.Generator (List Card.Card)
shuffledCards cards =
    Random.List.shuffle cards
