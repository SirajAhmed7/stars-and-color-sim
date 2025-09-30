interface Unit {
  x: number;
  y: number;
}

interface PieceTemplate {
  color: string;
  units: Unit[];
}

export default function tetrisFall(
  section: HTMLElement,
  wrapper: HTMLDivElement,
  canvas: HTMLCanvasElement
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context from canvas");
  }

  // Game configuration
  let unitSize: number = 12; // Size of each block unit
  let gridWidth: number;
  let gridHeight: number;

  // Piece class - defined inside function scope to access gridWidth
  class Piece {
    x: number;
    y: number;
    color: string;
    units: Unit[];
    lastMoveTime: number;
    lastRotateTime: number;
    originalUnits: Unit[]; // Store original shape for rotation

    constructor(template: PieceTemplate) {
      this.x = Math.floor(Math.random() * gridWidth);
      this.y = -3; // Start above viewport
      this.color = template.color;
      this.units = [...template.units];
      this.originalUnits = [...template.units]; // Keep original for rotation
      this.lastMoveTime = 0;
      this.lastRotateTime = 0;
    }

    // Rotate the piece 90 degrees clockwise
    rotate(): void {
      const rotatedUnits: Unit[] = [];

      for (let unit of this.units) {
        // Rotate 90 degrees clockwise: (x, y) -> (y, -x)
        rotatedUnits.push({
          x: unit.y,
          y: -unit.x,
        });
      }

      // Check if rotation is valid
      const tempUnits = this.units;
      this.units = rotatedUnits;

      if (checkCollisions(this, 0, 0)) {
        // Rotation would cause collision, revert
        this.units = tempUnits;
      }
    }
  }

  let staticUnits: (string | number)[][] = []; // 2D array to store fallen blocks

  // Timing variables
  let timeCur: number = 0;
  let timeEvent: number = 0;
  let tickRate: number = 60; // How fast blocks fall (milliseconds)
  let spawnTimer: number = 0;
  let spawnInterval: number = 150; // How often to spawn new pieces

  // Current falling pieces
  let fallingPieces: Piece[] = [];

  // Mouse tracking variables
  let mouseX: number = 0;
  let mouseY: number = 0;

  // Piece templates - simplified Tetris pieces
  const pieceTemplates: PieceTemplate[] = [
    // O - Square
    {
      // color: "rgba(255, 255, 255)",
      // color: "#F6E34E",
      color: "#F6E34E",
      units: [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
      ],
    },
    // I - Line
    {
      // color: "#47EBC7",
      color: "#50F2CE",
      units: [
        { x: -2, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
    },
    // S - Right zigzag
    {
      // color: "#75E84B",
      color: "#71F042",
      units: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: 1 },
        { x: 0, y: 1 },
      ],
    },
    // Z - Left zigzag
    {
      // color: "#E6415B",
      color: "#EB3C57",
      units: [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
    },
    // L - Right angle
    {
      // color: "#E8884C",
      color: "#EF8646",
      units: [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: -1, y: -1 },
      ],
    },
    // J - Left angle
    {
      // color: "#5A74E5",
      color: "#5571ED",
      units: [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: -1 },
      ],
    },
    // T - T-shape
    {
      // color: "#9F50EA",
      color: "#9D48EF",
      units: [
        { x: -1, y: 0 },
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
      ],
    },
  ];

  // Mouse event handlers
  function handleMouseMove(event: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  }

  // Setup mouse event listeners
  function setupMouseListeners(): void {
    canvas.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mousemove", handleMouseMove);
  }

  // Handle window resize
  function resizeCanvas(): void {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;

    // Calculate grid dimensions based on unit size
    gridWidth = Math.floor(canvas.width / unitSize);
    gridHeight = Math.floor(canvas.height / unitSize);

    // Reinitialize grid if dimensions changed
    initializeGrid();
  }

  // Initialize the game area
  function initialize(): void {
    resizeCanvas();
    initializeGrid();
    setupMouseListeners();
    createNewPiece();
    gameLoop();
  }

  // Initialize the static units grid
  function initializeGrid(): void {
    staticUnits = [];
    for (let x = 0; x < gridWidth; x++) {
      staticUnits[x] = [];
      for (let y = 0; y < gridHeight; y++) {
        staticUnits[x][y] = 0; // 0 means empty
      }
    }
  }

  // Remove the bottom-most row and shift everything down
  function removeBottomRow(): void {
    for (let x = 0; x < gridWidth; x++) {
      staticUnits[x].splice(gridHeight - 1, 1);
      staticUnits[x].unshift(0);
    }
  }

  // Create a new piece and add it to falling pieces
  function createNewPiece(): void {
    const randomTemplate: PieceTemplate =
      pieceTemplates[Math.floor(Math.random() * pieceTemplates.length)];
    const newPiece = new Piece(randomTemplate);

    // Check if the new piece can spawn
    if (checkCollisions(newPiece, 0, 0)) {
      // For background, we'll just remove bottom row instead of game over
      removeBottomRow();
    }

    fallingPieces.push(newPiece);
  }

  // Check for collisions
  function checkCollisions(
    piece: Piece,
    offsetX: number,
    offsetY: number
  ): boolean {
    for (let unit of piece.units) {
      const testX = piece.x + unit.x + offsetX;
      const testY = piece.y + unit.y + offsetY;

      // Check boundaries
      if (testX < 0 || testX >= gridWidth || testY >= gridHeight) {
        return true;
      }

      // Check collision with static blocks (only if Y > 0 to allow spawning)
      if (testY >= 0 && staticUnits[testX][testY] !== 0) {
        return true;
      }
    }
    return false;
  }

  // Apply gravity to all falling pieces
  function applyGravity(): void {
    for (let i = fallingPieces.length - 1; i >= 0; i--) {
      const piece = fallingPieces[i];

      // Try to move piece down
      if (!checkCollisions(piece, 0, 1)) {
        piece.y++;
      } else {
        // Piece can't fall further, freeze it
        freezePiece(piece);
        // Remove this piece from falling pieces array
        fallingPieces.splice(i, 1);
      }
    }
  }

  // Freeze the specified piece into static units
  function freezePiece(piece: Piece): void {
    if (!piece) return;

    const affectedRows: number[] = [];

    for (let unit of piece.units) {
      const staticX = piece.x + unit.x;
      const staticY = piece.y + unit.y;

      if (
        staticX >= 0 &&
        staticX < gridWidth &&
        staticY >= 0 &&
        staticY < gridHeight
      ) {
        staticUnits[staticX][staticY] = piece.color;

        if (affectedRows.indexOf(staticY) === -1) {
          affectedRows.push(staticY);
        }
      }
    }

    // Clear complete rows
    clearCompleteRows(affectedRows);

    // Check if stack is getting too high and manage it
    manageStackHeight();
  }

  // Clear complete rows
  function clearCompleteRows(checkRows: number[]): void {
    checkRows.sort((a, b) => a - b);

    for (let row of checkRows) {
      let isComplete = true;

      // Check if row is complete
      for (let x = 0; x < gridWidth; x++) {
        if (staticUnits[x][row] === 0) {
          isComplete = false;
          break;
        }
      }

      // If complete, remove the row and add empty row at top
      if (isComplete) {
        for (let x = 0; x < gridWidth; x++) {
          staticUnits[x].splice(row, 1);
          staticUnits[x].unshift(0);
        }
      }
    }
  }

  // Check and manage stack height
  function manageStackHeight(): void {
    // Find the highest point of the stack (lowest y value with blocks)
    let highestPoint = gridHeight;

    for (let y = 0; y < gridHeight; y++) {
      let hasBlocks = false;
      for (let x = 0; x < gridWidth; x++) {
        if (staticUnits[x][y] !== 0) {
          hasBlocks = true;
          break;
        }
      }
      if (hasBlocks) {
        highestPoint = y;
        break;
      }
    }

    // Calculate stack height as percentage of viewport
    const stackHeight = (gridHeight - highestPoint) / gridHeight;

    // If stack reaches 30% of viewport height, remove bottom row
    if (stackHeight >= 0.35) {
      removeBottomRow();
    }
  }

  // Check if mouse is near a piece
  function isMouseNearPiece(piece: Piece): boolean {
    const mouseGridX = Math.floor(mouseX / unitSize);
    const mouseGridY = Math.floor(mouseY / unitSize);

    for (let unit of piece.units) {
      const unitGridX = piece.x + unit.x;
      const unitGridY = piece.y + unit.y;

      // Check if mouse is within 2 units of this piece unit
      const distance = Math.sqrt(
        Math.pow(mouseGridX - unitGridX, 2) +
          Math.pow(mouseGridY - unitGridY, 2)
      );

      if (distance <= 1.5) {
        return true;
      }
    }
    return false;
  }

  // Get the center X position of a piece
  function getPieceCenterX(piece: Piece): number {
    let minX = Infinity;
    let maxX = -Infinity;

    for (let unit of piece.units) {
      const unitX = piece.x + unit.x;
      minX = Math.min(minX, unitX);
      maxX = Math.max(maxX, unitX);
    }

    return (minX + maxX) / 2;
  }

  // Handle mouse interaction with falling pieces - now rotates instead of moving
  function handleMouseInteraction(): void {
    const currentTime = Date.now();
    const mouseGridX = Math.floor(mouseX / unitSize);

    for (let piece of fallingPieces) {
      // Throttle rotation to prevent too frequent updates
      // if (currentTime - piece.lastRotateTime < 300) continue;
      if (currentTime - piece.lastRotateTime < 500) continue;

      if (isMouseNearPiece(piece)) {
        const pieceCenterX = getPieceCenterX(piece);

        // Calculate direction to move away from mouse
        let targetDirection = 0;
        if (mouseGridX > pieceCenterX) {
          // Mouse is to the right, move piece left
          targetDirection = -3;
        } else if (mouseGridX < pieceCenterX) {
          // Mouse is to the left, move piece right
          targetDirection = 3;
        }

        // Try to move in target direction
        if (
          targetDirection !== 0 &&
          !checkCollisions(piece, targetDirection, 0)
        ) {
          piece.x += targetDirection;
          piece.lastMoveTime = currentTime;
        }

        // Rotate the piece when mouse is near
        piece.rotate();
        piece.lastRotateTime = currentTime;
      }
    }
  }

  // Render everything
  function render(): void {
    if (!ctx) {
      throw new Error("Could not get 2D context from canvas");
    }

    // Clear canvas with transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const blockSize = unitSize - 1; // Leave small gap between blocks

    // Draw static blocks
    for (let x = 0; x < gridWidth; x++) {
      for (let y = 0; y < gridHeight; y++) {
        if (staticUnits[x][y] !== 0) {
          ctx.fillStyle = staticUnits[x][y] as string;
          ctx.fillRect(x * unitSize, y * unitSize, blockSize, blockSize);
        }
      }
    }

    // Draw all falling pieces
    for (let piece of fallingPieces) {
      ctx.fillStyle = piece.color;
      for (let unit of piece.units) {
        const drawX = (piece.x + unit.x) * unitSize;
        const drawY = (piece.y + unit.y) * unitSize;

        if (
          drawX >= 0 &&
          drawX < canvas.width &&
          drawY >= 0 &&
          drawY < canvas.height
        ) {
          ctx.fillRect(drawX, drawY, blockSize, blockSize);
        }
      }
    }
  }

  // Main game loop
  function gameLoop(): void {
    timeCur = Date.now();

    // Check if it's time for gravity tick
    if (timeCur >= timeEvent) {
      applyGravity();
      timeEvent = timeCur + tickRate;
    }

    // Check if it's time to spawn a new piece
    if (timeCur >= spawnTimer) {
      createNewPiece();
      spawnTimer = timeCur + spawnInterval;
    }

    // Handle mouse interactions
    handleMouseInteraction();

    render();
    requestAnimationFrame(gameLoop);
  }

  // Handle window resize
  window.addEventListener("resize", resizeCanvas);

  // Start the background animation
  initialize();
}
