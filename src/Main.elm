module Main exposing (..)

import Browser
import Html exposing (Html, button, div, text)
import Html.Attributes exposing (class)
import Html.Events exposing (onClick)



-- MAIN


main =
    Browser.sandbox { init = init, update = update, view = view }



-- MODEL


type Cell
    = Rabble
    | Empty


type alias Row =
    List Cell


type alias Board =
    List Row


type alias Model =
    Board


init : Model
init =
    [ [ Rabble, Empty ], [ Rabble, Empty ] ]



-- UPDATE


type Msg
    = Tick


update : Msg -> Model -> Model
update msg model =
    case msg of
        Tick ->
            moveBoard model


moveBoard : Board -> Board
moveBoard board =
    board



-- VIEW


viewCell : Cell -> Html Msg
viewCell cell =
    case cell of
        Rabble ->
            div [] [ text " [-] " ]

        Empty ->
            div [] [ text " _ " ]


viewRow : Row -> Html Msg
viewRow row =
    div [ class "border flex flex-row" ] (List.map viewCell row)


viewBoard : Board -> Html Msg
viewBoard board =
    div [ class "border" ] (List.map viewRow board)


view : Model -> Html Msg
view model =
    div []
        [ viewBoard model
        , button [ onClick Tick ] [ text "+" ]
        ]
