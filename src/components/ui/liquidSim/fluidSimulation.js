export default function fluidSimulation(wrapper, canvas) {
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

  // ===== SIMULATION VARIABLES =====
  let simHeight, simWidth, cScale;
  let cnt = 0;

  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

  // Constants
  const U_FIELD = 0;
  const V_FIELD = 1;
  const FLUID_CELL = 0;
  const AIR_CELL = 1;
  const SOLID_CELL = 2;

  // WebGL resources
  let logoTexture = null;
  let pointShader = null;
  let meshShader = null;
  let pointVertexBuffer = null;
  let pointColorBuffer = null;
  let gridVertBuffer = null;
  let gridColorBuffer = null;
  let diskVertBuffer = null;
  let diskIdBuffer = null;
  let diamondVertBuffer = null;
  let diamondIdBuffer = null;
  let diamondTexture = null;
  let diamondTexCoordsBuffer = null;
  let texturedDiamondShader = null;

  // Animation control
  let animationRunning = false;

  // ===== RESPONSIVE CANVAS SIZING =====
  function updateCanvasSize() {
    const rect = wrapper.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    const widthBuffer = displayWidth * 0.2;
    const heightBuffer = displayHeight * 0.27;

    canvas.width = displayWidth + widthBuffer;
    canvas.height = displayHeight + heightBuffer;
    canvas.style.width = displayWidth + widthBuffer + "px";
    canvas.style.height = displayHeight + heightBuffer + "px";

    const canvasDisplayWidth = canvas.width;
    const canvasDisplayHeight = canvas.height;

    simHeight = 3;
    simWidth = simHeight * (canvasDisplayWidth / canvasDisplayHeight);
    cScale = canvas.height / simHeight;

    return {
      width: displayWidth,
      height: displayHeight,
      aspectRatio: displayWidth / displayHeight,
      bufferWidth: widthBuffer,
      bufferHeight: heightBuffer,
    };
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

  // ===== FLIPFLUID CLASS =====
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

    integrateParticles(dt, gravity) {
      const diamond = scene.fixedObstacle;

      for (let i = 0; i < this.numParticles; i++) {
        const oldX = this.particlePos[2 * i];
        const oldY = this.particlePos[2 * i + 1];

        this.particleVel[2 * i + 1] += dt * gravity;
        let newX = oldX + this.particleVel[2 * i] * dt;
        let newY = oldY + this.particleVel[2 * i + 1] * dt;

        if (diamond && diamond.show) {
          const result = preventDiamondTunneling(
            oldX,
            oldY,
            newX,
            newY,
            diamond
          );
          newX = result.x;
          newY = result.y;

          if (result.bounced) {
            this.particleVel[2 * i] *= -0.5;
            this.particleVel[2 * i + 1] *= -0.5;
          }
        }

        this.particlePos[2 * i] = newX;
        this.particlePos[2 * i + 1] = newY;
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

    handleParticleCollisions(obstacleX, obstacleY, obstacleRadius) {
      const h = 1.0 / this.fInvSpacing;
      const r = this.particleRadius;
      const minDistCircle = obstacleRadius + r;
      const minDistCircle2 = minDistCircle * minDistCircle;
      const diamond = scene.fixedObstacle;

      const minX = h + r;
      const maxX = (this.fNumX - 1) * h - r;
      const minY = h + r;
      const maxY = (this.fNumY - 1) * h - r;

      for (let i = 0; i < this.numParticles; i++) {
        let x = this.particlePos[2 * i];
        let y = this.particlePos[2 * i + 1];

        const dxCircle = x - obstacleX;
        const dyCircle = y - obstacleY;
        const d2Circle = dxCircle * dxCircle + dyCircle * dyCircle;

        if (d2Circle < minDistCircle2 && d2Circle > 0.0) {
          const d = Math.sqrt(d2Circle);
          x = obstacleX + dxCircle * (minDistCircle / d);
          y = obstacleY + dyCircle * (minDistCircle / d);

          const dot =
            dxCircle * this.particleVel[2 * i] +
            dyCircle * this.particleVel[2 * i + 1];
          const damping = 0.7;
          this.particleVel[2 * i] =
            (this.particleVel[2 * i] -
              ((1.0 + damping) * dot * dxCircle) / d2Circle) *
            damping;
          this.particleVel[2 * i + 1] =
            (this.particleVel[2 * i + 1] -
              ((1.0 + damping) * dot * dyCircle) / d2Circle) *
            damping;
        }

        if (diamond && diamond.show) {
          const insideDiamond = isPointInDiamond(x, y, diamond);
          const vertices = [
            {
              x: diamond.x - 0.35 * diamond.size,
              y: diamond.y + 0.38 + 0.3 * diamond.size,
            },
            { x: diamond.x, y: diamond.y + 0.38 + 0.3 * diamond.size },
            {
              x: diamond.x + 0.35 * diamond.size,
              y: diamond.y + 0.38 + 0.3 * diamond.size,
            },
            { x: diamond.x + 0.75 * diamond.size, y: diamond.y + 0.34 },
            {
              x: diamond.x + 0.34 * diamond.size,
              y: diamond.y + 0.31 - 0.35 * diamond.size,
            },
            { x: diamond.x, y: diamond.y + 0.37 - 0.7 * diamond.size },
            {
              x: diamond.x - 0.34 * diamond.size,
              y: diamond.y + 0.31 - 0.35 * diamond.size,
            },
            { x: diamond.x - 0.75 * diamond.size, y: diamond.y + 0.34 },
            {
              x: diamond.x - 0.35 * diamond.size,
              y: diamond.y + 0.38 + 0.3 * diamond.size,
            },
          ];

          if (insideDiamond) {
            const diamondCenter = { x: diamond.x, y: diamond.y + 0.25 };
            let minDist = Infinity;
            let closestPoint = { x: 0, y: 0 };

            for (let j = 0; j < vertices.length - 1; j++) {
              const v1 = vertices[j];
              const v2 = vertices[j + 1];
              const edgeX = v2.x - v1.x;
              const edgeY = v2.y - v1.y;
              const edgeLengthSquared = edgeX * edgeX + edgeY * edgeY;

              let t =
                ((x - v1.x) * edgeX + (y - v1.y) * edgeY) / edgeLengthSquared;
              t = Math.max(0, Math.min(1, t));

              const pointOnEdge = {
                x: v1.x + t * edgeX,
                y: v1.y + t * edgeY,
              };

              const dx = x - pointOnEdge.x;
              const dy = y - pointOnEdge.y;
              const distSquared = dx * dx + dy * dy;

              if (distSquared < minDist) {
                minDist = distSquared;
                closestPoint = pointOnEdge;
              }
            }

            const safety = this.particleRadius * 2.5;
            const dx = x - closestPoint.x;
            const dy = y - closestPoint.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 0.001) {
              const dxFromCenter = x - diamond.x;
              const dyFromCenter = y - (diamond.y + 0.25);
              const distFromCenter = Math.sqrt(
                dxFromCenter * dxFromCenter + dyFromCenter * dyFromCenter
              );

              if (distFromCenter > 0.001) {
                x = closestPoint.x + (dxFromCenter / distFromCenter) * safety;
                y = closestPoint.y + (dyFromCenter / distFromCenter) * safety;
              } else {
                const angle = Math.random() * 2 * Math.PI;
                x = diamond.x + Math.cos(angle) * diamond.size * 0.6;
                y = diamond.y + 0.25 + Math.sin(angle) * diamond.size * 0.6;
              }
            } else {
              x = closestPoint.x + (dx / dist) * safety;
              y = closestPoint.y + (dy / dist) * safety;
            }

            const normalX = (x - closestPoint.x) / safety;
            const normalY = (y - closestPoint.y) / safety;
            const dotProd =
              this.particleVel[2 * i] * normalX +
              this.particleVel[2 * i + 1] * normalY;

            if (dotProd < 0) {
              const damping = 0.5;
              this.particleVel[2 * i] =
                (this.particleVel[2 * i] - 1.5 * dotProd * normalX) * damping;
              this.particleVel[2 * i + 1] =
                (this.particleVel[2 * i + 1] - 1.5 * dotProd * normalY) *
                damping;
            } else {
              this.particleVel[2 * i] += normalX * 0.5;
              this.particleVel[2 * i + 1] += normalY * 0.5;
            }
          } else {
            let minDist = Infinity;
            let closestEdgeNormal = { x: 0, y: 0 };

            for (let j = 0; j < vertices.length - 1; j++) {
              const v1 = vertices[j];
              const v2 = vertices[j + 1];
              const edgeX = v2.x - v1.x;
              const edgeY = v2.y - v1.y;
              const edgeLengthSquared = edgeX * edgeX + edgeY * edgeY;

              let t =
                ((x - v1.x) * edgeX + (y - v1.y) * edgeY) / edgeLengthSquared;
              t = Math.max(0, Math.min(1, t));

              const closestX = v1.x + t * edgeX;
              const closestY = v1.y + t * edgeY;
              const dx = x - closestX;
              const dy = y - closestY;
              const distSquared = dx * dx + dy * dy;

              if (distSquared < minDist) {
                minDist = distSquared;
                const edgeLength = Math.sqrt(edgeLengthSquared);
                closestEdgeNormal.x = -edgeY / edgeLength;
                closestEdgeNormal.y = edgeX / edgeLength;

                const dotProduct =
                  dx * closestEdgeNormal.x + dy * closestEdgeNormal.y;
                if (dotProduct < 0) {
                  closestEdgeNormal.x = -closestEdgeNormal.x;
                  closestEdgeNormal.y = -closestEdgeNormal.y;
                }
              }
            }

            const minDistance = Math.sqrt(minDist);
            if (minDistance < this.particleRadius * 1.5) {
              const penetrationDepth = this.particleRadius * 1.5 - minDistance;
              x += closestEdgeNormal.x * penetrationDepth;
              y += closestEdgeNormal.y * penetrationDepth;

              const dot =
                this.particleVel[2 * i] * closestEdgeNormal.x +
                this.particleVel[2 * i + 1] * closestEdgeNormal.y;
              const damping = 0.6;

              this.particleVel[2 * i] =
                (this.particleVel[2 * i] -
                  (1.0 + damping) * dot * closestEdgeNormal.x) *
                damping;
              this.particleVel[2 * i + 1] =
                (this.particleVel[2 * i + 1] -
                  (1.0 + damping) * dot * closestEdgeNormal.y) *
                damping;
            }
          }
        }

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
      // Keep particles white/colored as desired
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
      gravity,
      flipRatio,
      numPressureIters,
      numParticleIters,
      overRelaxation,
      compensateDrift,
      separateParticles,
      obstacleX,
      obstacleY,
      obstacleRadius
    ) {
      const numSubSteps = 3;
      const sdt = dt / numSubSteps;

      for (let step = 0; step < numSubSteps; step++) {
        this.integrateParticles(sdt, gravity);
        if (separateParticles) this.pushParticlesApart(numParticleIters);
        this.handleParticleCollisions(obstacleX, obstacleY, obstacleRadius);
        this.transferVelocities(true);
        this.updateParticleDensity();
        this.solveIncompressibility(
          numPressureIters,
          sdt,
          overRelaxation,
          compensateDrift
        );
        this.transferVelocities(false, flipRatio);

        if (scene.fixedObstacle && scene.fixedObstacle.show) {
          cleanupTrappedParticles();
        }
      }

      this.updateParticleColors();
      this.updateCellColors();
    }
  }

  // ===== SCENE SETUP =====
  let scene = {
    gravity: -9.81,
    dt: 1.0 / 120.0,
    flipRatio: 0.8,
    numPressureIters: 100,
    numParticleIters: 2,
    frameNr: 0,
    overRelaxation: 1.9,
    compensateDrift: true,
    separateParticles: true,
    obstacleX: 0.0,
    obstacleY: 0.0,
    obstacleRadius: 0.35,
    paused: false,
    showObstacle: true,
    obstacleVelX: 0.0,
    obstacleVelY: 0.0,
    showParticles: true,
    showGrid: false,
    fluid: null,
    fixedObstacle: {
      x: 0,
      y: 0,
      size: 1.5,
      show: false,
      color: [1.0, 1.0, 1.0],
      textureIntensity: 1.0,
    },
  };

  // ===== HELPER FUNCTIONS =====
  function getResponsiveSettings() {
    const rect = wrapper.getBoundingClientRect();
    const aspectRatio = rect.width / rect.height;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    let settings = {
      particleMultiplier: 1.0,
      diamondSize: 0.9,
      waterHeight: 0.75,
      waterWidth: 0.8,
      resolution: 100,
    };

    if (isMobile) {
      settings.particleMultiplier = 0.5;
      settings.resolution = 50;
      settings.diamondSize = 0.6;
      settings.waterHeight = 0.65;
      settings.waterWidth = 0.85;
    } else if (isTablet) {
      settings.particleMultiplier = 0.7;
      settings.resolution = 70;
      settings.diamondSize = 0.75;
      settings.waterHeight = 0.7;
      settings.waterWidth = 0.82;
    }

    return settings;
  }

  function cleanupTrappedParticles() {
    const f = scene.fluid;
    const diamond = scene.fixedObstacle;

    if (!diamond || !diamond.show || !cleanup.initialized) return;

    let foundTrapped = false;
    for (let i = 0; i < f.numParticles; i++) {
      const x = f.particlePos[2 * i];
      const y = f.particlePos[2 * i + 1];

      if (isPointInDiamond(x, y, diamond)) {
        foundTrapped = true;
        const dx = x - diamond.x;
        const dy = y - (diamond.y + 0.33);
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 0.001) {
          const safeRadius = diamond.size * 1.5;
          f.particlePos[2 * i] = diamond.x + (dx / dist) * safeRadius;
          f.particlePos[2 * i + 1] =
            diamond.y + 0.33 + (dy / dist) * safeRadius;
        } else {
          const angle = Math.random() * 2 * Math.PI;
          f.particlePos[2 * i] =
            diamond.x + Math.cos(angle) * diamond.size * 1.5;
          f.particlePos[2 * i + 1] =
            diamond.y + 0.33 + Math.sin(angle) * diamond.size * 1.5;
        }

        f.particleVel[2 * i] = 0;
        f.particleVel[2 * i + 1] = 0;
      }
    }

    return foundTrapped;
  }

  function preventDiamondTunneling(oldX, oldY, newX, newY, diamond) {
    if (
      !isPointInDiamond(oldX, oldY, diamond) &&
      !isPointInDiamond(newX, newY, diamond)
    ) {
      const vertices = [
        {
          x: diamond.x - 0.35 * diamond.size,
          y: diamond.y + 0.38 + 0.3 * diamond.size,
        },
        { x: diamond.x, y: diamond.y + 0.38 + 0.3 * diamond.size },
        {
          x: diamond.x + 0.35 * diamond.size,
          y: diamond.y + 0.38 + 0.3 * diamond.size,
        },
        { x: diamond.x + 0.75 * diamond.size, y: diamond.y + 0.34 },
        {
          x: diamond.x + 0.34 * diamond.size,
          y: diamond.y + 0.31 - 0.35 * diamond.size,
        },
        { x: diamond.x, y: diamond.y + 0.39 - 0.7 * diamond.size },
        {
          x: diamond.x - 0.34 * diamond.size,
          y: diamond.y + 0.31 - 0.35 * diamond.size,
        },
        { x: diamond.x - 0.75 * diamond.size, y: diamond.y + 0.34 },
        {
          x: diamond.x - 0.35 * diamond.size,
          y: diamond.y + 0.38 + 0.3 * diamond.size,
        },
      ];

      let intersected = false;
      let closestIntersection = null;
      let closestDist = Infinity;

      for (let i = 0; i < vertices.length - 1; i++) {
        const v1 = vertices[i];
        const v2 = vertices[i + 1];

        const x1 = oldX,
          y1 = oldY,
          x2 = newX,
          y2 = newY;
        const x3 = v1.x,
          y3 = v1.y,
          x4 = v2.x,
          y4 = v2.y;

        const denominator = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        if (denominator === 0) continue;

        const ua =
          ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        const ub =
          ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
          const intersectionX = x1 + ua * (x2 - x1);
          const intersectionY = y1 + ua * (y2 - y1);

          const distToIntersection = Math.sqrt(
            (intersectionX - oldX) * (intersectionX - oldX) +
              (intersectionY - oldY) * (intersectionY - oldY)
          );

          if (distToIntersection < closestDist) {
            closestDist = distToIntersection;
            closestIntersection = {
              x: intersectionX,
              y: intersectionY,
              normalX: y4 - y3,
              normalY: -(x4 - x3),
            };
          }

          intersected = true;
        }
      }

      if (intersected && closestIntersection) {
        const normalLength = Math.sqrt(
          closestIntersection.normalX * closestIntersection.normalX +
            closestIntersection.normalY * closestIntersection.normalY
        );
        closestIntersection.normalX /= normalLength;
        closestIntersection.normalY /= normalLength;

        const safetyMargin = 0.01;
        return {
          x: closestIntersection.x + closestIntersection.normalX * safetyMargin,
          y: closestIntersection.y + closestIntersection.normalY * safetyMargin,
          bounced: true,
        };
      }
    }

    return { x: newX, y: newY, bounced: false };
  }

  function isPointInDiamond(x, y, diamond) {
    const dx = x - diamond.x;
    const dy = y - diamond.y - 0.25;

    const vertices = [
      [-0.18, 0.38],
      [0.0, 0.38],
      [0.18, 0.38],
      [0.38, 0.01],
      [0.18, -0.35],
      [0.0, -0.7],
      [-0.18, -0.35],
      [-0.38, 0.01],
      [-0.18, 0.38],
    ];

    const scaledVertices = vertices.map((v) => [
      v[0] * diamond.size,
      v[1] * diamond.size,
    ]);

    let inside = false;
    for (
      let i = 0, j = scaledVertices.length - 1;
      i < scaledVertices.length;
      j = i++
    ) {
      const xi = scaledVertices[i][0],
        yi = scaledVertices[i][1];
      const xj = scaledVertices[j][0],
        yj = scaledVertices[j][1];

      const intersect =
        yi > dy != yj > dy && dx < ((xj - xi) * (dy - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  }

  // ===== SHADER CREATION =====
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

  const meshVertexShader = `
  attribute vec2 attrPosition;
  uniform vec2 domainSize;
  uniform vec3 color;
  uniform vec2 translation;
  uniform float scale;

  varying vec3 fragColor;

  void main() {
    vec2 v = translation + attrPosition * scale;
    vec4 screenTransform = vec4(2.0 / domainSize.x, 2.0 / domainSize.y, -1.0, -1.0);
    gl_Position = vec4(v * screenTransform.xy + screenTransform.zw, 0.0, 1.0);
    fragColor = color;
  }`;

  const meshFragmentShader = `
  precision mediump float;
  varying vec3 fragColor;

  void main() {
    gl_FragColor = vec4(fragColor, 0.0);
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

  // ===== SCENE SETUP FUNCTIONS =====
  function setupScene() {
    if (!cleanup.initialized) return;

    const settings = getResponsiveSettings();

    scene.obstacleRadius = 0.35;
    scene.overRelaxation = 1.9;
    scene.dt = 1.0 / 60.0;
    scene.numPressureIters = 50;
    scene.numParticleIters = 2;

    const res = settings.resolution;
    const tankHeight = 1.0 * simHeight;
    const tankWidth = 1.0 * simWidth;
    const h = (tankHeight / res) * 5.0;
    const density = 1000.0;
    const relWaterHeight = settings.waterHeight;
    const relWaterWidth = settings.waterWidth;

    const r = 0.35 * h;
    const dx = 2.0 * r;
    const dy = (Math.sqrt(3.0) / 2.0) * dx;

    const numX = Math.floor(
      (relWaterWidth * tankWidth - 2.0 * h - 2.0 * r) / dx
    );
    const numY = Math.floor(
      (relWaterHeight * tankHeight - 2.0 * h - 2.0 * r) / dy
    );
    const maxParticles = Math.floor(numX * numY * settings.particleMultiplier);

    const f = (scene.fluid = new FlipFluid(
      density,
      tankWidth,
      tankHeight,
      h,
      r,
      maxParticles
    ));

    diamondTexture = loadTexture(gl, "/images/diamond-obstacle.png");

    f.numParticles = Math.floor(numX * numY * settings.particleMultiplier);
    let p = 0;
    for (let i = 0; i < numX && p < f.numParticles * 2; i++) {
      for (let j = 0; j < numY && p < f.numParticles * 2; j++) {
        if (p / 2 >= f.numParticles) break;
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

    scene.fixedObstacle.x = simWidth / 2 + (simWidth / 2) * 0.06;
    scene.fixedObstacle.y = simHeight / 2 - 0.7 * 0.94;
    scene.fixedObstacle.size = settings.diamondSize;
    scene.fixedObstacle.show = true;

    setObstacle(3.0, 2.0, true);
    setupFixedObstacle();
    cleanupTrappedParticles();
  }

  function setupFixedObstacle() {
    if (!cleanup.initialized) return;

    const f = scene.fluid;
    const n = f.fNumY;
    const diamond = scene.fixedObstacle;
    const buffer = 0.05;

    for (let i = 1; i < f.fNumX - 2; i++) {
      for (let j = 1; j < f.fNumY - 2; j++) {
        const cellX = (i + 0.5) * f.h;
        const cellY = (j + 0.5) * f.h;

        if (isPointInDiamond(cellX, cellY, diamond)) {
          f.s[i * n + j] = 0.0;
          continue;
        }

        const checkPoints = [
          { x: cellX - buffer, y: cellY },
          { x: cellX + buffer, y: cellY },
          { x: cellX, y: cellY - buffer },
          { x: cellX, y: cellY + buffer },
        ];

        for (const point of checkPoints) {
          if (isPointInDiamond(point.x, point.y, diamond)) {
            f.s[i * n + j] = 0.0;
            break;
          }
        }
      }
    }

    cleanupTrappedParticles();
  }

  function setObstacle(x, y, reset) {
    if (!cleanup.initialized) return;

    let vx = 0.0;
    let vy = 0.0;

    if (!reset) {
      vx = (x - scene.obstacleX) / scene.dt;
      vy = (y - scene.obstacleY) / scene.dt;
    }

    scene.obstacleX = x;
    scene.obstacleY = y;
    const r = scene.obstacleRadius;
    const f = scene.fluid;
    const n = f.fNumY;

    for (let i = 1; i < f.fNumX - 2; i++) {
      for (let j = 1; j < f.fNumY - 2; j++) {
        f.s[i * n + j] = 1.0;

        const dx = (i + 0.5) * f.h - x;
        const dy = (j + 0.5) * f.h - y;

        if (dx * dx + dy * dy < r * r) {
          f.s[i * n + j] = 0.0;
          f.u[i * n + j] = vx;
          f.u[(i + 1) * n + j] = vx;
          f.v[i * n + j] = vy;
          f.v[i * n + j + 1] = vy;
        }
      }
    }

    scene.showObstacle = true;
    scene.obstacleVelX = vx;
    scene.obstacleVelY = vy;
  }

  // ===== DRAWING FUNCTIONS =====
  function drawSolidDiamond() {
    if (!scene.fixedObstacle.show || !cleanup.initialized) return;

    const diamond = scene.fixedObstacle;

    const solidDiamondVertexShader = `
    attribute vec2 position;
    uniform vec2 domainSize;
    uniform vec2 center;
    uniform float size;

    void main() {
      vec2 scaledPos = position * size + center;
      vec4 screenTransform = vec4(2.0 / domainSize.x, 2.0 / domainSize.y, -1.0, -1.0);
      gl_Position = vec4(scaledPos * screenTransform.xy + screenTransform.zw, 0.0, 1.0);
    }`;

    const solidDiamondFragmentShader = `
    precision mediump float;
    uniform vec4 color;

    void main() {
      gl_FragColor = color;
    }`;

    if (!window.solidDiamondShader) {
      window.solidDiamondShader = createShader(
        gl,
        solidDiamondVertexShader,
        solidDiamondFragmentShader
      );
    }

    const yOffset = 0.34;
    const vertices = [
      0.0,
      0.0 + yOffset,
      -0.35,
      0.38 + yOffset,
      0.0,
      0.38 + yOffset,
      0.35,
      0.38 + yOffset,
      0.75,
      0.0 + yOffset,
      0.34,
      -0.31 + yOffset,
      0.0,
      -0.7 + yOffset,
      -0.34,
      -0.31 + yOffset,
      -0.75,
      0.0 + yOffset,
      -0.35,
      0.38 + yOffset,
    ];

    if (!window.solidDiamondBuffer) {
      window.solidDiamondBuffer = trackWebGLResource(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, window.solidDiamondBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
      );
    }

    gl.useProgram(window.solidDiamondShader);

    gl.uniform2f(
      gl.getUniformLocation(window.solidDiamondShader, "domainSize"),
      simWidth,
      simHeight
    );
    gl.uniform2f(
      gl.getUniformLocation(window.solidDiamondShader, "center"),
      diamond.x,
      diamond.y
    );
    gl.uniform1f(
      gl.getUniformLocation(window.solidDiamondShader, "size"),
      diamond.size
    );
    gl.uniform4f(
      gl.getUniformLocation(window.solidDiamondShader, "color"),
      0.016,
      0.016,
      0.016,
      1.0
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, window.solidDiamondBuffer);
    const posLoc = gl.getAttribLocation(window.solidDiamondShader, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);

    gl.disableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  function draw() {
    if (!cleanup.initialized) return;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (pointShader === null) {
      pointShader = createShader(gl, pointVertexShader, pointFragmentShader);
    }
    if (meshShader === null) {
      meshShader = createShader(gl, meshVertexShader, meshFragmentShader);
    }

    // Grid setup
    if (gridVertBuffer === null) {
      const f = scene.fluid;
      gridVertBuffer = trackWebGLResource(gl.createBuffer());
      const cellCenters = new Float32Array(2 * f.fNumCells);
      let p = 0;

      for (let i = 0; i < f.fNumX; i++) {
        for (let j = 0; j < f.fNumY; j++) {
          cellCenters[p++] = (i + 0.5) * f.h;
          cellCenters[p++] = (j + 0.5) * f.h;
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, gridVertBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, cellCenters, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    if (gridColorBuffer === null) {
      gridColorBuffer = trackWebGLResource(gl.createBuffer());
    }

    // Draw grid if enabled
    if (scene.showGrid) {
      const pointSize = ((0.9 * scene.fluid.h) / simWidth) * canvas.width;

      gl.useProgram(pointShader);
      gl.uniform2f(
        gl.getUniformLocation(pointShader, "domainSize"),
        simWidth,
        simHeight
      );
      gl.uniform1f(gl.getUniformLocation(pointShader, "pointSize"), pointSize);
      gl.uniform1f(gl.getUniformLocation(pointShader, "drawDisk"), 0.0);

      gl.bindBuffer(gl.ARRAY_BUFFER, gridVertBuffer);
      const posLoc = gl.getAttribLocation(pointShader, "attrPosition");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, gridColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, scene.fluid.cellColor, gl.DYNAMIC_DRAW);

      const colorLoc = gl.getAttribLocation(pointShader, "attrColor");
      gl.enableVertexAttribArray(colorLoc);
      gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, scene.fluid.fNumCells);

      gl.disableVertexAttribArray(posLoc);
      gl.disableVertexAttribArray(colorLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    // Load logo texture if not already loaded
    if (!logoTexture) {
      logoTexture = loadTexture(gl, "/images/rare-logo-fluid.png");
    }

    // Draw particles
    if (scene.showParticles) {
      gl.clear(gl.DEPTH_BUFFER_BIT);
      const pointSize =
        ((2.0 * scene.fluid.particleRadius) / simWidth) * canvas.width * 0.75;

      const texturedShader = createShader(
        gl,
        texturedParticleVertexShader,
        texturedParticleFragmentShader
      );
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

    // Draw disk obstacle
    const numSegs = 50;

    if (diskVertBuffer === null) {
      diskVertBuffer = trackWebGLResource(gl.createBuffer());
      const dphi = (2.0 * Math.PI) / numSegs;
      const diskVerts = new Float32Array(2 * numSegs + 2);
      let p = 0;
      diskVerts[p++] = 0.0;
      diskVerts[p++] = 0.0;
      for (let i = 0; i < numSegs; i++) {
        diskVerts[p++] = Math.cos(i * dphi);
        diskVerts[p++] = Math.sin(i * dphi);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, diskVertBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, diskVerts, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);

      diskIdBuffer = trackWebGLResource(gl.createBuffer());
      const diskIds = new Uint16Array(3 * numSegs);
      p = 0;
      for (let i = 0; i < numSegs; i++) {
        diskIds[p++] = 0;
        diskIds[p++] = 1 + i;
        diskIds[p++] = 1 + ((i + 1) % numSegs);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, diskIdBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, diskIds, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

    gl.clear(gl.DEPTH_BUFFER_BIT);
    const diskColor = [1.0, 1.0, 1.0];

    gl.useProgram(meshShader);
    gl.uniform2f(
      gl.getUniformLocation(meshShader, "domainSize"),
      simWidth,
      simHeight
    );
    gl.uniform3f(
      gl.getUniformLocation(meshShader, "color"),
      diskColor[0],
      diskColor[1],
      diskColor[2]
    );
    gl.uniform2f(
      gl.getUniformLocation(meshShader, "translation"),
      scene.obstacleX,
      scene.obstacleY
    );
    gl.uniform1f(
      gl.getUniformLocation(meshShader, "scale"),
      scene.obstacleRadius + scene.fluid.particleRadius
    );

    const posLoc = gl.getAttribLocation(meshShader, "attrPosition");
    gl.enableVertexAttribArray(posLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, diskVertBuffer);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, diskIdBuffer);
    gl.drawElements(gl.TRIANGLES, 3 * numSegs, gl.UNSIGNED_SHORT, 0);

    gl.disableVertexAttribArray(posLoc);

    // Draw diamond on top
    drawSolidDiamond();
  }

  // ===== INTERACTION HANDLING =====
  let prevMouseX = null;
  let prevMouseY = null;
  let prevTime = null;
  let mouseVelocity = 0;
  const maxRadius = 0.4;
  const minRadius = 0.1;
  const velocitySensitivity = 0.03;
  let mouseDown = false;
  let mouseMoveTimer;

  const startDrag = (x, y) => {
    if (!cleanup.initialized) return;

    const bounds = canvas.getBoundingClientRect();
    const mx = x - bounds.left - canvas.clientLeft;
    const my = y - bounds.top - canvas.clientTop;
    mouseDown = true;

    prevMouseX = x;
    prevMouseY = y;
    prevTime = performance.now();

    const scaledX = (mx * (canvas.width / canvas.offsetWidth)) / cScale;
    const scaledY =
      ((canvas.offsetHeight - my) * (canvas.height / canvas.offsetHeight)) /
      cScale;
    setObstacle(scaledX, scaledY, true);
    scene.paused = false;
  };

  const endDrag = () => {
    if (!cleanup.initialized) return;

    mouseDown = false;
    prevMouseX = null;
    prevMouseY = null;
    prevTime = null;

    const shrinkRadius = () => {
      if (!cleanup.initialized) return;

      scene.obstacleRadius *= 0.9;
      if (scene.obstacleRadius > 0.01) {
        cleanup.animationFrame = requestAnimationFrame(shrinkRadius);
      } else {
        scene.obstacleRadius = 0;
      }
      setObstacle(scene.obstacleX, scene.obstacleY, false);
    };
    shrinkRadius();

    scene.obstacleVelX = 0.0;
    scene.obstacleVelY = 0.0;
  };

  const drag = (x, y) => {
    if (!cleanup.initialized) return;

    const now = performance.now();

    if (prevMouseX !== null && prevMouseY !== null && prevTime !== null) {
      const dt = (now - prevTime) / 1000;
      if (dt > 0) {
        const scaleFactorX = canvas.width / canvas.offsetWidth / cScale;
        const scaleFactorY = canvas.height / canvas.offsetHeight / cScale;
        const dx = (x - prevMouseX) * scaleFactorX;
        const dy = (y - prevMouseY) * scaleFactorY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        mouseVelocity = distance / dt;

        const targetRadius = Math.min(
          maxRadius,
          minRadius + mouseVelocity * velocitySensitivity
        );
        scene.obstacleRadius = scene.obstacleRadius * 0.7 + targetRadius * 0.3;
      }
    }

    prevMouseX = x;
    prevMouseY = y;
    prevTime = now;

    if (mouseDown) {
      const bounds = canvas.getBoundingClientRect();
      const mx = x - bounds.left - canvas.clientLeft;
      const my = y - bounds.top - canvas.clientTop;

      const scaledX = (mx * (canvas.width / canvas.offsetWidth)) / cScale;
      const scaledY =
        ((canvas.offsetHeight - my) * (canvas.height / canvas.offsetHeight)) /
        cScale;
      setObstacle(scaledX, scaledY, false);
    } else startDrag(x, y);
  };

  // ===== EVENT LISTENERS =====
  addEventListenerWithCleanup(wrapper, "mousedown", (event) =>
    startDrag(event.x, event.y)
  );
  addEventListenerWithCleanup(wrapper, "mouseup", endDrag);
  addEventListenerWithCleanup(wrapper, "mousemove", (event) => {
    clearTimeout(mouseMoveTimer);
    drag(event.x, event.y);
    mouseMoveTimer = setTimeoutWithCleanup(endDrag, 100);
  });
  addEventListenerWithCleanup(wrapper, "mouseenter", (event) =>
    startDrag(event.x, event.y)
  );
  addEventListenerWithCleanup(wrapper, "mouseleave", (event) =>
    startDrag(event.x, event.y)
  );
  addEventListenerWithCleanup(window, "blur", endDrag);
  addEventListenerWithCleanup(window, "focus", endDrag);
  addEventListenerWithCleanup(wrapper, "touchstart", (event) => {
    startDrag(event.touches[0].clientX, event.touches[0].clientY);
  });
  addEventListenerWithCleanup(wrapper, "touchend", endDrag);
  addEventListenerWithCleanup(
    wrapper,
    "touchmove",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      drag(event.touches[0].clientX, event.touches[0].clientY);
    },
    { passive: false }
  );

  // ===== RESIZE HANDLING =====
  let resizeTimeout;
  const handleResize = () => {
    if (!cleanup.initialized) return;

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeoutWithCleanup(() => {
      const oldParticlePos = scene.fluid
        ? new Float32Array(scene.fluid.particlePos)
        : null;
      const oldParticleVel = scene.fluid
        ? new Float32Array(scene.fluid.particleVel)
        : null;
      const oldNumParticles = scene.fluid ? scene.fluid.numParticles : 0;

      updateCanvasSize();
      setupScene();

      if (
        oldParticlePos &&
        oldParticleVel &&
        oldNumParticles > 0 &&
        scene.fluid
      ) {
        const newNumParticles = Math.min(
          oldNumParticles,
          scene.fluid.numParticles
        );

        for (let i = 0; i < newNumParticles; i++) {
          const x = Math.max(
            0.1,
            Math.min(simWidth - 0.1, oldParticlePos[2 * i])
          );
          const y = Math.max(
            0.1,
            Math.min(simHeight - 0.1, oldParticlePos[2 * i + 1])
          );

          scene.fluid.particlePos[2 * i] = x;
          scene.fluid.particlePos[2 * i + 1] = y;
          scene.fluid.particleVel[2 * i] = oldParticleVel[2 * i] * 0.5;
          scene.fluid.particleVel[2 * i + 1] = oldParticleVel[2 * i + 1] * 0.5;
        }

        scene.fluid.numParticles = newNumParticles;
      }

      pointVertexBuffer = null;
      pointColorBuffer = null;
      gridVertBuffer = null;
      gridColorBuffer = null;
    }, 150);
  };

  addEventListenerWithCleanup(window, "resize", handleResize);
  addEventListenerWithCleanup(window, "orientationchange", () => {
    setTimeoutWithCleanup(handleResize, 100);
  });

  // ===== SIMULATION AND ANIMATION =====
  const simulate = () => {
    if (!scene.paused && cleanup.initialized) {
      scene.fluid.simulate(
        scene.dt,
        scene.gravity,
        scene.flipRatio,
        scene.numPressureIters,
        scene.numParticleIters,
        scene.overRelaxation,
        scene.compensateDrift,
        scene.separateParticles,
        scene.obstacleX,
        scene.obstacleY,
        scene.obstacleRadius
      );
    }
    scene.frameNr++;
  };

  const update = () => {
    if (!cleanup.initialized || !animationRunning) return;

    if (scene.fixedObstacle && scene.fixedObstacle.show) {
      cleanupTrappedParticles();
    }

    simulate();
    draw();
    cleanup.animationFrame = requestAnimationFrame(update);
  };

  // ===== INITIALIZATION =====
  const initialize = () => {
    try {
      cleanup.initialized = true;
      animationRunning = true;

      let canvasSize = updateCanvasSize();
      canvas.focus();

      setupScene();

      update();

      console.log("Fluid simulation initialized successfully");
    } catch (error) {
      console.error("Failed to initialize fluid simulation:", error);
      cleanup.initialized = false;
      animationRunning = false;
    }
  };

  // Start initialization
  initialize();

  // ===== CLEANUP FUNCTION =====
  return () => {
    console.log("Cleaning up fluid simulation...");

    cleanup.initialized = false;
    animationRunning = false;

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

    if (mouseMoveTimer) {
      clearTimeout(mouseMoveTimer);
      mouseMoveTimer = null;
    }
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }

    // Clear global references that might prevent garbage collection
    if (window.solidDiamondShader) {
      try {
        gl.deleteProgram(window.solidDiamondShader);
      } catch (e) {}
      window.solidDiamondShader = null;
    }
    if (window.solidDiamondBuffer) {
      try {
        gl.deleteBuffer(window.solidDiamondBuffer);
      } catch (e) {}
      window.solidDiamondBuffer = null;
    }

    // Reset all variables
    scene = null;
    pointShader = null;
    meshShader = null;
    pointVertexBuffer = null;
    pointColorBuffer = null;
    gridVertBuffer = null;
    gridColorBuffer = null;
    diskVertBuffer = null;
    diskIdBuffer = null;
    diamondTexture = null;
    logoTexture = null;

    console.log("Fluid simulation cleanup completed");
  };
}
