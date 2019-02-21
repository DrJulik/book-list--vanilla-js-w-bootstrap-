class Book {
  constructor (title, author, isbn,read) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
    this.read = read;
  }
}

class UI {
  addBookToList(book){

    // read checkbox conversion
    if (book.read === true) {
      book.read = "Yes"
    } else {
      book.read = "No"
    }

    const list = document.getElementById('book-list');
    // create tr element
    const row = document.createElement('tr');
    // append class name
    row.className = 'book-entry';
    // insert col
    row.innerHTML = `
    <td class="item">${book.title}</td>
    <td class="item">${book.author}</td>
    <td class="item">${book.isbn}</td>
    <td class="item">${book.read}</td>
    <td><a href="#" class="delete">X<a></td>
    `;

    list.appendChild(row);
  
  }

  showAlert(message, className) {
    // create div
  const div = document.createElement('div');
  // add classes
  div.className = `alert ${className}`;
  // add text
  div.appendChild(document.createTextNode(message));
  // get parent
  const container = document.querySelector('.container');

  const form = document.querySelector('#book-form');

  container.insertBefore(div, form);

  // timeout after 3s
  setTimeout(function(){
    document.querySelector('.alert').remove();
  }, 3000)
  }

  deleteBook(target){
    if(target.className === 'delete'){
      target.parentElement.parentElement.remove();
    }
}

  filterBooks(n,inputField) {

    function filterB() {
      // vars
      let i,
        input = inputField,
        filter = input.value.toUpperCase(),
        bookList = document.getElementById('book-list'),
        bookRow = bookList.getElementsByClassName('book-entry');

      // loop through rows
      for (i = 0; i < bookRow.length; i++) {
        let td = bookRow[i].getElementsByClassName("item")[n];

        
      if (td) {
        let txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        bookRow[i].style.display = "";
      } else {
        bookRow[i].style.display = "none";
      }
      }
    }
    }
    filterB();
}

sortBooks(n) {
  function sortT(){
    // vars
    let table = document.getElementById('table'),
        i,
        x,
        y,
        shouldSwitch,
        switchCount = 0,
        rows = document.getElementsByClassName('book-entry'),
        switching = true;
    //sorting direction to ascending:
    let dir = "asc"; 
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (i = 0; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByClassName("item")[n];
        y = rows[i + 1].getElementsByClassName("item")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchCount ++; 
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchCount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  } 
  sortT();
    }

  

clearFields() {
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
  document.getElementById('isbn').value = '';
  document.getElementById('read').checked = false;
  }
}

// local storage class
class Store {
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books; 
  }

  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function(book){
      const ui = new UI;

      // add book to UI
      ui.addBookToList(book);
    });
  }

  static addBook(book){
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn){
    const books = Store.getBooks();

    books.forEach(function(book,index){
    if(book.isbn === isbn){
      books.splice(index, 1);
    }
  });

  localStorage.setItem('books', JSON.stringify(books));
}
}
// DOM load event
document.addEventListener('DOMContentLoaded', Store.displayBooks);
// Event Listeners for addBook

document.getElementById('book-form').addEventListener('submit', function(e){
  const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value,
        read = document.getElementById('read').checked;

  const book = new Book(title, author, isbn, read);

  const ui = new UI();

  // validate 
  if(title === '' || author === '' || isbn === '') {
    // error alert
    ui.showAlert('Please fill in all fields', 'error');
  } else {
  // Add book to list
  ui.addBookToList(book);

  // add to local storage
  Store.addBook(book);

  // show success
  ui.showAlert('Book added!', 'success');

  // clear fields
  ui.clearFields();

  } 

  
  e.preventDefault();
});


// search for Book title
document.getElementById('filter-title').addEventListener('keyup', function(){
  const ui = new UI;
  ui.filterBooks(0, document.getElementById('filter-title'));
})

// search for Book title
document.getElementById('filter-author').addEventListener('keyup', function(){
  const ui = new UI;
  ui.filterBooks(1, document.getElementById('filter-author'));
})

// search for Book title
document.getElementById('filter-isbn').addEventListener('keyup', function(){
  const ui = new UI;
  ui.filterBooks(2, document.getElementById('filter-isbn'));
})





// sort books by title
document.getElementById('book-title').addEventListener('click', function(){
  const ui = new UI;
  ui.sortBooks(0);
})
// sort books by author
document.getElementById('book-author').addEventListener('click', function(){
  const ui = new UI;
  ui.sortBooks(1);
})
// sort books by isbn
document.getElementById('book-isbn').addEventListener('click', function(){
  const ui = new UI;
  ui.sortBooks(2);
})


// event listener for delete
document.getElementById('book-list').addEventListener('click', function(e){

  const ui = new UI();

  // delete book
  ui.deleteBook(e.target);

  // remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);

  // show message
  ui.showAlert('Book removed', 'success');

  e.preventDefault();
});


