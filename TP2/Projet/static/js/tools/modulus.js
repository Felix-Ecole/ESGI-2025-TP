import {LSDB, Model} from "./LSDB.js"

export class Book extends Model {
	static schema = Object.freeze({
		title: [String, true],
		author: [String, true]
	})

	getDetails(title) {
		return `${this.title} (${this.author})`
	}
}

export const BookDB = new LSDB(Book)

export class Library {
	static findBookByTitle(title) {
		return this.listBooks().filter((x) => x.title.includes(title))
	}

	static addBook(book) {
		return BookDB.create(book)
	}

	static listBooks() {
		return BookDB.read().filter((x) => x)
	}
}

export class displayManager {
	constructor() {
		this.bookListElement = document.querySelector("#book-list")
		this.bookListElement.innerHTML = ""
		let dataBook = Library.listBooks()

		if (dataBook.length) {
			dataBook.forEach((x) => {
				this.bookListElement.innerHTML += `
					<li ID="book-${x.ID}" class="ui segment grid equal width">
						<div class="ui column">
							<p>${x.getDetails()}</p>
						</div>
						<div class="column">
							<i onclick="editBook(${x.ID})" class="edit outline icon"></i>
							<i onclick="delBook(${x.ID})" class="trash alternate outline icon"></i>
						</div>
					</li>
				`
			})
		} else {
			this.bookListElement.innerHTML += `
				<div class="ui icon warning message">
					<i class="inbox icon"></i>
					<div class="content">
						<div class="header">Vous n'avez aucun livre à afficher !</div>
					</div>
				</div>
			`
		}
	}

	filter(term) {
		[...this.bookListElement.children].forEach((x) => {
			x.style.display = (x.firstElementChild.innerText.includes(term)) ? "" : "none"
		})
	}
}
