import { LSDB, Model } from "./LSDB.js";

// -------------------------------------------- LSDB Model --------------------------------------------


// Modèle pour les codes ISO de devises, utilisé pour remplir les menus déroulants, etc.
export class Code_ISO extends Model {
	static schema = Object.freeze({
		ISO: [String, true],     // Code ISO de la devise (ex: "USD")
		Name: [String, true]     // Nom lisible de la devise (ex: "Dollar américain")
	})
}

// Base de données locale pour stocker les paires ISO/Name
export const Code_ISO_DB = new LSDB(Code_ISO)

// -------------------------------------------- PayPal API --------------------------------------------
export class PayPal_API {
	static async getData() {

		// Récupère les données de métadonnées de PayPal (noms de devises, codes ISO, etc.)
		let data = (await (await fetch("https://www.paypal.com/smarthelp/get-cc-meta")).json()).appData

		// Supprime les données inutiles et retourne le résultat.
		delete data.formMapping; delete data.tTypeOptions; return data
	}

	// Récupère le taux de conversion entre deux devises.
	static async getRate(from, to, origin="FR") {
		let URL = `https://www.paypal.com/smarthelp/currency-conversion`
		let PARAM = `?fromCountry=${origin}&toTransCurrency=${from}&fromPaymentCurrency=${to}&transAmount=1&tType=FX_ON_SENDER`

		try {
			// Utilise une expression régulière pour extraire les données souhaitées.
			let filter = /([\d.]+).+?([\d.]+).+?([\d.]+).+?([\d.]+).+/gm
			var data = filter.exec((await (await fetch(URL + PARAM)).json()).result).slice(1)
		} catch (error) {
			return null // Retourne null en cas d'erreur (ex: données incomplètes ou serveur inaccessible)
		}
	
		// Retourne deux objets avec les conversions dans les deux sens
		return [{[from]: data[2], [to]: data[3]}, {[to]: data[0], [from]: data[1]}]
	}
}

// ---------------------------------------------- XE API ----------------------------------------------
export class XE_API {
	// Récupère les taux moyens du marché à partir de XE.com (via un proxy CORS)
	static async getData() {
		return (await (await fetch(
			"https://proxy.corsfix.com/?https://www.xe.com/api/protected/midmarket-converter",
			{headers: {"authorization": "Basic bG9kZXN0YXI6cHVnc25heA=="}}
		)).json()).rates
	}
}

// ----------------------------------------------------------------------------------------------------
