// Array to store quotes
let quotes = [];
let categories = [];

// Simulated server quotes (from JSONPlaceholder)
const serverQuotesUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API for server data

// Function to load quotes from localStorage when the page initializes
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Default quotes if localStorage is empty
    quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
      { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" },
    ];
  }

  categories = [...new Set(quotes.map(quote => quote.category))];
  populateCategories();
  filterQuotes();
}

// Function to save quotes to localStorage after every update
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the server (mock API)
function fetchQuotesFromServer() {
  fetch(serverQuotesUrl)
    .then(response => response.json())
    .then(data => {
      const serverQuotes = data.slice(0, 5).map(post => ({
        text: post.title,
        category: "Server Category"
      }));
      syncQuotes(serverQuotes);
    })
    .catch(error => console.error("Error fetching server quotes:", error));
}

// Function to post new quotes to the server (mock API)
function postQuoteToServer(newQuote) {
  fetch(serverQuotesUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newQuote)
  })
  .then(response => response.json())
  .then(data => console.log('Quote successfully posted to server:', data))
  .catch(error => console.error('Error posting quote to server:', error));
}

// Function to handle syncing between local storage and server data
function syncQuotes(serverQuotes) {
  let conflicts = false;

  serverQuotes.forEach(serverQuote => {
    const existingQuote = quotes.find(quote => quote.text === serverQuote.text);
    if (!existingQuote) {
      quotes.push(serverQuote);
      conflicts = true;
    }
  });

  if (conflicts) {
    document.getElementById('notification').style.display = 'block';
    document.getElementById('notification').textContent = "Conflicts detected! Data synced from server.";
    document.getElementById('resolveConflict').style.display = 'block'; // Show manual resolution option
    saveQuotes();
    filterQuotes();
  } else {
    console.log('No conflicts detected, data is up to date.');
  }
}

// Function to populate categories dynamically in the dropdown menu
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset dropdown

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
  localStorage.setItem('selectedCategory', selectedCategory); // Save selected category to localStorage

  let filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  displayQuotes(filteredQuotes);
}

// Function to display quotes in the quoteDisplay area
function displayQuotes(quotesToDisplay) {
  let quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = ''; // Clear the display area

  quotesToDisplay.forEach(quote => {
    let quoteElement = document.createElement('p');
    quoteElement.innerHTML = `"${quote.text}" - <em>${quote.category}</em>`;
    quoteDisplay.appendChild(quoteElement);
  });
}

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    displayQuotes([randomQuote]); // Display only the random quote
  }
}

// Function to add a new quote and update the DOM and localStorage
function addQuote() {
  let newQuoteText = document.getElementById('newQuoteText').value;
  let newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    let newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    if (!categories.includes(newQuoteCategory)) {
      categories.push(newQuoteCategory); // Add new category to the array
    }

    saveQuotes();
    populateCategories(); // Update the dropdown with the new category
    filterQuotes();
    postQuoteToServer(newQuote); // Post the new quote to the server
    alert("New quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Manual conflict resolution option
function resolveConflictManually() {
  alert("Manual conflict resolution initiated. Please handle conflicts as needed.");
  document.getElementById('notification').style.display = 'none'; // Hide notification
  document.getElementById('resolveConflict').style.display = 'none'; // Hide button
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

// Initialize the application
loadQuotes();
createAddQuoteForm();
populateCategories();
filterQuotes();

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Periodically sync with server (e.g., every 10 seconds)
setInterval(fetchQuotesFromServer, 10000); // 10 seconds interval
