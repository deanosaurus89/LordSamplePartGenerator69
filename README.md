# Lord Sample

Ein kleiner Generator für kreative Bauteilnamen in Messtechnik- und Maschinenbau-Demos. Damit Beispielteile nicht bei „Welle 1“, „Adapterplatte“ oder „Flansch“ hängen bleiben.

Die Seite läuft statisch im Browser: Deutsch oder Englisch, ein bis vier Wörter, drei Humorstufen (seriös, ein bisschen witzig, unvernünftig witzig) und Bereiche wie Wellen, Flansche, Sensorik oder Hydraulik. Nichts wird an einen Server geschickt.

## Lokal öffnen

`index.html` im Browser öffnen. Es braucht keinen Build und keinen Server.

Alternativ aus diesem Ordner:

```bash
python3 -m http.server 8080
```

Dann [http://localhost:8080](http://localhost:8080) aufrufen.

Die Wortlogik lässt sich ohne Browser prüfen:

```bash
node --test
```

## GitHub Pages

Die Seite liegt im Wurzelverzeichnis von `main` (`index.html`, `styles.css`, `app.js`). `.nojekyll` sorgt dafür, dass GitHub Pages die Dateien unverändert ausliefert und nicht durch Jekyll schickt.

Im Repository: **Settings → Pages → Build and deployment → Source: Deploy from a branch**. Branch `main`, Ordner **`/ (root)`**, dann speichern.

Danach ist die Seite unter `https://deanosaurus89.github.io/LordSamplePartGenerator69/` erreichbar. Das erste Deployment kann eine Minute dauern.

Schriftarten: Outfit und IBM Plex Mono, beide unter der SIL Open Font License. Lizenztexte liegen in `fonts/`.
