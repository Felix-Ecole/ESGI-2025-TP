import {Book, BookDB, Library, displayManager} from "./tools/modulus.js"

const display = new displayManager()
window["BookDB"] = BookDB
window["Book"] = Book

window["testDB"] = () => {
	BookDB.create(new Book({title: "Pourquoi un leader doit être exemplaire", author: "Tessa Melkonian"}))
	BookDB.create(new Book({title: "L'homme qui plantait des arbres", author: "Jean Giono"}))
	BookDB.create(new Book({title: "Le Harcèlement moral : la violence perverse au quotidien", author: "Marie-France Hirigoyen"}))
	BookDB.create(new Book({title: "Anti-fautes : Anglais", author: "Larousse"}))
}

// ------------------------------------------------------------------------------------------------------------------------

// display notification (https://github.com/psyll/Noty-JS)
function notif(type, text) {
	if (["information", "success", "error"].includes(type)) {
		if (type == "information") var icon = '<i class="info circle icon"></i>'
		if (type == "success") var icon = '<i class="check circle icon"></i>'
		if (type == "error") var icon = '<i class="times circle icon"></i>'
		text = new Noty({
			theme: "metroui", layout: "bottomRight",
			progressBar: true, timeout: 2000,
			type, text: icon + text,
			closeWith: ["click"]
		}).show()
	} else {
		throw Error("Bad type!")
	}
}

// ------------------------------------------------------------------------------------------------------------------------

// Display book research result.
document.querySelector("#find-book input").onkeyup = (e) => {
	display.filter(e.target.value)
}


// Create new book.
document.querySelector("#book-add-modal").onsubmit = (e) => {
	e.preventDefault(); let [title, author] = e.target.querySelectorAll("input")
	if (title.value && author.value) {
		Library.addBook(new Book({title: title.value, author: author.value}))
		new displayManager(); title.value = ""; author.value = ""
		$("#book-add-modal").modal("hide")
	}
}


// Edit existant book (interface).
window["editBook"] = (ID) => {
	let inputs = document.querySelectorAll("#book-edit-modal input")
	let book = BookDB.read(ID)

	inputs[0].value = ID
	inputs[1].value = book.title
	inputs[2].value = book.author

	$("#book-edit-modal").modal({onApprove: ()=>{return false}}).modal("show")
}

// Edit existant book (submit).
document.querySelector("#book-edit-modal").onsubmit = (e) => {
	e.preventDefault(); let [ID, title, author] = e.target.querySelectorAll("input")
	if (title.value && author.value) {
		BookDB.update(new Book({ID: ID.value, title: title.value, author: author.value}))
		new displayManager(); $("#book-edit-modal").modal("hide")
	}
}


// Delete all book.
document.querySelector("#book-del-modal").onsubmit = (e) => {
	e.preventDefault(); BookDB.ERASE(true); new displayManager()
}


// Delete individual book (interface).
window["delBook"] = (ID) => {
	let input = document.querySelector("#book-del-ID-modal input")
	input.value = ID; $("#book-del-ID-modal").modal("show")
}

// // Delete individual book (submit).
document.querySelector("#book-del-ID-modal").onsubmit = (e) => {
	e.preventDefault(); BookDB.delete(e.target.querySelector("input").value); new displayManager()
}

// ------------------------------------------------------------------------------------------------------------------------
