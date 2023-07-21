const rotate = (degs) => {
    const deglist = degs.split(",");
    const x = deglist[0];
    const y = deglist[1];
    const cube = document.getElementById("cube");
    cube.style.setProperty("--cube-rotation", `rotateX(${x}deg) rotateY(${y}deg)`);
    console.log("x: ", x, "y: ", y);
}