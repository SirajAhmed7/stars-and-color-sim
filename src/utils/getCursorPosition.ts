const getCursorPosition = () => {
    const position = { x: 0, y: 0 };

    const mouseMoveHandler = (event: MouseEvent) => {
        position.x = event.clientX;
        position.y = event.clientY;
    };

    const touchMoveHandler = (event: TouchEvent) => {
        if (event.touches.length > 0) {
            position.x = event.touches[0].clientX;
            position.y = event.touches[0].clientY;
        }
    };

    window.addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener('touchmove', touchMoveHandler);

    return position;
}

export default getCursorPosition;
