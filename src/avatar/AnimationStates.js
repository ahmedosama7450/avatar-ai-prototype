/**
 * Animation state definitions.
 * Each state defines target params, duration, sub-animations, and transitions.
 */

export const DEFAULT_PARAMS = {
  headX: 0,
  headY: 0,
  headTilt: 0,
  eyeOpenness: 1,
  eyeScale: 1,
  pupilX: 0,
  pupilY: 0,
  eyebrowRaise: 0,
  mouthOpen: 0,
  mouthSmile: 0.4,
  mouthWidth: 0.5,
  armRightAngle: 0,
  armRightWave: 0,
  bodyBounce: 0,
  blushOpacity: 0,
};

export const STATES = {
  idle: {
    name: 'idle',
    duration: Infinity,
    transitionDuration: 500,
    params: {
      headX: 0,
      headY: 0,
      headTilt: 0,
      eyeOpenness: 1,
      eyeScale: 1,
      pupilX: 0,
      pupilY: 0,
      eyebrowRaise: 0,
      mouthOpen: 0,
      mouthSmile: 0.4,
      mouthWidth: 0.5,
      armRightAngle: 0,
      armRightWave: 0,
      bodyBounce: 0,
      blushOpacity: 0,
    },
    subAnimations: [
      {
        name: 'blink',
        type: 'interval',
        interval: 3000,
        jitter: 1500,
        param: 'eyeOpenness',
        keyframes: [
          { value: 0, duration: 80 },
          { value: 1, duration: 120 },
        ],
      },
      {
        name: 'breathe',
        type: 'loop',
        param: 'bodyBounce',
        keyframes: [
          { value: 0.025, duration: 1500 },
          { value: 0, duration: 1500 },
        ],
      },
    ],
  },

  wave: {
    name: 'wave',
    duration: 3500,
    transitionDuration: 400,
    params: {
      armRightAngle: 85,
      mouthSmile: 0.85,
      headTilt: 4,
      eyeScale: 1.05,
      blushOpacity: 0.1,
    },
    onComplete: 'idle',
    subAnimations: [
      {
        name: 'waveMotion',
        type: 'loop',
        param: 'armRightWave',
        keyframes: [
          { value: 1, duration: 280 },
          { value: 0, duration: 280 },
        ],
      },
      {
        name: 'blink',
        type: 'interval',
        interval: 2500,
        jitter: 1000,
        param: 'eyeOpenness',
        keyframes: [
          { value: 0, duration: 80 },
          { value: 1, duration: 120 },
        ],
      },
      {
        name: 'breathe',
        type: 'loop',
        param: 'bodyBounce',
        keyframes: [
          { value: 0.02, duration: 1200 },
          { value: 0, duration: 1200 },
        ],
      },
    ],
  },

  nod: {
    name: 'nod',
    duration: 3000,
    transitionDuration: 400,
    params: {
      mouthSmile: 0.6,
      eyebrowRaise: 0.2,
    },
    onComplete: 'idle',
    subAnimations: [
      {
        name: 'nodMotion',
        type: 'loop',
        count: 3,
        param: 'headY',
        keyframes: [
          { value: 0.15, duration: 300 },
          { value: -0.03, duration: 300 },
        ],
      },
      {
        name: 'blink',
        type: 'interval',
        interval: 3000,
        jitter: 1000,
        param: 'eyeOpenness',
        keyframes: [
          { value: 0, duration: 80 },
          { value: 1, duration: 120 },
        ],
      },
    ],
  },

  talking: {
    name: 'talking',
    duration: Infinity,
    transitionDuration: 300,
    params: {
      mouthSmile: 0.5,
      eyebrowRaise: 0.15,
    },
    subAnimations: [
      {
        name: 'mouthFlap',
        type: 'loop',
        param: 'mouthOpen',
        keyframes: [
          { value: 0.55, duration: 130 },
          { value: 0.12, duration: 110 },
          { value: 0.4, duration: 120 },
          { value: 0.05, duration: 100 },
        ],
      },
      {
        name: 'blink',
        type: 'interval',
        interval: 3500,
        jitter: 1500,
        param: 'eyeOpenness',
        keyframes: [
          { value: 0, duration: 80 },
          { value: 1, duration: 120 },
        ],
      },
      {
        name: 'headBob',
        type: 'loop',
        param: 'headTilt',
        keyframes: [
          { value: 2, duration: 800 },
          { value: -2, duration: 800 },
        ],
      },
      {
        name: 'breathe',
        type: 'loop',
        param: 'bodyBounce',
        keyframes: [
          { value: 0.015, duration: 1000 },
          { value: 0, duration: 1000 },
        ],
      },
    ],
  },

  happy: {
    name: 'happy',
    duration: 3000,
    transitionDuration: 400,
    params: {
      mouthSmile: 1.0,
      mouthOpen: 0.15,
      eyeScale: 1.1,
      eyeOpenness: 0.85,
      eyebrowRaise: 0.5,
      blushOpacity: 0.3,
      bodyBounce: 0.04,
    },
    onComplete: 'idle',
    subAnimations: [
      {
        name: 'happyBounce',
        type: 'loop',
        param: 'bodyBounce',
        keyframes: [
          { value: 0.06, duration: 400 },
          { value: 0.02, duration: 400 },
        ],
      },
      {
        name: 'blink',
        type: 'interval',
        interval: 2800,
        jitter: 1000,
        param: 'eyeOpenness',
        keyframes: [
          { value: 0, duration: 80 },
          { value: 0.85, duration: 120 },
        ],
      },
    ],
  },

  thinking: {
    name: 'thinking',
    duration: 3000,
    transitionDuration: 500,
    params: {
      mouthSmile: 0.15,
      pupilX: 0.55,
      pupilY: -0.3,
      eyebrowRaise: 0.6,
      headTilt: -7,
      eyeOpenness: 0.9,
    },
    onComplete: 'idle',
    subAnimations: [
      {
        name: 'breathe',
        type: 'loop',
        param: 'bodyBounce',
        keyframes: [
          { value: 0.02, duration: 1500 },
          { value: 0, duration: 1500 },
        ],
      },
    ],
  },

  encouraging: {
    name: 'encouraging',
    duration: 3500,
    transitionDuration: 400,
    params: {
      mouthSmile: 0.9,
      mouthOpen: 0.1,
      eyeScale: 1.1,
      eyebrowRaise: 0.3,
      blushOpacity: 0.15,
    },
    onComplete: 'idle',
    subAnimations: [
      {
        name: 'smallNod',
        type: 'loop',
        count: 3,
        param: 'headY',
        keyframes: [
          { value: 0.08, duration: 350 },
          { value: 0, duration: 350 },
        ],
      },
      {
        name: 'breathe',
        type: 'loop',
        param: 'bodyBounce',
        keyframes: [
          { value: 0.03, duration: 1200 },
          { value: 0, duration: 1200 },
        ],
      },
      {
        name: 'blink',
        type: 'interval',
        interval: 3000,
        jitter: 1200,
        param: 'eyeOpenness',
        keyframes: [
          { value: 0, duration: 80 },
          { value: 0.95, duration: 120 },
        ],
      },
    ],
  },
};
