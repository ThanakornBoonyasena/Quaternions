const rotate = (x, y) => {
    const cube = document.getElementById("cube");
    cube.style.setProperty("--cube-rotation", `rotateX(${x}deg) rotateY(${y}deg)`);
}

const toggleMenu = () => {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}