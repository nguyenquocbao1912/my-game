export class Camera {
    constructor(canvasWidth, canvasHeight, mapWidth, mapHeight) {
        this.x = 0;
        this.y = 0;
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.smoothing = 0.1; // Độ mượt của camera
    }

    follow(target) {
        // Camera theo player với hiệu ứng smooth
        const targetX = target.x - this.width / 2;
        const targetY = target.y - this.height / 2;

        // Smooth camera movement
        this.x += (targetX - this.x) * this.smoothing;
        this.y += (targetY - this.y) * this.smoothing;

        // Giới hạn camera trong map
        this.x = Math.max(0, Math.min(this.x, this.mapWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, this.mapHeight - this.height));
    }

    update(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
    }

    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }
}