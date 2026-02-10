import { lerp, easeInOutCubic } from "../utils/lerp.js";
import { STATES, DEFAULT_PARAMS } from "./AnimationStates.js";

class SubAnimation {
  constructor(def) {
    this.def = def;
    this.elapsed = 0;
    this.keyframeIndex = 0;
    this.keyframeElapsed = 0;
    this.loopCount = 0;
    this.maxLoops = def.count || Infinity;
    this.active = true;
    this.prevValue = null;

    // For interval-based (e.g. blink)
    if (def.type === "interval") {
      this.nextTrigger =
        def.interval + (Math.random() - 0.5) * (def.jitter || 0);
      this.triggered = false;
    }
  }

  update(dt, currentParams) {
    if (!this.active) return;

    if (this.def.type === "interval") {
      this.elapsed += dt;
      if (!this.triggered) {
        if (this.elapsed >= this.nextTrigger) {
          this.triggered = true;
          this.keyframeIndex = 0;
          this.keyframeElapsed = 0;
          this.prevValue = currentParams[this.def.param];
        }
        return;
      }
      // Playing the keyframe sequence
      this._playKeyframes(dt, currentParams);
      return;
    }

    if (this.def.type === "loop") {
      if (this.loopCount >= this.maxLoops) return;
      if (this.prevValue === null) {
        this.prevValue = currentParams[this.def.param];
      }
      this._playKeyframes(dt, currentParams);
    }
  }

  _playKeyframes(dt, currentParams) {
    const kfs = this.def.keyframes;
    if (this.keyframeIndex >= kfs.length) {
      // Sequence complete
      if (this.def.type === "interval") {
        this.triggered = false;
        this.elapsed = 0;
        this.nextTrigger =
          this.def.interval + (Math.random() - 0.5) * (this.def.jitter || 0);
      } else if (this.def.type === "loop") {
        this.loopCount++;
        if (this.loopCount < this.maxLoops) {
          this.keyframeIndex = 0;
          this.keyframeElapsed = 0;
          this.prevValue = currentParams[this.def.param];
        }
      }
      return;
    }

    const kf = kfs[this.keyframeIndex];
    this.keyframeElapsed += dt;
    const t = Math.min(this.keyframeElapsed / kf.duration, 1);
    const eased = easeInOutCubic(t);

    currentParams[this.def.param] = lerp(this.prevValue, kf.value, eased);

    if (t >= 1) {
      this.prevValue = kf.value;
      this.keyframeIndex++;
      this.keyframeElapsed = 0;
    }
  }

  reset() {
    this.elapsed = 0;
    this.keyframeIndex = 0;
    this.keyframeElapsed = 0;
    this.loopCount = 0;
    this.active = true;
    this.prevValue = null;
    if (this.def.type === "interval") {
      this.nextTrigger =
        this.def.interval + (Math.random() - 0.5) * (this.def.jitter || 0);
      this.triggered = false;
    }
  }
}

export class AnimationEngine {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.currentParams = { ...DEFAULT_PARAMS };
    this.sourceParams = { ...DEFAULT_PARAMS };
    this.targetParams = { ...DEFAULT_PARAMS };
    this.transitionProgress = 1;
    this.transitionDuration = 500;
    this.currentState = null;
    this.stateElapsed = 0;
    this.subAnimations = [];

    this.transitionTo("idle");
  }

  transitionTo(stateName) {
    const state = STATES[stateName];
    if (!state) {
      console.warn(`Unknown animation state: ${stateName}`);
      return;
    }

    // Snapshot current params as transition source
    this.sourceParams = { ...this.currentParams };

    // Build target by merging defaults with state params
    this.targetParams = { ...DEFAULT_PARAMS, ...state.params };

    this.transitionProgress = 0;
    this.transitionDuration = state.transitionDuration || 500;
    this.currentState = state;
    this.stateElapsed = 0;

    // Create sub-animations
    this.subAnimations = (state.subAnimations || []).map(
      (def) => new SubAnimation(def),
    );
  }

  update(dt) {
    // Advance the base transition
    if (this.transitionProgress < 1) {
      this.transitionProgress += dt / this.transitionDuration;
      this.transitionProgress = Math.min(this.transitionProgress, 1);
      const t = easeInOutCubic(this.transitionProgress);

      for (const key of Object.keys(this.targetParams)) {
        if (this.sourceParams[key] !== undefined) {
          this.currentParams[key] = lerp(
            this.sourceParams[key],
            this.targetParams[key],
            t,
          );
        }
      }
    }

    // Layer sub-animations on top
    for (const subAnim of this.subAnimations) {
      subAnim.update(dt, this.currentParams);
    }

    // Check if state duration has elapsed
    if (this.currentState && this.currentState.duration !== Infinity) {
      this.stateElapsed += dt;
      if (this.stateElapsed >= this.currentState.duration) {
        const nextState = this.currentState.onComplete || "idle";
        this.eventBus.emit("animation:stateComplete", this.currentState.name);
        this.transitionTo(nextState);
      }
    }

    return this.currentParams;
  }

  getCurrentState() {
    return this.currentState?.name || "idle";
  }
}
