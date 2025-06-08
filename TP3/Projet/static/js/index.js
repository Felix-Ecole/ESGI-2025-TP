// Importe les modules nécessaires (APIs et base de données interne).
import { Code_ISO_DB, PayPal_API, XE_API } from "./tools/API.js"

// Expose des modules dans l'objet "window" (pour le debugging).
Object.assign(window, { Code_ISO_DB, XE_API, PayPal_API })

// Ajoute une fonction d'arrondi à x décimales.
const round = (n, x) => Number(n.toFixed(x))

// ----------------------------------------------------------------------------------------------------=

// Récupère les données depuis l'API de XE sous forme de paires [code ISO, taux].
let XE_DATA = Object.entries(await XE_API.getData())


// Récupération et stock les codes ISO + noms des devises dans la table "Code_ISO" si celle-ci est vide.
if (!Code_ISO_DB.read().length) {

	// Ne conserve que les devises présentes dans les deux sources (Paypal et XE.com)
	let PayPal_DATA = (await PayPal_API.getData()).currencies.map(x => [x.value, x.primaryText])
	.filter(x => XE_DATA.map(x => x[0]).includes(x[0])).sort()

	for (let [key, val] of PayPal_DATA) {
		Code_ISO_DB.create(new Code_ISO_DB.model({ISO: key, Name: val}))
	}
}


// Ajoute la méthode "getRate" à l'API de XE pour obtenir un taux de conversion entre deux monnaies.
XE_API.getRate = (from, to) => {
	let rates = Object.fromEntries(XE_DATA.filter(x => [from, to].includes(x[0])))
	return [{[from]: 1, [to]: rates[to]/rates[from]}, {[to]: 1, [from]: rates[from]/rates[to]}]
}

// ----------------------------------------------------------------------------------------------------

// Préparation du DOM : Récupération des éléments de l'interface.
const selectSource = document.querySelector("[name=source]")
const inputValue   = document.querySelector("[name=value]")
const selectFrom   = document.querySelector("[name=from]")
const selectTo     = document.querySelector("[name=to]")

// Réinitialise la valeur initiale.
inputValue.value = ""

// ----------------------------------------------------------------------------------------------------

// Remplissage des sélecteurs de devises (monnaie d'origine et de destination).
Code_ISO_DB.read().sort((x, y) => x.Name > y.Name).forEach(x => {
	let option = `<option value="${x.ISO}">${x.Name}</option>`
	selectFrom.innerHTML += option
	selectTo.innerHTML += option
})

// Gestion de la saisie utilisateur : Bloque les touches non autorisé. 
inputValue.onkeypress = (e) => {
	if (!/[0-9]/.test(e.key)) { e.preventDefault() }
	if (!selectFrom.value || !selectTo.value) { e.preventDefault() }
}

// Gestion de la saisie utilisateur : Bloque la saisie lorsque l'interface n'est pas valide.
inputValue.onkeyup = (e) => {
	if (/Backspace|Delete|[0-9]/.test(e.key) && selectFrom.value && selectTo.value) updateDisplay()
}

// ----------------------------------------------------------------------------------------------------

// Défini la variable pour le taux PayPal.
let PayPalRate

// Fonction pour mettre à jour le taux de PayPal entre les deux devises sélectionnées.
// Si la devices sélectionnées n'est pas disponible, alors retourne un message d'erreur en texte.
async function updatePayPal() {
	try { PayPalRate = (await PayPal_API.getRate(selectFrom.value, selectTo.value))[0] }
	catch { return "La devise sélectionnée n'est pas supportée par cette plateforme." }
	return true
}


// Fonction pour mettre à jour l'affichage (le résultat de la conversion).
async function updateDisplay(p) {

	// Si toute les devises n'on pas été sélectionnée, alors, stop le processus.
	if (!selectFrom.value || !selectTo.value) return

	// Si "p" est vrai, alors, on met à jour le taux de PayPal.
	const p_status = p ? await updatePayPal() : true


	// Récupère les codes ISO des monnaies d'origine et de destination.
	const currencyCodes = [selectFrom.value, selectTo.value]

	// Récupère le montant que l'utilisateur souhaite convertir.
	const amount = Number(inputValue.value || 0)


	// Si la source sélectionnée est PayPal,
	if (selectSource.value === "PayPal") {

		// Alors, si le status est bon, alors, convertie le montant de l'utilisateur dans la monnaie souhaité.
		if (p_status === true) p_status = `${amount} ${from} = ${round(PayPalRate[to] * amount, 4)} ${to}`

		// Affiche le montant converti ou, le cas échéant, l'erreur PayPal.
		document.querySelector("h2").innerText = p_status
	}


	// Si la source est XE,
	if (selectSource.value === "XE") {

		// Alors, formate les données de XE.com
		const data = Object.fromEntries(XE_DATA)

		// Calcule et afficher montant souhaité de l'utilisateur dans la monnaie souhaité.
		document.querySelector("h2").innerText = `${amount} ${from} = ${round(data[to] / data[from] * amount, 4)} ${to}`
	}
}


// Mes à jours l'interface en fonction des actions de l'utilisateur.
selectSource.oninput = () => updateDisplay()
selectFrom.oninput   = () => updateDisplay(true)
selectTo.oninput     = () => updateDisplay(true)

// ----------------------------------------------------------------------------------------------------

// Masque le loader et affiche l'interface utilisateur.
const [section1, section2] = document.querySelectorAll("section")
section1.style.display = "none"
section2.style.display = ""
