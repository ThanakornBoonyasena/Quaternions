function rotate(x,y) {
    const cube = document.getElementById("cube");
    cube.style.setProperty("--cube-rotation", `rotateX(${x}deg) rotateY(${y}deg)`);
}