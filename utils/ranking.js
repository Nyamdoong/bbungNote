export function addRankToList(list) {
  let lastScore = null;
  let rank = 0;

  const scoreCounts = {};
  list.forEach((item) => {
    scoreCounts[item.score] = (scoreCounts[item.score] || 0) + 1;
  });

  return list.map((item, index) => {
    if (item.score !== lastScore) {
      rank = index + 1;
      lastScore = item.score;
    }

    return {
      ...item,
      rank,
      isTied: scoreCounts[item.score] > 1,
    };
  });
}

export function getRankLabel(item) {
  if (item.isTied) {
    return `공동 ${item.rank}위`;
  }

  return `${item.rank}위`;
}