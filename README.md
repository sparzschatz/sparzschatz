# Briefarchiv

Eine feststehende, schwarze Pinnwand mit zwei Arten von Objekten:

- **Postkarten**: Klick vergrößert die Karte, ein Button dreht sie in 3D zur Rückseite.
- **Reisetagebücher**: Klick öffnet einen Seitenleser, durch den man mit Pfeilen
  (oder den ← / → Tasten) blättert.

Die Fläche selbst ist nicht verschiebbar – die Seite scrollt bei Bedarf ganz normal
nach unten, wenn mehr Objekte hinzukommen als auf einen Bildschirm passen.
Schrift durchgängig Helvetica (Systemschrift, kein externer Font-Ladevorgang nötig).

Passwortschutz ist rein clientseitig – ausreichend, um die Seite nicht offen im
Netz stehen zu haben, aber kein echter Sicherheitsmechanismus.

## Struktur

```
index.html     Seitenaufbau (Passwortabfrage, Board, Modals)
style.css      Aussehen (Farben, Board, Karten, Modals)
script.js      Logik: Passwort, Verschieben, Postkarten-Flip, Tagebuch-Reader
data.json      Alle Objekte auf dem Board (hier trägst du deine echten Scans ein)
images/        Die Scan-Dateien (aktuell nur Platzhalter-SVGs)
```

## Passwort ändern

In `script.js` ganz oben: `const PASSWORD = "unserreise";` – einfach ersetzen.

## Neue Objekte hinzufügen

Jeder Eintrag in `data.json` braucht `x`/`y` (Position auf dem 2000×1400px
großen Board) und `rotation` (leichte Schräglage in Grad, z. B. -6 bis 8).

**Postkarte:**

```json
{
  "id": "eindeutige-id",
  "typ": "postkarte",
  "titel": "Kurzer Titel",
  "datum": "1987-06-03",
  "ort": "Rom, Italien",
  "x": 300,
  "y": 250,
  "rotation": -5,
  "vorderseite": "images/dein-scan-vorne.jpg",
  "rueckseite": "images/dein-scan-hinten.jpg"
}
```

Die Fläche ist 1400px breit; `x`/`y` sind Pixel-Koordinaten darauf, gemessen von
oben links. Nach unten wächst sie automatisch mit dem Inhalt mit (die Seite scrollt
dann einfach weiter).

**Reisetagebuch (beliebig viele Seiten):**

```json
{
  "id": "eindeutige-id",
  "typ": "tagebuch",
  "titel": "Kurzer Titel",
  "datum": "1987-06",
  "ort": "Italien-Reise",
  "x": 700,
  "y": 400,
  "rotation": 3,
  "seiten": [
    "images/seite-1.jpg",
    "images/seite-2.jpg",
    "images/seite-3.jpg"
  ]
}
```

Scans einfach in `images/` legen und im jeweiligen Eintrag referenzieren.
Positionen für neue Objekte kannst du frei wählen – am einfachsten testest
du lokal und schiebst Werte so lange hin und her, bis die Anordnung passt.
Die Breite der Fläche (1400px) kannst du in `style.css` bei `#board-canvas`
(`width`) anpassen, falls du mehr Platz nebeneinander brauchst.

## Lokal testen

```bash
# im Projektordner ausführen
python3 -m http.server 8000
```

Dann `http://localhost:8000` im Browser öffnen.

## Veröffentlichen mit GitHub Pages

1. Repository auf GitHub erstellen und diesen Ordner hochladen.
2. Im Repo unter **Settings → Pages** als Quelle den `main`-Branch auswählen.
3. Seite ist unter `https://<dein-username>.github.io/<repo-name>/` erreichbar.

Jeder `git push` aktualisiert die Seite automatisch.
