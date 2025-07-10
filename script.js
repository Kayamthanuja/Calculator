document.addEventListener('DOMContentLoaded', () => {
  const currentOperandEl = document.getElementById('current-operand');
  const previousOperandEl = document.getElementById('previous-operand');
  const buttons = document.querySelectorAll('button');
  let currentOperand = '0';
  let previousOperand = '';
  let operation = undefined;
  let resetScreen = false;

  function updateDisplay() {
    currentOperandEl.innerText = currentOperand;
    if (operation != null) {
      previousOperandEl.innerText =
        `${previousOperand} ${operation === '*' ? '×' : operation === '/' ? '÷' : operation}`;
    } else {
      previousOperandEl.innerText = '';
    }
  }

  function appendDigit(digit) {
    if (currentOperand === '0' || resetScreen) {
      currentOperand = digit;
      resetScreen = false;
    } else if (digit === '.' && currentOperand.includes('.')) {
      return;
    } else {
      currentOperand += digit;
    }
    updateDisplay();
  }

  function chooseOperation(op) {
    if (currentOperand === '' && op === '-') {
      appendDigit('-');
      return;
    }

    if (currentOperand === '') return;
    if (previousOperand !== '') {
      compute();
    }

    operation = op === '×' ? '*' : op === '÷' ? '/' : op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
  }

  function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        computation = prev / current;
        break;
      default:
        return;
    }

    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    resetScreen = true;
    updateDisplay();
  }

  function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
  }

  function deleteDigit() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
      currentOperand = '0';
    } else {
      currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 9) appendDigit(e.key);
    if (e.key === '.') appendDigit('.');
    if (['+', '-', '*', '/'].includes(e.key)) chooseOperation(e.key);
    if (e.key === 'Enter') compute();
    if (e.key === 'Escape') clear();
    if (e.key === 'Backspace') deleteDigit();
  });

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('operator')) {
        chooseOperation(button.innerText);
      } else if (button.classList.contains('equals')) {
        compute();
      } else if (button.classList.contains('clear')) {
        clear();
      } else if (button.classList.contains('delete')) {
        deleteDigit();
      } else {
        appendDigit(button.innerText);
      }
    });
  });
});
