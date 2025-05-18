// display notification (https://github.com/psyll/Noty-JS)
function notif(type, text) {
	if (["information", "success", "error"].includes(type)) {
		if (type == "information") var icon = '<i class="info circle icon"></i>'
		if (type == "success") var icon = '<i class="check circle icon"></i>'
		if (type == "error") var icon = '<i class="times circle icon"></i>'
		text = 
		new Noty({
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

// Display task research result.
document.querySelector("#find-task input").onkeyup = (e) => {
	TaskManager.display(TaskManager.filter(e.target.value))
}

// Delete all task.
document.querySelector("#task-del-modal").onsubmit = (e) => {
	e.preventDefault(); TaskManager.delete(); TaskManager.display()
}

// Delete completed task.
document.querySelector("#task-end-modal").onsubmit = (e) => {
	Object.entries(TaskManager.get()).forEach((e) => { if (e[1].checked) TaskManager.delete(e[0]) })
	e.preventDefault(); TaskManager.display()
}

// Create new task.
document.querySelector("#task-add-modal").onsubmit = (e) => {
	e.preventDefault(); let input = e.target.querySelector("input")
	TaskManager.set({"title": input.value, "checked": false})
	TaskManager.display(); input.value = ""
}

// Edit existant task (interface).
function editTask(ID) {
	let inputs = document.querySelectorAll("#task-edit-modal input")
	inputs[0].value=ID; inputs[1].value=TaskManager.get(ID).title
	$("#task-edit-modal").modal("show")
}

// Edit existant task (submit).
document.querySelector("#task-edit-modal").onsubmit = (e) => {
	e.preventDefault(); let inputs = e.target.querySelectorAll("input")
	TaskManager.set({"title": inputs[1].value}, inputs[0].value)
	TaskManager.display();
}

// Delete individual task (interface).
function delTask(ID) {
	let input = document.querySelector("#task-del-ID-modal input")
	input.value = ID; $("#task-del-ID-modal").modal("show")
}

// Delete individual task (submit).
document.querySelector("#task-del-ID-modal").onsubmit = (e) => {
	e.preventDefault(); let input = e.target.querySelector("input")
	TaskManager.delete(input.value); TaskManager.display()
}

// Individual task action.
function checkTask(e, ID) { TaskManager.set({"checked": e.checked}, ID) }

// ------------------------------------------------------------------------------------------------------------------------
