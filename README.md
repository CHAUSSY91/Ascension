# Ascension

Une montagne se grimpe pas à pas. Version 1 « manuelle » : l’app gère la montagne, les épreuves, les coches et le journal ; le guide IA (Claude, Mistral…) s’utilise par copier-coller.

## Mettre en ligne sur GitHub Pages

1. Crée un dépôt sur GitHub (privé ou public).
2. Envoie tout le contenu de ce dossier à la racine du dépôt : `index.html`, `manifest.webmanifest`, `sw.js`, `README.md` et toutes les images.
3. Dans le dépôt : **Settings → Pages → Branch : main, dossier / (root) → Save**.
4. Après une minute, l’app est en ligne à l’adresse affichée (`https://<pseudo>.github.io/<depot>/`).
5. Sur ton téléphone, ouvre cette adresse puis « Ajouter à l’écran d’accueil ».

Note : GitHub Pages en plan gratuit publie le site même si le dépôt est privé ; l’adresse reste simplement peu connue. Tes données, elles, ne quittent jamais ton téléphone.

## Utilisation

1. **Diagnostic** : copie le texte du guide, colle-le dans Claude ou Mistral, réponds, fais les tests, puis colle le bloc JSON final dans l’app.
2. **Chaque jour** : coche tes épreuves, valide-les avec ton ressenti, choisis le soir l’épreuve du lendemain.
3. **Bivouac, feu de camp, halte** : l’app prépare un texte pour ton guide ; tu colles sa réponse, la montagne s’adapte.
4. **Moi** : rappel du soir (ajout à l’agenda), export et import de sauvegarde.

## Mettre à jour l’app

Après une modification, change `CACHE = "ascension-v1"` en `v2`, `v3`… dans `sw.js` pour forcer les téléphones à recharger les fichiers.

## Guide intégré avec Mistral (facultatif)

Mistral n’accepte pas les appels directs depuis une page web. L’app passe donc par un petit relais gratuit chez Cloudflare, qui transmet la demande à Mistral et renvoie la réponse. Il ne stocke rien.

### Créer le relais (une seule fois, 5 minutes)

1. Crée un compte gratuit sur **dash.cloudflare.com**.
2. Menu **Workers & Pages** → **Create** → **Create Worker** (modèle « Hello World »). Nomme-le `ascension-relais`, puis **Deploy**.
3. Touche **Edit code**, efface tout, colle le contenu du fichier `relais-cloudflare.js`, puis **Deploy**.
4. Copie l’adresse du worker, du type `https://ascension-relais.<ton-pseudo>.workers.dev`.

### Brancher le guide

Dans Ascension : **Brancher mon guide** (ou onglet **Moi**) → colle ta clé Mistral, l’adresse du relais, choisis le modèle → **Enregistrer et tester**.

- La clé reste sur le téléphone et n’est jamais incluse dans les sauvegardes.
- Le relais n’accepte que les demandes venant de `chaussy91.github.io`. Si ton adresse GitHub change, modifie la ligne `ORIGINE` dans le relais.
- Sans clé, le copier-coller reste disponible.
