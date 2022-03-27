module Main exposing (..)

import Browser
import Debug
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, classList)
import Html.Events exposing (onClick)
import List.Extra



-- MAIN


main =
    Browser.sandbox { init = init, update = update, view = view }



-- MODEL
-- --- Modena (Blue) ---
-- |                   |
-- --- Bolonga (Red) ---


modenaStyle : String
modenaStyle =
    "bg-blue-800 hover:bg-blue-900"


bolognaStyle : String
bolognaStyle =
    "bg-red-800 hover:bg-red-900"


type Player
    = Bologna
    | Modena


type Cell
    = Piece Player
    | Empty


type alias Row =
    List Cell


type alias Board =
    List Row


type Card
    = Place
    | FlankLeft
    | FlankRight
    | Charge


showCard : Card -> String
showCard card =
    case card of
        Place ->
            "Place"

        FlankLeft ->
            "Flank Left"

        FlankRight ->
            "Flank Right"

        Charge ->
            "Charge"


cardIsEqual : Card -> Maybe Card -> Bool
cardIsEqual c1 maybeC2 =
    case maybeC2 of
        Just c2 ->
            c1 == c2

        Nothing ->
            False


type alias Model =
    { player : Player
    , move : Maybe Card
    , bolognaCards : List Card
    , modenaCards : List Card
    , board : Board
    }


init : Model
init =
    let
        initialBoard =
            buildBoard 8 8
    in
    { player = Bologna
    , move = Nothing
    , bolognaCards = [ Place, FlankLeft, FlankRight, Charge ]
    , modenaCards = [ Place, FlankLeft, FlankRight, Charge ]
    , board = initialBoard
    }


buildBoard : Int -> Int -> Board
buildBoard l h =
    List.repeat h (buildRow l)


buildRow : Int -> Row
buildRow l =
    List.repeat l Empty



-- UPDATE


type Msg
    = SelectCell Int Int
    | SelectCard Card Player
    | EndTurn


update : Msg -> Model -> Model
update msg model =
    case msg of
        EndTurn ->
            let
                nextBoard =
                    progressBoard model.player model.board
            in
            { model
                | player = nextPlayer model.player
                , board = nextBoard
            }

        SelectCell rowIdx colIdx ->
            let
                isValid =
                    isValidMove model rowIdx colIdx

                nextBoard =
                    handleMove model rowIdx colIdx
            in
            if isValid then
                { model
                    | move = Nothing
                    , board = nextBoard
                }

            else
                model

        SelectCard card player ->
            let
                nextMove =
                    if model.move == Just card then
                        Nothing

                    else
                        Just card
            in
            { model | move = nextMove }



-- Is Valid Move --


isValidMove : Model -> Int -> Int -> Bool
isValidMove model rowIdx colIdx =
    case model.move of
        Just Place ->
            isValidPlace model rowIdx colIdx

        Just FlankLeft ->
            isValidFlankLeft model rowIdx colIdx

        Just FlankRight ->
            isValidFlankRight model rowIdx colIdx

        Just Charge ->
            isValidCharge model rowIdx colIdx

        Nothing ->
            False


isValidPlace : Model -> Int -> Int -> Bool
isValidPlace model rowIdx colIdx =
    case model.player of
        Modena ->
            rowIdx == 0

        Bologna ->
            rowIdx == 7


isValidFlankLeft : Model -> Int -> Int -> Bool
isValidFlankLeft model rowIdx colIdx =
    case model.player of
        Modena ->
            isValidPieceMove (\r -> r) (\c -> c - 1) rowIdx colIdx model.player model.board

        Bologna ->
            isValidPieceMove (\r -> r) (\c -> c + 1) rowIdx colIdx model.player model.board


isValidFlankRight : Model -> Int -> Int -> Bool
isValidFlankRight model rowIdx colIdx =
    case model.player of
        Modena ->
            isValidPieceMove (\r -> r) (\c -> c + 1) rowIdx colIdx model.player model.board

        Bologna ->
            isValidPieceMove (\r -> r) (\c -> c - 1) rowIdx colIdx model.player model.board


isValidCharge : Model -> Int -> Int -> Bool
isValidCharge model rowIdx colIdx =
    case model.player of
        Modena ->
            isValidPieceMove (\r -> r - 1) (\c -> c) rowIdx colIdx model.player model.board

        Bologna ->
            isValidPieceMove (\r -> r + 1) (\c -> c) rowIdx colIdx model.player model.board


