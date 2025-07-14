
let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentInput;
}

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        // Prevent multiple operators in a row
        const lastChar = currentInput.slice(-1);
        const operators = ['+', '-', '*', '/'];
        
        if (operators.includes(value) && operators.includes(lastChar)) {
            currentInput = currentInput.slice(0, -1) + value;
        } else {
            currentInput += value;
        }
    }
    
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculateResult() {
    try {
        // Replace display symbols with actual operators
        let expression = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Evaluate the expression safely
        let result = Function('"use strict"; return (' + expression + ')')();
        
        // Handle division by zero and other edge cases
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Round to avoid floating point precision issues
            result = Math.round(result * 100000000) / 100000000;
            currentInput = result.toString();
        }
        
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Prevent default behavior for calculator keys
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Numbers and decimal point
    if ('0123456789.'.includes(key)) {
        appendToDisplay(key);
    }
    
    // Operators
    else if (key === '+') {
        appendToDisplay('+');
    }
    else if (key === '-') {
        appendToDisplay('-');
    }
    else if (key === '*') {
        appendToDisplay('*');
    }
    else if (key === '/') {
        appendToDisplay('/');
    }
    
    // Calculate result
    else if (key === 'Enter' || key === '=') {
        calculateResult();
    }
    
    // Clear
    else if (key === 'Escape') {
        clearDisplay();
    }
    
    // Delete last character
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Add visual feedback for keyboard presses
document.addEventListener('keydown', function(event) {
    const key = event.key;
    let buttonToHighlight = null;
    
    // Find the corresponding button
    if ('0123456789'.includes(key)) {
        buttonToHighlight = document.querySelector(`button[onclick="appendToDisplay('${key}')"]`);
    } else if (key === '+') {
        buttonToHighlight = document.querySelector(`button[onclick="appendToDisplay('+')"]`);
    } else if (key === '-') {
        buttonToHighlight = document.querySelector(`button[onclick="appendToDisplay('-')"]`);
    } else if (key === '*') {
        buttonToHighlight = document.querySelector(`button[onclick="appendToDisplay('*')"]`);
    } else if (key === '/') {
        buttonToHighlight = document.querySelector(`button[onclick="appendToDisplay('/')"]`);
    } else if (key === '.') {
        buttonToHighlight = document.querySelector(`button[onclick="appendToDisplay('.')"]`);
    } else if (key === 'Enter' || key === '=') {
        buttonToHighlight = document.querySelector(`button[onclick="calculateResult()"]`);
    } else if (key === 'Escape') {
        buttonToHighlight = document.querySelector(`button[onclick="clearDisplay()"]`);
    } else if (key === 'Backspace') {
        buttonToHighlight = document.querySelector(`button[onclick="deleteLast()"]`);
    }
    
    // Add highlight effect
    if (buttonToHighlight) {
        buttonToHighlight.style.transform = 'translateY(0)';
        buttonToHighlight.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        
        setTimeout(() => {
            buttonToHighlight.style.transform = '';
            buttonToHighlight.style.boxShadow = '';
        }, 150);
    }
});

// Initialize display
updateDisplay();
