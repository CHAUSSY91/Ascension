# Ascension

Une montagne se grimpe pas à pas. Ascension est un arbre de compétences pour la vraie vie : un guide IA construit et adapte le chemin vers un objectif (le sommet), zone par zone.

**Version : v33 (14 novembre 2026). Cache : `ascension-v33`.**

Ce zip suffit pour reprendre le projet dans une nouvelle discussion. Deux documents font référence :

- `README.md` (ce fichier) : comment reprendre, comment l'app est faite, comment livrer.
- `FICHE-DECISIONS-ASCENSION.txt` : tout ce que Mrik a acté (vision, vocabulaire, guide, interface, rejets, questions ouvertes). **À lire avant toute modification.**

---

## 1. Reprendre dans une nouvelle discussion (pour Claude)

1. Mrik dépose le dernier `ascension.zip`. Dézippe-le et travaille sur cette version, jamais sur une plus ancienne.
2. Lis `FICHE-DECISIONS-ASCENSION.txt` en entier, puis ce README.
3. Règles de travail avec Mrik :
   - **Valider avant de coder** : propose, donne ton avis franc, signale les erreurs, puis code une fois que c'est acté.
   - **Toujours penser à la pertinence du guide IA** : chaque nouveauté doit lui donner les données réelles utiles et lui dire quoi en faire.
   - **Le guide décide du calibrage** (organisation, paliers, durées, jours), pas Claude.
   - **Adapter au niveau, jamais niveler vers le bas** : voir la règle « QUAND C'EST TROP DUR » dans `CORE`.
   - Mrik écrit en français familier, lit sur téléphone : réponses courtes, sans jargon.
4. À chaque version livrée :
   - incrémenter `CACHE` dans `sw.js` (`ascension-vN`) ;
   - mettre à jour `FICHE-DECISIONS-ASCENSION.txt` (décisions, rejets, date, version) et ce README (version, historique) ;
   - livrer **`ascension.zip`** (toujours ce nom, sans numéro), contenant un dossier `ascension/` ;
   - dire clairement ce qui a été testé et ce qui ne l'a pas été.
5. Ne jamais écrire de clé ni d'adresse de relais dans les fichiers.

## 2. Installer une version (pour Mrik)

1. Dans l'app, onglet **Moi** : exporte une sauvegarde (par sécurité).
2. Sur le dépôt GitHub, envoie **`index.html`** et **`sw.js`** (upload, puis commit). Les images ne changent pas. Le README et la fiche n'ont pas besoin d'être en ligne.
3. Attends 2 minutes, ferme complètement l'app, rouvre-la.

Si l'ancienne version reste affichée, c'est que `CACHE` n'a pas été incrémenté dans `sw.js`.

## 3. Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'app : styles, interface, logique, consignes du guide. |
| `sw.js` | Service worker (hors ligne, cache). Contient `CACHE = "ascension-vN"`. |
| `manifest.webmanifest`, `icon-*.png`, `apple-touch-icon.png` | Installation sur le téléphone. |
| `montagne.jpg`, `camp-0.jpg` à `camp-4.jpg` | Carte et scènes des camps. |
| `relais-cloudflare.js` | Code du relais à coller dans un Worker Cloudflare (pour Mistral). |
| `README.md`, `FICHE-DECISIONS-ASCENSION.txt` | Documentation de reprise. |

Hébergement : GitHub Pages. Aucune compilation : on modifie `index.html` directement.

## 4. Le modèle (résumé, la fiche fait foi)

- **Massif** : une compétence, avec un **sommet** (objectif final) et une échéance.
- **Zone** : forêt, pentes, falaise. Un sous-objectif et une durée. Se termine par un **feu de camp**.
- **Sentier** : une discipline avec une direction (ex. Endurance).
- **Palier** : environ une semaine, plus exigeant que le précédent. Le guide n'en détaille qu'un à la fois.
- **Pas** : la séance du jour, faite de blocs rattachés à des sentiers, avec un jour conseillé. Se note avec un ressenti (1 à 5), une date, une mesure et un mot.
- **Hors piste** : séance en plus du programme, ou pas prévu fait un autre jour.
- **Mot du guide** : réponse courte du guide après chaque pas.
- **Étoile** : note de bas de palier. **Vigilance** : point faible signalé par le guide.
- **Repères** (onglet Moi) : FC de repos, FC max (mesurée ou estimée), date exacte du sommet. L'app en tire les zones cardio.
- **Bilan de palier** : à la validation d'un palier, sommeil, FC au réveil, poids, douleur, moment où le cap a été tenu (tout facultatif).
- **Suivi de l'échéance** : rythme réel comparé au calendrier, affiché sur la montagne et envoyé au guide.
- **Créneau long** et **objectif de secours** : convenus au feu de camp, quand l'objectif demande plus que le temps disponible.

