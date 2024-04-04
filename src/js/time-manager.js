import { stanceStyles } from "./configuration.js";

export class TimerManager {
  static SLIDE = 0;
  static SINGLE = 1;
  static DUAL = 2;

  constructor(data, firstTimer, secondTimer) {
    this.data = data;
    this.currentIndex = 0;
    this.firstTimer = firstTimer;
    this.secondTimer = secondTimer;
    this.currentTimerMode = null;
    this.isCoachingMode = false;
    this.isAutoToggle = true;
    this.setOnTimeout();
  }

  setData(newData) {
    if (newData) this.data = newData;
  }

  toggleCoachingOneMinute() {
    this.toggleCoaching(60);
  }

  toggleCoachingTwoMinutes() {
    this.toggleCoaching(120);
  }

  toggleCoaching(seconds) {
    this.isCoachingMode = !this.isCoachingMode;
    if (this.isCoachingMode) {
      this.setTimerMode("timer1");
      this.displayTimersByMode();
      this.initTimers("教练指导环节", "-", seconds, 0, "无", null);
    } else {
      this.loadCurrentIndexData();
    }
  }

  loadCurrentIndexData() {
    if (!this.hasData()) return;

    const {
      type,
      mainTitle,
      title1,
      stance1,
      duration1,
      title2,
      stance2,
      duration2,
    } = this.data[this.currentIndex];

    this.setTimerMode(type);
    this.displayTimersByMode();

    const isSlide = this.isSlide();
    document.body.classList.add(isSlide ? "slide-display" : "timer-display");
    document.body.classList.remove(isSlide ? "timer-display" : "slide-display");

    this.initTimers(title1, title2, duration1, duration2, stance1, mainTitle);
  }

  initTimers(title1, title2, duration1, duration2, stance, mainTitle) {
    this.configureTimer(this.firstTimer, title1, duration1);
    if (this.isDualTimer())
      this.configureTimer(this.secondTimer, title2, duration2);

    if (this.isSingleTimer()) this.applyStance(stance);

    this.displayMainTitle(mainTitle);
  }

  moveIndex(step) {
    this.currentIndex += step;
    this.currentIndex = Math.max(
      0,
      Math.min(this.currentIndex, this.data.length - 1)
    );
    [this.firstTimer, this.secondTimer].forEach((timer) => timer.reset());
    this.loadCurrentIndexData();
  }

  hasData() {
    if (!this.data || this.data.length === 0) {
      alert("Data not loaded");
      return false;
    }
    return true;
  }

  setTimerMode(type) {
    this.currentTimerMode = {
      slide: TimerManager.SLIDE,
      timer1: TimerManager.SINGLE,
      timer2: TimerManager.DUAL,
    }[type];
  }

  isSlide() {
    return this.currentTimerMode === TimerManager.SLIDE;
  }

  isSingleTimer() {
    return this.currentTimerMode === TimerManager.SINGLE;
  }

  isDualTimer() {
    return this.currentTimerMode === TimerManager.DUAL;
  }

  configureTimer(timer, title, duration) {
    timer.setTitle(title);
    timer.setDuration(duration || 0);
    timer.reset();
  }

  displayTimersByMode() {
    const box = document.getElementById("box");

    if (this.isSlide()) {
      box.style.display = "none";
    } else {
      box.style.display = "";
      box.classList.toggle("single-countdown", this.isSingleTimer());
      box.classList.toggle("both-countdowns", this.isDualTimer());
    }
  }

  applyStance(stance) {
    const countdown = document.getElementById("countdown");
    Object.values(stanceStyles).forEach((style) =>
      countdown.classList.remove(style)
    );
    if (stanceStyles[stance]) countdown.classList.add(stanceStyles[stance]);
  }

  displayMainTitle(title) {
    const titleElement = document.getElementById("main-title");
    if (title) {
      titleElement.style.display = "block";
      titleElement.textContent = title;
    } else {
      titleElement.style.display = "none";
    }
  }

  toggleFirstTimer() {
    this.toggleTimerBasedOnStatus(this.firstTimer, this.secondTimer);
  }

  toggleSecondTimer() {
    this.toggleTimerBasedOnStatus(this.secondTimer, this.firstTimer);
  }

  toggleTimerBasedOnStatus(primaryTimer, secondaryTimer) {
    primaryTimer.toggle();
    if (primaryTimer.isRunning) secondaryTimer.stop();
  }

  hasTimerRunning() {
    return this.firstTimer.isRunning || this.secondTimer.isRunning;
  }

  toggleBothTimersConditionally() {
    if (this.isDualTimer() && this.hasTimerRunning())
      [this.firstTimer, this.secondTimer].forEach((timer) => timer.toggle());
  }

  handleTimerTimeout(timer) {
    if (timer === this.firstTimer && this.secondTimer.duration * 1000 - this.secondTimer.elapsed > 0) {
      console.log("First timer timeout")
      this.toggleSecondTimer();
    } else if (timer === this.secondTimer && this.firstTimer.duration * 1000 - this.firstTimer.elapsed > 0) {
      console.log("First timer timeout")
      this.toggleFirstTimer();
    }
  }

  setAutoToggle(value) {
    this.isAutoToggle = value;
    this.setOnTimeout();
  }

  setOnTimeout() {
    this.firstTimer.setTimeoutCallback(
      this.isAutoToggle
        ? () => this.handleTimerTimeout(this.firstTimer)
        : null
    );
    this.secondTimer.setTimeoutCallback(
      this.isAutoToggle
        ? () => this.handleTimerTimeout(this.secondTimer)
        : null
    );
  }
}
