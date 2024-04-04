export class Timer {
  constructor(title, minutes, seconds) {
    this.title = title;
    this.minutes = minutes;
    this.seconds = seconds;
    this.isRunning = false;
    this.duration = 0;
    this.elapsed = 0;
    this.interval = null;
    this.onTimeout = null;
  }

  toggle() {
    this.isRunning ? this.stop() : this.start();
  }

  start() {
    if (this.duration && this.duration > 0) {
      this.isRunning = true;
      const start = Date.now() - this.elapsed;
      this.interval = setInterval(() => {
        const now = Date.now();
        const diff = this.duration * 1000 - (now - start);
        if (diff <= 0) {
          console.log("Timeout");
          console.log(this.onTimeout);
          this.stop();
          
          if(this.onTimeout) {
            this.onTimeout();
          }
          return;
        }
        this.updateDisplay(diff);
        this.elapsed = now - start;
      }, 100);
    }
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      this.isRunning = false;
    }
  }

  reset() {
    this.stop();
    this.elapsed = 0;
    this.updateDisplay(this.duration * 1000);
  }

  restart() {
    this.reset();
    this.start();
  }

  updateDisplay(time) {
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    this.minutes.textContent = `0${minutes}`.slice(-2);
    this.seconds.textContent = `0${seconds}`.slice(-2);
  }

  setTitle(title) {
    this.title.textContent = title;
  }

  setDuration(duration) {
    this.duration = duration;
  }

  setTimeoutCallback(callback) {
    this.onTimeout = callback;
  }
}
