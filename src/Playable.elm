module Playable exposing (..)


type Playable a
    = Selected a
    | NotSelected a
    | Exhausted a


isSelected : Playable a -> Bool
isSelected p =
    case p of
        Selected a ->
            True

        _ ->
            False


isExhausted : Playable a -> Bool
isExhausted p =
    case p of
        Exhausted a ->
            True

        _ ->
            False


isNotSelected : Playable a -> Bool
isNotSelected p =
    case p of
        NotSelected a ->
            True

        _ ->
            False


select : Playable a -> Playable a
select p =
    case p of
        Selected a ->
            Selected a

        NotSelected a ->
            Selected a

        Exhausted a ->
            Exhausted a


exhaustSelected : Playable a -> Playable a
exhaustSelected p =
    case p of
        Selected a ->
            Exhausted a

        _ ->
            p


exhaust : Playable a -> Playable a
exhaust p =
    case p of
        Selected a ->
            Exhausted a

        NotSelected a ->
            Exhausted a

        Exhausted a ->
            Exhausted a


deselect : Playable a -> Playable a
deselect p =
    case p of
        Selected a ->
            NotSelected a

        NotSelected a ->
            NotSelected a

        Exhausted a ->
            Exhausted a


unwrap : Playable a -> a
unwrap p =
    case p of
        Selected a ->
            a

        NotSelected a ->
            a

        Exhausted a ->
            a
