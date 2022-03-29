module Card exposing (..)


type Card
    = Place
    | FlankLeft
    | FlankRight
    | Charge


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


showCost : Card -> String
showCost card =
    String.join "" [ "(", String.fromInt <| toActionCost <| Just card, ")" ]


isEqual : Card -> Maybe Card -> Bool
isEqual c1 maybeC2 =
    case maybeC2 of
        Just c2 ->
            c1 == c2

        Nothing ->
            False


toActionCost : Maybe Card -> Int
toActionCost card =
    case card of
        Just Place ->
            2

        Just FlankLeft ->
            1

        Just FlankRight ->
            1

        Just Charge ->
            1

        Nothing ->
            0
