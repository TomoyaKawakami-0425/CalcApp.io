class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.display = document.getElementById('display');
    }
    
    inputDigit(digit) {
        if (this.displayValue === 'Error') {
            this.displayValue = String(digit);
            this.waitingForSecondOperand = false;
            this.updateDisplay();
            return;
        }
        
        if (this.waitingForSecondOperand) {
            this.displayValue = String(digit);
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? String(digit) : this.displayValue + digit;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.displayValue === 'Error') {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            this.updateDisplay();
            return;
        }
        
        if (this.waitingForSecondOperand) {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            this.updateDisplay();
            return;
        }

        if (!this.displayValue.includes('.')) {
            this.displayValue += '.';
            this.updateDisplay();
        }
    }

    clear() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.updateDisplay();
    }

    performOperation(nextOperator) {
        const inputValue = parseFloat(this.displayValue);

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            if (this.waitingForSecondOperand) {
                this.operator = nextOperator;
                return;
            }
            
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            
            if (result === 'Error') {
                this.displayValue = result;
                this.firstOperand = null;
                this.operator = null;
                this.waitingForSecondOperand = false;
                this.updateDisplay();
                return;
            }
            
            this.displayValue = String(result);
            this.firstOperand = result;
            this.updateDisplay();
        }

        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                if (secondOperand === 0) {
                    return 'Error';
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    updateDisplay() {
        this.display.textContent = this.displayValue;
    }
}

const calculator = new Calculator();

document.querySelector('.buttons').addEventListener('click', (event) => {
    const target = event.target;
    
    if (!target.matches('button')) {
        return;
    }

    if (target.dataset.value === '.') {
        calculator.inputDecimal();
        return;
    }

    if (target.dataset.value !== undefined) {
        calculator.inputDigit(target.dataset.value);
        return;
    }

    if (target.dataset.action === 'clear') {
        calculator.clear();
        return;
    }

    if (target.dataset.action === 'add' ||
        target.dataset.action === 'subtract' ||
        target.dataset.action === 'multiply' ||
        target.dataset.action === 'divide') {
        calculator.performOperation(target.dataset.action);
        return;
    }

    if (target.dataset.action === 'equals') {
        calculator.performOperation(null);
        return;
    }
});
