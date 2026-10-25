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

## Guide intégré (facultatif)

Onglet **Moi → Brancher mon guide** : colle une clé d’API Claude (créée sur la plateforme développeur de Claude). Le diagnostic, le bivouac, le feu de camp et la halte se font alors directement dans l’app, qui applique la montagne toute seule.

- La clé reste sur le téléphone et n’est jamais incluse dans les sauvegardes.
- À utiliser uniquement sur ton propre appareil : une clé enregistrée dans un navigateur peut être lue par qui a accès à l’appareil.
- L’usage est facturé par Anthropic selon la consommation.
- Sans clé, le copier-coller reste disponible.
