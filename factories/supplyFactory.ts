import { Factory } from "fishery"

import { Supply } from "../src/model"

export const supplyFactory = Factory.define<Supply.Supply>(() => {
  const supply: Supply.Supply = [
    { card: "DeployHoplite", count: 8 },
    { card: "ManeuverLeft", count: 8 },
    { card: "ManeuverRight", count: 8 },
    { card: "ManeuverForward", count: 8 },
    { card: "Charge", count: 8 },
    { card: "FlankLeft", count: 8 },
    { card: "FlankRight", count: 8 },
    { card: "MilitaryReforms", count: 8 },
    { card: "PoliticalReforms", count: 8 },
  ]

  return supply
})
