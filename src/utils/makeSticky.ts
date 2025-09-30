import gsap from "gsap";

function makeSticky(elementToHover: HTMLElement, elementToMove: HTMLElement, magnitude: number) {    
    elementToHover.addEventListener('mousemove', (e) => {
        const x = (e.offsetX - elementToHover.clientWidth/2) * magnitude;
        const y = (e.offsetY - elementToHover.clientHeight/2) * magnitude;
    
        gsap.to(elementToMove, {x, y})
    });
    
    elementToHover.addEventListener('mouseleave', () => {
        gsap.to(elementToMove, {
            x: 0, y: 0,
            ease: 'elastic',
            duration: 1.2
        })
    })
}

export default makeSticky;