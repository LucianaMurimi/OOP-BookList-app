/*An object is the heart of OOP.
An object has properties and methods.

A class is the blueprint of an object
An object constructor is called each time an object is created.
The object constructor function is used to define and initialize objects and their features*/

class Book {
    constructor(bookArr){
        this.title = bookArr[0];
        this.author = bookArr[1];
        this.id = new Date().getTime();
    }       
}
class UI {
    static addBookToList() {
        //1. Get the array of books from localStorage
        let books = Store.getBooks();   
    
        //2. Get the ul to attach the li elements
        let ul = document.querySelector('.books');
        ul.innerHTML = ' ';
        //3. Loop through each element in the array creating a list item
        for(let i in books){
            let li = document.createElement('li');
            li.setAttribute("id", `${books[i].id}`);
            li.innerHTML = (`
                ${books[i].title} by ${books[i].author}
                <span class="delete"><i class="fa fa-trash"></i></span>
            `);
            ul.append(li);
        }        
    }
    static listenForDelete() {
        let listItems = document.querySelectorAll('.delete');
        let books = Store.getBooks();  

        for (let item of listItems){
            item.addEventListener("click", (e)=>{
                let deleteItemID = e.target.closest('li').id;

                let arrIndex = books.findIndex(book => book.id == deleteItemID);
                books.splice(arrIndex, 1);
                //step 4. reset the `completedItems` localStorage to reflect only the remaining completed tasks
                localStorage.removeItem('books');
                localStorage.setItem('books', JSON.stringify(books));
               
                let elem = e.target.closest('li');
                elem.parentNode.removeChild(elem);
            });
        }
       
        //UI.addBookToList()
    }
}

class Store {
    //1. get the books from the localStorage
    static getBooks() {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        return books;
    }
    //2. add the book to localStorage
    static addBook(book) {
        let books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
}


//Listen for an add event
document.querySelector('.add').addEventListener('click', (e)=>{
    let bookEntry = document.getElementById('book-id').value;
    
    if(bookEntry !== ''){
        let bookEntryArr = bookEntry.split(',').map(item=>item.trim()); /*[0->title, 1->author]*/
        const bookListEntry = new Book(bookEntryArr);
        console.log(bookListEntry);

        //1. add book to store
        Store.addBook(bookListEntry);
        //2. add book to list on the UI
        UI.addBookToList(bookListEntry);
    }

});


//Load the booklist on loading content
document.addEventListener('DOMContentLoaded', ()=>{
    UI.addBookToList();
    UI.listenForDelete();
});



