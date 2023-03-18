const app = document.querySelector(`.app`);
const display = document.querySelector(`.current-display`);
const operators = document.querySelectorAll(".function");

app.addEventListener(`click`, (e) => {
  activeOperator(e.target.innerText)
  if(e.target.classList.contains(`numbers`)){
    writeNumbers(e.target.innerText);
  } else if(e.target.classList.contains(`comma`)){
    addComma();
  } else if(e.target.classList.contains(`delete`)) {
    clear();
  } else if(e.target.classList.contains(`function`)){
    operatorClick(e.target.innerText);
  } else if(e.target.classList.contains(`equals`)){
    equals();
  } else if(e.target.classList.contains(`sign`)){
    changeSign();
  } else if(e.target.classList.contains(`percent`)){
    percentage();
  } else if(e.target.classList.contains(`current-display`)){
    backSpace();
  }
})

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
      display.textContent = number;
    } else if (!nextNumber) {
      display.textContent += number;
    } else if (nextNumber) {
      display.textContent = number;
      nextNumber = false;
    }
  } else {
    if(store.length !== 0 && nextNumber){
      display.textContent = number;
      nextNumber = false;
    } else if(store.length !== 0 && !nextNumber){
      display.textContent += number;
    }
  }
}

const addComma = () => {
  if(!display.textContent.includes(`,`)){
    if(!nextNumber){
      display.textContent += `,`;
    } else {
      display.textContent = `0,`
      nextNumber = false;
    }
  } else {
    if(nextNumber) {
      display.textContent = `0,`;
      nextNumber = false;
    }
  }
} 

const clear = () => {
  display.textContent = `0`;
  numberEntered = false;
  nextNumber = false;
  store = [];
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
  roundBigFloat();
}

// onclick function for operator buttons
const operatorClick = (operand) => {
  if (store.length === 0 && numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    store.push(operand);
    numberEntered = false;
    nextNumber = true;
  } else if (store.length !== 0 && !numberEntered) {
      if (typeof store[store.length - 1] !== "number") {
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
  
  checkLength();
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
  checkLength();
}

// checks if the number exceeds the max limit
const checkLength = () => {
  if(store[store.length - 1] === `undefined`){
    display.innerText = `undefined`;
    store = [];
  } else if(store.length !== 0 && store[0].toString().split(``).length < 11) {
    display.innerText = store[0].toString().replace(`.`, `,`);
  } else if(store.length !== 0) {
    alert("Number of values that can be entered exceeded");
  }
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
}

const changeSign = () => {
  const changed = parseFloat(
    Number(display.innerText.replace(",", ".")) * -1
  );
  display.innerText = changed.toString().replace(".", ",");
}

const percentage = () => {
  const percentageValue = Number(display.innerText.replace(`,`, `.`)) / 100;
  if (
    percentageValue.toString().split(`.`).join(``).split(``).length < 11
  ) {
    display.innerText = percentageValue.toString().replace(`.`, `,`);
  } else {
    alert(`Number of values that can be entered exceeded`);
  }
}

// deletes only last digit
const backSpace = () => {
  const number = display.innerText.split(``);
  number.pop();
  display.innerText = number.join(``);
  if(display.innerText === ``){
    display.innerText = `0`;
  }
}

// keyboard events
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    writeNumbers(e.key)
    removeColor();
  } else if(e.key === `Delete`) {
    clear();
    removeColor();
  } else if(
    e.key === `+` ||
    e.key === `-` ||
    e.key === `*` ||
    e.key === `/`
    ) {
      operatorClick(e.key);
      activeOperator(e.key)
    } else if(
      e.key === `=` ||
      e.key === `Enter`
      ) {
      equals();
    } else if(
      e.key === `,` ||
      e.key === `.`
    ) {
      addComma();
      removeColor();
    } else if(e.key === `Control`){
      changeSign();
      removeColor();
    } else if(e.key === `%`){
      removeColor();
      percentage();
    } else if(e.key === `Backspace`){
      removeColor();
      backSpace();
    }
});

const activeOperator = (btn) => {
  operators.forEach((item) => {
    if (item.classList.contains("function")) {
      if (btn === item.innerText) {
        item.classList.add("active-operator");
      } else {
        item.classList.remove("active-operator");
      }
    } else {
      item.classList.remove("active-operator");
    }
  });

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
      item.classList.add("active-operator");
    } else {
      item.classList.remove("active-operator");
    }
  });
} 

const removeColor = () => {
  operators.forEach((item) => {
    item.classList.remove("active-operator");
  });
};
