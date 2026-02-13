export class InputHandler {
  constructor() {
    this.keys = {};
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseDown = false;
    this.canvas = null;
    this.onInventoryToggle = null;
    this.onMouseClick = null;
    this.onMouseMove = null;
    this.onShopToggle = null;
    this.onEscapePress = null;
  }

  init(canvas) {
    this.canvas = canvas;

    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;

      // Phím I để mở/đóng túi đồ
      if (e.key === "i" || e.key === "I") {
        if (this.onInventoryToggle) {
          this.onInventoryToggle();
        }
      }

      // Phím O để mở/đóng cửa hàng
      if (e.key === "o" || e.key === "O") {
        if (this.onShopToggle) {
          this.onShopToggle();
        }
      }

      // Phím ESC để tạm dừng/quay về lobby
      if (e.key === "Escape") {
        if (this.onEscapePress) {
          this.onEscapePress();
        }
      }

      // Phím F11 để toggle fullscreen
      if (e.key === "F11") {
        e.preventDefault();
        this.toggleFullscreen();
      }
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;

      if (this.onMouseMove) {
        this.onMouseMove(this.mouseX, this.mouseY);
      }
    });

    canvas.addEventListener("mousedown", () => {
      this.mouseDown = true;
    });

    canvas.addEventListener("mouseup", () => {
      this.mouseDown = false;
    });

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      if (this.onMouseClick) {
        this.onMouseClick(clickX, clickY);
      }
    });

    // Ngăn context menu khi click phải
    canvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  resetMouseClick() {
    this.mouseDown = false;
  }
}
