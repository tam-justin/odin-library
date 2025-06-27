const bookSection = document.querySelector(".book-section");
const addBookButton = document.querySelector(".addBook-button");
const newBookDialog = document.querySelector(".newBook-dialog");
const closeForm = document.querySelector(".close-button");
const submitFormButton = document.querySelector("#form-submit");
const newBookForm = document.querySelector(".book-form");
const removeBookButton = document.querySelector(".remove-button");
const emptyLibraryText = document.querySelector("#library-empty");
const questionButton = document.querySelector(".question-mark");
const faqText = document.querySelector(".how-to");

let libraryEmpty = true;

questionButton.addEventListener('mouseenter', () => {
    faqText.classList.remove('hidden');
})

questionButton.addEventListener('mouseleave', () => {
    faqText.classList.add('hidden');
})

addBookButton.addEventListener("click", () => {
    newBookDialog.showModal();
})

newBookDialog.addEventListener("close", () => {
    newBookDialog.close()
    newBookForm.reset();
})

closeForm.addEventListener("click", () => {
    newBookDialog.close()
    newBookForm.reset();
})

submitFormButton.addEventListener("click", (event) => {
    if(!newBookForm.checkValidity()){
        event.preventDefault();
        newBookForm.reportValidity();
        return;
    }

    const bookTitle = newBookForm.elements['bookTitle'].value;
    const bookAuthor = newBookForm.elements['bookAuthor'].value;
    const pageCount = newBookForm.elements['pageCount'].value;
    const bookStatus = newBookForm.elements['bookStatus'].checked;
    console.log(bookStatus);

    addBookToLibrary(bookTitle, bookAuthor, pageCount, bookStatus);

    newBookDialog.close();
    newBookForm.reset();
})

let library = [];

function Book(title, author, pages, status){
    if(status){
        status = "read";
    }else{
        status = "unread";
    }
    
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

function addBookToLibrary(title, author, pages, status){
    let temp = new Book(title, author, pages, status);
    library.push(temp);
    
    libraryEmpty = false;
    displayBooks();
}

function cardButtonEvent(event){
    if(event.target.tagName === "BUTTON"){
        if(event.target.className == "status-button"){
            const id = event.currentTarget.id;
            for(let i = 0; i < library.length; i++){
                const book = library[i];
                if(id == book.id){
                    book.status = (book.status == "read" ? "unread" : "read");
                    updateStatus(event.currentTarget, book.status);
                }
            }
        }else if (event.target.className == "remove-button"){
            const card = event.currentTarget;
            library = library.filter(book => book.id !== card.id);   
            card.remove();
            if(library.length == 0){
                libraryEmpty = true;
            }
            displayBooks();
        }
    }
}

function updateStatus(card, newStatus){
    const statusText = card.querySelector(".book-status");
    statusText.classList.remove(newStatus == "read" ? "unread" : "read");
    statusText.classList.add(newStatus);
    statusText.textContent = `status: ${newStatus}`;
}


function displayBooks(){
    bookSection.innerHTML = "";

    if(libraryEmpty){
        bookSection.classList.add('hidden');
        emptyLibraryText.classList.remove('hidden');
    }else{
        emptyLibraryText.classList.add('hidden');
        bookSection.classList.remove('hidden');
    }

    for(let i = 0; i < library.length; i++){
        const book = library[i];

        const newCard = document.createElement("div");
        newCard.classList.add("card");
        bookSection.appendChild(newCard)
        newCard.id = book.id;

        const bookTitle = document.createElement("div");
        bookTitle.classList.add("book-title");
        bookTitle.textContent = book.title;

        const bookAuthor = document.createElement("div");
        bookAuthor.classList.add("book-author");
        bookAuthor.textContent = book.author;

        const pageCount = document.createElement("div");
        pageCount.classList.add("page-count");
        pageCount.textContent = `${book.pages} Pages`;

        const bookStatus = document.createElement("div");
        bookStatus.classList.add("book-status");
        bookStatus.textContent = `status: ${book.status}`;
        bookStatus.classList.add((book.status == "read" ? "read" : "unread"));

        const changeStatusBtn = document.createElement("button");
        changeStatusBtn.classList.add("status-button");
        changeStatusBtn.textContent = "Change Status";

        const removeCardBtn = document.createElement("button");
        removeCardBtn.classList.add("remove-button");
        removeCardBtn.textContent = "Remove"

        newCard.appendChild(bookTitle);
        newCard.appendChild(bookTitle);
        newCard.appendChild(bookAuthor);
        newCard.appendChild(pageCount);
        newCard.appendChild(changeStatusBtn);
        newCard.appendChild(bookStatus);
        newCard.appendChild(removeCardBtn);

        newCard.addEventListener("click", cardButtonEvent);
    }
}

displayBooks();

addBookToLibrary("Crazy Rich Asians", "Kevin Kwan", "536", "read");