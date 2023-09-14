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

let threeDimensionalSpace = {
  quaternion: [null, null, null, null],
  rotationMatrix: [[null, null, null], 
                    [null, null, null], 
                    [null, null, null]],
  directionCosine: [null, null, null]
  };

// let threeDimensionalSpace = {
//   quaternion: [1.0, 0.0, 0.0, 0.0],
//   rotationMatrix: [[1.0, 0.0, 0.0], 
//                    [0.0, 1.0, 0.0], 
//                    [0.0, 0.0, 1.0]],
//   directionCosine: [0.0, 0.0, 0.0]
//   };

// let threeDimensionalSpace = {
//   quaternion: [1.0, 0.0, 0.0, 0.0],
//   rotationMatrix: [[1.0, 0.0, 0.0], 
//                      [0.0, 1.0, 0.0], 
//                      [0.0, 0.0, 1.0]],
//   directionCosine: [null, null, null]
//   };

const checkData = new Promise((resolve, reject) => {
  let providedList = Object.keys(threeDimensionalSpace);
  let missingList = [];
  for (key of providedList) if ((threeDimensionalSpace[key].every(innerArray => Array.isArray(innerArray) && innerArray.every(item => item === null))) || (threeDimensionalSpace[key].every(item => item === null))) {
    missingList.push(key);
    providedList.splice(providedList.indexOf(key), 1);
  }
  if (providedList.length !== 0) {
    resolve([missingList, providedList]);
  } else {
    reject("No data provided");
  }
})

const convertor = async(missingToProvided) => {
  const w = threeDimensionalSpace.quaternion[0];
  const x = threeDimensionalSpace.quaternion[1];
  const y = threeDimensionalSpace.quaternion[2];
  const z = threeDimensionalSpace.quaternion[3];
  const r00 = threeDimensionalSpace.rotationMatrix[0][0]
  const r01 = threeDimensionalSpace.rotationMatrix[0][1]
  const r02 = threeDimensionalSpace.rotationMatrix[0][2]
  const r10 = threeDimensionalSpace.rotationMatrix[1][0]
  const r11 = threeDimensionalSpace.rotationMatrix[1][1]
  const r12 = threeDimensionalSpace.rotationMatrix[1][2]
  const r20 = threeDimensionalSpace.rotationMatrix[2][0]
  const r21 = threeDimensionalSpace.rotationMatrix[2][1]
  const r22 = threeDimensionalSpace.rotationMatrix[2][2]
  const roll = threeDimensionalSpace.directionCosine[0]
  const pitch = threeDimensionalSpace.directionCosine[1]
  const yaw = threeDimensionalSpace.directionCosine[2]

  switch (missingToProvided) {
    case "quaternionToRotationMatrix":
      threeDimensionalSpace.rotationMatrix[0][0] = ((w**2) + (x**2) - (y**2) - (z**2))
      threeDimensionalSpace.rotationMatrix[0][1] = ((2*x*y) - (2*w*z))
      threeDimensionalSpace.rotationMatrix[0][2] = ((2*x*z) + (2*w*y))
      threeDimensionalSpace.rotationMatrix[1][0] = ((2*x*y) + (2*w*z))
      threeDimensionalSpace.rotationMatrix[1][1] = ((w**2) - (x**2) + (y**2) - (z**2))
      threeDimensionalSpace.rotationMatrix[1][2] = ((2*y*z) - (2*w*x))
      threeDimensionalSpace.rotationMatrix[2][0] = ((2*x*z) - (2*w*y))
      threeDimensionalSpace.rotationMatrix[2][1] = ((2*y*z) + (2*w*x))
      threeDimensionalSpace.rotationMatrix[2][2] = ((w**2) - (x**2) - (y**2) + (z**2))
      console.log(threeDimensionalSpace.rotationMatrix)
      break;
    case "rotationMatrixToQuaternion":
      threeDimensionalSpace.quaternion[0] = Math.sqrt((1 + r00 + r11 + r22)/4)
      threeDimensionalSpace.quaternion[1] = Math.sqrt((1 - r00 - r11 + r22)/4)
      threeDimensionalSpace.quaternion[2] = Math.sqrt((1 - r00 + r11 - r22)/4)
      threeDimensionalSpace.quaternion[3] = Math.sqrt((1 + r00 - r11 - r22)/4)
      console.log(threeDimensionalSpace.quaternion)
      break;
    case "directionCosineToRotationMatrix" :
      threeDimensionalSpace.rotationMatrix[0][0] = (Math.cos(yaw) * Math.cos(pitch))
      threeDimensionalSpace.rotationMatrix[0][1] = (Math.sin(yaw) * Math.cos(pitch))
      threeDimensionalSpace.rotationMatrix[0][2] = -(Math.sin(pitch))
      threeDimensionalSpace.rotationMatrix[1][0] = ((Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll)) - (Math.sin(yaw) * Math.cos(roll)))
      threeDimensionalSpace.rotationMatrix[1][1] = ((Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll)) + (Math.cos(yaw) * Math.cos(roll)))
      threeDimensionalSpace.rotationMatrix[1][2] = (Math.sin(roll) * Math.cos(pitch))
      threeDimensionalSpace.rotationMatrix[2][0] = ((Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll)) - (Math.sin(yaw) * Math.sin(roll)))
      threeDimensionalSpace.rotationMatrix[2][1] = ((Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll)) - (Math.cos(yaw) * Math.sin(roll)))
      threeDimensionalSpace.rotationMatrix[2][2] = (Math.cos(roll) * Math.cos(pitch))
      console.log(threeDimensionalSpace.rotationMatrix)
      break;
    case "rotationMatrixToDirectionCosine":
      threeDimensionalSpace.directionCosine[0] = Math.atan2(r12, r22);
      threeDimensionalSpace.directionCosine[1] = Math.asin(-r02);
      threeDimensionalSpace.directionCosine[2] = Math.atan2(r01, r00);
      console.log(threeDimensionalSpace.directionCosine)
      break;
  }
}

const prepareData = async() => {
try {
  let [missingList,providedList] = await checkData;
  console.log("The missing data : ", missingList);
  console.log("The provided data : ", providedList);
  // for (provided of providedList) {
  //   if (provided === "rotationMatrix") {
  //     for (missing of missingList) {
  //       await convertor(`rotationMatrixTo${missing}`);
  //     }
  //   } else {
  //     for (missing of missingList) {
  //       await convertor(`${provided}ToRotationMatrix`);
  //       providedList.add("rotationMatrix")
  //     }
  //   }
  // }
} catch (error) {
  console.error(error);
}};

prepareData();