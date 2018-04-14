## Todo

* Ajouter bouton pour fermer le load actuel
* Ajouter bouton retour à la liste des jeux (une fois les routes faites) > Ou Appbar fullwidth avec liste des jeux ?
* Gérer le long press sur une touche qui faire des rerender après savestate quand arbre de state trop grand (ram)
* Gérer les champs vides (required, ne pas save ou autre dès que la valeur entrée dépasse le max etc.)
* Voir pour passer les values en array (avec génération auto du nom en camelCase ou autre (wingedSkeleton ect.)) > Utile ? Le système actuel permet de checker si un id n'est pas déjà utilisé avec eslint / utile pour les divider
* Outil camelcase > l'utiliser aussi pour les strtolower, voir comment fait la référence pour gérer les names de listes
* Voir pour faire un système de link (dans le cas de gold preview, ne pas efficher (même dans les states), mais si gold save, save aussi gold preview)
* Faire une fonction des Object.keys
* Débrider les heures TIME à plus de 24 heures
* Voir eslint et (x + y) - (x / y)
* Voir comment gérer les checkboxs issues d'une même value (01 + 02 = 03) > Souls par exemple, voir si on peut écrire (ou choisir dans une liste) dans VALUES, l'algorithme pour décoder
* Faire un système de route pour accèder aux différents editeurs (route index : choix du jeu, changement de la route pour afficher l'éditeur choisi, faire un fichier de config de route)
