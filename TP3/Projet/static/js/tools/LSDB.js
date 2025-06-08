// ------------------------------------------------------------
// API version : 1.0.0
// Principaux changement :
// - Refonte complète du fonctionnement globale
// - Amélioration du stockage des données
// - Amélioration de la sécurité
// - Amélioration de l'efficacité
// ------------------------------------------------------------
// // API version : 1.0.1
// Principaux changement :
// - Amélioration de la fiabilité de la fonction "TrueTypeOf"
// - Amélioration de la visibilité du changelog (temporaire)
// - Amélioration et correction de l'exemple de modèle
// - Correction d'un bug de typage pour les éléments "Date"
// ------------------------------------------------------------

export function TrueTypeOf(obj) {
	if (obj instanceof Function) return obj
	return (obj?.constructor) ? obj.__proto__.constructor : obj
}


export class LSDB {
	constructor(model) {
		this.name = model.name; this.model = model
		this.property = Object.keys(this.model.schema)

		if (!localStorage[this.name]) localStorage[this.name] = "[]"

		if (this.read().find((x) => x)) {
			let testKeys = Object.keys(this.read().find((x) => x)).slice(1)
			let error = "Incompatible column between model and LocalStorage: "

			if (this.property.length != testKeys.length) { throw new Error(error+"Incorrect column number!") }
			if (testKeys.map((x) => this.property.includes(x)).includes(false)) { throw new Error(error+"Incorrect column name!") }
		}
	}

	create(model) {
		model.ID = this.read().length
		this.update(model); return model.ID
	}

	read(ID) {
		let data = JSON.parse(localStorage[this.name]).map((x) => (x) ? new this.model(x) : x)
		return (ID === undefined) ? data : ((data[ID]) ? data[ID] : null)
	}

	update(model) {
		if (model?.ID === undefined) return null
		if (TrueTypeOf(model) != TrueTypeOf(this.model)) {
			throw new Error("The expected data model is not correct")
		}

		let data = this.read()
		if (model.ID > data.length) return null
		if (data[model.ID] === null) return false
		
		data[model.ID] = model; return Boolean(localStorage[this.name] = JSON.stringify(data))
	}

	delete(ID) {
		let data = this.read()
		if (data[ID] === null) return false
		if (data[ID] === undefined) return null

		data[ID] = null; return Boolean(localStorage[this.name] = JSON.stringify(data))
	}

	ERASE(confirm) {
		return (confirm) ? Boolean(localStorage[this.name] = "[]") : false
	}
}

export class Model {
	constructor(data) {
		data.ID = Number(data.ID); this.ID = (isNaN(data.ID)) ? undefined : data.ID

		Object.entries(this.constructor.schema).forEach(([prop, value]) => {
			if (value[0] === Date) { data[prop] = new Date(data[prop]) }

			if (!data[prop] && value[1]) throw new Error(`The required "${prop}" is not defined!`)

			if (data[prop] && TrueTypeOf(data[prop]) !== value[0]) {
				throw new Error(`The type of "${prop}" is not correct!`)
			}

			this[prop] = data[prop] || null
		})
	}
}

// Voici un exemple simple de déclaration possible de table.
// Le seul élément requis est un objet schema geler (verrouiller).
// Il est possible de rajouter des méthodes personnalisés dans la classe.
// 
// class Example extends Model {
	// static schema = Object.freeze({
	// 	count: [Number, true],
	// 	text:  [String, true],
	// 	date:  [Date, false]
	// })
// }
