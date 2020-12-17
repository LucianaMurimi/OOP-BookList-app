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
                ${books[i].title} <span class="author">by ${books[i].author}<span>
                <span class="delete"><i class="fa fa-trash"></i></span>
            `);
            ul.append(li);
        }        
    }
    static createSearchList() {
        let searchItem = document.getElementById('searchID').value;
        
        if(searchItem !== ''){
            let books = Store.getBooks();
            let searchRes = books.filter(book=>book.title.toUpperCase().includes(searchItem.toUpperCase()) || 
                                                book.author.toUpperCase().includes(searchItem.toUpperCase()));
            
            let ul = document.querySelector('.search-results');
            ul.innerHTML = ' ';
            
            if(searchRes == ''){
                let p = document.createElement('p');
                p.innerHTML = (`
                    No such record as ${searchItem} in the book list.
                `);
                ul.append(p);
            }else {
                //Loop through each element in the array creating a list item
                for(let i in searchRes ){
                    let li = document.createElement('li');
                    li.setAttribute("id", `${searchRes[i].id}`);
                    li.innerHTML = (`
                        ${searchRes[i].title} <span class="author">by ${searchRes[i].author}<span>
                    `);
                    ul.append(li);
                }
            }       
        }
        function closeAllLists(){
            //close all autocomplete lists in the document,
            let x = document.querySelector(".search-results");
            for (let i = 0; i < x.length; i++) {
                x[i].removeChild(x[i]);
            }
        }
        /*also, close all lists when someone clicks anywhere elese on the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
        
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
    static searchList() {
        let books = Store.getBooks();
        let titleArr = books.map(book=>book.title);
        let authorArr = books.map(book=>book.author);
        let booksArr = titleArr.concat(authorArr); 
        return booksArr;
    }
    static autocomplete(inp, arr){
        /*the autocomplete function takes two arguments => 1.   the text field element
                                                            2.  an array of possible autocompleted values
        */
       
        /*execute a function when someone writes in the text field:*/
        
        inp.addEventListener('input', e => {
            let ul, liItem, val = e.target.value;
            //console.log(e.target.value)
            
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            let unli = document.querySelector('.search-results');
            unli.innerHTML = ' ';

            if (!val) { return false;}  //if there is no value entered, exit; do not show any list
            
            /*create a div element that will contain the li items/values i.e
            <div id = "searchIDautocomplete-list" class="autocomplete-items">
            </div>
            */
            ul = document.createElement('div');
            ul.setAttribute("class", "autocomplete-items");
            e.target.parentNode.appendChild(ul);

            /*for each item in the array...*/
            for (let i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a li element for each matching element:*/
                    liItem = document.createElement('li');
                    liItem.setAttribute('class', 'litems');

                    /*make the matching letters bold:*/
                    liItem.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    liItem.innerHTML += arr[i].substr(val.length);   /*concatenate it with the rest of the string*/
                    //console.log(arr[i]);
                    
                    /*insert a input field that will hold the current array item's value:*/
                    liItem.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    
                    liItem.addEventListener("click", e=>{
                    /*insert the value for the autocomplete text field:*/
                        inp.value = e.target.innerText;
                        //then, close the list of autocompleted values
                        closeAllLists();
                    });
                    ul.appendChild(liItem);
                }
            }
        });
        function closeAllLists(){
            //close all autocomplete lists in the document,
            let x = document.getElementsByClassName("autocomplete-items");
            
            for (let i = 0; i < x.length; i++) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
        /*also, close all lists when someone clicks anywhere elese on the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });

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


/*on document load: 1.  create the booklist
                    2.  listen for delete events
                    3.  listen for search events*/
document.addEventListener('DOMContentLoaded', ()=>{
    UI.addBookToList();
    UI.listenForDelete();
    //Store.autocomplete(theInput, theArray)
    Store.autocomplete(document.getElementById('searchID'), Store.searchList());
});



