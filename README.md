# Weart weboldal

Astro 7 alapú statikus oldal. A blogcikkek build időben a headless WordPressből jönnek (content.weart.hu, WPGraphQL). A korábbi kézzel írt HTML változat a `mentesek/02-statikus-html/` mappában van.

## Beállítás

```sh
cp .env.example .env   # majd töltsd ki a WP_USER és WP_APP_PASSWORD értékét
npm install
npm run dev
```

A GraphQL végpont jelenleg csak bejelentkezett felhasználónak válaszol, ezért a buildhez egy WordPress alkalmazásjelszó kell (Felhasználók > Profil > Alkalmazásjelszavak). A `.env` nem kerül verziókezelésbe. Éles buildnél (pl. Vercel) ugyanezeket a környezeti változókat kell beállítani.

Új vagy módosított cikk csak új builddel jelenik meg. Ha automatikusan frissülnie kell, a WordPressből egy deploy hookot kell hívni mentéskor.

A kapcsolati űrlap a Gravity Forms 2-es űrlapja (`site.contactFormId`). A mezőit, a gomb szövegét és a köszönő üzenetet a build kéri le a REST API-ból (`src/lib/wordpress/gravity-forms.ts`), a beküldést a böngésző közvetlenül a `content.weart.hu/wp-json/gf/v2/forms/2/submissions` végpontra küldi. Ezért:

- Az űrlap módosítása a Gravity Formsban csak új builddel jelenik meg.
- A Gravity Forms frissítése után is új build kell. A honeypot `version_hash` értéke a bővítmény verziójától függ, a build a `content.weart.hu/contact/` oldalról olvassa ki. Elavult értékkel a beküldések a spam közé kerülnek, értesítő nélkül.
- Támogatott mezőtípusok: szöveg, e-mail, telefon, webcím, szám, szövegdoboz, legördülő, rejtett, feltételes megjelenítéssel. Más típusnál a build hibával leáll.

## Parancsok

| Parancs           | Mit csinál                                                    |
| ----------------- | ------------------------------------------------------------- |
| `npm run dev`     | Fejlesztői szerver: http://localhost:4321                     |
| `npm run build`   | Típusellenőrzés (`astro check`), majd build a `dist/` mappába |
| `npm run preview` | A buildelt oldal helyi előnézete                              |
| `npm run lint`    | ESLint (TypeScript, Astro, akadálymentesség)                  |
| `npm run format`  | Prettier formázás                                             |

## Felépítés

```
src/
  content.config.ts   projektek és blogcikkek sémája (Zod)
  content/
    projects.yaml     munkáink: új projekt = új elem ebben a fájlban
  lib/wordpress/      GraphQL kliens, a cikkeket betöltő content loader, HTML átalakítók
  pages/posts/        cikklista (/posts/) és cikkoldal (/posts/<slug>/)
  data/               statikus adatok (elérhetőségek, GYIK, vélemények, számok, kategóriák)
  layouts/            BaseLayout: head, SEO, fejléc, kapcsolat szekció, lábléc
  components/
    home/             a főoldal szekciói
    layout/           fejléc, lábléc, kapcsolat, mobil CTA
    cards/            projekt- és cikkkártya
    art/              SVG illusztrációk
    icons/            kis ismétlődő SVG-k
  scripts/            közös kliensoldali TypeScript (DOM segédek, csillagmező, scroll reveal)
  styles/
    global.css        betűtípusok és a partialok sorrendje (ez a kaszkád sorrendje)
    partials/         szekciónkénti CSS, tokenek a DESIGN.md alapján
```

## Konvenciók

- A kliensoldali kód TypeScript, a hozzá tartozó komponensben, `<script>` tagben. Szekciót alkotó komponensnél a `<script>` a `<section>` elemen belül áll, mert a CSS szomszédsági szelektorokat használ (`.section-light + .section-light`).
- A stílusok globálisak, nem scoped komponens stílusok: sok szabály futásidőben létrehozott elemekre (csillagok, űrlaphibák, csapat-összekötők) és több szekcióban használt osztályokra vonatkozik.
- A projekteket a `src/content/projects.yaml` fájlban kell módosítani, a cikkeket a WordPressben. A komponensekben nincs tartalom.
- A cikkekben a CMS domainre mutató linkek (cikk, kapcsolat, főoldal) build közben erre az oldalra íródnak át. A feltöltött képek a CMS-ről töltődnek.
- A belső linkek perjellel végződnek (`trailingSlash: 'always'`).
- Commit előtt: `npm run lint && npm run format:check && npm run build`.

## Nyitott pontok

- A képek helyén még helyőrzők vannak. Ha megvannak a fotók, `src/assets/` alá kerüljenek, és az `astro:assets` `<Image>` komponensével jelenjenek meg.
- A `projects.yaml` 5 és 7 közötti elemei vázlatok (cím és link ellenőrizendő), a 8 és 10 közöttiek üres helyek.
