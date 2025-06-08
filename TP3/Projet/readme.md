# TP : Conversion de devises
- **Projet de :** Félix Lhoste
- **Date :** Juin 2025

### Design
Le design globale se veux très minimaliste et moins travailler car la finalité est moins sophistiqué.

### Structure
- `index.html` : Page du site (nécessite un petit serveur web pour le cors comme `Live Server` ou `python -m http.server`).
- `static/js/tools/LSDB.js` : Outils faite maison pour "facilité" l'utilisation du localStorage.
- `static/js/tools/API.js` : Branchement au API rétro-ingénierez des services externe de taux de change. 
- `static/js/index.js` : Module principale, coeur du fonctionnement du site.
- `static/img/favicon.png` : Icône pour le site (source internet).
- `static/css/index.css` : Fichier CSS d'ajustement pour le site.
