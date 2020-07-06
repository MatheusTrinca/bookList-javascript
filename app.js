// Book Constructor
class Book{
    constructor(titulo, autor, isbn){
        this.titulo = titulo;
        this.autor = autor;
        this.isbn = isbn;
    }
}

// UI Constructor
class UI{
    addBookToList(book){
        const list = document.getElementById('book-list');
        // Criar elemento tr
        const row = document.createElement('tr');
        // addicionar colunas (td)
        row.innerHTML = `
            <td>${book.titulo}</td>
            <td>${book.autor}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        `;
        list.appendChild(row);
    }

    clearFields(){
        document.getElementById('titulo').value = '',
        document.getElementById('autor').value = '',
        document.getElementById('isbn').value = '';
    }

    showAlert(message, className){
        // criando div
        const div = document.createElement('div');
        // add nome da classe alert + ...
        div.className = `alert ${className}`;
        // add mensagem
        div.appendChild(document.createTextNode(message));
        // pegando elemento pai
        const container = document.querySelector('.container');
        // pegando para fazer before
        const form = document.getElementById('book-form');
        container.insertBefore(div, form);

        // Remover apos 3 segundos
        setInterval(function(){
            const alert = document.querySelector('.alert');
            if(alert !== null){
                alert.remove();
            }
        }, 4000)
    }

    deleteBook(target){
        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

};

class Store{

    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Store.getBooks();
        books.forEach(function(book){
            const ui = new UI();
            ui.addBookToList(book);
        })

    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book, index){
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Dom load evend
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener
document.getElementById('book-form').addEventListener('submit',function(e){
    const titulo = document.getElementById('titulo').value,
          autor = document.getElementById('autor').value,
          isbn = document.getElementById('isbn').value;
    
    // Instanciando book
    const book = new Book(titulo, autor, isbn);

    // Intanciando UI
    const ui = new UI();

    // validando
    if(titulo === '' || autor === '' || isbn === ''){
        // Alerta de error
        ui.showAlert('Por favor preencha todos os campos', 'error');
    }else{
        // adidicionando livro a lista
        ui.addBookToList(book);
        // salvando no localStorage
        Store.addBook(book);
        // Alerta success
        ui.showAlert('Livro adicionado com sucesso', 'success');
        // Limpar campos
        ui.clearFields();
    }
    e.preventDefault();
});

// Eventlistener para delete
document.getElementById('book-list').addEventListener('mouseup', function(e){
    const ui = new UI();

    ui.deleteBook(e.target);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    ui.showAlert('Livro removido', 'success');

    e.preventDefault();
})