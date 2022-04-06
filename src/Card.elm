module Card exposing (..)


type Card
    = Place
    | FlankLeft
    | FlankRight
    | Charge


type alias StrategyCost =
    Int


type alias TacticCost =
    Int


type alias Cost =
    ( StrategyCost, TacticCost )


show : Card -> String
show card =
    case card of
        Place ->
            "Place"

        FlankLeft ->
            "Flank Left"

        FlankRight ->
            "Flank Right"

        Charge ->
            "Charge"


showStrategyCost : Card -> String
showStrategyCost card =
    let
        ( strategyCost, _ ) =
            toActionCost (Just card)
    in
    String.fromInt strategyCost


showTacticCost : Card -> String
showTacticCost card =
    let
        ( _, tacticCost ) =
            toActionCost (Just card)
    in
    String.fromInt tacticCost


isEqual : Card -> Maybe Card -> Bool
isEqual c1 maybeC2 =
    case maybeC2 of
        Just c2 ->
            c1 == c2

        Nothing ->
            False


toActionCost : Maybe Card -> Cost
toActionCost card =
    case card of
        Just Place ->
            ( 1, 0 )

        Just FlankLeft ->
            ( 0, 1 )

        Just FlankRight ->
            ( 0, 1 )

        Just Charge ->
            ( 0, 1 )

        Nothing ->
            ( 0, 0 )
