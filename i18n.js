/* UI strings. The page has no other copy source. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SampleI18n = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var strings = {
    de: {
      skip: "Zum Namen",
      kicker: "Bauteilnamen für Demos",
      title: "Lord Sample",
      tagline: "Damit die Demo nicht schon wieder „Welle 1“ heißt.",
      langAria: "Sprache",
      wordsLabel: "Wörter",
      humorLabel: "Humor",
      humorSerious: "Seriös",
      humorSeriousHelp: "Zeichnungstauglich, wie aus der Fertigung.",
      exSerious: "Gehärtete Messwelle",
      humorWry: "Ein bisschen witzig",
      humorWryHelp: "Schmunzeln in der Besprechung, trotzdem ein Bauteil.",
      exWry: "Übermotivierte Montagswelle",
      humorUnhinged: "Unvernünftig witzig",
      humorUnhingedHelp: "Dunkel und grenzwertig, aber noch als Teil benennbar.",
      exUnhinged: "Seelenlose Verdammniswelle",
      domainsLabel: "Bereiche",
      domainHintEmpty: "Keine Auswahl mischt alle Bereiche.",
      domainHintSelected: "Der Name kommt aus den markierten Bereichen.",
      mix: "Alle mischen",
      generate: "Generieren",
      regenerate: "Neu generieren",
      again: "Nochmal",
      copy: "Kopieren",
      copied: "Kopiert",
      copyFailed: "Nicht kopiert",
      pnLabel: "Zeichnung",
      footer: "Läuft komplett im Browser. Es wird nichts hochgeladen. Die Einstellungen bleiben nur auf diesem Gerät.",
      wordOne: "Wort",
      wordMany: "Wörter",
      docTitle: "Lord Sample — Bauteilnamen",
      description: "Generator für kreative Bauteilnamen in Messtechnik und Maschinenbau. Deutsch und Englisch, drei Humorstufen, nach Bereich filterbar.",
      error: "Kein Name erzeugt.",
      srReady: "Neuer Name:",
      badgeSerious: "Freigabe",
      badgeWry: "Leicht schief",
      badgeUnhinged: "Grenzwertig",
      domShafts: "Wellen & Achsen",
      domFlanges: "Flansche & Adapter",
      domHousings: "Gehäuse & Platten",
      domSensors: "Sensorik & Messtechnik",
      domFixtures: "Spannmittel & Fixtures",
      domDrives: "Getriebe & Antrieb",
      domFluid: "Hydraulik/Pneumatik",
      domElectronics: "Elektronik-Gehäuse",
    },
    en: {
      skip: "Skip to name",
      kicker: "Sample part names for demos",
      title: "Lord Sample",
      tagline: "So the demo is not called “Shaft 1” again.",
      langAria: "Language",
      wordsLabel: "Words",
      humorLabel: "Humor",
      humorSerious: "Serious",
      humorSeriousHelp: "Drawing-ready, like it came from the shop.",
      exSerious: "Hardened Gauge Shaft",
      humorWry: "A bit funny",
      humorWryHelp: "A smirk in the meeting, still a real part.",
      exWry: "Overeager Monday Shaft",
      humorUnhinged: "Unreasonably funny",
      humorUnhingedHelp: "Dark and borderline, but still nameable as a part.",
      exUnhinged: "Soulless Damnation Shaft",
      domainsLabel: "Domains",
      domainHintEmpty: "No selection mixes every domain.",
      domainHintSelected: "The name is drawn from the marked domains.",
      mix: "Mix all",
      generate: "Generate",
      regenerate: "Regenerate",
      again: "Again",
      copy: "Copy",
      copied: "Copied",
      copyFailed: "Copy failed",
      pnLabel: "Drawing",
      footer: "Runs entirely in the browser. Nothing is uploaded. Settings stay on this device.",
      wordOne: "word",
      wordMany: "words",
      docTitle: "Lord Sample — Part names",
      description: "Generator for creative sample part names in metrology and mechanical engineering. German and English, three humor levels, filterable by domain.",
      error: "Could not mint a name.",
      srReady: "New name:",
      badgeSerious: "Released",
      badgeWry: "Slightly off",
      badgeUnhinged: "Borderline",
      domShafts: "Shafts & Axles",
      domFlanges: "Flanges & Adapters",
      domHousings: "Housings & Plates",
      domSensors: "Sensors & Metrology",
      domFixtures: "Clamping & Fixtures",
      domDrives: "Gearboxes & Drives",
      domFluid: "Hydraulics & Pneumatics",
      domElectronics: "Electronics Enclosures",
    },
  };

  var humorName = {
    serious: "humorSerious",
    wry: "humorWry",
    unhinged: "humorUnhinged",
  };

  var domainKey = {
    shafts: "domShafts",
    flanges: "domFlanges",
    housings: "domHousings",
    sensors: "domSensors",
    fixtures: "domFixtures",
    drives: "domDrives",
    fluid: "domFluid",
    electronics: "domElectronics",
  };

  function pack(lang) {
    return strings[lang] || strings.de;
  }

  function t(lang, key) {
    var table = pack(lang);
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : strings.de[key];
  }

  function metaLine(lang, detail) {
    var table = pack(lang);
    var wordLabel = detail.words === 1 ? table.wordOne : table.wordMany;
    var humor = table[humorName[detail.humor]] || detail.humor;
    var domain = table[domainKey[detail.domain]] || detail.domain;
    return detail.words + " " + wordLabel + " · " + humor + " · " + domain;
  }

  return {
    strings: strings,
    t: t,
    metaLine: metaLine,
    humorName: humorName,
    domainKey: domainKey,
  };
});
