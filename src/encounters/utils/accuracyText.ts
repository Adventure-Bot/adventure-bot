import { AttackResult } from "../../attack/AttackResult";
import { Character } from "../../character/Character";
import { accuracyBar } from "./accuracyBar";
import { hitChanceText } from "./hitChanceText";

export function accuracyText({
  attacker,
  defender,
  attacks,
}: {
  attacker: Character;
  defender: Character;
  attacks: AttackResult[];
}): string {
  return `Hit chance ${hitChanceText(attacker, defender)}
          ${accuracyBar(attacks)}`;
}
