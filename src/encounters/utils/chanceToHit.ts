// given a bonus to your roll, what are the chances of rolling above a target?
export const chanceToHit = ({
  bonus,
  dc,
}: {
  bonus: number;
  dc: number;
}): number => {
  console.log("hit chance", { bonus, dc, chance: (21 - (dc - bonus)) / 20 });
  return (21 - (dc - bonus)) / 20;
}; // https://rpg.stackexchange.com/a/70349
