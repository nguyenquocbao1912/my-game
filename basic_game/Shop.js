import { Item } from "./Item.js";

export class Shop {
  constructor() {
    this.items = [];
    this.refreshCost = 10;
    this.generateShopItems();
  }

  generateShopItems() {
    this.items = [];

    const rarities = ["common", "common", "rare", "rare", "epic", "legendary"];
    const types = ["helmet", "armor", "gloves", "boots"];

    for (let i = 0; i < 6; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const rarity = rarities[i];

      // ⭐ Random variant
      const variant = Math.floor(Math.random() * 3);

      const item = new Item(type, rarity, variant);
      item.price = this.calculatePrice(rarity);
      this.items.push(item);
    }
  }

  calculatePrice(rarity) {
    const basePrices = {
      common: 20,
      rare: 50,
      epic: 120,
      legendary: 300,
    };
    return basePrices[rarity] || 20;
  }

  refresh() {
    this.generateShopItems();
  }

  buyItem(index) {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      this.items.splice(index, 1);
      return item;
    }
    return null;
  }
}
