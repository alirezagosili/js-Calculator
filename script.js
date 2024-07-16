const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const buttons = document.querySelectorAll("button");

let result = "";
let currentInput = "";
let operator = "";

const operators = ["+", "-", "×", "÷", "%"];

const isOperator = (value) => operators.includes(value);

const operations = {
    "+": (num1, num2) => num1 + num2,
    "-": (num1, num2) => num1 - num2,
    "×": (num1, num2) => Math.round((num1 * num2) * 1000000) / 1000000,
    "÷": (num1, num2) => num2 === 0 ? "Error" : Math.round((num1 / num2) * 1000) / 1000,
    "%": (num1) => num1 / 100
};

const calculate = (num1, operator, num2) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    const operation = operations[operator];
    if (operation) {
        return operation(num1, num2).toString();
    } else {
        return "Error";
    }
};

const formatNumber = (num) => {
    if (num === "Error") return num;
    const parts = num.split(".");
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (parts.length > 1) {
        return `${integerPart}.${parts[1]}`;
    } else {
        return integerPart;
    }
};

const displayError = (message) => {
    outputEl.textContent = `Error: ${message}`;
    outputEl.style.fontSize = "16px";
};

const resetFontSize = () => {
    outputEl.style.fontSize = "42px";
};

buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const inputValue = e.target.textContent;

        if (inputValue === "C") {
            result = "";
            currentInput = "";
            operator = "";
            inputEl.textContent = "";
            outputEl.textContent = "";
            resetFontSize();
        } else if (inputValue === "±") {
            if (currentInput) {
                currentInput = (parseFloat(currentInput) * -1).toString();
            }
        } else if (inputValue === "=") {
            if (result && currentInput) {
                const num1 = result;
                const num2 = currentInput;
                result = calculate(num1, operator, num2).toString();
                currentInput = "";
                operator = "";
                inputEl.textContent = "";
                if (result.length > 18) {
                    displayError("Number too long");
                } else {
                    outputEl.textContent = formatNumber(result);
                    if (result.length > 12) {
                        let fontSize = 42 - (result.length - 12);
                        outputEl.style.fontSize = `${fontSize}px`;
                    } else {
                        resetFontSize();
                    }
                }
            }
        } else if (inputValue === "%") {
            if (currentInput) {
                result = operations["%"](currentInput).toString();
                currentInput = "";
                operator = "";
                inputEl.textContent = "";
                if (result.length > 16) {
                    displayError("Number too long");
                } else {
                    outputEl.textContent = formatNumber(result);
                    if (result.length > 12) {
                        let fontSize = 30 - (result.length - 12);
                        outputEl.style.fontSize = `${fontSize}px`;
                    } else {
                        resetFontSize();
                    }
                }
            }
        } else if (isOperator(inputValue)) {
            if (currentInput) {
                result = currentInput;
                operator = inputValue;
                currentInput = "";
                inputEl.textContent = `${result} ${operator}`;
                outputEl.textContent = "";
            }
        } else if (inputValue === ".") {
            if (!currentInput.includes(".")) {
                currentInput = currentInput + inputValue;
            }
        } else {
            if (currentInput.length < 20) {
                currentInput = currentInput + inputValue;
            } else {
                displayError("Input too long");
                return;
            }
        }

        if (!isOperator(inputValue) && inputValue !== "=" && inputValue !== "C" && inputValue !== "±") {
            if (operator) {
                inputEl.textContent = `${result} ${operator} ${currentInput}`;
            } else {
                inputEl.textContent = currentInput;
            }
        }
    });
});
