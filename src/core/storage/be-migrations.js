import { DC } from "../constants";

export function beMigration(player) {
    player.reality.imCap = new Decimal(player.reality.iMCap)
    player.reality.imaginaryMachines = new Decimal(player.reality.imaginaryMachines)
    if (player.replicanti.timer != undefined) player.replicanti.timer = new Decimal(player.replicanti.timer)
    player.celestials.enslaved.tesseracts = new Decimal(player.celestials.enslaved.tesseracts)
}