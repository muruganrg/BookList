//represent books
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// handle table tasks
class Table {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => {
      Table.addBookToList(book);
    });
  }
  static addBookToList(book) {
    const list = document.getElementById("book-list");

    const row = document.createElement("tr");

    row.innerHTML = `<td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td> <a href="#" class="btn btn-danger btn-sm delete">X</a> </td>`;

    list.appendChild(row);
  }

  static deleteBook(target) {
    if (target.classList.contains("delete")) {
      target.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.getElementById("book-form");
    container.insertBefore(div, form);

    //delete in 2 seconds
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }

  static clearFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }
}
//store in local storage
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

//display book
document.addEventListener("DOMContentLoaded", Table.displayBooks);

//add a book
document.getElementById("book-form").addEventListener("submit", (e) => {
  //prevent actual submit
  e.preventDefault();
  //get form values
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const isbn = document.getElementById("isbn").value;

  //validate fields
  if (title === "" || author === "" || isbn === "") {
    Table.showAlert("Fill all the fields", "danger");
  } else {
    //Instantiate book
    Table.showAlert("Book is added successfully", "success");
    const book = new Book(title, author, isbn);

    //add book to table
    Table.addBookToList(book);

    //store book in local storage
    Store.addBook(book);

    //clear fields

    Table.clearFields();
  }
});

//event:remove a book
document.getElementById("book-list").addEventListener("click", (e) => {
  //remove book from table
  Table.deleteBook(e.target);

  //remove book from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  //message on top of the screen
  Table.showAlert("Book is deleted successfully", "success");
});