isValidPieceMove :
    (Int -> Int)
    -> (Int -> Int)
    -> Int
    -> Int
    -> Player
    -> Board
    -> Bool
isValidPieceMove dirR dirC rowIdx colIdx player board =
    let
        pieceAtEnd =
            Debug.log "At End" (hasPieceAt rowIdx colIdx player board)

        pieceAtStart =
            Debug.log "At Start" (hasPieceAt (dirR rowIdx) (dirC colIdx) player board)
    in
    pieceAtStart && not pieceAtEnd


hasPieceAt : Int -> Int -> Player -> Board -> Bool
hasPieceAt rowIdx colIdx player board =
    let
        cell =
            getPieceOnBoard rowIdx colIdx board
    in
    case cell of
        Just (Piece p) ->
            p == player

        Just Empty ->
            False

        Nothing ->
            False


nextPlayer : Player -> Player
nextPlayer player =
    case player of
        Bologna ->
            Modena

        Modena ->
            Bologna



-- Progress Board --


progressBoard : Player -> Board -> Board
progressBoard player board =
    progressPieces player board


progressPieces : Player -> Board -> Board
progressPieces player board =
    List.indexedMap (progressPieceOnRow player board) board


progressPieceOnRow : Player -> Board -> Int -> Row -> Row
progressPieceOnRow player board rowIdx row =
    List.indexedMap (progressPiece player board rowIdx) row


progressPiece : Player -> Board -> Int -> Int -> Cell -> Cell
progressPiece player board rowIdx colIdx currentCell =
    let
        nextCell : Maybe Cell
        nextCell =
            getPieceOnBoard (rowIdx + 1) colIdx board

        prevCell : Maybe Cell
        prevCell =
            getPieceOnBoard (rowIdx - 1) colIdx board
    in
    case player of
        Bologna ->
            case ( currentCell, nextCell ) of
                ( _, Just (Piece Bologna) ) ->
                    Piece Bologna

                ( Piece Modena, _ ) ->
                    Piece Modena

                ( _, _ ) ->
                    Empty

        Modena ->
            case ( currentCell, prevCell ) of
                ( _, Just (Piece Modena) ) ->
                    Piece Modena

                ( Piece Bologna, _ ) ->
                    Piece Bologna

                ( _, _ ) ->
                    Empty


getPieceOnBoard : Int -> Int -> Board -> Maybe Cell
getPieceOnBoard rowIdx colIdx board =
    List.Extra.getAt rowIdx board
        |> Maybe.andThen (List.Extra.getAt colIdx)



-- Handle Move --


handleMove : Model -> Int -> Int -> Board
handleMove model rowIdx colIdx =
    case model.move of
        Just Place ->
            placePiece model.player rowIdx colIdx model.board

        Just FlankLeft ->
            flankLeft model.player rowIdx colIdx model.board

        Just FlankRight ->
            flankRight model.player rowIdx colIdx model.board

        Just Charge ->
            charge model.player rowIdx colIdx model.board

        Nothing ->
            model.board


id : Int -> Int
id m =
    m


charge : Player -> Int -> Int -> Board -> Board
charge player =
    case player of
        Modena ->
            movePieceForPlayer (\r -> r - 1) id player

        Bologna ->
            movePieceForPlayer (\r -> r + 1) id player


flankLeft : Player -> Int -> Int -> Board -> Board
flankLeft player =
    case player of
        Modena ->
            movePieceForPlayer id (\c -> c - 1) player

        Bologna ->
            movePieceForPlayer id (\c -> c + 1) player


flankRight : Player -> Int -> Int -> Board -> Board
flankRight player =
    case player of
        Modena ->
            movePieceForPlayer id (\c -> c + 1) player

        Bologna ->
            movePieceForPlayer id (\c -> c - 1) player


movePieceForPlayer : (Int -> Int) -> (Int -> Int) -> Player -> Int -> Int -> Board -> Board
movePieceForPlayer dirR dirC player rowIdx colIdx board =
    let
        fromRowIdx =
            dirR rowIdx

        fromColIdx =
            dirC colIdx
    in
    updateCellOnBoard rowIdx colIdx (Piece player) board
        |> updateCellOnBoard fromRowIdx fromColIdx Empty


updateCellOnBoard : Int -> Int -> Cell -> Board -> Board
updateCellOnBoard rowIdx colIdx cell board =
    List.indexedMap (updateRow rowIdx colIdx cell) board


updateRow : Int -> Int -> Cell -> Int -> Row -> Row
updateRow rowIdx colIdx cell rIdx row =
    List.indexedMap (updateCell rowIdx colIdx cell rIdx) row


