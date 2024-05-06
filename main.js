document.addEventListener('DOMContentLoaded', () => {
  const inputBookForm = document.getElementById('inputBook');
  const searchBookForm = document.getElementById('searchBook');
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  inputBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
  });

  searchBookForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchBook();
  });

  function addBook() {
    const id = new Date().getTime();
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const yearInput = document.getElementById('inputBookYear').value;
    const year = parseInt(yearInput, 10);
    const isComplete = document.getElementById('inputBookIsComplete').checked;

    const book = {
      id,
      title,
      author,
      year,
      isComplete,
    };
    console.log(book);

    isComplete ? addToCompleteBookshelfList(book) : addToIncompleteBookshelfList(book);

    updateLocalStorage();
    inputBookForm.reset();
  }

  function addToIncompleteBookshelfList(book) {
    const bookItem = createBookItem(book, true);
    incompleteBookshelfList.appendChild(bookItem);
  }

  function addToCompleteBookshelfList(book) {
    const bookItem = createBookItem(book, false);
    completeBookshelfList.appendChild(bookItem);
  }

  function createBookItem(book, isIncomplete) {
    const bookItem = document.createElement('article');
    bookItem.className = 'book_item';

    if (book.id) {
      bookItem.id = `book_${book.id}`;
    }

    const titleElement = document.createElement('h3');
    titleElement.innerText = book.title;

    const authorElement = document.createElement('p');
    authorElement.innerText = `Penulis: ${book.author}`;

    const yearElement = document.createElement('p');
    yearElement.innerText = `Tahun: ${book.year}`;

    const actionElement = document.createElement('div');
    actionElement.className = 'action';

    const toggleButton = document.createElement('button');
    toggleButton.className = 'green';
    toggleButton.innerText = isIncomplete ? 'Selesai dibaca' : 'Belum Selesai dibaca';
    toggleButton.addEventListener('click', function () {
      toggleBookStatus(book, isIncomplete);
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'red';
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', function () {
      deleteBook(book, isIncomplete);
    });

    actionElement.appendChild(toggleButton);
    actionElement.appendChild(deleteButton);

    bookItem.appendChild(titleElement);
    bookItem.appendChild(authorElement);
    bookItem.appendChild(yearElement);
    bookItem.appendChild(actionElement);

    return bookItem;
  }

  function toggleBookStatus(book, isIncomplete) {
    if (isIncomplete) {
      removeFromIncompleteBookshelfList(book);
      addToCompleteBookshelfList(book);
    } else {
      removeFromCompleteBookshelfList(book);
      addToIncompleteBookshelfList(book);
    }

    updateLocalStorage();
  }

  function deleteBook(book, isIncomplete) {
    isIncomplete ? removeFromIncompleteBookshelfList(book) : removeFromCompleteBookshelfList(book);
    updateLocalStorage();
  }

  function removeFromIncompleteBookshelfList(book) {
    const bookItem = findBookItem(book, true);
    if (bookItem) {
      incompleteBookshelfList.removeChild(bookItem);
    }
  }

  function removeFromCompleteBookshelfList(book) {
    const bookItem = findBookItem(book, false);
    if (bookItem) {
      completeBookshelfList.removeChild(bookItem);
    }
  }

  function findBookItem(book, isIncomplete) {
    const bookshelfList = isIncomplete ? incompleteBookshelfList : completeBookshelfList;
    const bookItems = bookshelfList.getElementsByClassName('book_item');
    for (const item of bookItems) {
      const titleElement = item.querySelector('h3');
      if (titleElement.innerText === book.title) {
        return item;
      }
    }
    return null;
  }

  function searchBook() {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();

    const allBooks = Array.from(incompleteBookshelfList.children).concat(Array.from(completeBookshelfList.children));

    allBooks.forEach((bookItem) => {
      const titleElement = bookItem.querySelector('h3');
      const title = titleElement.innerText.toLowerCase();

      title.includes(searchTitle) ? (bookItem.style.display = 'block') : (bookItem.style.display = 'none');
    });
  }

  function updateLocalStorage() {
    const incompleteBooks = getBooksFromBookshelfList(incompleteBookshelfList);
    const completeBooks = getBooksFromBookshelfList(completeBookshelfList);

    incompleteBooks.forEach((book) => (book.year = parseInt(book.year, 10)));
    completeBooks.forEach((book) => (book.year = parseInt(book.year, 10)));

    localStorage.setItem('incompleteBooks', JSON.stringify(incompleteBooks));
    localStorage.setItem('completeBooks', JSON.stringify(completeBooks));
  }

  function getBooksFromBookshelfList(bookshelfList) {
    const books = [];
    const bookItems = bookshelfList.getElementsByClassName('book_item');
    for (const item of bookItems) {
      const titleElement = item.querySelector('h3');
      const authorElement = item.querySelector('p:nth-child(2)');
      const yearElement = item.querySelector('p:nth-child(3)');
      const isComplete = item.querySelector('button.green').innerText === 'Selesai dibaca';

      const book = {
        id: item.id.replace('book_', ''),
        title: titleElement.innerText,
        author: authorElement.innerText.replace('Penulis: ', ''),
        year: yearElement.innerText.replace('Tahun: ', ''),
        isComplete: isComplete,
      };

      books.push(book);
    }
    return books;
  }

  function loadBooksFromLocalStorage() {
    const incompleteBooks = JSON.parse(localStorage.getItem('incompleteBooks')) || [];
    const completeBooks = JSON.parse(localStorage.getItem('completeBooks')) || [];

    incompleteBooks.forEach((book) => addToIncompleteBookshelfList(book));
    completeBooks.forEach((book) => addToCompleteBookshelfList(book));
  }

  loadBooksFromLocalStorage();
});
