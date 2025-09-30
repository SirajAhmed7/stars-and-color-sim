interface Velocity {
  x: number;
  y: number;
}

export default function matrixText(
  section: HTMLElement,
  wrapper: HTMLDivElement,
  canvas: HTMLCanvasElement
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get 2D context from canvas");
  }

  canvas.width = wrapper.offsetWidth;
  canvas.height = wrapper.offsetHeight;

  const fontSize: number = 20;
  const columns: number = canvas.width / fontSize;
  const drops: number[] = [];
  const positions: number[] = [];
  const velocities: Velocity[] = [];

  let mouseX: number | null = null;
  let mouseY: number | null = null;
  // const mouseRadius: number = 150;
  const mouseRadius: number = 80;
  let mouseVelX: number = 0;
  let mouseVelY: number = 0;

  for (let x = 0; x < columns; x++) {
    drops[x] = Math.floor((Math.random() * canvas.height) / fontSize) * -1;
    positions[x] = x * fontSize;
    velocities[x] = { x: 0, y: 0 };
  }

  const matrix: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
  // const matrix: string =
  //   "ラドクリフマラソンわたしワタシんょンョたばこタバコとうきょうトウキョウ0123456789±!@#$%^&*()_+ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let lastTime: number = 0;
  const FPS: number = 60;
  const frameTime: number = 1000 / FPS;
  // const frameTime: number = 1500 / FPS;

  function handleMouseMove(e: MouseEvent): void {
    const rect = canvas.getBoundingClientRect();
    if (
      // e.clientX >= rect.left &&
      // e.clientX <= rect.right &&
      // e.clientY >= rect.top &&
      // e.clientY <= rect.bottom
      e.offsetX >= rect.left &&
      e.offsetX <= rect.right &&
      e.offsetY >= rect.top &&
      e.offsetY <= rect.bottom
    ) {
      mouseVelX = e.offsetX - (mouseX || e.offsetX);
      mouseVelY = e.offsetY - (mouseY || e.offsetY);
      mouseX = e.offsetX;
      mouseY = e.offsetY;
    }
  }

  function handleMouseLeave(): void {
    console.log("leave");
    mouseX = null;
    mouseY = null;
    mouseVelX = 0;
    mouseVelY = 0;
  }

  canvas.addEventListener("mousemove", handleMouseMove);
  section.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);

  function draw(currentTime: number): void {
    if (!ctx) {
      throw new Error("Could not get 2D context from canvas");
    }

    if (currentTime - lastTime < frameTime) {
      requestAnimationFrame(draw);
      return;
    }

    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = fontSize + "px monospace";

    for (let i = 0; i < drops.length; i++) {
      const originalX: number = i * fontSize;
      let x: number = positions[i];
      const y: number = drops[i] * fontSize;

      if (mouseX !== null && mouseY !== null) {
        const dx: number = x - mouseX;
        const dy: number = y - mouseY;
        const distance: number = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseRadius) {
          const angle: number = Math.atan2(dy, dx);
          const force: number =
            Math.pow((mouseRadius - distance) / mouseRadius, 2) * 2;

          const repelX: number = Math.cos(angle) * force * 25;
          const repelY: number = Math.sin(angle) * force * 25;

          velocities[i].x += repelX + mouseVelX * force * 0.2;
          velocities[i].y += repelY + mouseVelY * force * 0.2;

          velocities[i].x += (Math.random() - 0.5) * force * 10;
          velocities[i].y += (Math.random() - 0.5) * force * 10;
        }
      }

      positions[i] += velocities[i].x;
      drops[i] += velocities[i].y / fontSize;

      velocities[i].x *= 0.95;
      velocities[i].y *= 0.95;

      positions[i] += (originalX - positions[i]) * 0.05;

      const text: string = matrix[Math.floor(Math.random() * matrix.length)];

      if (drops[i] * fontSize > 0) {
        ctx.fillStyle = "#0F0";
        // ctx.fillStyle = "#ddd";
        ctx.fillText(text, positions[i], y);

        ctx.fillStyle = "#0403";
        // ctx.fillStyle = "#666";
        for (let j = 1; j < 10; j++) {
          const trailChar: string =
            matrix[Math.floor(Math.random() * matrix.length)];
          ctx.fillText(trailChar, positions[i], y - j * fontSize);
        }
      }

      drops[i]++;

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
        velocities[i].y = 0;
      }

      if (positions[i] < 0) positions[i] = 0;
      if (positions[i] > canvas.width) positions[i] = canvas.width;
    }

    lastTime = currentTime;
    requestAnimationFrame(draw);
  }

  function handleResize(): void {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const newColumns: number = canvas.width / fontSize;

    for (let x = 0; x < newColumns; x++) {
      if (!drops[x]) {
        drops[x] = Math.floor((Math.random() * canvas.height) / fontSize) * -1;
        positions[x] = x * fontSize;
        velocities[x] = { x: 0, y: 0 };
      }
    }
  }

  window.addEventListener("resize", handleResize);

  requestAnimationFrame(draw);
}