updateCell : Int -> Int -> Cell -> Int -> Int -> Cell -> Cell
updateCell rowIdx colIdx newCell rIdx cIdx oldCell =
    if rowIdx == rIdx && colIdx == cIdx then
        newCell

    else
        oldCell


placePiece : Player -> Int -> Int -> Board -> Board
placePiece player rowIdx colIdx board =
    List.indexedMap (placePieceOnRow player rowIdx colIdx) board


placePieceOnRow : Player -> Int -> Int -> Int -> Row -> Row
placePieceOnRow player rowIdx colIdx rIdx row =
    List.indexedMap (placePieceOnCell player rowIdx rIdx colIdx) row


placePieceOnCell : Player -> Int -> Int -> Int -> Int -> Cell -> Cell
placePieceOnCell player rowIdx rIdx colIdx cIdx piece =
    if isCell rIdx rowIdx cIdx colIdx then
        Piece player

    else
        piece


isCell : Int -> Int -> Int -> Int -> Bool
isCell rIdx rowIdx cIdx colIdx =
    rIdx == rowIdx && cIdx == colIdx



---- VIEW ----


view : Model -> Html Msg
view model =
    div [ class "p-8 space-y-4" ]
        [ viewPlayer model.player
        , viewBoard model.board
        , viewCardList model
        , endTurnButton
        ]


endTurnButton : Html Msg
endTurnButton =
    button [ class "btn-primary", onClick EndTurn ] [ text "End Turn" ]


viewCardList : Model -> Html Msg
viewCardList model =
    let
        cards =
            case model.player of
                Bologna ->
                    model.bolognaCards

                Modena ->
                    model.modenaCards
    in
    div [ class "flex flex-row space-x-2" ] (cardList model cards)


cardList : Model -> List Card -> List (Html Msg)
cardList model cards =
    List.map (cardToButton model) cards


withPlayerStyle : Player -> String -> String
withPlayerStyle player style =
    case player of
        Bologna ->
            String.join " " [ bolognaStyle, style ]

        Modena ->
            String.join " " [ modenaStyle, style ]


cardToButton : Model -> Card -> Html Msg
cardToButton model card =
    let
        baseStyle =
            withPlayerStyle model.player "btn-primary"

        activeStyle =
            "border-gray-900"
    in
    button
        [ classList
            [ ( activeStyle, cardIsEqual card model.move )
            , ( baseStyle, True )
            ]
        , onClick <| SelectCard card model.player
        ]
        [ text <| showCard card ]


viewPlayer : Player -> Html Msg
viewPlayer player =
    let
        baseStyle =
            "p-8 max-w-xs font-black text-gray-100"
    in
    case player of
        Modena ->
            div
                [ classList
                    [ ( baseStyle, True )
                    , ( modenaStyle, True )
                    ]
                ]
                [ text "Modena" ]

        Bologna ->
            div
                [ classList
                    [ ( baseStyle, True )
                    , ( bolognaStyle, True )
                    ]
                ]
                [ text "Bologna" ]


viewBoard : Board -> Html Msg
viewBoard board =
    let
        baseStyle =
            "h-2"
    in
    div [ class "space-y-1" ]
        [ div [ classList [ ( baseStyle, True ), ( modenaStyle, True ) ] ] []
        , div [ class "" ] (List.indexedMap viewRow board)
        , div [ classList [ ( baseStyle, True ), ( bolognaStyle, True ) ] ] []
        ]


viewRow : Int -> Row -> Html Msg
viewRow rowIdx row =
    div [ class "flex flex-row" ] (List.indexedMap (viewCell rowIdx) row)


viewCell : Int -> Int -> Cell -> Html Msg
viewCell rowIdx colIdx cell =
    let
        baseStyle =
            "p-8"

        emptyStyle =
            "bg-gray-100 hover:bg-gray-200"
    in
    case cell of
        Piece Bologna ->
            div
                [ classList
                    [ ( baseStyle, True )
                    , ( bolognaStyle, True )
                    ]
                , onClick <| SelectCell rowIdx colIdx
                ]
                []

        Piece Modena ->
            div
                [ classList
                    [ ( baseStyle, True )
                    , ( modenaStyle, True )
                    ]
                , onClick <| SelectCell rowIdx colIdx
                ]
                []

        Empty ->
            div
                [ classList [ ( baseStyle, True ), ( emptyStyle, True ) ]
                , onClick <| SelectCell rowIdx colIdx
                ]
                []
