function getEnglishSuffix(rank) {
  const j = rank % 10,
    k = rank % 100;
  if (j === 1 && k !== 11) return `${rank}st`;
  if (j === 2 && k !== 12) return `${rank}nd`;
  if (j === 3 && k !== 13) return `${rank}rd`;
  return `${rank}th`;
}

function getAzerbaijaniSuffix(rank) {
  const num = `${rank}`;
  const lastDigit = num[num.length - 1];
  if (["0", "6", "9"].includes(lastDigit)) return `${rank}-cu`;
  if (["1", "2", "5", "7", "8"].includes(lastDigit)) return `${rank}-ci`;
  if (["3", "4"].includes(lastDigit)) return `${rank}-cü`;
  return `${rank}-ci`;
}

function getRussianSuffix(rank) {
  return `${rank}-е`;
}

export default function getCorrectSuffix(rank, language) {
  switch (language) {
    case "en":
      return getEnglishSuffix(rank);
    case "az":
      return getAzerbaijaniSuffix(rank);
    case "ru":
      return getRussianSuffix(rank);
    default:
      return rank;
  }
}
