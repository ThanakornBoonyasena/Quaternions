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

const computeAndReplace = (  
  rollValue,
  pitchValue,
  yawValue,
  wValue,
  xValue,
  yValue,
  zValue,
  value00,
  value01,
  value02,
  value10,
  value11,
  value12,
  value20,
  value21,
  value22) => {


  let threeDimensionalSpace = {
    Quaternion: [wValue, xValue, yValue, zValue],
    RotationMatrix: [[value00, value01, value02], 
                      [value10, value11, value12],  
                      [value20, value21, value22]],
    DirectionCosine: [rollValue, pitchValue, yawValue]
  };

  const checkData = new Promise((resolve, reject) => {
    let getList = Object.keys(threeDimensionalSpace);
    let missingList = [];
    let providedList = Object.keys(threeDimensionalSpace);
    for (key of getList) { 
      console.log(key)
      if (key === "RotationMatrix") {
        if (threeDimensionalSpace["RotationMatrix"][0].every(item => item === "") && threeDimensionalSpace["RotationMatrix"][1].every(item => item === "") && threeDimensionalSpace["RotationMatrix"][2].every(item => item === "")) {
          missingList.push(key);
          providedList.splice(providedList.indexOf(key), 1);
        }
      } 
      if (key === "Quaternion" ||key === "DirectionCosine" && (threeDimensionalSpace[key].every(item => item === ""))) {
        missingList.push(key);
        providedList.splice(providedList.indexOf(key), 1);
      }    
    }
    if (providedList.length !== 0) {
      resolve([missingList, providedList]);
    } else {
      reject("No data provided");
    }
  })

  const convertor = async(missingToProvided) => {
      const w = threeDimensionalSpace.Quaternion[0];
      const x = threeDimensionalSpace.Quaternion[1];
      const y = threeDimensionalSpace.Quaternion[2];
      const z = threeDimensionalSpace.Quaternion[3];
      const r00 = threeDimensionalSpace.RotationMatrix[0][0]
      const r01 = threeDimensionalSpace.RotationMatrix[0][1]
      const r02 = threeDimensionalSpace.RotationMatrix[0][2]
      const r10 = threeDimensionalSpace.RotationMatrix[1][0]
      const r11 = threeDimensionalSpace.RotationMatrix[1][1]
      const r12 = threeDimensionalSpace.RotationMatrix[1][2]
      const r20 = threeDimensionalSpace.RotationMatrix[2][0]
      const r21 = threeDimensionalSpace.RotationMatrix[2][1]
      const r22 = threeDimensionalSpace.RotationMatrix[2][2]
      const roll = threeDimensionalSpace.DirectionCosine[0]
      const pitch = threeDimensionalSpace.DirectionCosine[1]
      const yaw = threeDimensionalSpace.DirectionCosine[2]

      switch (missingToProvided) {
        case "QuaternionToRotationMatrix":
          threeDimensionalSpace.RotationMatrix[0][0] = ((w**2) + (x**2) - (y**2) - (z**2))
          threeDimensionalSpace.RotationMatrix[0][1] = ((2*x*y) - (2*w*z))
          threeDimensionalSpace.RotationMatrix[0][2] = ((2*x*z) + (2*w*y))
          threeDimensionalSpace.RotationMatrix[1][0] = ((2*x*y) + (2*w*z))
          threeDimensionalSpace.RotationMatrix[1][1] = ((w**2) - (x**2) + (y**2) - (z**2))
          threeDimensionalSpace.RotationMatrix[1][2] = ((2*y*z) - (2*w*x))
          threeDimensionalSpace.RotationMatrix[2][0] = ((2*x*z) - (2*w*y))
          threeDimensionalSpace.RotationMatrix[2][1] = ((2*y*z) + (2*w*x))
          threeDimensionalSpace.RotationMatrix[2][2] = ((w**2) - (x**2) - (y**2) + (z**2))
          console.log(threeDimensionalSpace.RotationMatrix)
          break;
        case "RotationMatrixToQuaternion":
          threeDimensionalSpace.Quaternion[0] = Math.sqrt((1 + r00 + r11 + r22)/4)
          threeDimensionalSpace.Quaternion[1] = Math.sqrt((1 - r00 - r11 + r22)/4)
          threeDimensionalSpace.Quaternion[2] = Math.sqrt((1 - r00 + r11 - r22)/4)
          threeDimensionalSpace.Quaternion[3] = Math.sqrt((1 + r00 - r11 - r22)/4)
          console.log(threeDimensionalSpace.Quaternion)
          break;
        case "DirectionCosineToRotationMatrix" :
          threeDimensionalSpace.RotationMatrix[0][0] = (Math.cos(yaw) * Math.cos(pitch))
          threeDimensionalSpace.RotationMatrix[0][1] = (Math.sin(yaw) * Math.cos(pitch))
          threeDimensionalSpace.RotationMatrix[0][2] = -(Math.sin(pitch))
          threeDimensionalSpace.RotationMatrix[1][0] = ((Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll)) - (Math.sin(yaw) * Math.cos(roll)))
          threeDimensionalSpace.RotationMatrix[1][1] = ((Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll)) + (Math.cos(yaw) * Math.cos(roll)))
          threeDimensionalSpace.RotationMatrix[1][2] = (Math.sin(roll) * Math.cos(pitch))
          threeDimensionalSpace.RotationMatrix[2][0] = ((Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll)) - (Math.sin(yaw) * Math.sin(roll)))
          threeDimensionalSpace.RotationMatrix[2][1] = ((Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll)) - (Math.cos(yaw) * Math.sin(roll)))
          threeDimensionalSpace.RotationMatrix[2][2] = (Math.cos(roll) * Math.cos(pitch))
          console.log(threeDimensionalSpace.RotationMatrix)
          break;
        case "RotationMatrixToDirectionCosine":
          threeDimensionalSpace.DirectionCosine[0] = Math.atan2(r12, r22);
          threeDimensionalSpace.DirectionCosine[1] = Math.asin(-r02);
          threeDimensionalSpace.DirectionCosine[2] = Math.atan2(r01, r00);
          console.log(threeDimensionalSpace.DirectionCosine)
          break;
      }
    }

  const prepareData = async() => {
  try {
    let [missingList, providedList] = await checkData;
    console.log("The missing data : ", missingList);
    console.log("The provided data : ", providedList);

    if (providedList.includes("RotationMatrix")) {
      for (missing of missingList) {
        await convertor(`RotationMatrixTo${missing}`);
      }
    } else {
      await convertor(`${providedList[0]}ToRotationMatrix`);
      await providedList.push("RotationMatrix")
      for (missing of missingList) {
        await convertor(`RotationMatrixTo${missing}`);
      }
    }
  } catch (error) {
    console.error(error);
  }};
  prepareData();

  rollInput.value = threeDimensionalSpace.DirectionCosine[0];
  pitchInput.value = threeDimensionalSpace.DirectionCosine[1];
  yawInput.value = threeDimensionalSpace.DirectionCosine[2];
  wInput.value = threeDimensionalSpace.Quaternion[0];
  xInput.value = threeDimensionalSpace.Quaternion[1];
  yInput.value = threeDimensionalSpace.Quaternion[2];
  zInput.value = threeDimensionalSpace.Quaternion[3];
  input00.value = threeDimensionalSpace.RotationMatrix[0][0];
  input01.value = threeDimensionalSpace.RotationMatrix[0][1];
  input02.value = threeDimensionalSpace.RotationMatrix[0][2];
  input10.value = threeDimensionalSpace.RotationMatrix[1][0];
  input11.value = threeDimensionalSpace.RotationMatrix[1][1];
  input12.value = threeDimensionalSpace.RotationMatrix[1][2];
  input20.value = threeDimensionalSpace.RotationMatrix[2][0];
  input21.value = threeDimensionalSpace.RotationMatrix[2][1];
  input22.value = threeDimensionalSpace.RotationMatrix[2][2];
}