## 5. Architecture de `index.html`

Un seul fichier, JavaScript sans bibliothèque. L'état complet est l'objet `S`, enregistré dans `localStorage` (clé `ascension-v1`) par `save()`. L'interface est redessinée par `render()`. Les clics passent par `data-a="nomAction"` et l'objet d'actions `A`. Les fiches du bas s'ouvrent avec `openSheet()`.

### L'état `S` (champs utiles)

- `S.massif` : nom, sommet, échéance, cap, dispo (temps disponible), matériel, portrait, familles, étapes.
- `S.zone` (0 à 3), `S.zoneDebut`, `S.phase`, `S.sommet`.
- `S.strat[z]`, `S.rythme[z]`, `S.dirs[z]` (sentiers de la zone), `S.vig[z]` (vigilances).
- `S.pal[z]` : liste des paliers `{titre, intention, progression, etat: verrouille|actif|valide, pas:[{jour, blocs:[{sentier,titre,minutes,detail}]}], etoile, message, note, texte}`.
- `S.pasLog["z:palier:pas"]` : `{date, note, mesure, texte}` pour chaque pas fait.
- `S.hors` : séances hors piste `{id, z, pi, date, titre, minutes, note, mesure, texte, sentier}`.
- `S.mot` : dernier mot du guide `{z, ref, date, texte, type}`.
- `S.profil` : `{fcRepos, fcMax, fcMesuree}`. Suit la personne d'un massif à l'autre.
- `S.massif.echeanceDate` (date exacte, sinon déduite du texte `echeance`), `S.massif.long` `{minutes, par, quand}`, `S.massif.secours`, `S.massif.voie` (numéro du tracé sur la photo).
- `S.pal[z][i].bilan` : `{sommeil, fcReveil, poids, douleur, cap}`.
- `S.journal` : entrées `{date, type, ref, sentier, epreuve, note, texte, guide}`. `ref` relie une entrée à un pas (`pas:z:p:i`) ou à un hors piste (`hors:id`).

`isV2()` indique le modèle actuel (paliers et pas). L'ancien modèle d'épreuves reste dans le code pour les anciennes sauvegardes : ne pas le supprimer sans le décider avec Mrik.

### Fonctions clés

