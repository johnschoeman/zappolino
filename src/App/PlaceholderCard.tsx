import { JSX } from "solid-js"

const PlaceHolderCardView = (): JSX.Element => {
  const style =
    "flex flex-col justify-between w-48 h-64 border rounded border-black bg-gray-200 dark:bg-gray-200"

  return <div class={style}></div>
}

export default PlaceHolderCardView
