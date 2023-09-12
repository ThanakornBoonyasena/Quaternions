const toggleMenu = () => {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}

// let epoch = 0

const rotate = (x, y, Bruh) => {
    const cube = document.getElementById("cube");
    // const card = document.querySelector(".card");
    // const text = document.querySelector("#text");
    cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
    // if (epoch == 0){
    //     card.classList.toggle('rotate');
    //     epoch += 1
    // } else{
    //     card.classList.toggle('gyat');
    //     epoch += 1
    // }
    // console.log(epoch)
    // text.innerText = `${Bruh}`
}

let three_Dimensional_Space = {
  quaternion: [1.0, 0.0, 1.0, 0.0],
  rotation_Matrix: [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],
  direction_Cosine: [0.0, 0.0, 0.0]
};

const checkData = new Promise((resolve, reject) => {
    let to_Find_List = ["quaternion", "rotation_Matrix", "direction_Cosine"]
    for (key of to_Find_List) if (three_Dimensional_Space[key] === null || 
        three_Dimensional_Space[key].every(item => item === null) || 
        (three_Dimensional_Space[key].every(innerArray => Array.isArray(innerArray) && innerArray.every(item => item === null)))) {
        if (to_Find_List.indexOf(key) !== -1) {
            to_Find_List.splice(to_Find_List.indexOf(key), 1);
        }
    }
    if (to_Find_List.length === 0) {
        reject("All properties have null values.");
    } else {
        resolve(to_Find_List);
    }
})

checkData
  .then((remainingProperties) => {
    console.log("Remaining properties:", remainingProperties);
  })
  .catch((error) => {
    console.error(error);
  });