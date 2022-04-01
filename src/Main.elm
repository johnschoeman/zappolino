module Main exposing (..)

import Browser
import Browser.Navigation as Nav
import Card
import Debug
import Deck exposing (Deck, initialDeck)
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class, classList)
import Html.Events exposing (onClick)
import List.Extra
import Playable exposing (Playable(..))
import Random
import Random.List
import Url



---- MAIN ----


main : Program Flags Model Msg
main =
    Browser.application
        { view = view
        , init = init
        , update = update
        , subscriptions = subscriptions
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        }


type alias Flags =
    ()



---- MODEL ----
-- --- Modena (Blue) ---
-- |                   |
-- --- Bolonga (Red) ---


type alias Model =
    { player : Player
    , actionCount : Int
    , bolognaDeck : Deck
    , modenaDeck : Deck
    , board : Board
    }


init : Flags -> Url.Url -> Nav.Key -> ( Model, Cmd Msg )
init _ _ _ =
    let
        initialBoard =
            buildBoard 8 8

        initialModel =
            { player = Bologna
            , actionCount = 3
            , bolognaDeck = initialDeck
            , modenaDeck = initialDeck
            , board = initialBoard
            }
    in
    ( initialModel
    , Cmd.batch
        [ shuffleDeck (GetShuffledDeckAndDraw Bologna) Bologna initialDeck
        , shuffleDeck (GetShuffledDeckAndDraw Modena) Modena initialDeck
        ]
    )


modenaStyle : String
modenaStyle =
    "bg-blue-800 hover:bg-blue-900"


bolognaStyle : String
bolognaStyle =
    "bg-red-800 hover:bg-red-900"


type Player
    = Bologna
    | Modena


showPlayer : Player -> String
showPlayer player =
    case player of
        Bologna ->
            "Bolonga"

        Modena ->
            "Modena"


playerStyle : Player -> String
playerStyle player =
    case player of
        Bologna ->
            bolognaStyle

        Modena ->
            modenaStyle


type Cell
    = Piece Player
    | Empty


type alias Row =
    List Cell


type alias Board =
    List Row


buildBoard : Int -> Int -> Board
buildBoard l h =
    List.repeat h (buildRow l)


buildRow : Int -> Row
buildRow l =
    List.repeat l Empty



---- UPDATE ----


type Msg
    = ChangedUrl Url.Url
    | ClickedLink Browser.UrlRequest
    | SelectCell Int Int
    | SelectCard Int (Playable Card.Card) Player
    | EndTurn
    | DrawHand Player
    | ShuffleDeckAndDraw Player
    | GetShuffledDeckAndDraw Player Deck.Deck


