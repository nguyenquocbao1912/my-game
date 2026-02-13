import { SpriteAnimator } from "./SpriteAnimator.js";

export class Enemy {
  constructor(x, y, type = "zombie") {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = true;
    this.isDead = false;

    // Setup stats theo type
    this.setupType();

    this.hp = this.maxHp;

    // Animation
    this.animator = new SpriteAnimator(this.getSpriteSheet(), 16, 16, {
      idle: { row: 0, frames: 1, frameDelay: 10, loop: true },
      run: { row: 1, frames: 3, frameDelay: 6, loop: true },
      attack: {
        row: 4,
        frames: 2,
        frameDelay: 5,
        loop: true,
        customRows: [4, 0], // ✨ Thêm dòng này
      },
      dead: { row: 0, frames: 1, frameDelay: 10, loop: false },
    });
  }

  getSpriteSheet() {
    const sprites = {
      // Level 1 - Làng Khởi Đầu
      zombie: "assets/enemy_zombie.png",
      skeleton: "assets/enemy_skeleton.png",

      // Level 2 - Rừng Tối
      goblin: "assets/enemy_goblin.png",
      orc: "assets/enemy_orc.png",
      darkwolf: "assets/enemy_darkwolf.png",

      // Level 3 - Hang Động Ma
      demon: "assets/enemy_demon.png",
      wraith: "assets/enemy_wraith.png",
      golem: "assets/enemy_golem.png",

      // Level 4 - Địa Ngục
      dragon: "assets/enemy_dragon.png",
      lich: "assets/enemy_lich.png",
      titan: "assets/enemy_titan.png",

      // Bosses
      boss_necromancer: "assets/boss_necromancer.png",
      boss_demon_lord: "assets/boss_demon_lord.png",
      boss_dragon_king: "assets/boss_dragon_king.png",
    };
    return sprites[this.type] || "";
  }

  setupType() {
    // Default values
    this.speed = 1.5;
    this.maxHp = 100;
    this.damage = 10;
    this.armor = 0;
    this.width = 64;
    this.height = 64;
    this.goldDrop = [5, 15]; // [min, max]
    this.isBoss = false;

    switch (this.type) {
      // ==========================================
      // LEVEL 1 - LÀNG KHỞI ĐẦU (Dễ)
      // ==========================================
      case "zombie":
        this.speed = 1.2;
        this.maxHp = 80;
        this.damage = 8;
        this.armor = 0;
        this.goldDrop = [3, 8];
        break;
      case "skeleton":
        this.speed = 1.8;
        this.maxHp = 60;
        this.damage = 10;
        this.armor = 0;
        this.goldDrop = [5, 10];
        break;
      // ==========================================
      // LEVEL 2 - RỪNG TỐI (Trung Bình)
      // ==========================================
      case "goblin":
        this.speed = 2.0;
        this.maxHp = 100;
        this.damage = 12;
        this.armor = 5;
        this.goldDrop = [8, 15];
        break;
      case "orc":
        this.speed = 1.3;
        this.maxHp = 180;
        this.damage = 15;
        this.armor = 10;
        this.goldDrop = [12, 20];
        break;
      case "darkwolf":
        this.speed = 2.5;
        this.maxHp = 90;
        this.damage = 14;
        this.armor = 3;
        this.goldDrop = [10, 18];
        break;
      // ==========================================
      // LEVEL 3 - HANG ĐỘNG MA (Khó)
      // ==========================================
      case "demon":
        this.speed = 1.8;
        this.maxHp = 250;
        this.damage = 20;
        this.armor = 15;
        this.goldDrop = [20, 35];
        break;
      case "wraith":
        this.speed = 2.2;
        this.maxHp = 180;
        this.damage = 18;
        this.armor = 8;
        this.goldDrop = [18, 30];
        break;
      case "golem":
        this.speed = 0.8;
        this.maxHp = 400;
        this.damage = 25;
        this.armor = 25;
        this.goldDrop = [25, 40];
        break;
      // ==========================================
      // LEVEL 4 - ĐỊA NGỤC (Cực Khó)
      // ==========================================
      case "dragon":
        this.speed = 1.5;
        this.maxHp = 500;
        this.damage = 30;
        this.armor = 20;
        this.goldDrop = [40, 60];
        break;
      case "lich":
        this.speed = 1.6;
        this.maxHp = 350;
        this.damage = 28;
        this.armor = 15;
        this.goldDrop = [35, 55];
        break;
      case "titan":
        this.speed = 1.0;
        this.maxHp = 700;
        this.damage = 35;
        this.armor = 30;
        this.goldDrop = [50, 80];
        break;
    }
  }

  update(playerX, playerY) {
    // Nếu chết, chỉ update animation
    if (this.isDead) {
      this.animator.update();

      // Xóa enemy khi animation chết xong
      if (this.animator.isAnimationComplete()) {
        this.active = false;
      }
      return;
    }

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;

      this.animator.updateDirection(playerX, playerY, this.x, this.y);
      this.animator.setState("run");
    } else {
      this.animator.setState("idle");
    }

    this.animator.update();
  }

  draw(ctx) {
    ctx.save();

    // Shadow (không vẽ khi chết)
    if (!this.isDead) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.ellipse(
        this.x,
        this.y + this.height / 2 + 5,
        this.width / 2,
        this.height / 4,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }

    // Vẽ sprite
    this.animator.draw(ctx, this.x, this.y, this.width, this.height);

    // Health bar
    if (!this.isDead) {
      this.drawHealthBar(ctx);
    }

    ctx.restore();
  }

  drawHealthBar(ctx) {
    const barWidth = this.width;
    const barHeight = 5;
    const barX = this.x - barWidth / 2;
    const barY = this.y - this.height / 2 - 10;

    ctx.fillStyle = "#333";
    ctx.fillRect(barX, barY, barWidth, barHeight);

    const hpPercent = this.hp / this.maxHp;
    ctx.fillStyle =
      hpPercent > 0.5 ? "#4CAF50" : hpPercent > 0.25 ? "#FFC107" : "#F44336";
    ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
  }

  takeDamage(damage) {
    if (this.isDead) return;

    this.hp -= damage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.animator.setState("dead");
    console.log(`💀 Enemy ${this.type} died`);
  }

  collidesWith(bullet) {
    if (this.isDead) return false;

    const distX = Math.abs(bullet.x - this.x);
    const distY = Math.abs(bullet.y - this.y);

    if (distX > this.width / 2 + bullet.radius) return false;
    if (distY > this.height / 2 + bullet.radius) return false;

    if (distX <= this.width / 2) return true;
    if (distY <= this.height / 2) return true;

    const dx = distX - this.width / 2;
    const dy = distY - this.height / 2;
    return dx * dx + dy * dy <= bullet.radius * bullet.radius;
  }

  collidesWithPlayer(player) {
    if (this.isDead) return false;

    const distX = Math.abs(this.x - player.x);
    const distY = Math.abs(this.y - player.y);

    return (
      distX < (this.width + player.width) / 2 &&
      distY < (this.height + player.height) / 2
    );
  }

  getDamage() {
    return this.damage;
  }

  // ✨ THÊM LUN METHOD NÀY (nếu chưa có)
  getGoldDrop() {
    const [min, max] = this.goldDrop;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
