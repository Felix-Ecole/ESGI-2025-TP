const User = new ManageLocalStorage("users")

class ManageUser {
	constructor(name, pass) {
		this.name = name
		this.pass = pass
	}

	hashPass(password, ID) {
		let npass = Number(password.split("").map((x) => `${x.charCodeAt()}`).join(""))
		return `${(npass * ID) % 1000000000}`
	}

	login() {
		let user = User.get(this.name)
		if (user && user.pass == this.hashPass(this.pass, user.date)) { return [true, "Connexion réussite !"] }
		return [false, "Utilisateur ou mot de passe incorrecte !"]
	}

	register() {
		for (let user in User.get()) { if (this.name == user) { return [false, "Le nom d'utilisateur existe déjà !"] } }
		let ID = Date.now(); User.set(this.name, {"date": ID, "pass": this.hashPass(this.pass, ID)})
		return [true, "Compte créer !"]
	}
}

// ------------------------------------------------------------------------------------------------------------------------
// Display and style for login/register window.
// ------------------------------------------------------------------------------------------------------------------------
const authInput = document.querySelectorAll("#auth-modal input")
authInput[0].onfocus = (e) => { if (e.target.value) authInput[1].focus(); authInput[0].onfocus = null }
$("#auth-modal").modal({closable: false})
$("#auth-modal").modal("show")

// Login/Register system verification.
const authModal = document.querySelector("#auth-modal")
authModal.onsubmit = (e) => {
	e.preventDefault(); let [user, pass] = e.target.querySelectorAll("input")

	// Login button
	if (e.submitter.id == "register-btn") {
		var result = new ManageUser(user.value, pass.value).register()
	}

	// Register button
	if (e.submitter.id == "login-btn") {
		var result = new ManageUser(user.value, pass.value).login()
		if (result[0]) { TaskManager = new ManageTask(user.value); $("#auth-modal").modal("hide") }
	}

	notif((result[0]) ? "success" : "error", result[1])
}
// ------------------------------------------------------------------------------------------------------------------------
