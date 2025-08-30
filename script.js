document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('.number');
    const operatorButtons = document.querySelectorAll('.operator');
    const equalsButton = document.querySelector('[data-action="calculate"]');
    const clearButton = document.querySelector('[data-action="clear"]');
    const deleteButton = document.querySelector('[data-action="delete"]');
    const percentButton = document.querySelector('[data-action="percent"]');

    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;

    // Update the display
    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(currentOperand);
        
        if (operation != null) {
            previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }

    // Format numbers for display
    function formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Add event listeners for number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.textContent);
            updateDisplay();
        });
    });

    // Add event listeners for operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.textContent);
            updateDisplay();
        });
    });

    // Add event listener for equals button
    equalsButton.addEventListener('click', () => {
        calculate();
        updateDisplay();
    });

    // Add event listener for clear button
    clearButton.addEventListener('click', () => {
        clear();
        updateDisplay();
    });

    // Add event listener for delete button
    deleteButton.addEventListener('click', () => {
        deleteNumber();
        updateDisplay();
    });

    // Add event listener for percent button
    percentButton.addEventListener('click', () => {
        percent();
        updateDisplay();
    });

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9' || event.key === '.') {
            appendNumber(event.key);
            updateDisplay();
        } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
            const operationMap = {
                '+': '+',
                '-': '-',
                '*': '×',
                '/': '÷'
            };
            chooseOperation(operationMap[event.key]);
            updateDisplay();
        } else if (event.key === 'Enter' || event.key === '=') {
            calculate();
            updateDisplay();
        } else if (event.key === 'Escape') {
            clear();
            updateDisplay();
        } else if (event.key === 'Backspace') {
            deleteNumber();
            updateDisplay();
        } else if (event.key === '%') {
            percent();
            updateDisplay();
        }
    });

    // Append a number to the current operand
    function appendNumber(number) {
        if (shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        
        if (number === '.' && currentOperand.includes('.')) return;
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
    }

    // Choose an operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
    }

    // Calculate the result
    function calculate() {
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
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Add animation effect
        currentOperandElement.classList.add('flash');
        setTimeout(() => {
            currentOperandElement.classList.remove('flash');
        }, 200);
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
    }

    // Clear all values
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
    }

    // Delete the last digit
    function deleteNumber() {
        if (shouldResetScreen) {
            clear();
            updateDisplay();
            return;
        }
        
        if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith('-'))) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
    }

    // Calculate percentage
    function percent() {
        if (currentOperand === '') return;
        
        currentOperand = (parseFloat(currentOperand) / 100).toString();
    }

    // Initialize display
    updateDisplay();
});