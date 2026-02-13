export class SpawnWarning {
    constructor(x, y, duration = 120) { // 2 giây ở 60fps
        this.x = x;
        this.y = y;
        this.duration = duration;
        this.timer = 0;
        this.radius = 30;
        this.maxRadius = 60;
        this.active = true;
    }

    update() {
        this.timer++;
        if (this.timer >= this.duration) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        const progress = this.timer / this.duration;
        const alpha = 1 - progress;
        const pulseRadius = this.radius + (this.maxRadius - this.radius) * Math.sin(progress * Math.PI * 4);

        ctx.save();

        // Vòng tròn cảnh báo nhấp nháy
        ctx.strokeStyle = `rgba(255, 0, 0, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Vòng tròn bên trong
        ctx.strokeStyle = `rgba(255, 100, 0, ${alpha * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseRadius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Điểm ở giữa
        ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Warning text
        if (Math.floor(this.timer / 10) % 2 === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('!', this.x, this.y - pulseRadius - 10);
        }

        ctx.restore();
    }

    isComplete() {
        return !this.active;
    }
}