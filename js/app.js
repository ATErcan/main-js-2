const app = document.querySelector(`.app`);
const display = document.querySelector(`.current-display`);

app.addEventListener(`click`, (e) => {
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
  }
  console.log(store);
})

let numberEntered = false;
let nextNumber = false;
let store = [];

const writeNumbers = (number) => {
  numberEntered = true;
  if (display.textContent.split(`-`).join(``).split(``).length < 10) {
    if (store.length === 0 && display.textContent === `0`) {
      display.textContent = number;
    } else if (!nextNumber) {
      display.textContent += number;
    } else if (nextNumber) {
      display.textContent = number;
      nextNumber = false;
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
  }
} 

const clear = () => {
  display.textContent = `0`;
  numberEntered = false;
  nextNumber = false;
  store = [];
}

const changeSign = () => {
  const changed = parseFloat(
    Number(display.innerText.replace(",", ".")) * -1
  );
  display.innerText = changed.toString().replace(".", ",");
}

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
      store = [store[store.length - 1]];
    }
    store.push(operand);
    nextNumber = true;
  } else if (store.length !== 0 && numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    operands();
    store.push(operand);
    numberEntered = false;
    nextNumber = true;
  }
  display.innerText = store[0].toString().replace(`.`, `,`);
}

const equals = () => {
  if(store.length !== 0 && !numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    operands();
    numberEntered = true;
    nextNumber = true;
  } else if(store.length !== 0 && numberEntered) {
    store.push(Number(display.innerText.replace(`,`, `.`)));
    operands();
    numberEntered = false;
    nextNumber = true;
  }
  display.innerText = store[0].toString().replace(`.`, `,`);
}

const operands = () => {
  store.forEach((item, i) => {
    if(item === `×` || item === `*`){
      store = [store[i - 1] * store[i + 1]];
    } else if(item === `÷` || item === `/`) {
      store = [store[i - 1] / store[i + 1]];
    } else if(item === `+`){
      store = [store[i - 1] + store[i + 1]];
    } else if(item === `−` || item === `-`) {
      store = [store[i - 1] - store[i + 1]];
    }
  })
}

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    writeNumbers(e.key)
  }
});

