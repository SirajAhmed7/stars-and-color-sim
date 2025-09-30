export default function fluidSimulationGyro(wrapper, canvas) {
  if (!wrapper || !canvas) return () => {};

  // ===== CLEANUP SYSTEM =====
  const cleanup = {
    eventListeners: [],
    timeouts: [],
    intervals: [],
    animationFrame: null,
    webglResources: [],
    initialized: false,
  };

  const addEventListenerWithCleanup = (element, event, handler, options) => {
    element.addEventListener(event, handler, options);
    cleanup.eventListeners.push({ element, event, handler, options });
  };

  const setTimeoutWithCleanup = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    cleanup.timeouts.push(timeoutId);
    return timeoutId;
  };

  const trackWebGLResource = (resource) => {
    if (resource) cleanup.webglResources.push(resource);
    return resource;
  };

  // ===== WEBGL SETUP =====
  let gl;
  try {
    gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return () => {};
    }
  } catch (error) {
    console.error("Failed to get WebGL context:", error);
    return () => {};
  }

  // ===== CANVAS SIZING =====
  canvas.width = wrapper.clientWidth + wrapper.clientWidth * 0.195;
  canvas.height = wrapper.clientHeight + wrapper.clientHeight * 0.1;
  canvas.focus();

  const simHeight = 3;
  let cScale = canvas.height / simHeight;
  let simWidth = canvas.width / cScale;

  // ===== SIMULATION CONSTANTS =====
  const U_FIELD = 0;
  const V_FIELD = 1;
  const FLUID_CELL = 0;
  const AIR_CELL = 1;
  const SOLID_CELL = 2;

  let cnt = 0;
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

  // ===== DEVICE ORIENTATION VARIABLES =====
  let lastBeta = 0;
  let lastGamma = 0;
  let lastAlpha = 0;
  let orientationSupported = false;
  let permissionGranted = false;
  let isIOS = false;
  let orientationInitialized = false;

  // ===== WEBGL RESOURCES =====
  let logoTexture = null;
  let pointShader = null;
  let texturedShader = null;
  let pointVertexBuffer = null;
  let pointColorBuffer = null;
  let gridVertBuffer = null;
  let gridColorBuffer = null;

  // Animation control
  let animationRunning = false;

  // ===== DEVICE DETECTION =====
  function detectIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  // ===== TEXTURE LOADING =====
  function loadTexture(gl, url) {
    const texture = trackWebGLResource(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 255])
    );

    const image = new Image();
    image.onload = function () {
      if (!cleanup.initialized) return;

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;
    return texture;
  }

  function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }

  // ===== FLIPFLUID CLASS (keeping same as before) =====
  class FlipFluid {
    constructor(density, width, height, spacing, particleRadius, maxParticles) {
      this.density = density;
      this.fNumX = Math.floor(width / spacing) + 1;
      this.fNumY = Math.floor(height / spacing) + 1;
      this.h = Math.max(width / this.fNumX, height / this.fNumY);
      this.fInvSpacing = 1.0 / this.h;
      this.fNumCells = this.fNumX * this.fNumY;

      this.u = new Float32Array(this.fNumCells);
      this.v = new Float32Array(this.fNumCells);
      this.du = new Float32Array(this.fNumCells);
      this.dv = new Float32Array(this.fNumCells);
      this.prevU = new Float32Array(this.fNumCells);
      this.prevV = new Float32Array(this.fNumCells);
      this.p = new Float32Array(this.fNumCells);
      this.s = new Float32Array(this.fNumCells);
      this.cellType = new Int32Array(this.fNumCells);
      this.cellColor = new Float32Array(3 * this.fNumCells);

      this.maxParticles = maxParticles;
      this.particlePos = new Float32Array(2 * this.maxParticles);
      this.particleColor = new Float32Array(3 * this.maxParticles);

      for (let i = 0; i < this.maxParticles; i++) {
        this.particleColor[3 * i] = 1.0;
        this.particleColor[3 * i + 1] = 1.0;
        this.particleColor[3 * i + 2] = 1.0;
      }

      this.particleVel = new Float32Array(2 * this.maxParticles);
      this.particleDensity = new Float32Array(this.fNumCells);
      this.particleRestDensity = 0.0;

      this.particleRadius = particleRadius;
      this.pInvSpacing = 1.0 / (2.2 * particleRadius);
      this.pNumX = Math.floor(width * this.pInvSpacing) + 1;
      this.pNumY = Math.floor(height * this.pInvSpacing) + 1;
      this.pNumCells = this.pNumX * this.pNumY;

      this.numCellParticles = new Int32Array(this.pNumCells);
      this.firstCellParticle = new Int32Array(this.pNumCells + 1);
      this.cellParticleIds = new Int32Array(maxParticles);
      this.numParticles = 0;
    }

    integrateParticles(dt, gravityX, gravityY) {
      for (let i = 0; i < this.numParticles; i++) {
        this.particleVel[2 * i] += dt * gravityX;
        this.particleVel[2 * i + 1] += dt * gravityY;
        this.particlePos[2 * i] += this.particleVel[2 * i] * dt;
        this.particlePos[2 * i + 1] += this.particleVel[2 * i + 1] * dt;
      }
    }

    pushParticlesApart(numIters) {
      const colorDiffusionCoeff = 0.001;
      const minDist = 2.0 * this.particleRadius;
      const minDist2 = minDist * minDist;

      this.numCellParticles.fill(0);

      for (let i = 0; i < this.numParticles; i++) {
        const x = this.particlePos[2 * i];
        const y = this.particlePos[2 * i + 1];

        const xi = clamp(Math.floor(x * this.pInvSpacing), 0, this.pNumX - 1);
        const yi = clamp(Math.floor(y * this.pInvSpacing), 0, this.pNumY - 1);
        const cellNr = xi * this.pNumY + yi;
        this.numCellParticles[cellNr]++;
      }

      let first = 0;
      for (let i = 0; i < this.pNumCells; i++) {
        first += this.numCellParticles[i];
        this.firstCellParticle[i] = first;
      }
      this.firstCellParticle[this.pNumCells] = first;

      for (let i = 0; i < this.numParticles; i++) {
        const x = this.particlePos[2 * i];
        const y = this.particlePos[2 * i + 1];

        const xi = clamp(Math.floor(x * this.pInvSpacing), 0, this.pNumX - 1);
        const yi = clamp(Math.floor(y * this.pInvSpacing), 0, this.pNumY - 1);
        const cellNr = xi * this.pNumY + yi;
        this.firstCellParticle[cellNr]--;
        this.cellParticleIds[this.firstCellParticle[cellNr]] = i;
      }

      for (let iter = 0; iter < numIters; iter++) {
        for (let i = 0; i < this.numParticles; i++) {
          const px = this.particlePos[2 * i];
          const py = this.particlePos[2 * i + 1];

          const pxi = Math.floor(px * this.pInvSpacing);
          const pyi = Math.floor(py * this.pInvSpacing);
          const x0 = Math.max(pxi - 1, 0);
          const y0 = Math.max(pyi - 1, 0);
          const x1 = Math.min(pxi + 1, this.pNumX - 1);
          const y1 = Math.min(pyi + 1, this.pNumY - 1);

          for (let xi = x0; xi <= x1; xi++) {
            for (let yi = y0; yi <= y1; yi++) {
              const cellNr = xi * this.pNumY + yi;
              const first = this.firstCellParticle[cellNr];
              const last = this.firstCellParticle[cellNr + 1];

              for (let j = first; j < last; j++) {
                const id = this.cellParticleIds[j];
                if (id === i) continue;

                const qx = this.particlePos[2 * id];
                const qy = this.particlePos[2 * id + 1];

                let dx = qx - px;
                let dy = qy - py;
                const d2 = dx * dx + dy * dy;
                if (d2 > minDist2 || d2 === 0.0) continue;

                const d = Math.sqrt(d2);
                const s = (0.5 * (minDist - d)) / d;
                dx *= s;
                dy *= s;

                this.particlePos[2 * i] -= dx;
                this.particlePos[2 * i + 1] -= dy;
                this.particlePos[2 * id] += dx;
                this.particlePos[2 * id + 1] += dy;

                for (let k = 0; k < 3; k++) {
                  const color0 = this.particleColor[3 * i + k];
                  const color1 = this.particleColor[3 * id + k];
                  const color = (color0 + color1) * 0.5;
                  this.particleColor[3 * i + k] =
                    color0 + (color - color0) * colorDiffusionCoeff;
                  this.particleColor[3 * id + k] =
                    color1 + (color - color1) * colorDiffusionCoeff;
                }
              }
            }
          }
        }
      }
    }

    handleParticleCollisions() {
      const h = 1.0 / this.fInvSpacing;
      const r = this.particleRadius;

      const minX = h + r;
      const maxX = (this.fNumX - 1) * h - r;
      const minY = h + r;
      const maxY = (this.fNumY - 1) * h - r;

      for (let i = 0; i < this.numParticles; i++) {
        let x = this.particlePos[2 * i];
        let y = this.particlePos[2 * i + 1];

        if (x < minX) {
          x = minX;
          this.particleVel[2 * i] = 0.0;
        }
        if (x > maxX) {
          x = maxX;
          this.particleVel[2 * i] = 0.0;
        }
        if (y < minY) {
          y = minY;
          this.particleVel[2 * i + 1] = 0.0;
        }
        if (y > maxY) {
          y = maxY;
          this.particleVel[2 * i + 1] = 0.0;
        }

        this.particlePos[2 * i] = x;
        this.particlePos[2 * i + 1] = y;
      }
    }

    updateParticleDensity() {
      const n = this.fNumY;
      const h = this.h;
      const h1 = this.fInvSpacing;
      const h2 = 0.5 * h;
      const d = this.particleDensity;
      d.fill(0.0);

      for (let i = 0; i < this.numParticles; i++) {
        let x = this.particlePos[2 * i];
        let y = this.particlePos[2 * i + 1];

        x = clamp(x, h, (this.fNumX - 1) * h);
        y = clamp(y, h, (this.fNumY - 1) * h);

        const x0 = Math.floor((x - h2) * h1);
        const tx = (x - h2 - x0 * h) * h1;
        const x1 = Math.min(x0 + 1, this.fNumX - 2);

        const y0 = Math.floor((y - h2) * h1);
        const ty = (y - h2 - y0 * h) * h1;
        const y1 = Math.min(y0 + 1, this.fNumY - 2);

        const sx = 1.0 - tx;
        const sy = 1.0 - ty;

        if (x0 < this.fNumX && y0 < this.fNumY) d[x0 * n + y0] += sx * sy;
        if (x1 < this.fNumX && y0 < this.fNumY) d[x1 * n + y0] += tx * sy;
        if (x1 < this.fNumX && y1 < this.fNumY) d[x1 * n + y1] += tx * ty;
        if (x0 < this.fNumX && y1 < this.fNumY) d[x0 * n + y1] += sx * ty;
      }

      if (this.particleRestDensity === 0.0) {
        let sum = 0.0;
        let numFluidCells = 0;

        for (let i = 0; i < this.fNumCells; i++) {
          if (this.cellType[i] === FLUID_CELL) {
            sum += d[i];
            numFluidCells++;
          }
        }

        if (numFluidCells > 0) this.particleRestDensity = sum / numFluidCells;
      }
    }

    transferVelocities(toGrid, flipRatio) {
      const n = this.fNumY;
      const h = this.h;
      const h1 = this.fInvSpacing;
      const h2 = 0.5 * h;

      if (toGrid) {
        this.prevU.set(this.u);
        this.prevV.set(this.v);
        this.du.fill(0.0);
        this.dv.fill(0.0);
        this.u.fill(0.0);
        this.v.fill(0.0);

        for (let i = 0; i < this.fNumCells; i++) {
          this.cellType[i] = this.s[i] === 0.0 ? SOLID_CELL : AIR_CELL;
        }

        for (let i = 0; i < this.numParticles; i++) {
          const x = this.particlePos[2 * i];
          const y = this.particlePos[2 * i + 1];
          const xi = clamp(Math.floor(x * h1), 0, this.fNumX - 1);
          const yi = clamp(Math.floor(y * h1), 0, this.fNumY - 1);
          const cellNr = xi * n + yi;
          if (this.cellType[cellNr] === AIR_CELL) {
            this.cellType[cellNr] = FLUID_CELL;
          }
        }
      }

      for (let component = 0; component < 2; component++) {
        const dx = component === 0 ? 0.0 : h2;
        const dy = component === 0 ? h2 : 0.0;
        const f = component === 0 ? this.u : this.v;
        const prevF = component === 0 ? this.prevU : this.prevV;
        const d = component === 0 ? this.du : this.dv;

        for (let i = 0; i < this.numParticles; i++) {
          let x = this.particlePos[2 * i];
          let y = this.particlePos[2 * i + 1];

          x = clamp(x, h, (this.fNumX - 1) * h);
          y = clamp(y, h, (this.fNumY - 1) * h);

          const x0 = Math.min(Math.floor((x - dx) * h1), this.fNumX - 2);
          const tx = (x - dx - x0 * h) * h1;
          const x1 = Math.min(x0 + 1, this.fNumX - 2);

          const y0 = Math.min(Math.floor((y - dy) * h1), this.fNumY - 2);
          const ty = (y - dy - y0 * h) * h1;
          const y1 = Math.min(y0 + 1, this.fNumY - 2);

          const sx = 1.0 - tx;
          const sy = 1.0 - ty;

          const d0 = sx * sy;
          const d1 = tx * sy;
          const d2 = tx * ty;
          const d3 = sx * ty;

          const nr0 = x0 * n + y0;
          const nr1 = x1 * n + y0;
          const nr2 = x1 * n + y1;
          const nr3 = x0 * n + y1;

          if (toGrid) {
            const pv = this.particleVel[2 * i + component];
            f[nr0] += pv * d0;
            d[nr0] += d0;
            f[nr1] += pv * d1;
            d[nr1] += d1;
            f[nr2] += pv * d2;
            d[nr2] += d2;
            f[nr3] += pv * d3;
            d[nr3] += d3;
          } else {
            const offset = component === 0 ? n : 1;
            const valid0 =
              this.cellType[nr0] !== AIR_CELL ||
              this.cellType[nr0 - offset] !== AIR_CELL
                ? 1.0
                : 0.0;
            const valid1 =
              this.cellType[nr1] !== AIR_CELL ||
              this.cellType[nr1 - offset] !== AIR_CELL
                ? 1.0
                : 0.0;
            const valid2 =
              this.cellType[nr2] !== AIR_CELL ||
              this.cellType[nr2 - offset] !== AIR_CELL
                ? 1.0
                : 0.0;
            const valid3 =
              this.cellType[nr3] !== AIR_CELL ||
              this.cellType[nr3 - offset] !== AIR_CELL
                ? 1.0
                : 0.0;

            const v = this.particleVel[2 * i + component];
            const denom = valid0 * d0 + valid1 * d1 + valid2 * d2 + valid3 * d3;

            if (denom > 0.0) {
              const picV =
                (valid0 * d0 * f[nr0] +
                  valid1 * d1 * f[nr1] +
                  valid2 * d2 * f[nr2] +
                  valid3 * d3 * f[nr3]) /
                denom;
              const corr =
                (valid0 * d0 * (f[nr0] - prevF[nr0]) +
                  valid1 * d1 * (f[nr1] - prevF[nr1]) +
                  valid2 * d2 * (f[nr2] - prevF[nr2]) +
                  valid3 * d3 * (f[nr3] - prevF[nr3])) /
                denom;
              const flipV = v + corr;
              this.particleVel[2 * i + component] =
                (1.0 - flipRatio) * picV + flipRatio * flipV;
            }
          }
        }

        if (toGrid) {
          for (let i = 0; i < f.length; i++) {
            if (d[i] > 0.0) f[i] /= d[i];
          }

          for (let i = 0; i < this.fNumX; i++) {
            for (let j = 0; j < this.fNumY; j++) {
              const solid = this.cellType[i * n + j] === SOLID_CELL;
              if (
                solid ||
                (i > 0 && this.cellType[(i - 1) * n + j] === SOLID_CELL)
              ) {
                this.u[i * n + j] = this.prevU[i * n + j];
              }
              if (
                solid ||
                (j > 0 && this.cellType[i * n + j - 1] === SOLID_CELL)
              ) {
                this.v[i * n + j] = this.prevV[i * n + j];
              }
            }
          }
        }
      }
    }

    solveIncompressibility(
      numIters,
      dt,
      overRelaxation,
      compensateDrift = true
    ) {
      this.p.fill(0.0);
      this.prevU.set(this.u);
      this.prevV.set(this.v);

      const n = this.fNumY;
      const cp = (this.density * this.h) / dt;

      for (let iter = 0; iter < numIters; iter++) {
        for (let i = 1; i < this.fNumX - 1; i++) {
          for (let j = 1; j < this.fNumY - 1; j++) {
            if (this.cellType[i * n + j] !== FLUID_CELL) continue;

            const center = i * n + j;
            const left = (i - 1) * n + j;
            const right = (i + 1) * n + j;
            const bottom = i * n + j - 1;
            const top = i * n + j + 1;

            const s = this.s[center];
            const sx0 = this.s[left];
            const sx1 = this.s[right];
            const sy0 = this.s[bottom];
            const sy1 = this.s[top];
            const sumS = sx0 + sx1 + sy0 + sy1;
            if (sumS === 0.0) continue;

            let div =
              this.u[right] - this.u[center] + this.v[top] - this.v[center];

            if (this.particleRestDensity > 0.0 && compensateDrift) {
              const k = 1.0;
              const compression =
                this.particleDensity[center] - this.particleRestDensity;
              if (compression > 0.0) div = div - k * compression;
            }

            const p = (-div / sumS) * overRelaxation;
            this.p[center] += cp * p;

            this.u[center] -= sx0 * p;
            this.u[right] += sx1 * p;
            this.v[center] -= sy0 * p;
            this.v[top] += sy1 * p;
          }
        }
      }
    }

    updateParticleColors() {
      // Keep particles white for simplicity
    }

    setSciColor(cellNr, val, minVal, maxVal) {
      val = Math.min(Math.max(val, minVal), maxVal - 0.0001);
      const d = maxVal - minVal;
      val = d === 0.0 ? 0.5 : (val - minVal) / d;
      const m = 0.25;
      const num = Math.floor(val / m);
      const s = (val - num * m) / m;
      let r, g, b;

      switch (num) {
        case 0:
          r = 0.0;
          g = s;
          b = 1.0;
          break;
        case 1:
          r = 0.0;
          g = 1.0;
          b = 1.0 - s;
          break;
        case 2:
          r = s;
          g = 1.0;
          b = 0.0;
          break;
        case 3:
          r = 1.0;
          g = 1.0 - s;
          b = 0.0;
          break;
      }

      this.cellColor[3 * cellNr] = r;
      this.cellColor[3 * cellNr + 1] = g;
      this.cellColor[3 * cellNr + 2] = b;
    }

    updateCellColors() {
      this.cellColor.fill(0.0);

      for (let i = 0; i < this.fNumCells; i++) {
        if (this.cellType[i] === SOLID_CELL) {
          this.cellColor[3 * i] = 0.5;
          this.cellColor[3 * i + 1] = 0.5;
          this.cellColor[3 * i + 2] = 0.5;
        } else if (this.cellType[i] === FLUID_CELL) {
          let d = this.particleDensity[i];
          if (this.particleRestDensity > 0.0) d /= this.particleRestDensity;
          this.setSciColor(i, d, 0.0, 2.0);
        }
      }
    }

    simulate(
      dt,
      gravityX,
      gravityY,
      flipRatio,
      numPressureIters,
      numParticleIters,
      overRelaxation,
      compensateDrift,
      separateParticles
    ) {
      const numSubSteps = 1;
      const sdt = dt / numSubSteps;

      for (let step = 0; step < numSubSteps; step++) {
        this.integrateParticles(sdt, gravityX, gravityY);
        if (separateParticles) this.pushParticlesApart(numParticleIters);
        this.handleParticleCollisions();
        this.transferVelocities(true);
        this.updateParticleDensity();
        this.solveIncompressibility(
          numPressureIters,
          sdt,
          overRelaxation,
          compensateDrift
        );
        this.transferVelocities(false, flipRatio);
      }

      this.updateParticleColors();
      this.updateCellColors();
    }
  }

  // ===== SCENE SETUP =====
  let scene = {
    gravity: -9.81,
    gravityX: 0.0,
    gravityY: -9.81,
    dt: 1.0 / 60.0,
    flipRatio: 0.45,
    numPressureIters: 50,
    numParticleIters: 2,
    frameNr: 0,
    overRelaxation: 1.9,
    compensateDrift: true,
    separateParticles: true,
    paused: false,
    showParticles: true,
    showGrid: false,
    fluid: null,
  };

  function setupScene() {
    if (!cleanup.initialized) return;

    const res = 100;
    const tankHeight = 1.0 * simHeight;
    const tankWidth = 1.0 * simWidth;
    const h = (tankHeight / res) * 5.0;
    const density = 1000.0;
    const relWaterHeight = 0.75;
    const relWaterWidth = 0.8;

    const r = 0.35 * h;
    const dx = 2.0 * r;
    const dy = (Math.sqrt(3.0) / 2.0) * dx;

    const numX = Math.floor(
      (relWaterWidth * tankWidth - 2.0 * h - 2.0 * r) / dx
    );
    const numY = Math.floor(
      (relWaterHeight * tankHeight - 2.0 * h - 2.0 * r) / dy
    );
    const maxParticles = numX * numY;

    const f = (scene.fluid = new FlipFluid(
      density,
      tankWidth,
      tankHeight,
      h,
      r,
      maxParticles
    ));

    f.numParticles = numX * numY;
    let p = 0;
    for (let i = 0; i < numX; i++) {
      for (let j = 0; j < numY; j++) {
        f.particlePos[p++] = h + r + dx * i + (j % 2 === 0 ? 0.0 : r);
        f.particlePos[p++] = h + r + dy * j;
      }
    }

    const n = f.fNumY;
    for (let i = 0; i < f.fNumX; i++) {
      for (let j = 0; j < f.fNumY; j++) {
        f.s[i * n + j] = i === 0 || i === f.fNumX - 1 || j === 0 ? 0.0 : 1.0;
      }
    }
  }

  // ===== ENHANCED DEVICE ORIENTATION FUNCTIONS =====
  function createPermissionButton() {
    // Create a button for requesting permission if it doesn't exist
    const buttonWrapper = document.getElementById(
      "orientation-permission-btn-wrapper"
    );
    let button = document.getElementById("orientation-permission-btn");

    if (isIOS) {
      buttonWrapper.style.display = "flex";
    }

    // if (!button) {
    //   button = document.createElement("button");
    //   button.id = "orientation-permission-btn";
    //   button.innerHTML = "Enable Gyro Control";
    //   button.style.cssText = `
    //     position: fixed;
    //     top: 50%;
    //     left: 50%;
    //     transform: translate(-50%, -50%);
    //     z-index: 10000;
    //     padding: 15px 30px;
    //     font-size: 18px;
    //     background: #E4E4E7;
    //     color: #1A1A1E;
    //     border: none;
    //     border-radius: 10px;
    //     cursor: pointer;
    //     box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    //   `;
    //   document
    //     .querySelector("#fluid-sim-wrapper")
    //     .insertAdjacentElement("afterbegin", button);
    // }
    button.onclick = () => {
      requestOrientationPermission();
    };
    return button;
  }

  function removePermissionButton() {
    const buttonWrapper = document.getElementById(
      "orientation-permission-btn-wrapper"
    );
    const button = document.getElementById("orientation-permission-btn");
    if (buttonWrapper) {
      buttonWrapper.remove();
    }
  }

  async function requestOrientationPermission() {
    if (!cleanup.initialized) return;

    console.log("Requesting orientation permission...");

    try {
      // For iOS 13+ devices that require permission
      if (
        isIOS &&
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        console.log("iOS device detected, requesting permission...");

        const response = await DeviceOrientationEvent.requestPermission();
        console.log("Permission response:", response);

        if (response === "granted") {
          permissionGranted = true;
          removePermissionButton();
          setupOrientationListener();
          console.log("✅ iOS orientation permission granted");
        } else {
          console.warn("❌ iOS orientation permission denied");
          showFallbackMessage();
        }
      }
      // For Android and older iOS devices
      else if (
        typeof window !== "undefined" &&
        "DeviceOrientationEvent" in window
      ) {
        console.log("Non-iOS device or older iOS, setting up directly...");
        permissionGranted = true;
        removePermissionButton();
        setupOrientationListener();
        console.log("✅ Orientation listener set up for non-iOS device");
      }
      // Device doesn't support orientation at all
      else {
        console.log("❌ Device orientation not supported");
        showFallbackMessage();
      }
    } catch (error) {
      console.error("❌ Error requesting orientation permission:", error);
      showFallbackMessage();
    }
  }

  function showFallbackMessage() {
    removePermissionButton();
    const message = document.createElement("div");
    message.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10000;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 8px;
      color: #333;
      font-size: 14px;
    `;
    message.innerHTML = "Gyroscope not available. Using default gravity.";
    document.body.appendChild(message);

    // Auto remove after 3 seconds
    setTimeoutWithCleanup(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 3000);
  }

  function setupOrientationListener() {
    if (!cleanup.initialized) return;

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // Add the event listener
      addEventListenerWithCleanup(
        window,
        "deviceorientation",
        handleOrientation,
        { passive: true }
      );
      orientationSupported = true;
      orientationInitialized = true;

      console.log("✅ Device orientation listener successfully added");

      // Test the orientation after a short delay
      setTimeoutWithCleanup(() => {
        testOrientation();
      }, 1000);
    } else {
      console.log("❌ DeviceOrientationEvent not available");
    }
  }

  function testOrientation() {
    console.log("Testing orientation values...");
    console.log("Current gravity:", { x: scene.gravityX, y: scene.gravityY });
    console.log("Permission granted:", permissionGranted);
    console.log("Orientation supported:", orientationSupported);
  }

  function handleOrientation(event) {
    if (!permissionGranted || !cleanup.initialized) {
      console.log(
        "Orientation event received but permission not granted or cleanup in progress"
      );
      return;
    }

    // Get raw orientation values
    const alpha = event.alpha || 0; // Z axis (compass heading)
    const beta = event.beta || 0; // X axis (front-to-back tilt) -180 to 180
    const gamma = event.gamma || 0; // Y axis (left-to-right tilt) -90 to 90

    // console.log("Raw orientation:", {
    //   alpha: alpha.toFixed(1),
    //   beta: beta.toFixed(1),
    //   gamma: gamma.toFixed(1),
    // });

    // Enhanced tilt sensitivity and mapping
    const maxTilt = 30; // Reduced for more sensitivity
    const minGravity = 2.0; // Minimum downward gravity
    const maxGravity = 15.0; // Maximum gravity force

    // Normalize tilt values with better sensitivity curve
    let normalizedBeta = Math.max(-1, Math.min(1, beta / maxTilt));
    let normalizedGamma = Math.max(-1, Math.min(1, gamma / maxTilt));

    // Apply sensitivity curve (square the normalized values while preserving sign)
    normalizedBeta =
      Math.sign(normalizedBeta) * Math.pow(Math.abs(normalizedBeta), 0.7);
    normalizedGamma =
      Math.sign(normalizedGamma) * Math.pow(Math.abs(normalizedGamma), 0.7);

    // Calculate gravity components
    scene.gravityX = normalizedGamma * maxGravity;
    scene.gravityY = -normalizedBeta * maxGravity;

    // Ensure there's always some downward gravity
    scene.gravityY = Math.min(scene.gravityY, -minGravity);

    // Smooth the gravity changes to prevent jittery motion
    const smoothing = 0.1;
    scene.gravityX = lastGamma + (scene.gravityX - lastGamma) * smoothing;
    scene.gravityY = lastBeta + (scene.gravityY - lastBeta) * smoothing;

    // Update last values for smoothing
    lastBeta = scene.gravityY;
    lastGamma = scene.gravityX;
    lastAlpha = alpha;

    // Debug logging (remove in production)
    if (scene.frameNr % 60 === 0) {
      // Log every 60 frames (once per second at 60fps)
      console.log("Applied gravity:", {
        x: scene.gravityX.toFixed(2),
        y: scene.gravityY.toFixed(2),
        beta: beta.toFixed(1),
        gamma: gamma.toFixed(1),
      });
    }
  }

  function checkPermissionNeeded() {
    if (!cleanup.initialized) return;

    // Detect iOS
    isIOS = detectIOS();
    console.log("Device detection:", { isIOS });

    if (
      isIOS &&
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      // iOS 13+ requires user interaction to request permission
      console.log("iOS 13+ detected, showing permission button");
      createPermissionButton();
    } else if (
      typeof window !== "undefined" &&
      "DeviceOrientationEvent" in window
    ) {
      // Android or older iOS - set up directly
      console.log(
        "Non-iOS device or older iOS detected, setting up orientation directly"
      );
      permissionGranted = true;
      setupOrientationListener();
    } else {
      console.log("Device orientation not supported on this device");
      showFallbackMessage();
    }
  }

  // ===== SHADER DEFINITIONS =====
  const pointVertexShader = `
    attribute vec2 attrPosition;
    attribute vec3 attrColor;
    uniform vec2 domainSize;
    uniform float pointSize;
    uniform float drawDisk;
    varying vec3 fragColor;
    varying float fragDrawDisk;
    void main() {
      vec4 screenTransform = vec4(2.0 / domainSize.x, 2.0 / domainSize.y, -1.0, -1.0);
      gl_Position = vec4(attrPosition * screenTransform.xy + screenTransform.zw, 0.0, 1.0);
      gl_PointSize = pointSize;
      fragColor = attrColor;
      fragDrawDisk = drawDisk;
    }`;

  const pointFragmentShader = `
    precision mediump float;
    varying vec3 fragColor;
    varying float fragDrawDisk;
    void main() {
      if (fragDrawDisk == 1.0) {
        float rx = 0.5 - gl_PointCoord.x;
        float ry = 0.5 - gl_PointCoord.y;
        float r2 = rx * rx + ry * ry;
        if (r2 > 0.25) discard;
      }
      gl_FragColor = vec4(fragColor, 1.0);
    }`;

  const texturedParticleVertexShader = `
    attribute vec2 attrPosition;
    attribute vec3 attrColor;
    uniform vec2 domainSize;
    uniform float pointSize;

    varying vec3 fragColor;

    void main() {
      vec4 screenTransform = vec4(2.0 / domainSize.x, 2.0 / domainSize.y, -1.0, -1.0);
      gl_Position = vec4(attrPosition * screenTransform.xy + screenTransform.zw, 0.0, 1.0);
      gl_PointSize = pointSize;
      fragColor = attrColor;
    }`;

  const texturedParticleFragmentShader = `
    precision mediump float;
    varying vec3 fragColor;
    uniform sampler2D texture;
    uniform float logoIntensity;

    void main() {
      vec4 texColor = texture2D(texture, gl_PointCoord);
      if (texColor.a < 0.1) discard;
      vec3 finalColor = mix(fragColor, texColor.rgb, logoIntensity);
      gl_FragColor = vec4(finalColor, 1.0);
    }`;

  const createShader = (gl, vsSource, fsSource) => {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const vsShader = trackWebGLResource(gl.createShader(gl.VERTEX_SHADER));
    gl.shaderSource(vsShader, vsSource);
    gl.compileShader(vsShader);
    if (!gl.getShaderParameter(vsShader, gl.COMPILE_STATUS)) {
      console.log(
        "vertex shader compile error: " + gl.getShaderInfoLog(vsShader)
      );
    }

    const fsShader = trackWebGLResource(gl.createShader(gl.FRAGMENT_SHADER));
    gl.shaderSource(fsShader, fsSource);
    gl.compileShader(fsShader);
    if (!gl.getShaderParameter(fsShader, gl.COMPILE_STATUS)) {
      console.log(
        "fragment shader compile error: " + gl.getShaderInfoLog(fsShader)
      );
    }

    const shader = trackWebGLResource(gl.createProgram());
    gl.attachShader(shader, vsShader);
    gl.attachShader(shader, fsShader);
    gl.linkProgram(shader);

    return shader;
  };

  // ===== DRAWING FUNCTIONS =====
  function draw() {
    if (!cleanup.initialized) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (pointShader === null) {
      pointShader = createShader(gl, pointVertexShader, pointFragmentShader);
    }
    if (texturedShader === null) {
      texturedShader = createShader(
        gl,
        texturedParticleVertexShader,
        texturedParticleFragmentShader
      );
    }

    if (!logoTexture) {
      logoTexture = loadTexture(gl, "/images/rare-logo-fluid.png");
    }

    if (scene.showParticles) {
      const pointSize =
        ((2.0 * scene.fluid.particleRadius) / simWidth) * canvas.width * 0.75;

      gl.useProgram(texturedShader);

      gl.uniform2f(
        gl.getUniformLocation(texturedShader, "domainSize"),
        simWidth,
        simHeight
      );
      gl.uniform1f(
        gl.getUniformLocation(texturedShader, "pointSize"),
        pointSize
      );
      gl.uniform1f(gl.getUniformLocation(texturedShader, "logoIntensity"), 0.8);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, logoTexture);
      gl.uniform1i(gl.getUniformLocation(texturedShader, "texture"), 0);

      if (pointVertexBuffer === null)
        pointVertexBuffer = trackWebGLResource(gl.createBuffer());
      if (pointColorBuffer === null)
        pointColorBuffer = trackWebGLResource(gl.createBuffer());

      gl.bindBuffer(gl.ARRAY_BUFFER, pointVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, scene.fluid.particlePos, gl.DYNAMIC_DRAW);

      const posLoc = gl.getAttribLocation(texturedShader, "attrPosition");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, pointColorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        scene.fluid.particleColor,
        gl.DYNAMIC_DRAW
      );

      const colorLoc = gl.getAttribLocation(texturedShader, "attrColor");
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, scene.fluid.numParticles);

      gl.disableVertexAttribArray(posLoc);
      gl.disableVertexAttribArray(colorLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }

  // ===== SIMULATION AND ANIMATION =====
  const simulate = () => {
    if (!scene.paused && cleanup.initialized) {
      scene.fluid.simulate(
        scene.dt,
        scene.gravityX,
        scene.gravityY,
        scene.flipRatio,
        scene.numPressureIters,
        scene.numParticleIters,
        scene.overRelaxation,
        scene.compensateDrift,
        scene.separateParticles
      );
    }
    scene.frameNr++;
  };

  const update = () => {
    if (!cleanup.initialized || !animationRunning) return;

    simulate();
    draw();
    cleanup.animationFrame = requestAnimationFrame(update);
  };

  // ===== RESIZE HANDLING =====
  const handleResize = () => {
    if (!cleanup.initialized) return;

    canvas.width = wrapper.clientWidth + wrapper.clientWidth * 0.195;
    canvas.height = wrapper.clientHeight + wrapper.clientHeight * 0.1;
    cScale = canvas.height / simHeight;
    simWidth = canvas.width / cScale;

    // Reset WebGL buffers
    pointVertexBuffer = null;
    pointColorBuffer = null;
    gridVertBuffer = null;
    gridColorBuffer = null;

    setupScene();
  };

  addEventListenerWithCleanup(window, "resize", handleResize);

  // ===== INITIALIZATION =====
  const initialize = () => {
    try {
      cleanup.initialized = true;
      animationRunning = true;

      setupScene();

      // Small delay before checking permission to ensure DOM is ready
      setTimeoutWithCleanup(() => {
        checkPermissionNeeded();
      }, 100);

      update();

      console.log("✅ Gyro fluid simulation initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize gyro fluid simulation:", error);
      cleanup.initialized = false;
      animationRunning = false;
    }
  };

  // Start initialization
  initialize();

  // ===== CLEANUP FUNCTION =====
  return () => {
    console.log("Cleaning up gyro fluid simulation...");

    cleanup.initialized = false;
    animationRunning = false;

    // Remove permission button if it exists
    removePermissionButton();

    if (cleanup.animationFrame) {
      cancelAnimationFrame(cleanup.animationFrame);
      cleanup.animationFrame = null;
    }

    cleanup.timeouts.forEach(clearTimeout);
    cleanup.timeouts.length = 0;

    cleanup.intervals.forEach(clearInterval);
    cleanup.intervals.length = 0;

    cleanup.eventListeners.forEach(({ element, event, handler, options }) => {
      try {
        element.removeEventListener(event, handler, options);
      } catch (error) {
        console.warn("Error removing event listener:", error);
      }
    });
    cleanup.eventListeners.length = 0;

    if (gl) {
      try {
        cleanup.webglResources.forEach((resource) => {
          if (resource) {
            if (
              resource.constructor.name.includes("Buffer") ||
              resource instanceof WebGLBuffer
            ) {
              gl.deleteBuffer(resource);
            } else if (
              resource.constructor.name.includes("Texture") ||
              resource instanceof WebGLTexture
            ) {
              gl.deleteTexture(resource);
            } else if (
              resource.constructor.name.includes("Shader") ||
              resource instanceof WebGLShader
            ) {
              gl.deleteShader(resource);
            } else if (
              resource.constructor.name.includes("Program") ||
              resource instanceof WebGLProgram
            ) {
              gl.deleteProgram(resource);
            }
          }
        });
        cleanup.webglResources.length = 0;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      } catch (error) {
        console.warn("Error cleaning up WebGL resources:", error);
      }
    }

    // Reset variables
    scene = null;
    pointShader = null;
    texturedShader = null;
    pointVertexBuffer = null;
    pointColorBuffer = null;
    gridVertBuffer = null;
    gridColorBuffer = null;
    logoTexture = null;

    // Reset orientation variables
    orientationSupported = false;
    permissionGranted = false;
    orientationInitialized = false;
    isIOS = false;

    console.log("✅ Gyro fluid simulation cleanup completed");
  };
}