- Paliers et pas : `palList`, `curPalIdx`, `pasKey`, `pasDone`, `nextPas`, `pasJours` (jour de chaque pas), `normPas`, `checkPalier` (contrôle : chaque sentier présent, chaque pas dans le temps disponible), `detailPalier` (demande au guide le détail d'un palier), `remapPasLog` (après une réorganisation).
- v33 : `zonesFC`, `fcContext`, `echeanceDate`, `suivi`, `suiviTxt`, `suiviContext`, `longSlot`, `allBilans`, `bilanTxt`, `isPhys`, `reperesCard`, `sheetReperes`.
- Carte : `RAW` contient les tracés relevés sur `montagne.jpg` (coordonnées de l'image, 688 × 1529), plusieurs voies par zone. `zoneRoute`, `baseRoute`, `topRoute` les lissent ; `rAt` place un point le long du tracé, `rD` dessine un tronçon. L'ancien modèle d'épreuves garde ses courbes.
- Écrans : `vMontagne`, `vJourV2` (Aujourd'hui), `vJournal`, `vMoi`, `sheetZone`, `planHTMLv2` (« Voir ma semaine » et PDF).
- Saisie : `sheetPas` (pas accompli, modifier, annuler), `sheetHors`, `sheetHorsPick`, `sheetHorsForm`, `sheetPalier`.
- Guide : `CORE` (consigne générale), `context()` et `v2Context()` (données envoyées), `seancesReelles` (pas et hors pistes dans l'ordre réel), `motPrompt`, `motContext`, `motOccasions` et `motDuGuide` (mot après une séance), `promptFeu`, `callGuide` (appel réseau), `extractJSON`.

### Les missions du guide (dans le code, chercher « MISSION : »)

Première conversation et tests de placement, construction de la montagne, détail d'un palier, mot du guide après une séance, réorganisation du palier, feu de camp, sommet, bivouac, halte. Toutes partent de `CORE`, **sauf le mot du guide**, qui a sa propre consigne courte (`motPrompt`) et un cadre allégé, pour rester concentré sur la séance. **Une règle ajoutée dans `CORE` vaut pour les autres missions** : vérifier qu'aucune ne la contredit, et la reporter dans `motPrompt` si elle concerne aussi le mot du guide.

### Le guide IA

- Fournisseur principal : Mistral Large, via un relais Cloudflare (Mistral refuse les appels directs depuis une page web). Secours : Gemini Flash, sans relais. Mode secours par copier-coller dans l'onglet Moi.
- La clé et l'adresse du relais se saisissent dans l'onglet Moi. Elles restent sur le téléphone, hors des sauvegardes.
- Sans clé ou hors connexion, l'app fonctionne : les pas s'enregistrent, seules les réponses du guide manquent.

## 6. Tester avant de livrer

- Syntaxe : extraire le contenu de `<script>` et lancer `node --check`.
- Parcours : Playwright (Chromium, 390 × 844), en ouvrant `index.html` en local. Construire un état avec `buildFromDiag({... zone: Z})`, où `Z` suit le format `ZONE_JSON` de `CORE`.
- Guide simulé : remplacer `getKey` et `callGuide` dans la page (`getKey=()=>({key:"x",model:"m",relay:"r"}); callGuide=async()=>'{"type":"orienter","mot":"…"}'`).
- Vérifier aussi une sauvegarde ancienne (journal sans `ref`).
- Les réponses réelles de Mistral ne peuvent pas être testées hors du téléphone : le dire à Mrik et lui demander une capture.

## 7. Historique récent

- **v26** : nouveau modèle sentiers, paliers, pas. Stratégie du guide, un palier détaillé à la fois, contrôle automatique, « Réajuster ma forêt ».
- **v27** : cadenas sur les paliers, « Voir ma semaine » et PDF par jours de la semaine, un jour conseillé par pas.
- **v28** : « Hors piste » (séance en plus, avancer un pas prévu), modification d'un pas, séances réelles envoyées au guide.
- **v29** : annulation d'un pas, règle « adapter, jamais niveler vers le bas ».
- **v30** : « Le mot du guide » après chaque pas, documentation de reprise dans le zip.
- **v31** : mot du guide recentré. Premier essai réel décevant (mauvais prochain pas cité, dépassement de FC max ignoré, repère plus bas que le niveau atteint) : la mission n'utilise plus `CORE` ni le contexte complet, mais une consigne courte, un cadre allégé (`motContext`) et les prochaines occasions par sentier (`motOccasions`), avec une relecture obligatoire des chiffres et du mot.
- **v32** : mot du guide moins alarmiste. Deuxième essai réel : fond juste, ton trop fort. Quatre intentions au lieu de trois : « vigilance » (rare, orange, seulement si l'essentiel du pas n'est pas respecté ou vrai signal), « ajuster » (réglage de coach, affichage normal), « orienter », « encourager ». Le message ouvre sur ce qui a marché. Volet mental : un outil concret quand le mot de la personne l'appelle. Feu de camp : nouvelle étape « La tête » qui relit les mots de la zone.

- **v33** : comparaison avec un programme trail écrit à la main. Détail d'un bloc structuré (mise en route, cœur chiffré, seuil d'action, fin), fin du plafond de 20 min par sentier, zones cardio dans Moi, suivi de l'échéance, bilan de palier, étape « Face à l'enjeu » au feu de camp (créneau long ou objectif de secours), sentiers de la carte posés sur les chemins de la photo.

## 8. Brancher le guide (première installation)

### Gemini (gratuit, sans relais)
1. Sur aistudio.google.com : **Get API key**, puis **Create API key**.
2. Dans Ascension, onglet **Moi** : **Brancher mon guide**, modèle Gemini Flash, colle la clé, **Enregistrer et tester**.

Sur l'offre gratuite, Google peut utiliser les échanges pour améliorer ses modèles.

### Mistral (via relais)
1. Crée un compte gratuit sur dash.cloudflare.com.
2. **Workers & Pages**, **Create Worker**, puis **Deploy**.
3. **Edit code** : efface tout, colle le contenu de `relais-cloudflare.js`, **Deploy**.
4. Dans Ascension, onglet **Moi** : colle la clé Mistral et l'adresse du worker, choisis le modèle, **Enregistrer et tester**.

Le relais ne stocke rien et n'accepte que les demandes venant de l'adresse GitHub Pages de l'app (ligne `ORIGINE` du relais, à adapter si l'adresse change).
