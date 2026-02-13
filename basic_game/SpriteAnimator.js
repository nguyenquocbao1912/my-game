export class SpriteAnimator {
  constructor(imagePath, frameWidth, frameHeight, animationConfig) {
    this.image = new Image();
    this.image.src = imagePath;
    this.frameWidth = frameWidth; // 16
    this.frameHeight = frameHeight; // 16
    this.animationConfig = animationConfig;

    this.currentState = "idle";
    this.currentDirection = "down";
    this.currentFrame = 0;
    this.frameCounter = 0;
    this.imageLoaded = false;

    // Hysteresis để tránh flicker
    this.directionThreshold = 15;
    this.lastAngle = 0;

    // Scale factor cho pixel art
    this.pixelScale = 2; // 16x16 -> 32x32

    this.image.onload = () => {
      this.imageLoaded = true;
      console.log(
        `✅ Sprite loaded: ${imagePath} (${frameWidth}x${frameHeight})`,
      );
    };
  }

  setState(state) {
    if (this.currentState !== state && this.animationConfig[state]) {
      this.currentState = state;
      this.currentFrame = 0;
      this.frameCounter = 0;
    }
  }

  updateDirection(mouseX, mouseY, entityX, entityY) {
    // Dead state không đổi direction
    if (this.currentState === "dead") return;

    const dx = mouseX - entityX;
    const dy = mouseY - entityY;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Chỉ update nếu góc thay đổi đủ lớn
    const angleDiff = Math.abs(angle - this.lastAngle);

    if (angleDiff < this.directionThreshold && this.currentDirection) {
      return;
    }

    let newDirection;
    if (angle >= -45 && angle < 45) {
      newDirection = "right";
    } else if (angle >= 45 && angle < 135) {
      newDirection = "down";
    } else if (angle >= -135 && angle < -45) {
      newDirection = "up";
    } else {
      newDirection = "left";
    }

    if (newDirection !== this.currentDirection) {
      this.currentDirection = newDirection;
      this.currentFrame = 0;
      this.frameCounter = 0;
    }

    this.lastAngle = angle;
  }

  update() {
    if (!this.animationConfig[this.currentState]) return;

    const config = this.animationConfig[this.currentState];
    this.frameCounter++;

    if (this.frameCounter >= config.frameDelay) {
      this.frameCounter = 0;
      this.currentFrame++;

      // Nếu là dead animation và loop = false, dừng ở frame cuối
      if (this.currentFrame >= config.frames) {
        if (config.loop === false) {
          this.currentFrame = config.frames - 1; // Hold frame cuối
        } else {
          this.currentFrame = 0;
        }
      }
    }
  }

  draw(ctx, x, y, width, height) {
    if (!this.imageLoaded) return;

    const config = this.animationConfig[this.currentState];
    if (!config) return;

    ctx.imageSmoothingEnabled = false;

    let srcX, srcY;

    // Dead animation không phụ thuộc direction
    if (this.currentState === "dead") {
      srcX = this.currentFrame * this.frameWidth;
      srcY = config.row * this.frameHeight;
    } else {
      const directionMap = {
        down: 0,
        up: 1,
        left: 2,
        right: 3,
      };

      const directionCol = directionMap[this.currentDirection];
      srcX = directionCol * this.frameWidth;

      // ✨ MỚI: Hỗ trợ custom rows cho từng frame
      if (
        config.customRows &&
        config.customRows[this.currentFrame] !== undefined
      ) {
        srcY = config.customRows[this.currentFrame] * this.frameHeight;
      } else {
        srcY = (config.row + this.currentFrame) * this.frameHeight;
      }
    }

    ctx.drawImage(
      this.image,
      srcX,
      srcY,
      this.frameWidth,
      this.frameHeight,
      Math.floor(x - width / 2),
      Math.floor(y - height / 2),
      width,
      height,
    );

    ctx.imageSmoothingEnabled = true;
  }

  isAnimationComplete() {
    const config = this.animationConfig[this.currentState];
    if (!config) return true;

    return config.loop === false && this.currentFrame === config.frames - 1;
  }

  drawDebug(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";

    const text = `${this.currentState} ${this.currentDirection} [${this.currentFrame}]`;
    ctx.strokeText(text, x, y - 40);
    ctx.fillText(text, x, y - 40);
    ctx.restore();
  }
}