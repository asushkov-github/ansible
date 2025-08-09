/*
  Newton's Laws — Dynamic SVG for Kids
  - Scene management with requestAnimationFrame
  - Three scenes: Inertia, F=ma, Action-Reaction
*/

class AnimationClock {
  constructor() {
    this.isRunning = false;
    this._last = 0;
    this._subscribers = new Set();
  }

  subscribe(handler) {
    this._subscribers.add(handler);
    return () => this._subscribers.delete(handler);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this._last = performance.now();
    const tick = (t) => {
      if (!this.isRunning) return;
      const dt = Math.min(0.05, (t - this._last) / 1000);
      this._last = t;
      for (const fn of this._subscribers) fn(dt);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  stop() {
    this.isRunning = false;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function roundTo(value, decimals = 2) {
  const p = Math.pow(10, decimals);
  return Math.round(value * p) / p;
}

// Scene 1: Inertia
class SceneInertia {
  constructor(root) {
    this.root = root;
    this.ballGroup = root.querySelector('#l1-ball');
    this.handGroup = root.querySelector('#l1-hand');
    this.speedLabel = root.querySelector('#l1-speed-label');

    this.pushButton = document.getElementById('l1-push');
    this.resetButton = document.getElementById('l1-reset');
    this.frictionSlider = document.getElementById('l1-friction');

    this.positionX = 100; // px
    this.velocityX = 0; // px/s
    this.friction = parseFloat(this.frictionSlider.value); // 0..1

    this.trackMin = 60;
    this.trackMax = 740;

    this._bind();
    this._render();
  }

  _bind() {
    this.pushButton.addEventListener('click', () => {
      // Give the ball an initial speed; stronger if friction is high to make it satisfying
      const baseKick = 250;
      const bonus = 150 * this.friction;
      this.velocityX += baseKick + bonus;
      // little hand nudge animation
      this._animateHand();
    });

    this.resetButton.addEventListener('click', () => this.reset());

    this.frictionSlider.addEventListener('input', () => {
      this.friction = parseFloat(this.frictionSlider.value);
    });
  }

  _animateHand() {
    const start = performance.now();
    const duration = 200;
    const base = 60;
    const go = (t) => {
      const k = Math.min(1, (t - start) / duration);
      const dx = 8 * Math.sin(k * Math.PI);
      this.handGroup.setAttribute('transform', `translate(${base + dx},170)`);
      if (k < 1) requestAnimationFrame(go); else this.handGroup.setAttribute('transform', `translate(${base},170)`);
    };
    requestAnimationFrame(go);
  }

  update(dt) {
    // Apply friction as a deceleration proportional to velocity sign
    const frictionForce = this.friction * 120; // px/s^2
    if (Math.abs(this.velocityX) > 0) {
      const sign = Math.sign(this.velocityX);
      const vMag = Math.max(0, Math.abs(this.velocityX) - frictionForce * dt);
      this.velocityX = vMag * sign;
    }

    this.positionX += this.velocityX * dt;

    // Bounds and gentle bounce
    if (this.positionX < this.trackMin) {
      this.positionX = this.trackMin;
      this.velocityX = -this.velocityX * 0.5;
    } else if (this.positionX > this.trackMax) {
      this.positionX = this.trackMax;
      this.velocityX = -this.velocityX * 0.5;
    }

    this._render();
  }

  _render() {
    this.ballGroup.setAttribute('transform', `translate(${this.positionX},200)`);
    this.speedLabel.textContent = `speed: ${roundTo(this.velocityX, 0)}`;
  }

  reset() {
    this.positionX = 100;
    this.velocityX = 0;
    this._render();
  }
}

// Scene 2: F = m * a
class SceneFma {
  constructor(root) {
    this.root = root;
    this.cart1 = root.querySelector('#l2-cart1');
    this.cart2 = root.querySelector('#l2-cart2');
    this.a1Label = root.querySelector('#l2-a1');
    this.a2Label = root.querySelector('#l2-a2');

    this.forceSlider = document.getElementById('l2-force');
    this.m1Slider = document.getElementById('l2-m1');
    this.m2Slider = document.getElementById('l2-m2');
    this.startButton = document.getElementById('l2-start');
    this.resetButton = document.getElementById('l2-reset');

    this.f1Line = root.querySelector('#l2-f1');
    this.f1Head = root.querySelector('#l2-f1-head');
    this.f2Line = root.querySelector('#l2-f2');
    this.f2Head = root.querySelector('#l2-f2-head');

    this.trackMin = 60;
    this.trackMax = 740;

    this.p1 = 60;
    this.p2 = 60;
    this.v1 = 0;
    this.v2 = 0;

    this._bind();
    this._render(0);
  }

  _bind() {
    const updateForces = () => this._renderForceArrows();
    this.forceSlider.addEventListener('input', updateForces);
    this.m1Slider.addEventListener('input', () => this._render(0));
    this.m2Slider.addEventListener('input', () => this._render(0));

    this.startButton.addEventListener('click', () => {
      // Apply constant force for a short push duration
      this._pushTime = 1.2; // seconds
    });

    this.resetButton.addEventListener('click', () => this.reset());

    // initial force arrows
    this._renderForceArrows();
  }

  _renderForceArrows() {
    const F = parseFloat(this.forceSlider.value); // 20..200
    const arrowLen = 30 + (F - 20) * 0.7;

    const draw = (line, head, x1, y) => {
      const x2 = x1 + arrowLen;
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y);
      head.setAttribute('points', `${x2},${y} ${x2 - 12},${y - 6} ${x2 - 12},${y + 6}`);
    };

    draw(this.f1Line, this.f1Head, 60, 120);
    draw(this.f2Line, this.f2Head, 60, 250);
  }

  update(dt) {
    // During push time, apply acceleration a = F/m
    const F = parseFloat(this.forceSlider.value);
    const m1 = parseFloat(this.m1Slider.value);
    const m2 = parseFloat(this.m2Slider.value);

    if (this._pushTime && this._pushTime > 0) {
      const a1 = F / m1; // px/s^2 (scaled units)
      const a2 = F / m2;
      this.v1 += a1 * dt;
      this.v2 += a2 * dt;
      this._pushTime -= dt;
    }

    // Apply gentle rolling friction to limit runaway speed
    const friction = 10;
    this.v1 = Math.max(0, this.v1 - friction * dt);
    this.v2 = Math.max(0, this.v2 - friction * dt);

    this.p1 = clamp(this.p1 + this.v1 * dt, this.trackMin, this.trackMax);
    this.p2 = clamp(this.p2 + this.v2 * dt, this.trackMin, this.trackMax);

    this._render(F);
  }

  _render(F) {
    const m1 = parseFloat(this.m1Slider.value);
    const m2 = parseFloat(this.m2Slider.value);

    const a1 = (F || 0) / m1;
    const a2 = (F || 0) / m2;

    this.cart1.setAttribute('transform', `translate(${this.p1},110)`);
    this.cart2.setAttribute('transform', `translate(${this.p2},240)`);

    this.a1Label.textContent = `a: ${roundTo(a1, 1)}`;
    this.a2Label.textContent = `a: ${roundTo(a2, 1)}`;
  }

  reset() {
    this.p1 = 60;
    this.p2 = 60;
    this.v1 = 0;
    this.v2 = 0;
    this._pushTime = 0;
    this._render(parseFloat(this.forceSlider.value));
  }
}

// Scene 3: Action-Reaction
class SceneActionReaction {
  constructor(root) {
    this.root = root;
    this.groupL = root.querySelector('#l3-left');
    this.groupR = root.querySelector('#l3-right');
    this.vLLabel = root.querySelector('#l3-vL');
    this.vRLabel = root.querySelector('#l3-vR');

    this.arrowL = root.querySelector('#l3-arrowL');
    this.arrowLHead = root.querySelector('#l3-headL');
    this.arrowR = root.querySelector('#l3-arrowR');
    this.arrowRHead = root.querySelector('#l3-headR');

    this.mLSlider = document.getElementById('l3-mL');
    this.mRSlider = document.getElementById('l3-mR');
    this.forceSlider = document.getElementById('l3-force');
    this.pushButton = document.getElementById('l3-push');
    this.resetButton = document.getElementById('l3-reset');

    this.xL = 260;
    this.xR = 540;
    this.vL = 0;
    this.vR = 0;

    this.leftMin = 80;
    this.rightMax = 720;

    this._bind();
    this._renderArrows();
  }

  _bind() {
    const updateArrows = () => this._renderArrows();
    this.mLSlider.addEventListener('input', updateArrows);
    this.mRSlider.addEventListener('input', updateArrows);
    this.forceSlider.addEventListener('input', updateArrows);

    this.pushButton.addEventListener('click', () => {
      // Impulse: equal & opposite. v change inversely proportional to mass
      const F = parseFloat(this.forceSlider.value);
      const mL = parseFloat(this.mLSlider.value);
      const mR = parseFloat(this.mRSlider.value);
      const impulse = F * 0.5; // scaled
      this.vL -= impulse / mL;
      this.vR += impulse / mR;
    });

    this.resetButton.addEventListener('click', () => this.reset());
  }

  _renderArrows() {
    const F = parseFloat(this.forceSlider.value);
    // Arrow length proportional to force
    const len = 30 + (F - 30) * 0.6;
    const drawLeft = (x, y, length) => {
      this.arrowL.setAttribute('x1', x);
      this.arrowL.setAttribute('y1', y);
      this.arrowL.setAttribute('x2', x - length);
      this.arrowL.setAttribute('y2', y);
      this.arrowLHead.setAttribute('points', `${x - length},${y} ${x - length + 12},${y - 6} ${x - length + 12},${y + 6}`);
    };
    const drawRight = (x, y, length) => {
      this.arrowR.setAttribute('x1', x);
      this.arrowR.setAttribute('y1', y);
      this.arrowR.setAttribute('x2', x + length);
      this.arrowR.setAttribute('y2', y);
      this.arrowRHead.setAttribute('points', `${x + length},${y} ${x + length - 12},${y - 6} ${x + length - 12},${y + 6}`);
    };
    drawLeft(300, 160, len);
    drawRight(500, 160, len);
  }

  update(dt) {
    // Gentle rolling friction
    const roll = 8;
    this.vL = Math.max(0, this.vL + (this.vL < 0 ? roll * dt : -roll * dt));
    this.vR = Math.max(0, this.vR + (this.vR > 0 ? -roll * dt : roll * dt));

    this.xL = clamp(this.xL + this.vL * dt, this.leftMin, 400);
    this.xR = clamp(this.xR + this.vR * dt, 400, this.rightMax);

    this.groupL.setAttribute('transform', `translate(${this.xL},200)`);
    this.groupR.setAttribute('transform', `translate(${this.xR},200)`);

    this.vLLabel.textContent = `v: ${roundTo(this.vL, 1)}`;
    this.vRLabel.textContent = `v: ${roundTo(this.vR, 1)}`;
  }

  reset() {
    this.xL = 260;
    this.xR = 540;
    this.vL = 0;
    this.vR = 0;
    this.groupL.setAttribute('transform', `translate(${this.xL},200)`);
    this.groupR.setAttribute('transform', `translate(${this.xR},200)`);
    this.vLLabel.textContent = 'v: 0';
    this.vRLabel.textContent = 'v: 0';
  }
}

// Tabs and bootstrapping
function setupTabs() {
  const buttons = Array.from(document.querySelectorAll('.tab'));
  const panels = Array.from(document.querySelectorAll('.panel'));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));
      panels.forEach((p) => p.classList.toggle('is-visible', p.id === target));
      const panel = panels.find((p) => p.id === target);
      if (panel) panel.focus({ preventScroll: true });
    });
  });
}

function main() {
  setupTabs();

  const clock = new AnimationClock();

  const scene1 = new SceneInertia(document.getElementById('svg-law1'));
  const scene2 = new SceneFma(document.getElementById('svg-law2'));
  const scene3 = new SceneActionReaction(document.getElementById('svg-law3'));

  clock.subscribe((dt) => {
    scene1.update(dt);
    scene2.update(dt);
    scene3.update(dt);
  });

  clock.start();
}

window.addEventListener('DOMContentLoaded', main);