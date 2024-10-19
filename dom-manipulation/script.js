// script.js

// Array of quote objects with text and category properties
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" },
  ];
  
  // Function to display a random quote from the quotes array
  function showRandomQuote() {
    // Select a random quote
    let randomIndex = Math.floor(Math.random() * quotes.length);
    let randomQuote = quotes[randomIndex];
  
    // Display the quote in the quoteDisplay div
    let quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
  }
  
  // Add event listener to the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Function to add a new quote to the array and update the DOM
  function addQuote() {
    // Get the new quote text and category from the input fields
    let newQuoteText = document.getElementById('newQuoteText').value;
    let newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    // Ensure both inputs have values
    if (newQuoteText && newQuoteCategory) {
      // Create a new quote object and push it to the quotes array
      let newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
  
      // Clear the input fields after adding the quote
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      // Optionally, show a message confirming the quote was added
      alert("New quote added!");
  
      // Display the newly added quote immediately
      let quoteDisplay = document.getElementById('quoteDisplay');
      quoteDisplay.innerHTML = `<p>"${newQuote.text}" - <em>${newQuote.category}</em></p>`;
    } else {
      // If inputs are missing, show an alert
      alert("Please enter both a quote and a category.");
    }
  }
  