updateDeck : Player -> Deck.Deck -> Model -> Model
updateDeck player deck model =
    { model
        | modenaDeck =
            if player == Modena then
                deck

            else
                model.modenaDeck
        , bolognaDeck =
            if player == Bologna then
                deck

            else
                model.bolognaDeck
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangedUrl url ->
            ( model, Cmd.none )

        ClickedLink urlRequest ->
            ( model, Cmd.none )

        EndTurn ->
            let
                nextBoard =
                    progressBoard model.player model.board

                deck =
                    getPlayerDeck model.player model

                ( nextDeck, nextCmd ) =
                    drawHand model.player (Deck.discardHand deck)

                nextModel =
                    { model
                        | player = nextPlayer model.player
                        , actionCount = 3
                        , board = nextBoard
                    }
            in
            ( updateDeck model.player nextDeck nextModel
            , nextCmd
            )

        SelectCell rowIdx colIdx ->
            let
                actionCost =
                    Card.toActionCost (selectedMove model)

                isValid =
                    model.actionCount >= actionCost && isValidMove model rowIdx colIdx

                nextBoard =
                    handleMove model rowIdx colIdx

                nextActionCount =
                    model.actionCount - actionCost

                deck =
                    getPlayerDeck model.player model

                oldHand =
                    deck.hand

                nextHand =
                    List.map Playable.exhaustSelected oldHand

                nextDeck =
                    { deck | hand = nextHand }
            in
            if isValid then
                ( updateDeck model.player
                    nextDeck
                    { model
                        | actionCount = nextActionCount
                        , board = nextBoard
                    }
                , Cmd.none
                )

            else
                ( model, Cmd.none )

        SelectCard idx selectableCard player ->
            let
                deck =
                    getPlayerDeck player model

                hasSelection =
                    List.any Playable.isSelected deck.hand

                nextHand =
                    List.indexedMap
                        (\i card ->
                            case ( idx == i, hasSelection ) of
                                ( True, True ) ->
                                    Playable.deselect card

                                ( True, False ) ->
                                    if not (Playable.isExhausted card) then
                                        Playable.select card

                                    else
                                        card

                                ( False, True ) ->
                                    card

                                ( False, False ) ->
                                    card
                        )
                        deck.hand

                nextDeck =
                    { deck | hand = nextHand }
            in
            ( updateDeck player nextDeck model, Cmd.none )

        DrawHand player ->
            let
                deck =
                    case player of
                        Modena ->
                            model.modenaDeck

                        Bologna ->
                            model.bolognaDeck

                ( nextDeck, nextCmd ) =
                    drawHand player deck

                nextModel =
                    case player of
                        Modena ->
                            { model | modenaDeck = nextDeck }

                        Bologna ->
                            { model | bolognaDeck = nextDeck }
            in
            if List.length deck.hand > 4 then
                ( model, Cmd.none )

            else
                ( nextModel, nextCmd )

        GetShuffledDeckAndDraw player sDeck ->
            let
                nextDeck =
                    drawTo 3 sDeck

                nextModel =
                    case player of
                        Modena ->
                            { model | modenaDeck = nextDeck }

                        Bologna ->
                            { model | bolognaDeck = nextDeck }
            in
            ( nextModel, Cmd.none )

        ShuffleDeckAndDraw player ->
            let
                deck =
                    case player of
                        Modena ->
                            model.modenaDeck

                        Bologna ->
                            model.bolognaDeck
            in
            ( model, shuffleDeck (GetShuffledDeckAndDraw player) player deck )


drawTo : Int -> Deck.Deck -> Deck.Deck
drawTo handSize deck =
    let
        oldHandLength =
            List.length deck.hand

        unplayedLength =
            List.length deck.drawPile
    in
    if oldHandLength >= handSize || unplayedLength == 0 then
        deck

    else
        drawTo handSize (Deck.drawOneCard deck)


drawHand : Player -> Deck.Deck -> ( Deck.Deck, Cmd Msg )
drawHand player deck =
    let
        nextDeck =
            drawTo 3 deck

        handLength =
            List.length nextDeck.hand
    in
    if handLength >= 3 then
        ( nextDeck, Cmd.none )

    else
        ( nextDeck, shuffleDeck (GetShuffledDeckAndDraw player) player (Deck.mergeDiscardPile nextDeck) )


getPlayerDeck : Player -> Model -> Deck.Deck
getPlayerDeck player model =
    case player of
        Modena ->
            model.modenaDeck

        Bologna ->
            model.bolognaDeck


shuffleDeck : (Deck.Deck -> Msg) -> Player -> Deck.Deck -> Cmd Msg
shuffleDeck onShuffle player deck =
    Random.generate onShuffle (Deck.shuffledDeck deck)



-- Is Valid Move --


selectedMove : Model -> Maybe Card.Card
selectedMove model =
    let
        deck =
            getPlayerDeck model.player model

        hand =
            deck.hand

        selectedCard =
            List.Extra.find Playable.isSelected hand
    in
    Maybe.map Playable.unwrap selectedCard


isValidMove : Model -> Int -> Int -> Bool
isValidMove model rowIdx colIdx =
    case selectedMove model of
        Just Card.Place ->
            isValidPlace model rowIdx colIdx

        Just Card.FlankLeft ->
            isValidFlankLeft model rowIdx colIdx

        Just Card.FlankRight ->
            isValidFlankRight model rowIdx colIdx

        Just Card.Charge ->
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
            hasPieceAt rowIdx colIdx player board

        pieceAtStart =
            hasPieceAt (dirR rowIdx) (dirC colIdx) player board
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
    case selectedMove model of
        Just Card.Place ->
            placePiece model.player rowIdx colIdx model.board

        Just Card.FlankLeft ->
            flankLeft model.player rowIdx colIdx model.board

        Just Card.FlankRight ->
            flankRight model.player rowIdx colIdx model.board

        Just Card.Charge ->
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



---- SUBSCRIPTIONS ----


subscriptions : Model -> Sub Msg
subscriptions model =
    case model of
        _ ->
            Sub.none



---- VIEW ----


view : Model -> Browser.Document Msg
view model =
    { title = "Zappalino"
    , body =
        [ header
        , pageContent model
        , pageFooter
        ]
    }


header : Html Msg
header =
    div [] []


pageContent : Model -> Html Msg
pageContent model =
    div [ class "p-8 space-y-4" ]
        [ div [ class "flex flex-row space-x-2" ]
            [ viewPlayer model.player
            , viewActionCount model.actionCount
            ]
        , viewBoard model.board
        , viewCardList model
        , endTurnButton
        , viewDeck model
        ]


viewDeck : Model -> Html Msg
viewDeck model =
    let
        deck =
            getPlayerDeck model.player model

        discard =
            deck.discard

        drawPile =
            deck.drawPile

        countUnplayed =
            List.length drawPile

        countDiscard =
            List.length discard

        unplayedText =
            String.join " " [ "(", String.fromInt countUnplayed, ")" ]

        discardCountText =
            String.join " " [ "(", String.fromInt countDiscard, ")" ]
    in
    div []
        [ div []
            [ text "DrawPile:"
            , text unplayedText
            ]
        , div []
            [ text "Discard:"
            , text discardCountText
            , div [] (viewDiscardPile discard)
            ]
        ]


viewDiscardPile : List Card.Card -> List (Html Msg)
viewDiscardPile =
    List.map cardToItem


cardToItem : Card.Card -> Html Msg
cardToItem card =
    div [] [ text <| Card.show card ]


viewActionCount : Int -> Html Msg
viewActionCount count =
    div [ class "text-2xl text-gray-800" ] [ text <| String.fromInt count ]


endTurnButton : Html Msg
endTurnButton =
    button [ class "btn-primary", onClick EndTurn ] [ text "End Turn" ]


viewCardList : Model -> Html Msg
viewCardList model =
    let
        cards =
            case model.player of
                Bologna ->
                    model.bolognaDeck.hand

                Modena ->
                    model.modenaDeck.hand
    in
    div [ class "flex flex-row space-x-2" ] (cardList model cards)


cardList : Model -> List (Playable Card.Card) -> List (Html Msg)
cardList model cards =
    List.indexedMap (cardToButton model) cards


withPlayerStyle : Player -> String -> String
withPlayerStyle player style =
    case player of
        Bologna ->
            String.join " " [ bolognaStyle, style ]

        Modena ->
            String.join " " [ modenaStyle, style ]


cardToButton : Model -> Int -> Playable Card.Card -> Html Msg
cardToButton model idx card =
    let
        baseStyle =
            "btn-primary"

        unplayedStyle =
            playerStyle model.player

        activeStyle =
            "border-2 border-yellow-500 bg-gray-500"

        exhaustedStyle =
            "bg-gray-200"

        costText =
            Card.showCost (Playable.unwrap card)

        cardText =
            String.join " " [ Card.show (Playable.unwrap card), costText ]
    in
    button
        [ classList
            [ ( baseStyle, True )
            , ( unplayedStyle, Playable.isNotSelected card )
            , ( activeStyle, Playable.isSelected card )
            , ( exhaustedStyle, Playable.isExhausted card )
            ]
        , onClick <| SelectCard idx card model.player
        ]
        [ text cardText ]


viewPlayer : Player -> Html Msg
viewPlayer player =
    let
        baseStyle =
            "p-8 max-w-xs font-black text-gray-100"
    in
    div
        [ classList
            [ ( baseStyle, True )
            , ( playerStyle player, True )
            ]
        ]
        [ text <| showPlayer player ]


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


pageFooter : Html Msg
pageFooter =
    div [] []
