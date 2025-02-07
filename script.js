class Calculator {
    constructor() {
        // Select the display and operation display elements
        this.display = document.querySelector('.display');
        this.operationDisplay = document.querySelector('.operation');
        this.buttons = document.querySelectorAll('.buttons button');
        
        // Initialize calculator state variables
        this.firstOperand = null;
        this.secondOperand = null;
        this.operator = '';
        this.shouldResetDisplay = false;
        
        // Initialize the calculator
        this.init();
    }

    init() {
        // Add event listeners to each button
        this.buttons.forEach(button => {
            button.addEventListener('click', (e) => this.handleButtonClick(e));
        });
    }

    handleButtonClick(event) {
        // Get the value of the button clicked
        const value = event.target.textContent;

        // Clear the calculator if an error message is displayed
        if (this.display.value === 'Hell Nah') {
            this.clearCalculator();
            return;
        }

        // Disable the decimal button if it already exists in the display
        if (value === '.' && this.display.value.includes('.')) {
            return; // Do nothing if there's already a decimal
        }

        // Handle button clicks based on their value
        switch (value) {
            case 'AC':
                this.clearCalculator(); // Clear all values
                break;
            case '=':
                this.performCalculation(); // Perform the calculation
                break;
            case '←':
                this.handleBackspace(); // Remove the last digit
                break;
            case '+':
            case '-':
            case '×':
            case '÷':
                this.handleOperator(value); // Set the operator
                break;
            default:
                this.appendNumber(value); // Append the number to the display
        }
    }

    appendNumber(value) {
        // Append a number to the display
        if (this.display.value === '0' || this.shouldResetDisplay) {
            this.display.value = value; // Replace if zero or reset
            this.shouldResetDisplay = false;
        } else {
            this.display.value += value; // Append the value
        }
    }

    handleOperator(operator) {
        // If there's already an operator, calculate the result first
        if (this.operator && !this.shouldResetDisplay) {
            this.performCalculation();
        }

        // Set the operator and store the first operand
        this.operator = operator;
        this.firstOperand = parseFloat(this.display.value);
        this.operationDisplay.value = `${this.firstOperand} ${this.operator} `; // Update operation display
        this.shouldResetDisplay = true; // Prepare for next number input
    }

    performCalculation() {
        // Ensure there is an operator and second operand
        if (!this.operator || this.shouldResetDisplay) return;

        this.secondOperand = parseFloat(this.display.value);

        // Check for division by zero
        if (this.operator === '÷' && this.secondOperand === 0) {
            this.display.value = 'Hell Nah'; // Display error message
            return;
        }

        // Calculate the result based on the operator
        const result = this.calculate();
        const roundedResult = this.roundNumber(result); // Round the result

        // Update displays with the result
        this.updateDisplays(roundedResult);
        this.prepareNextCalculation(roundedResult);
    }

    calculate() {
        // Define operations in an object for easy access
        const operations = {
            '+': (a, b) => a + b,
            '-': (a, b) => a - b,
            '×': (a, b) => a * b,
            '÷': (a, b) => a / b
        };

        // Perform the calculation based on the operator
        return operations[this.operator](this.firstOperand, this.secondOperand);
    }

    updateDisplays(result) {
        // Update the operation display and the main display
        this.operationDisplay.value = `${this.firstOperand} ${this.operator} ${this.secondOperand} = ${result}`;
        this.display.value = result;
    }

    prepareNextCalculation(result) {
        // Prepare for the next calculation
        this.firstOperand = result; // Allow chaining calculations
        this.secondOperand = null; // Reset second operand
        this.shouldResetDisplay = true; // Prepare for next input
    }

    handleBackspace() {
        // Remove the last character from the display
        if (this.display.value.length > 1) {
            this.display.value = this.display.value.slice(0, -1);
        } else {
            this.display.value = '0'; // Reset to zero if nothing left
        }
    }

    clearCalculator() {
        // Reset all calculator values
        this.firstOperand = null;
        this.secondOperand = null;
        this.operator = '';
        this.display.value = '0'; // Reset display
        this.operationDisplay.value = ''; // Clear operation history
        this.shouldResetDisplay = false; // Reset flag
    }

    roundNumber(number) {
        // Round the number to two decimal places
        return Math.round(number * 100) / 100;
    }
}

// Initialize calculator
const calculator = new Calculator();
