const Task = new ManageLocalStorage("tasks")

class ManageTask {
	constructor(username) {
		this.taskList = document.querySelector("#task-list")
		if (!Task.get(username)) Task.set(username, {})
		this.name = username
		this.display()
	}

	get(ID) { let r=Task.get(this.name); return ID ? r[ID] : r }

	delete(ID) {
		return this.get(ID) ? Task.set(this.name, ID ? {...this.get(), ...{[ID]: undefined}} : {}) : false
	}

	set(data, ID=Date.now()) {
		return data ? Task.set(this.name, {...Task.get(this.name), ...{[ID]: {...this.get(ID), ...data}}}) : false
	}
	
	filter(term) {
		let r=Task.get(this.name)
		for (let [key, val] of Object.entries(r)) { if (!val.title.toLowerCase().includes(term)) delete r[key] }
		return r
	}

	display(data=Task.get(this.name)) {
		// Erase old displayed data.
		this.taskList.innerHTML = ""

		// If not task, when, display message.
		if (!Object.keys(data).length) {
			this.taskList.innerHTML += `
				<div class="ui icon warning message">
					<i class="inbox icon"></i>
					<div class="content">
						<div class="header">Vous n'avez aucune tâche à compléter !</div>
						<div>Ajouter de nouvelle tâche ci-dessus.</div>
					</div>
				</div>
			`
		} else {
			// Else, display all task and status (checked or not).
			for (let [key, val] of Object.entries(data)) {
				this.taskList.innerHTML += `
					<li class="ui segment grid equal width">
						<div class="ui checkbox column">
							<input type="checkbox" id="${key}" onchange="checkTask(this, ${key})" ${val.checked ? "checked":""}>
							<label for="${key}">${val.title}</label>
						</div>
						<div class="column">
							<i onclick="editTask(${key})" class="edit outline icon"></i>
							<i onclick="delTask(${key})" class="trash alternate outline icon"></i>
						</div>
					</li>
				`
			}
		}
	}
}
