# Coeus Cybersecurity — Sitio Web

Site vitrine statique. Aucune dépendance, aucun build : HTML + CSS + modules ES natifs.

## Lancer en local

```bash
python3 -m http.server 8000
```

Puis <http://localhost:8000>. Un serveur est nécessaire — les modules ES ne se
chargent pas depuis `file://`.

## Structure

```
index.html                     Home (7 sections)
soluciones/*.html              5 pages de solution
nosotros.html                  historia, misión/visión, principios
socios-aliados.html            fabricants partenaires
recursos.html                  Blog / Noticias / Eventos (ancres)
contacto.html                  formulaire + coordonnées
404.html
aviso-de-privacidad.html       gabarit légal à valider
terminos-y-condiciones.html    gabarit légal à valider
sitemap.xml · robots.txt
css/
  fonts.css           @font-face self-hostés
  tokens.css          palette, typo fluide, glass, espacements, mouvement
  base.css            reset, layout, accessibilité
  components.css      header, dropdowns, drawer, boutons, cartes, footer
  home.css            les 7 sections du Home
  pages.css           pages internes, formulaire, états vides, légal, 404
js/
  main.js             point d'entrée
  raf.js              boucle d'animation unique partagée
  particles.js        champ de particules réactif au curseur
  header.js           sticky, dropdowns clavier, drawer mobile
  marquee.js          carrousel infini des logos clients
  reveal.js           apparition au scroll
  counters.js         compteurs animés
  scroll-hint.js      indicateur de scroll du hero
  form.js             validation, antispam et états du formulaire
  bindings.js         injecte data/content.js dans le DOM
data/content.js       copies + valeurs à fournir (objet TODO)
fonts/                Staatliches + Roboto Mono (woff2, OFL)
img/optimized/        assets générés (webp + png de repli)
```

Le HTML est écrit en dur pour le SEO. `data/content.js` est la source de
vérité documentaire et alimente ce qui dépend d'informations encore manquantes.

Le header et le footer sont dupliqués à l'identique dans les 13 pages : c'est le
prix du « zéro build ». En cas de modification, répercuter dans toutes les pages
(`grep -l 'class="header"' *.html soluciones/*.html`).

## ⚠️ À compléter avant mise en ligne

Tout est regroupé dans l'objet `TODO` de `data/content.js`. Tant qu'une valeur
est vide, le bloc concerné est **masqué** plutôt que d'afficher un placeholder
(la Guía Maestra §11 interdit d'inventer chiffres, clients ou couverture).

| Clé | Effet actuel |
|---|---|
| `empresasApoyadas` | l'indicateur n'est pas affiché |
| `paisesAtendidos` | l'indicateur n'est pas affiché |
| `whatsappUrl` | les CTA « Contáctanos ahora » pointent vers `contacto.html` |
| `linkedinUrl`, `xUrl` | liens rendus inertes (non focusables) |
| `formEndpoint` | à brancher lors de la page Contacto |
| `sociosAliados` | logos des fabricants partenaires absents de `img/` |
| `recursosArticulos` | articles réels Blog / Noticias / Eventos |

Les pages `aviso-de-privacidad.html` et `terminos-y-condiciones.html` sont des
**gabarits** : elles affichent un encart signalant que le texte doit être fourni
et approuvé par Coeus. Elles sont en `noindex` en attendant.

Les blocs *Socios Aliados* et les trois sections de *Recursos* affichent un état
« Próximamente » tant qu'aucun contenu réel n'existe — rien n'est simulé.

## Formulaire de contact

`js/form.js` gère la validation en espagnol, le focus sur le premier champ en
erreur, un honeypot et un délai de remplissage minimal de 3 s contre les robots.

Tant que `TODO.formEndpoint` est vide, **aucun envoi n'a lieu** : le message
d'erreur de la spec s'affiche avec l'adresse directe, et un avertissement est
écrit en console. Pour activer l'envoi, renseigner l'endpoint (Formspree,
Web3Forms, API interne…) — le POST envoie un `FormData` avec
`Accept: application/json`.

## Déploiement

Site statique : déposer la racine telle quelle. Configurer la page d'erreur 404
de l'hébergeur sur `/404.html` (Netlify et Vercel le font automatiquement ;
sur Apache, `ErrorDocument 404 /404.html`).

## Régénérer les images optimisées

Les sources sont dans `img/Symbolos clean/` et `img/Empresas/`. Le fond blanc
des symboles est retiré par flood-fill depuis les bords (préserve les blancs
intérieurs — écume, faisceau, vitrages) :

```bash
magick "img/Symbolos clean/Dragon.png" -alpha set -bordercolor white -border 1 \
  -fuzz 6% -fill none -floodfill +0+0 white -shave 1x1 \
  -resize 1500x PNG32:img/optimized/dragon.png
cwebp -q 88 -alpha_q 100 img/optimized/dragon.png -o img/optimized/dragon.webp
```

Le logo (`img/Logo Coeus Horizontal.ai`, en réalité un PDF) a été rendu via
CoreGraphics faute de Ghostscript sur la machine.

## Accessibilité

- Un seul `<h1>` par page, hiérarchie sémantique, fil d'Ariane sur les pages
  internes. JSON-LD `Organization` (Home), `Service` (soluciones), `ContactPage`.
- Dropdowns et drawer entièrement opérables au clavier, `Escape` ferme et
  rend le focus au déclencheur.
- Canvas de particules `aria-hidden`, non initialisé si `prefers-reduced-motion`.
- Contrastes WCAG AA vérifiés. Signal Orange (#F28C28) plafonne à 2,45:1 sur
  blanc : le token `--signal-orange-text` (#D97812, 3,16:1) lui est substitué
  pour tout **texte** sur fond clair.
- Le masquage des blocs animés est conditionné à la classe `js` posée par un
  script inline du `<head>` : sans JavaScript, aucun contenu ne disparaît.
- `js/reveal.js` mesure les positions au scroll plutôt que d'utiliser un
  IntersectionObserver, qui ne notifie que les franchissements de seuil et
  laisse invisibles les blocs traversés lors d'un saut de défilement.
