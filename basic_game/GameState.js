export class GameState {
    constructor() {
        this.currentState = 'lobby'; // 'lobby', 'playing', 'gameover'
        this.selectedLevel = 1;
        this.listeners = [];
    }

    setState(newState) {
        this.currentState = newState;
        this.notifyListeners();
    }

    getState() {
        return this.currentState;
    }

    setLevel(level) {
        this.selectedLevel = level;
    }

    getLevel() {
        return this.selectedLevel;
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.currentState));
    }
}