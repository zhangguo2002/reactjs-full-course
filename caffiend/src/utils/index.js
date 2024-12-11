export const statusLevels = {
  low: {
    color: "#047857",
    background: "#d1fae5",
    description: "咖啡因水平较低，带来轻微的提神效果，副作用最小。",
    maxLevel: 100,
  },
  moderate: {
    color: "#b45309",
    background: "#fef3c7",
    description:
      "中等量的咖啡因会引起明显的兴奋感，提升专注度，但可能导致轻微焦虑。",
    maxLevel: 200,
  },
  high: {
    color: "#e11d48",
    background: "#ffe4e6",
    description:
      "高咖啡因水平可能引起不安、心跳加速和注意力不集中，表明摄入过多。",
    maxLevel: 9999,
  },
};

export const coffeeConsumptionHistory = {
  // 这里是咖啡消费记录的示例
  1727579064032: { name: "美式咖啡", cost: 5.52 },
  1727629263026: { name: "Rockstar 能量饮料 (16oz)", cost: 6.78 },
  1727571485301: { name: "玛奇朵", cost: 6.93 },
  // 其他条目...
};

export const coffeeOptions = [
  { name: "浓缩咖啡", caffeine: 63 },
  { name: "双份浓缩咖啡", caffeine: 126 },
  { name: "美式咖啡", caffeine: 96 },
  { name: "卡布奇诺", caffeine: 80 },
  // 其他咖啡选项...
];

const halfLifeHours = 5; // 咖啡因的半衰期为 5 小时

export function calculateCurrentCaffeineLevel(historyData) {
  const currentTime = Date.now();
  const halfLife = halfLifeHours * 60 * 60 * 1000; // 5 小时转换为毫秒
  const maxAge = 48 * 60 * 60 * 1000; // 48 小时转换为毫秒

  let totalCaffeine = 0;

  for (const [timestamp, entry] of Object.entries(historyData)) {
    const timeElapsed = currentTime - parseInt(timestamp);

    // 忽略超过 48 小时的条目
    if (timeElapsed <= maxAge) {
      const caffeineInitial = getCaffeineAmount(entry.name);
      // 使用半衰期公式计算剩余的咖啡因
      const remainingCaffeine =
        caffeineInitial * Math.pow(0.5, timeElapsed / halfLife);
      totalCaffeine += remainingCaffeine;
    }
  }

  return totalCaffeine.toFixed(2);
}

// 辅助函数：根据咖啡名称获取咖啡因含量
export function getCaffeineAmount(coffeeName) {
  const coffee = coffeeOptions.find((c) => c.name === coffeeName);
  return coffee ? coffee.caffeine : 0;
}

// 获取最受欢迎的三种咖啡
export function getTopThreeCoffees(historyData) {
  const coffeeCount = {};

  // 统计每种咖啡的出现次数
  for (const entry of Object.values(historyData)) {
    const coffeeName = entry.name;
    if (coffeeCount[coffeeName]) {
      coffeeCount[coffeeName]++;
    } else {
      coffeeCount[coffeeName] = 1;
    }
  }

  // 将 coffeeCount 对象转换为 [coffeeName, count] 数组并按次数排序
  const sortedCoffees = Object.entries(coffeeCount).sort((a, b) => b[1] - a[1]);

  // 计算总共消费的咖啡数量
  const totalCoffees = Object.values(coffeeCount).reduce(
    (sum, count) => sum + count,
    0
  );

  // 获取三种最受欢迎的咖啡
  const topThree = sortedCoffees.slice(0, 3).map(([coffeeName, count]) => {
    const percentage = ((count / totalCoffees) * 100).toFixed(2);
    return {
      coffeeName: coffeeName,
      count: count,
      percentage: percentage + "%",
    };
  });

  return topThree;
}

// 根据时间戳计算自消费以来的时间
export function timeSinceConsumption(utcMilliseconds) {
  const now = Date.now();
  const diffInMilliseconds = now - utcMilliseconds;

  // 转换为秒、分钟、小时、天数和月数
  const seconds = Math.floor(diffInMilliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  // 获取每个单位的余数
  const remainingDays = days % 30;
  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  // 构建字符串
  let result = "";
  if (months > 0) result += `${months}月 `;
  if (remainingDays > 0) result += `${remainingDays}天 `;
  if (remainingHours > 0) result += `${remainingHours}小时 `;
  if (remainingMinutes > 0) result += `${remainingMinutes}分钟 `;
  if (remainingSeconds > 0 || result === "") result += `${remainingSeconds}秒`;

  return result.trim(); // 去掉尾部的空格
}

// 计算咖啡消费的统计数据
export function calculateCoffeeStats(coffeeConsumptionHistory) {
  const dailyStats = {};
  let totalCoffees = 0;
  let totalCost = 0;
  let totalCaffeine = 0;
  let totalDaysWithCoffee = 0;

  for (const [timestamp, coffee] of Object.entries(coffeeConsumptionHistory)) {
    const date = new Date(parseInt(timestamp)).toISOString().split("T")[0]; // 提取 YYYY-MM-DD 格式的日期
    const caffeine = getCaffeineAmount(coffee.name);
    const cost = parseFloat(coffee.cost);

    // 初始化或更新每日统计数据
    if (!dailyStats[date]) {
      dailyStats[date] = { caffeine: 0, cost: 0, count: 0 };
    }

    dailyStats[date].caffeine += caffeine;
    dailyStats[date].cost += cost;
    dailyStats[date].count += 1;

    // 更新总数
    totalCoffees += 1;
    totalCost += cost;
  }

  const days = Object.keys(dailyStats).length;
  const dailyCaffeine = {};
  for (const [date, stats] of Object.entries(dailyStats)) {
    if (stats.caffeine > 0) {
      totalCaffeine += stats.caffeine;
      totalDaysWithCoffee += 1; // 统计含咖啡因消费的天数
    }
  }

  // 计算日均咖啡因和日均花费
  const averageDailyCaffeine =
    totalDaysWithCoffee > 0
      ? (totalCaffeine / totalDaysWithCoffee).toFixed(2)
      : 0;
  const averageDailyCost =
    totalDaysWithCoffee > 0 ? (totalCost / totalDaysWithCoffee).toFixed(2) : 0;
  console.log(totalCost, typeof totalCost);
  return {
    daily_caffeine: averageDailyCaffeine,
    daily_cost: averageDailyCost,
    average_coffees: (totalCoffees / days).toFixed(2),
    total_cost: totalCost.toFixed(2),
  };
}
