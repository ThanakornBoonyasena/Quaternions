const toggleMenu = () => {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('active');
}

let epoch = 0

const rotate = (x, y, header, paragraph) => {
  const cube = document.getElementById("cube");
  const card = document.querySelector(".card");
  const text = document.querySelector("#text");
  const ahh = document.getElementById("ahh");   
  const cardContainer = document.querySelector('.card-container');
  const screenWidth = window.innerWidth;

  cube.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  if (epoch == 0){
      card.classList.toggle('rotate');
      epoch += 1
  } else{
      card.classList.toggle('gyat');
      epoch += 1
  }
  if (header === undefined || paragraph === undefined) {
    cardContainer.style.display = "none";
  } 
  if (screenWidth >= 630 && (header === undefined || paragraph === undefined)) {
    cardContainer.style.display = "flex";
  }
  
  console.log(header) 
  console.log(paragraph)
  text.innerText = header
  ahh.innerHTML = paragraph
}

const checkData = (threeDimensionalSpace) => new Promise((resolve, reject) => {
  let getList = Object.keys(threeDimensionalSpace);
  let missingList = [];
  let providedList = Object.keys(threeDimensionalSpace);
  for (key of getList) { 
    if (key === "RotationMatrix") {
      if (threeDimensionalSpace["RotationMatrix"][0].every(item => item === "") && threeDimensionalSpace["RotationMatrix"][1].every(item => item === "") && threeDimensionalSpace["RotationMatrix"][2].every(item => item === "")) {
        missingList.push(key);
        providedList.splice(providedList.indexOf(key), 1);
      }
    } 
    if ((key === "Quaternion" || key === "DirectionCosine") && (threeDimensionalSpace[key].every(item => item === ""))) {
      missingList.push(key);
      providedList.splice(providedList.indexOf(key), 1);
    }    
  }
  if (providedList.length !== 0) {
    resolve([missingList, providedList]);
  } else {
    reject("No data provided");
  }
});

const convertor = async(missingToProvided, threeDimensionalSpace) => {
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
      break;
    case "RotationMatrixToQuaternion":
      threeDimensionalSpace.Quaternion[0] = Math.sqrt((1 + r00 + r11 + r22)/4)
      threeDimensionalSpace.Quaternion[1] = Math.sqrt((1 - r00 - r11 + r22)/4)
      threeDimensionalSpace.Quaternion[2] = Math.sqrt((1 - r00 + r11 - r22)/4)
      threeDimensionalSpace.Quaternion[3] = Math.sqrt((1 + r00 - r11 - r22)/4)
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
      break;
    case "RotationMatrixToDirectionCosine":
      threeDimensionalSpace.DirectionCosine[0] = Math.atan2(r12, r22);
      threeDimensionalSpace.DirectionCosine[1] = Math.asin(-r02);
      threeDimensionalSpace.DirectionCosine[2] = Math.atan2(r01, r00);
      break;
  }
}

const prepareData = async(threeDimensionalSpace) => {
  try {
    let [missingList, providedList] = await checkData(threeDimensionalSpace);
    console.log("The missing data : ", missingList);
    console.log("The provided data : ", providedList);

    if (providedList.includes("RotationMatrix")) {
      for (missing of missingList) {
        await convertor(`RotationMatrixTo${missing}`, threeDimensionalSpace);
      }
    } else {
      await convertor(`${providedList[0]}ToRotationMatrix`, threeDimensionalSpace);
      await providedList.push("RotationMatrix")
      for (missing of missingList) {
        await convertor(`RotationMatrixTo${missing}`, threeDimensionalSpace);
      }
    }
  } catch (error) {
    console.error(error);
  }};

const computeAndReplace = async(event) => {
  event.preventDefault();

  let rollValue = document.getElementById("roll").value;
  let pitchValue = document.getElementById("pitch").value;
  let yawValue = document.getElementById("yaw").value;
  let wValue = document.getElementById("w").value;
  let xValue = document.getElementById("x").value;
  let yValue = document.getElementById("y").value;
  let zValue = document.getElementById("z").value;
  let value00 = document.getElementById("r00").value;
  let value01 = document.getElementById("r01").value;
  let value02 = document.getElementById("r02").value;
  let value10 = document.getElementById("r10").value;
  let value11 = document.getElementById("r11").value;
  let value12 = document.getElementById("r12").value;
  let value20 = document.getElementById("r20").value;
  let value21 = document.getElementById("r21").value;
  let value22 = document.getElementById("r22").value;

  let inputThreeDimensionalSpace = {
    Quaternion: [wValue, xValue, yValue, zValue],
    RotationMatrix: [[value00, value01, value02], 
                      [value10, value11, value12],
                      [value20, value21, value22]],
    DirectionCosine: [rollValue, pitchValue, yawValue]
  };
  
  await prepareData(inputThreeDimensionalSpace);

  document.getElementById("roll").value = inputThreeDimensionalSpace.DirectionCosine[0];
  document.getElementById("pitch").value = inputThreeDimensionalSpace.DirectionCosine[1];
  document.getElementById("yaw").value = inputThreeDimensionalSpace.DirectionCosine[2];
  document.getElementById("w").value = inputThreeDimensionalSpace.Quaternion[0];
  document.getElementById("x").value = inputThreeDimensionalSpace.Quaternion[1];
  document.getElementById("y").value = inputThreeDimensionalSpace.Quaternion[2];
  document.getElementById("z").value = inputThreeDimensionalSpace.Quaternion[3];
  document.getElementById("r00").value = inputThreeDimensionalSpace.RotationMatrix[0][0];
  document.getElementById("r01").value = inputThreeDimensionalSpace.RotationMatrix[0][1];
  document.getElementById("r02").value = inputThreeDimensionalSpace.RotationMatrix[0][2];
  document.getElementById("r10").value = inputThreeDimensionalSpace.RotationMatrix[1][0];
  document.getElementById("r11").value = inputThreeDimensionalSpace.RotationMatrix[1][1];
  document.getElementById("r12").value = inputThreeDimensionalSpace.RotationMatrix[1][2];
  document.getElementById("r20").value = inputThreeDimensionalSpace.RotationMatrix[2][0];
  document.getElementById("r21").value = inputThreeDimensionalSpace.RotationMatrix[2][1];
  document.getElementById("r22").value = inputThreeDimensionalSpace.RotationMatrix[2][2];
}