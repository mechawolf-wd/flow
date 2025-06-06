// Create a style tag and add it to the head of the document
const style = document.createElement('style');
style.innerText = `
  #flow-error-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }

  #error-card {
    background-color: #f8d7da; /* Bootstrap danger background */
    color: #721c24; /* Bootstrap danger text color */
    padding: 20px;
    border-radius: 0.3rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
    width: 90%;
    max-width: 600px;
    text-align: left;
    position: relative;
    overflow-y: auto;
    max-height: 80%;
  }

  #close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px 10px;
    border: none;
    background-color: #f5c6cb; /* Bootstrap danger light */
    color: #721c24; /* Bootstrap danger text color */
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }

  #error-details {
    white-space: pre-wrap; /* Keeps the formatting of stack trace */
    font-family: monospace; /* Improves readability of stack trace */
    margin-top: 10px;
    overflow-y: auto;
  }
`;
document.head.append(style);

// Create the overlay element to display errors
const errorOverlay = document.createElement('div');
errorOverlay.id = 'flow-error-overlay';

// Create the card element within the overlay to display error messages
const errorCard = document.createElement('div');
errorCard.id = 'error-card';
errorCard.innerHTML = `<strong>An error has occurred!</strong><pre id="error-details"></pre>`;

// Create a close button for the card
const closeButton = document.createElement('button');
closeButton.id = 'close-button';
closeButton.textContent = 'Close';
closeButton.onclick = function () {
  document.body.removeChild(errorOverlay); // Remove the overlay from the body
};

// Append the close button and card to the overlay
errorCard.append(closeButton);
errorOverlay.append(errorCard);
document.body.append(errorOverlay);

errorOverlay.style.display = 'none';

// Function to show the overlay with dynamic error messages
export const showErrorOverlay = (error) => {
  errorOverlay.style.display = 'flex';
  document.getElementById('error-details').textContent = error + '\n\n';  // Display the provided error message
  if (error.stack) {
    document.getElementById('error-details').textContent += error.stack;  // Append the provided error stack trace
  }
  document.body.append(errorOverlay); // Append the overlay to the body
};

// Funkcja generujaca widok bledu, jest wywolywana gdy globalny try catch napotka blad
