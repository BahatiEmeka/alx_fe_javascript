// Array to store quotes, initially empty (will be populated from localStorage)
let quotes = [];
let categories = [];  // To store unique categories

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

  // Extract unique categories and update the category list
  categories = [...new Set(quotes.map(quote => quote.category))];
}

// Function to save quotes to localStorage after every update
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to populate categories in the dropdown menu dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';  // Reset dropdown

  categories.forEach(category => {
    let option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category filter from localStorage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);  // Save selected category to localStorage

  let filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

// Function to display quotes in the quoteDisplay area
function displayQuotes(quotesToDisplay) {
  let quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';  // Clear the display area

  quotesToDisplay.forEach(quote => {
    let quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to add a new quote and update the DOM and localStorage
function addQuote() {
  let newQuoteText = document.getElementById('newQuoteText').value;
  let newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    let newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    if (!categories.includes(newQuoteCategory)) {
      categories.push(newQuoteCategory);  // Add new category to the array
    }

    // Save the updated quotes and categories to localStorage
    saveQuotes();
    populateCategories();  // Update the dropdown with the new category

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Display the newly added quote in the filtered view
    filterQuotes();
    alert("New quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Function to create the form for adding new quotes dynamically
function createAddQuoteForm() {
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

  formDiv.appendChild(newQuoteTextInput);
  formDiv.appendChild(newQuoteCategoryInput);
  formDiv.appendChild(addQuoteButton);

  document.getElementById('quoteFormContainer').appendChild(formDiv);
}

// Function to export quotes as a JSON file
function exportToJson() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        importedQuotes.forEach(quote => {
          if (!categories.includes(quote.category)) {
            categories.push(quote.category);
          }
        });
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    } catch (error) {
      alert('Error reading JSON file.');
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// Initialize the application
loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', () => {
  filterQuotes();
});
