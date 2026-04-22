import goldCoinImage from "../../../assets/items/loot/goldcoin.png";
export const currencyItemsData = [
    {
        key: "gold",
        name: "Gold",
        icon: goldCoinImage,
        iconKey: "coin",
        weight: 0.05,
        description: "Currency used for simple trade.",
        stats: ["Trade currency"],
        category: "currency",
        stackable: true,
        baseValue: 1,
        tags: ["currency", "loot"],
    },
];
