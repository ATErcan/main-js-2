const app = document.querySelector(`.app`);
const display = document.querySelector(`.current-display`);
const operators = document.querySelectorAll(`.function`);

app.addEventListener(`click`, (e) => {
  if(e.target.classList.contains(`numbers`)){
    display.innerText = writeNumbers(e.target.innerText);
  } else if(e.target.classList.contains(`comma`)){
    display.innerText = addComma();
  } else if(e.target.classList.contains(`delete`)) {
    display.innerText = clear();
  } else if(e.target.classList.contains(`function`)){
    display.innerText = operatorClick(e.target.innerText);
  } else if(e.target.classList.contains(`equals`)){
    display.innerText = equals();
  } else if(e.target.classList.contains(`sign`)){
    display.innerText = changeSign();
  } else if(e.target.classList.contains(`percent`)){
    display.innerText = percentage();
  } else if(e.target.classList.contains(`current-display`)){
    display.innerText = backSpace();
  }
  activeOperator(e.target.innerText, e.target.classList);
})

// returning value of the functions, value that will be displayed on calculator screen
let result = 0;

// boolean value for checking if any number entered before doing operation
let numberEntered = false;

// boolean variable indicating that the next number should be entered
let nextNumber = false;

// array that stores our numbers and operators
let store = [];

const writeNumbers = (number) => {
  numberEntered = true;
  if (display.textContent.split(`-`).join(``).split(``).length < 10) {
    if (store.length === 0 && display.innerText === `0`) {
      return result = number;
    } else if (!nextNumber) {
      return result += number;
    } else if (nextNumber) {
      nextNumber = false;
      return result = number;
    }
  } else {
    if(store.length !== 0 && nextNumber){
      nextNumber = false;
      return result = number;
    } else if(store.length !== 0 && !nextNumber){
      return result += number;
    } else {
      return result;
    }
  }
}

const addComma = () => {
  if(!display.textContent.includes(`,`)){
    if(!nextNumber){
      return result += `,`;
    } else {
      nextNumber = false;
      return result = `0,`
    }
  } else {
    if(nextNumber) {
      nextNumber = false;
      return result = `0,`;
    }
    return result;
  }
} 

const clear = () => {
  numberEntered = false;
  nextNumber = false;
  store = [];
  return result = `0`;
}

// onclick function for operator buttons
const operatorClick = (operand) => {
  if (store.length === 0 && numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    store.push(operand);
    numberEntered = false;
    nextNumber = true;
  } else if (store.length !== 0 && !numberEntered) {
      if (typeof store[store.length - 1] !== `number`) {
        store.pop();
      } else {
        store = [Number(display.innerText.replace(`,`, `.`))];
      }
      store.push(operand);
      nextNumber = true;
  } else if (store.length !== 0 && numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    operate();
    store.push(operand);
    numberEntered = false;
    nextNumber = true;
  }  
  return checkLength();
}

// checks store and does the math
const operate = () => {
  store.forEach((item, i) => {
    if(item === `×` || item === `*`){
      store = [store[i - 1] * store[i + 1]];
    } else if((item === `÷` || item === `/`) && store[i + 1].toString() === `0`){
      store = [`undefined`];
      numberEntered = false;
      nextNumber = false;
    } else if(item === `÷` || item === `/`) {
      store = [store[i - 1] / store[i + 1]];
    } else if(item === `+`){
      store = [store[i - 1] + store[i + 1]];
    } else if(item === `−` || item === `-`) {
      store = [store[i - 1] - store[i + 1]];
    }
  })
  return roundBigFloat();
}

const roundBigFloat = () => {
  const number = store[0].toString();
  if (number.includes(`.`)) {
    const arr = number.split(``);
    const comma = arr.indexOf(`.`);
    if (arr.splice(comma + 1).length > 4) {
      store = [Number(Number(number).toFixed(4))];
    }
  }
  return store[0];
};

// checks if the number exceeds the max limit
const checkLength = () => {
  if(store[store.length - 1] === `undefined`){
    store = [];
    return result = `undefined`;
  } else if(store.length !== 0 && store[0].toString().split(``).length < 11) {
    return result = store[0].toString().replace(`.`, `,`);
  } else if(store.length !== 0) {
    alert(`Number of values that can be entered exceeded`);
    return result;
  }
  return result;
}

const equals = () => {
  if(store.length !== 0 && !numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    operate();
    numberEntered = true;
    nextNumber = true;
  } else if(store.length !== 0 && numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    operate();
    numberEntered = false;
    nextNumber = true;
  }
  return checkLength();
}

const changeSign = () => {
  const changed = parseFloat(
    Number(display.innerText.replace(`,`, `.`)) * -1
  );
  return result = changed.toString().replace(`.`, `,`);
}

const percentage = () => {
  const percentageValue = Number(display.innerText.replace(`,`, `.`)) / 100;
  if (
    percentageValue.toString().split(`.`).join(``).split(``).length < 11
  ) {
    return result = percentageValue.toString().replace(`.`, `,`);
  } else {
    alert(`Number of values that can be entered exceeded`);
    return result;
  }
}

// deletes only last digit
const backSpace = () => {
  if (!isOperatorActive()) {
    const number = display.innerText.split(``);
    number.pop();
    result = number.join(``);
    if (number.length === 0) {
      return (result = `0`);
    }
  }
  return result;
}

const isOperatorActive = () => {
  for(let i = 0; i < operators.length; i++){
    if(operators[i].classList.contains(`active-operator`)){
      return true;
    } 
  }
}

// keyboard events
document.addEventListener(`keydown`, (e) => {
  if (e.key >= `0` && e.key <= `9`) {
    removeColor();
    display.innerText = writeNumbers(e.key)
  } else if(e.key === `Delete`) {
    removeColor();
    display.innerText = clear();
  } else if(
    e.key === `+` ||
    e.key === `-` ||
    e.key === `*` ||
    e.key === `/`
    ) {
      display.innerText = operatorClick(e.key);
      activeOperator(e.key)
    } else if(
      e.key === `=` ||
      e.key === `Enter`
      ) {
      display.innerText = equals();
    } else if(
      e.key === `,` ||
      e.key === `.`
    ) {
      display.innerText = addComma();
      removeColor();
    } else if(e.key === `Control`){
      display.innerText = changeSign();
      removeColor();
    } else if(e.key === `%`){
      removeColor();
      display.innerText = percentage();
    } else if(e.key === `Backspace`){
      display.innerText = backSpace();
    }
});

// function to remove color from selected operator
const removeColor = () => {
  operators.forEach((item) => {
    item.classList.remove(`active-operator`);
  });
};

// function to change color of the selected operator
const activeOperator = (btn, classList = ``) => {
  if(classList === ``){
    keyCheck(btn);
  } else if(!classList.contains(`app`) && !classList.contains(`current-display`)){
    keyCheck(btn);
  }

  if(btn === `/`){
    keyCheck(`÷`);
  } else if(btn === `*`) {
      keyCheck(`×`);
  } else if (btn === `-`) {
      keyCheck(`−`);
  }
};

const keyCheck = (op) => {
  operators.forEach((item) => {
    if (item.innerText === op) {
      item.classList.add(`active-operator`);
    } else {
      item.classList.remove(`active-operator`);
    }
  });
}