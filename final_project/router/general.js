const axios = require('axios');

// Task 10: Get the list of books available
async function getBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Task 10 - All books:", response.data);
    } catch (error) {
        console.error("Error fetching books:", error.message);
    }
}

// Task 11: Get book details based on ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Task 11 - Book details for ISBN ${isbn}:`, response.data);
    } catch (error) {
        console.error(`Error fetching book by ISBN ${isbn}:`, error.message);
    }
}

// Task 12: Get book details based on Author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Task 12 - Books by author ${author}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
    }
}

// Task 13: Get book details based on Title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Task 13 - Books with title ${title}:`, response.data);
    } catch (error) {
        console.error(`Error fetching books with title ${title}:`, error.message);
    }
}

// Call the functions (example usage)
(async () => {
    await getBooks();
    await getBookByISBN('12345');      // replace with actual ISBN
    await getBooksByAuthor('John Doe'); // replace with actual author
    await getBooksByTitle('Learn JS');  // replace with actual title
})();
