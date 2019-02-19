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

filterBooks() {

  document.getElementById('filter').addEventListener('keyup', function(){

    // vars
    let i,
      input = document.getElementById('filter'),
      filter = input.value.toUpperCase(),
      bookList = document.getElementById('book-list'),
      bookRow = bookList.getElementsByClassName('book-entry');

    // loop through
    for (i = 0; i < bookRow.length; i++) {
      let td = bookRow[i].getElementsByTagName("td")[0];
      // let td1 = bookRow[i].getElementsByTagName("td")[1];
      // let td2 = bookRow[i].getElementsByTagName("td")[2];
      
    if (td) {
      let txtValue = td.textContent || td.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      bookRow[i].style.display = "";
    } else {
      bookRow[i].style.display = "none";
    }
    }

    // if (td1) {
    //   let txtValue = td1.textContent || td1.innerText;
    // if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //   bookRow[i].style.display = "";
    // } else {
    //   bookRow[i].style.display = "none";
    // }
    // }

    // if (td2) {
    //   let txtValue = td2.textContent || td2.innerText;
    // if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //   bookRow[i].style.display = "";
    // } else {
    //   bookRow[i].style.display = "none";
    // }
    // }
   }
  //  console.log(a);
    
    
  })

}

// sortBooks () {

// }

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


// filter Books
const ui = new UI;
ui.filterBooks();

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


