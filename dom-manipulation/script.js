// Array to store quotes, initially empty (will be populated from localStorage)
let quotes = [];

// Function to load quotes from localStorage when the page is initialized
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);  // Parse the quotes stored as JSON in localStorage
  } else {
    // Default quotes if localStorage is empty
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" },
    ];
  }
}

// Function to save quotes to localStorage after every update
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length === 0) return;

  let randomIndex = Math.floor(Math.random() * quotes.length);
  let randomQuote = quotes[randomIndex];

  let quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;

  // Save the last displayed quote in sessionStorage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to add a new quote and save it to localStorage
function addQuote() {
  let newQuoteText = document.getElementById('newQuoteText').value;
  let newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    let newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Save the updated quotes to localStorage
    saveQuotes();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Display the newly added quote
    let quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${newQuote.text}" - <em>${newQuote.category}</em></p>`;
    
    alert("New quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Function to create the form for adding new quotes dynamically
function createAddQuoteForm() {
  // Create input elements for the new quote text and category
  let formDiv = document.createElement('div');

  let newQuoteTextInput = document.createElement('input');
  newQuoteTextInput.setAttribute('id', 'newQuoteText');
  newQuoteTextInput.setAttribute('type', 'text');
  newQuoteTextInput.setAttribute('placeholder', 'Enter a new quote');

  let newQuoteCategoryInput = document.createElement('input');
  newQuoteCategoryInput.setAttribute('id', 'newQuoteCategory');
  newQuoteCategoryInput.setAttribute('type', 'text');
  newQuoteCategoryInput.setAttribute('placeholder', 'Enter quote category');

  let addQuoteButton = document.createElement('button');
  addQuoteButton.textContent = 'Add Quote';
  addQuoteButton.addEventListener('click', addQuote);

  // Append inputs and button to the formDiv
  formDiv.appendChild(newQuoteTextInput);
  formDiv.appendChild(newQuoteCategoryInput);
  formDiv.appendChild(addQuoteButton);

  // Append the formDiv to the form container
  document.getElementById('quoteFormContainer').appendChild(formDiv);
}

// Function to export quotes as a JSON file
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);  // Convert the quotes array to JSON
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create a download link and click it programmatically
  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);  // Parse the imported JSON
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);  // Append the imported quotes to the existing quotes array
        saveQuotes();  // Save the updated quotes array to localStorage
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    } catch (error) {
      alert('Error reading JSON file.');
    }
  };

  fileReader.readAsText(event.target.files[0]);  // Read the uploaded file
}

// Function to restore the last viewed quote from sessionStorage
function loadLastViewedQuote() {
  const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastViewedQuote) {
    const quote = JSON.parse(lastViewedQuote);
    let quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}" - <em>${quote.category}</em></p>`;
  }
}

// Initialize the application
loadQuotes();
createAddQuoteForm();
loadLastViewedQuote();

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
