class LS {
	constructor(name) { this.name = name; this.set(this.get()) }
	get() { return (localStorage[this.name]) ? JSON.parse(localStorage[this.name]) : {} }
	set(value) { return Boolean(localStorage[this.name] = JSON.stringify(value)) }
}

class ManageLocalStorage {
	constructor(name) { this.LS = new LS(name) }

	get(ID) { return (ID) ? this.LS.get()[ID] : this.LS.get() }
	set(ID, value) { return (ID) ? this.LS.set({...this.LS.get(), ...{[ID]: value}}) : false }

	create(value) { let ID = Date.now(); return (value) ? [this.set(ID, value), ID][1] : false }
	delete(ID) { return (ID) ? this.set(ID) : this.LS.set({}) }
}
