import { progressBar } from "../../utils/progress-bar";
import { AttackResult } from "../../attack/AttackResult";
import { averageRoll } from "./averageRoll";

export function accuracyBar(attacks: AttackResult[]): string {
  if (attacks.length === 0) return "";
  return `${progressBar(averageRoll(attacks) / 20, 10)} 
  Average Roll: ${averageRoll(attacks).toFixed(2).toString()}`;
}
