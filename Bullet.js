export class Bullet {
  constructor(x, y, velocityX, velocityY, damage = 25) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.radius = 4;
    this.color = '#FFD700';
    this.active = true;
    this.damage = damage;

    // ⭐ Tính góc bắn để xoay sprite
    this.angle = Math.atan2(velocityY, velocityX);

    // ⭐ Sprite settings - THAY ĐỔI ĐƯỜNG DẪN Ở ĐÂY
    this.sprite = this._loadImage("assets/bullet.png"); // Đường dẫn ảnh viên đạn
    this.spriteWidth = 13;   // Chiều rộng sprite trong file ảnh
    this.spriteHeight = 5;  // Chiều cao sprite trong file ảnh
    this.displayWidth = 39;  // Kích thước hiển thị (có thể scale)
    this.displayHeight = 15;
  }

  _loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();

    // Di chuyển gốc tọa độ đến vị trí viên đạn
    ctx.translate(this.x, this.y);
    
    // ⭐ Xoay theo hướng bắn
    ctx.rotate(this.angle);

    // Tắt image smoothing để giữ pixel art sắc nét
    const oldSmoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;

    // Vẽ sprite (nếu đã load) hoặc fallback
    if (this.sprite && this.sprite.complete && this.sprite.naturalWidth > 0) {
      // ⭐ Vẽ sprite - tâm ở (0, 0) do đã translate
      ctx.drawImage(
        this.sprite,
        -this.displayWidth / 2,   // Vẽ từ trung tâm
        -this.displayHeight / 2,
        this.displayWidth,
        this.displayHeight
      );
    } else {
      // Fallback: vẽ hình tròn như cũ nếu sprite chưa load
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.imageSmoothingEnabled = oldSmoothing;
    ctx.restore();
  }

  isOffScreen(canvasWidth, canvasHeight) {
    return (
      this.x < -50 || 
      this.x > canvasWidth + 50 || 
      this.y < -50 || 
      this.y > canvasHeight + 50
    );
  }
}