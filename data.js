/* Word banks for the sample-part name generator. DE nouns use a /m /f /n gender tag. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.SampleData = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var DOMAIN_IDS = [
    "shafts",
    "flanges",
    "housings",
    "sensors",
    "fixtures",
    "drives",
    "fluid",
    "electronics",
  ];

  var HUMORS = ["serious", "wry", "unhinged"];

  function deNouns(list) {
    return list.map(function (entry) {
      var cut = entry.lastIndexOf("/");
      var gender = entry.slice(cut + 1);
      if (cut < 1 || (gender !== "m" && gender !== "f" && gender !== "n")) {
        throw new Error("DE noun needs /m /f or /n: " + entry);
      }
      return { text: entry.slice(0, cut), gender: gender };
    });
  }

  function enNouns(list) {
    return list.map(function (text) {
      return { text: text, gender: null };
    });
  }

  function domains(kind, table) {
    var out = {};
    DOMAIN_IDS.forEach(function (id) {
      if (!table[id] || !table[id].length) throw new Error("empty " + kind + " " + id);
      out[id] = { nouns: kind === "de" ? deNouns(table[id]) : enNouns(table[id]) };
    });
    return out;
  }

  var techSpecs = {
    de: {
      shafts: ["Ø12", "Ø20", "Ø40", "Ø60", "L80", "L120", "L200"],
      flanges: ["DN15", "DN25", "DN50", "PN16", "PN40", "LK-4"],
      housings: ["t3", "t5", "t8", "t12", "IP54", "IP67"],
      sensors: ["Klasse-0", "Klasse-1", "Klasse-2", "0-10V", "4-20mA"],
      fixtures: ["M6", "M8", "M12", "M16", "SW10", "SW13"],
      drives: ["Z18", "Z24", "Z36", "i2", "i3", "i5", "Modul-1"],
      fluid: ["6bar", "10bar", "16bar", "G1/4", "G3/8", "G1/2"],
      electronics: ["5V", "12V", "24V", "IP20", "3HE", "6HE"],
    },
    en: {
      shafts: ["OD12", "OD20", "OD40", "OD60", "L80", "L120", "L200"],
      flanges: ["DN15", "DN25", "DN50", "PN16", "PN40", "4-Bolt"],
      housings: ["t3", "t5", "t8", "t12", "IP54", "IP67"],
      sensors: ["Class-0", "Class-1", "Class-2", "0-10V", "4-20mA"],
      fixtures: ["M6", "M8", "M12", "M16", "AF10", "AF13"],
      drives: ["T18", "T24", "T36", "Ratio-2", "Ratio-3", "Module-1"],
      fluid: ["6bar", "10bar", "16bar", "G1/4", "G3/8", "G1/2"],
      electronics: ["5V", "12V", "24V", "IP20", "3U", "6U"],
    },
  };

  var materials = {
    de: ["Stahl", "Edelstahl", "Aluminium", "Messing", "Bronze", "Titan", "POM", "Gusseisen", "Kupfer", "Invar", "Keramik", "Hartmetall"],
    en: ["Steel", "Stainless", "Aluminum", "Brass", "Bronze", "Titanium", "POM", "Cast-Iron", "Copper", "Invar", "Ceramic", "Carbide"],
  };

  var banks = {
    de: {
      serious: {
        adjectives: ["gehärtet", "geschliffen", "nitriert", "rostfrei", "kalibriert", "gefräst", "gedreht", "eloxiert", "poliert", "modular", "symmetrisch", "vergütet", "passgenau", "beschichtet", "gewuchtet", "maßhaltig", "verzinkt", "brüniert", "hochfest", "spielfrei", "feinjustiert", "präzise"],
        specs: ["links", "rechts", "vorn", "hinten", "oben", "unten", "mittig", "kurz", "lang", "vertikal", "horizontal", "innen", "außen", "einfach", "doppelt"],
        epithets: [],
        domains: domains("de", {
          shafts: ["Messwelle/f", "Antriebswelle/f", "Hohlwelle/f", "Keilwelle/f", "Abtriebswelle/f", "Nockenwelle/f", "Prüfwelle/f", "Führungsachse/f", "Linearachse/f", "Exzenterwelle/f", "Kardanwelle/f", "Zwischenwelle/f", "Stellwelle/f", "Laufachse/f", "Spindel/f", "Gewindespindel/f"],
          flanges: ["Zentrierflansch/m", "Adapterflansch/m", "Messflansch/m", "Schweißflansch/m", "Losflansch/m", "Blindflansch/m", "Anschlussflansch/m", "Zwischenflansch/m", "Drehflansch/m", "Prüfadapter/m", "Zentrieradapter/m", "Reduzierstück/n", "Übergangsstück/n", "Passscheibe/f", "Zentrierring/m"],
          housings: ["Schutzgehäuse/n", "Grundplatte/f", "Adapterplatte/f", "Deckplatte/f", "Lagergehäuse/n", "Messgehäuse/n", "Montageplatte/f", "Stirnplatte/f", "Bodenplatte/f", "Zwischenplatte/f", "Gerätegehäuse/n", "Trägerplatte/f", "Distanzplatte/f", "Gehäusedeckel/m", "Aufnahmeplatte/f"],
          sensors: ["Messtaster/m", "Messdorn/m", "Wegsensor/m", "Drucksensor/m", "Temperatursensor/m", "Kalibrierdorn/m", "Prüfdorn/m", "Messuhr/f", "Feinzeiger/m", "Lasersensor/m", "Neigungssensor/m", "Kraftsensor/m", "Referenznormal/n", "Lehrring/m", "Grenzlehrdorn/m"],
          fixtures: ["Spannprisma/n", "Spannbock/m", "Niederhalter/m", "Spannpratze/f", "Auflagebock/m", "Zentrierspitze/f", "Teilapparat/m", "Spannbacke/f", "Anschlagleiste/f", "Aufnahmedorn/m", "Spannwinkel/m", "Positionierstift/m", "Spannbrücke/f", "Werkstückauflage/f", "Spannzange/f"],
          drives: ["Stirnrad/n", "Ritzel/n", "Planetenrad/n", "Schneckenrad/n", "Zahnriemenrad/n", "Kupplung/f", "Getriebegehäuse/n", "Abtrieb/m", "Antriebsritzel/n", "Zwischenrad/n", "Kegelrad/n", "Freilauf/m", "Wellenkupplung/f", "Untersetzungsstufe/f", "Riemenrad/n"],
          fluid: ["Hydraulikblock/m", "Ventilplatte/f", "Pneumatikzylinder/m", "Druckregler/m", "Wegeventil/n", "Drossel/f", "Speicherblock/m", "Anschlussleiste/f", "Zylinderkopf/m", "Steuerblock/m", "Manometer/n", "Schnellkupplung/f", "Leitungsblock/m", "Rückschlagventil/n", "Wartungseinheit/f"],
          electronics: ["Schaltschrank/m", "Kühlkörper/m", "Gerätekasten/m", "Frontplatte/f", "Hutschienenhalter/m", "Klemmenkasten/m", "Steuergehäuse/n", "EMV-Gehäuse/n", "Bedienpanel/n", "Rückwand/f", "Modulträger/m", "Anschlussdose/f", "Elektronikdeckel/m", "Tragschiene/f", "Schnittstellenplatte/f"],
        }),
      },
      wry: {
        adjectives: ["übermotiviert", "diplomatisch", "optimistisch", "trotzig", "charmant", "eigenwillig", "theatralisch", "hoffnungsvoll", "improvisiert", "überkandidelt", "wankelmütig", "ehrgeizig", "gutgelaunt", "nörgelig", "pingelig", "verschlafen", "beleidigt", "stolz", "neugierig", "halbherzig", "übertrieben", "frech", "gemütlich", "skeptisch", "feierabendreif"],
        specs: ["provisorisch", "gefühlt", "ungefähr", "theoretisch", "vorläufig", "symbolisch", "angeblich", "notdürftig", "großzügig", "inoffiziell", "vermutlich", "irgendwie", "halbwegs", "fast", "schräg"],
        epithets: ["mit Haltung", "ohne Eile", "mit Meinung", "auf Bewährung", "mit Charme", "ohne Gewähr", "für Montag", "nach Feierabend", "mit Trotz", "ohne Plan", "mit Optimismus", "aus Trotz", "fürs Meeting", "mit Beigeschmack", "ohne Drama", "mit Augenzwinkern", "der leisen Zweifel", "der zweiten Chance", "mit guter Absicht", "ohne jede Eile", "für den Flurfunk", "mit festem Blick", "der kleinen Kompromisse", "aus reiner Höflichkeit", "für die Kaffeepause", "mit halbem Ernst", "ohne großen Plan", "der feinen Ironie"],
        domains: domains("de", {
          shafts: ["Montagswelle/f", "Kaffeewelle/f", "Feierabendachse/f", "Diplomatenwelle/f", "Hoffnungsspindel/f", "Trotzachse/f", "Pausenwelle/f", "Meetingachse/f", "Charmespindel/f", "Kummerwelle/f", "Optimismusachse/f", "Flurfunkwelle/f", "Überstundenachse/f", "Beinahespindel/f", "Prokrastinationswelle/f", "Ausredenachse/f"],
          flanges: ["Diplomatenflansch/m", "Ausredenadapter/m", "Hoffnungsflansch/m", "Kompromissflansch/m", "Kummerflansch/m", "Beinaheadapter/m", "Charmeflansch/m", "Flurfunkadapter/m", "Meetingflansch/m", "Trotzadapter/m", "Pausenflansch/m", "Optimismusflansch/m", "Ausweichadapter/m", "Versöhnungsflansch/m", "Smalltalkadapter/m", "Kaffeeflansch/m"],
          housings: ["Meinungsgehäuse/n", "Kaffeeplatte/f", "Feierabendplatte/f", "Ausredengehäuse/n", "Hoffnungsplatte/f", "Kompromissgehäuse/n", "Charmplatte/f", "Meetinggehäuse/n", "Trotzplatte/f", "Pausenplatte/f", "Flurfunkgehäuse/n", "Optimismusplatte/f", "Kummerplatte/f", "Diplomatengehäuse/n", "Beinahegehäuse/n", "Smalltalkplatte/f"],
          sensors: ["Bauchgefühlssensor/m", "Kaffeedorn/m", "Montagsmesstaster/m", "Hoffnungsdorn/m", "Beinahelehre/f", "Optimismusuhr/f", "Flurfunksensor/m", "Meetingtaster/m", "Charmmessdorn/m", "Trotzlehre/f", "Pausenmesstaster/m", "Diplomatenuhr/f", "Kummersensor/m", "Ausredendorn/m", "Feierabendtaster/m", "Pi-mal-Daumen-Lehre/f"],
          fixtures: ["Überredungsprisma/n", "Charmpratze/f", "Hoffnungsbock/m", "Trotzspanner/m", "Meetingniederhalter/m", "Kaffeepratze/f", "Feierabendspanner/m", "Diplomatenbock/m", "Pausenprisma/n", "Kompromisspratze/f", "Flurfunkhalter/m", "Optimismusbock/m", "Ausredenprisma/n", "Beinahespanner/m", "Smalltalkpratze/f", "Trostbock/m"],
          drives: ["Montagsritzel/n", "Kaffeekupplung/f", "Feierabendgetriebe/n", "Hoffnungsrad/n", "Diplomatenritzel/n", "Meetingkupplung/f", "Trotzgetriebe/n", "Pausenrad/n", "Charmritzel/n", "Kompromisskupplung/f", "Überstundengetriebe/n", "Flurfunkrad/n", "Optimismusritzel/n", "Ausredenkupplung/f", "Beinahegetriebe/n", "Versöhnungsrad/n"],
          fluid: ["Kaffeeregler/m", "Montagsventil/n", "Hoffnungszylinder/m", "Diplomatenblock/m", "Pausenventil/n", "Trotzzylinder/m", "Meetingdrossel/f", "Feierabendregler/m", "Charmventil/n", "Flurfunkzylinder/m", "Optimismusblock/m", "Ausredenventil/n", "Beinahezylinder/m", "Kompromissdrossel/f", "Kummerregler/m", "Smalltalkventil/n"],
          electronics: ["Kaffeeschrank/m", "Montagskasten/m", "Flurfunkschrank/m", "Meetingpanel/n", "Hoffnungsdose/f", "Trotzschrank/m", "Pausenmodul/n", "Diplomatenkasten/m", "Charmpanel/n", "Feierabendschrank/m", "Ausredendose/f", "Optimismusmodul/n", "Beinaheschrank/m", "Smalltalkpanel/n", "Kummerkasten/m", "Kompromissdose/f"],
        }),
      },
      unhinged: {
        adjectives: ["seelenlos", "apokalyptisch", "verdammt", "nihilistisch", "unheilvoll", "existenziell", "morbid", "hoffnungslos", "katastrophal", "teuflisch", "endzeitlich", "verzweifelt", "unbarmherzig", "dämonisch", "grabeskalt", "reuelos", "fatal", "ultimativ", "kompromisslos", "posthum", "gnadenlos", "besessen", "verflucht", "totgesagt", "blasphemisch"],
        specs: ["unwiderruflich", "endgültig", "terminal", "nihil", "irreversibel", "höllisch", "namenlos", "zeitlos", "restlos", "spurlos", "kopflos", "wortlos"],
        epithets: ["ohne Gnade", "mit Reue", "ohne Seele", "ohne Wiederkehr", "mit Ansage", "fürs Ende", "ohne Pardon", "aus Verzweiflung", "ohne Mitleid", "wider Willen", "mit Omen", "ins Verderben", "zur Unzeit", "ohne Erbarmen", "mit Endzeitstimmung", "des Jüngsten Gerichts", "der ewigen Reue", "für schlechte Nachrichten", "ohne jede Gnade", "der leeren Versprechen", "der letzten Schicht", "der gebrochenen Träume", "wider besseres Wissen", "der stillen Katastrophe", "für den Abgrund", "der letzten Stunde", "mit göttlichem Anspruch", "der eigenen Beerdigung", "aus der Hölle", "nach dem Ende", "ohne jede Wiederkehr", "der leisen Verdammnis", "für die Endzeit"],
        domains: domains("de", {
          shafts: ["Existenzkrisenwelle/f", "Verdammnisachse/f", "Seelenwelle/f", "Apokalypsenspindel/f", "Reuewelle/f", "Abgrundachse/f", "Höllenwelle/f", "Endzeitwelle/f", "Nihilismusspindel/f", "Grabesachse/f", "Sündenwelle/f", "Katastrophenspindel/f", "Untergangswelle/f", "Verzweiflungsachse/f", "Omenwelle/f", "Jenseitsachse/f"],
          flanges: ["Verdammnisflansch/m", "Seelenadapter/m", "Weltuntergangsflansch/m", "Lügenflansch/m", "Abgrundadapter/m", "Höllenflansch/m", "Reueadapter/m", "Apokalypsenflansch/m", "Sündenflansch/m", "Nihilismusadapter/m", "Grabesflansch/m", "Endzeitadapter/m", "Verratsflansch/m", "Untergangsflansch/m", "Omenadapter/m", "Ketzerflansch/m"],
          housings: ["Sündengehäuse/n", "Weltuntergangsgehäuse/n", "Grabesplatte/f", "Höllengehäuse/n", "Abgrundplatte/f", "Verdammnisgehäuse/n", "Seelenplatte/f", "Apokalypsengehäuse/n", "Endzeitplatte/f", "Reuegehäuse/n", "Nihilismusplatte/f", "Katastrophengehäuse/n", "Untergangsplatte/f", "Verzweiflungsgehäuse/n", "Jenseitsgehäuse/n", "Finsternisplatte/f"],
          sensors: ["Weltuntergangssensor/m", "Seelentaster/m", "Verdammnisdorn/m", "Apokalypsenuhr/f", "Abgrundsensor/m", "Höllenlehre/f", "Existenzdorn/m", "Reuelehre/f", "Nihilismustaster/m", "Grabesdorn/m", "Endzeitsensor/m", "Sündenlehre/f", "Katastrophentaster/m", "Allwissenheitssensor/m", "Omenuhr/f", "Jenseitsdorn/m"],
          fixtures: ["Zwangspratze/f", "Verdammnisprisma/n", "Seelenniederhalter/m", "Höllenspanner/m", "Abgrundbock/m", "Apokalypsenpratze/f", "Grabeshalter/m", "Endzeitprisma/n", "Reuepratze/f", "Untergangsbock/m", "Gewissensprisma/n", "Sündenpratze/f", "Nihilismusbock/m", "Existenzniederhalter/m", "Katastrophenspanner/m", "Omenhalter/m"],
          drives: ["Verdammnisritzel/n", "Seelenkupplung/f", "Apokalypsengetriebe/n", "Höllenrad/n", "Abgrundritzel/n", "Endzeitkupplung/f", "Reuegetriebe/n", "Nihilismusrad/n", "Grabesritzel/n", "Untergangsgetriebe/n", "Sündenkupplung/f", "Weltuntergangsrad/n", "Existenzritzel/n", "Katastrophengetriebe/n", "Verzweiflungsrad/n", "Omenkupplung/f"],
          fluid: ["Höllenventil/n", "Verdammniszylinder/m", "Seelenblock/m", "Apokalypsendrossel/f", "Abgrundventil/n", "Endzeitregler/m", "Reuezylinder/m", "Grabesventil/n", "Untergangsblock/m", "Nihilismusdrossel/f", "Sündenventil/n", "Weltuntergangszylinder/m", "Existenzregler/m", "Katastrophenblock/m", "Verzweiflungsventil/n", "Omenregler/m"],
          electronics: ["Höllenschrank/m", "Seelenkasten/m", "Apokalypsenpanel/n", "Verdammnisdose/f", "Abgrundschrank/m", "Endzeitmodul/n", "Grabespanel/n", "Reueschrank/m", "Nihilismuskasten/m", "Untergangsdose/f", "Sündenmodul/n", "Weltuntergangsschrank/m", "Existenzpanel/n", "Katastrophenschrank/m", "Verzweiflungsdose/f", "Omenmodul/n"],
        }),
      },
    },
    en: {
      serious: {
        adjectives: ["Hardened", "Ground", "Nitrided", "Calibrated", "Milled", "Turned", "Anodized", "Polished", "Modular", "Symmetric", "Tempered", "Coated", "Balanced", "Galvanized", "Blued", "Precision", "Heavy-Duty", "Low-Profile", "Matched", "Lapped"],
        specs: ["Left", "Right", "Front", "Rear", "Upper", "Lower", "Centered", "Short", "Long", "Vertical", "Horizontal", "Inner", "Outer", "Double", "Single"],
        epithets: [],
        domains: domains("en", {
          shafts: ["Spindle", "Mandrel", "Axle", "Leadscrew", "Quill", "Camshaft", "Driveshaft", "Halfshaft", "Jackshaft", "Tailstock", "Gauge Shaft", "Hollow Shaft", "Spline Shaft", "Output Shaft", "Linear Axis", "Guide Axis", "Eccentric Shaft", "Intermediate Shaft", "Cardan Shaft", "Setting Shaft", "Inspection Shaft", "Feed Shaft"],
          flanges: ["Flange", "Adapter", "Bushing", "Spacer", "Collar", "Gasket", "Hub", "Ferrule", "Orifice", "Blank", "Center Flange", "Adapter Flange", "Gauge Flange", "Weld-Neck Flange", "Blind Flange", "Loose Flange", "Reducing Adapter", "Centering Ring", "Shim Washer", "Lap-Joint Flange", "Socket Flange", "Pilot Adapter"],
          housings: ["Housing", "Baseplate", "Cover", "Casing", "Bracket", "Chassis", "Backplate", "Faceplate", "Cradle", "Saddle", "Guard Housing", "Adapter Plate", "Bearing Housing", "Mounting Plate", "Cover Plate", "Base Plate", "Front Plate", "Spacer Plate", "Device Housing", "End Plate", "Carrier Plate", "Inspection Cover"],
          sensors: ["Probe", "Stylus", "Gauge", "Encoder", "Loadcell", "Micrometer", "Indicator", "Caliper", "Dial", "Artifact", "Dial Indicator", "Gauge Pin", "Laser Sensor", "Pressure Sensor", "Temperature Probe", "Calibration Pin", "Limit Gauge", "Ring Gauge", "Reference Artifact", "Tilt Sensor", "Force Sensor", "Touch Probe"],
          fixtures: ["Clamp", "Collet", "Vise", "Fixture", "Nest", "Tombstone", "Pallet", "Chuck", "Stop", "Wedge", "Clamp Strap", "Step Block", "Toe Clamp", "Vise Jaw", "Locating Pin", "Rest Pad", "Angle Plate", "Fixture Plate", "Collet Chuck", "Center Point", "Clamp Bridge", "Work Support"],
          drives: ["Gear", "Pinion", "Coupling", "Gearbox", "Sprocket", "Pulley", "Clutch", "Flywheel", "Reducer", "Idler", "Spur Gear", "Planet Gear", "Worm Gear", "Timing Pulley", "Bevel Gear", "Shaft Coupling", "Freewheel Hub", "Belt Pulley", "Reduction Stage", "Intermediate Gear", "Drive Pinion", "Output Gear"],
          fluid: ["Valve", "Cylinder", "Manifold", "Regulator", "Accumulator", "Solenoid", "Restrictor", "Silencer", "Filter", "Actuator", "Valve Block", "Directional Valve", "Check Valve", "Pressure Regulator", "Pneumatic Cylinder", "Gauge Port", "Service Unit", "Header Block", "Flow Control", "Quick Coupling", "Relief Valve", "Cylinder Head"],
          electronics: ["Enclosure", "Heatsink", "Panel", "Busbar", "Gland", "Bezel", "Rack", "Carrier", "Console", "Backplane", "Control Cabinet", "Terminal Box", "Front Panel", "DIN Rail", "Module Carrier", "Junction Box", "Rear Panel", "EMC Enclosure", "Operator Panel", "Cable Gland", "Card Cage", "Interface Plate"],
        }),
      },
      wry: {
        adjectives: ["Overeager", "Diplomatic", "Optimistic", "Petty", "Charming", "Willful", "Theatrical", "Hopeful", "Improvised", "Ambitious", "Sleepy", "Proud", "Curious", "Halfhearted", "Skeptical", "Smug", "Anxious", "Heroic", "Caffeinated", "Gentle", "Suspicious", "Festive", "Overthought", "Unofficial", "Passive-Aggressive"],
        specs: ["Approximate", "Theoretical", "Provisional", "Symbolic", "Alleged", "Presumed", "Somehow", "Officially", "Halfway", "Generous", "Temporary", "Mood-Based", "Unconfirmed", "Allegedly", "Sort-Of", "For-Now"],
        epithets: ["with Attitude", "on Probation", "with Opinions", "without Warranty", "with Doubts", "for Mondays", "after Hours", "with Charm", "with Optimism", "from Spite", "with Coffee", "on Purpose", "without Drama", "with Feeling", "with Tact", "for Show", "of Quiet Doubts", "for the Meeting", "with Good Intent", "out of Spite", "of Small Compromises", "for the Breakroom", "with a Wink", "without a Plan", "of Polite Fiction", "for the Minutes"],
        domains: domains("en", {
          shafts: ["Monday-Shaft", "Coffee-Axle", "Overtime-Spindle", "Charm-Shaft", "Meeting-Axle", "Hope-Spindle", "Protest-Shaft", "Breakroom-Axle", "Smug-Mandrel", "Maybe-Shaft", "Monday Shaft", "Coffee Axle", "Diplomatic Shaft", "Optimistic Spindle", "Procrastination Axis", "After-Hours Axle", "Petty Shaft", "Anxious Spindle", "Heroic Mandrel", "Unofficial Axis", "Caffeinated Shaft", "Meeting Spindle"],
          flanges: ["Excuse-Flange", "Hope-Adapter", "Charm-Flange", "Meeting-Adapter", "Coffee-Flange", "Petty-Spacer", "Maybe-Adapter", "Truce-Flange", "Diplomatic Flange", "Compromise Adapter", "Optimism Flange", "Breakroom Adapter", "Passive Adapter", "Smug Flange", "Unofficial Adapter", "After-Hours Flange", "Polite Spacer", "Anxious Adapter", "Heroic Flange", "Apology Adapter"],
          housings: ["Opinion-Housing", "Coffee-Plate", "Excuse-Cover", "Hope-Bracket", "Meeting-Chassis", "Charm-Cover", "Petty-Plate", "Maybe-Housing", "Opinion Housing", "After-Hours Plate", "Compromise Cover", "Optimistic Bracket", "Meeting Housing", "Breakroom Plate", "Smug Cover", "Unofficial Chassis", "Anxious Plate", "Diplomatic Housing", "Heroic Bracket", "Mood Housing"],
          sensors: ["Hunch-Sensor", "Coffee-Gauge", "Monday-Probe", "Hope-Stylus", "Maybe-Gauge", "Meeting-Probe", "Charm-Dial", "Petty-Gauge", "Gut-Feeling Sensor", "Optimistic Gauge", "Breakroom Probe", "Diplomatic Indicator", "Anxious Stylus", "Unofficial Gauge", "After-Hours Probe", "Smug Indicator", "Caffeinated Gauge", "Heroic Probe", "Suspicious Dial", "Mood Sensor"],
          fixtures: ["Charm-Clamp", "Hope-Vise", "Meeting-Nest", "Petty-Clamp", "Coffee-Jaw", "Maybe-Fixture", "Smug-Clamp", "Truce-Vise", "Persuasion Clamp", "Optimistic Vise", "Diplomatic Fixture", "After-Hours Clamp", "Petty Strap", "Anxious Nest", "Unofficial Jaw", "Breakroom Fixture", "Heroic Clamp", "Passive Vise", "Mood Strap", "Apology Fixture"],
          drives: ["Monday-Gear", "Coffee-Clutch", "Hope-Pinion", "Meeting-Pulley", "Petty-Gear", "Charm-Coupling", "Maybe-Gearbox", "Smug-Sprocket", "Monday Gear", "Coffee Coupling", "Optimistic Pinion", "Diplomatic Gear", "After-Hours Gearbox", "Procrastination Gear", "Anxious Coupling", "Unofficial Pulley", "Heroic Pinion", "Breakroom Clutch", "Smug Gear", "Overtime Reducer"],
          fluid: ["Coffee-Valve", "Monday-Cylinder", "Hope-Manifold", "Petty-Valve", "Charm-Regulator", "Meeting-Valve", "Maybe-Cylinder", "Smug-Manifold", "Optimistic Cylinder", "Diplomatic Manifold", "After-Hours Valve", "Anxious Regulator", "Unofficial Cylinder", "Breakroom Valve", "Heroic Manifold", "Passive Regulator", "Mood Valve", "Caffeinated Cylinder", "Suspicious Manifold", "Apology Valve"],
          electronics: ["Coffee-Cabinet", "Monday-Box", "Hope-Panel", "Meeting-Bezel", "Petty-Rack", "Charm-Panel", "Maybe-Enclosure", "Smug-Heatsink", "Opinion Cabinet", "After-Hours Panel", "Diplomatic Enclosure", "Optimistic Heatsink", "Breakroom Box", "Anxious Panel", "Unofficial Rack", "Heroic Bezel", "Mood Cabinet", "Caffeinated Panel", "Suspicious Enclosure", "Rumor Box"],
        }),
      },
      unhinged: {
        adjectives: ["Soulless", "Apocalyptic", "Damned", "Nihilistic", "Ominous", "Existential", "Morbid", "Hopeless", "Catastrophic", "Devilish", "Desperate", "Merciless", "Demonic", "Fatal", "Ultimate", "Posthumous", "Cursed", "Possessed", "Blasphemous", "Doomed", "Godless", "Terminal", "Irreversible", "Unrepentant", "Funereal"],
        specs: ["Irrevocable", "Final", "Afterlife", "Unblessed", "No-Return", "Last-Call", "Off-Record", "Condemned", "Beyond-Repair", "No-Mercy", "Too-Late", "Unlisted"],
        epithets: ["without Mercy", "with Regret", "without Pardon", "from Despair", "without Pity", "at Doomsday", "with Omens", "past Saving", "beyond Hope", "after Everything", "before Ruin", "without Absolution", "with Malice", "of Eternal Regret", "for Bad News", "of the Apocalypse", "without a Soul", "for the End", "of Broken Promises", "of Last Shift", "from the Abyss", "of Quiet Doom", "for the Abyss", "of No Return", "with a God-Complex", "of Mild Damnation", "for Lost Causes", "of the Void", "after Last Rites"],
        domains: domains("en", {
          shafts: ["Doomsday-Shaft", "Regret-Spindle", "Abyss-Axle", "Damnation-Shaft", "Omen-Spindle", "Void-Axle", "Heresy-Shaft", "Ruin-Spindle", "Doomsday Shaft", "Damnation Spindle", "Apocalypse Axle", "Graveyard Shaft", "Existential Spindle", "Posthumous Axle", "God-Complex Shaft", "Last-Rites Spindle", "Nihilist Axle", "Funeral Shaft", "Soulless Spindle", "Quiet-Doom Axle"],
          flanges: ["Damnation-Flange", "Heresy-Adapter", "Abyss-Flange", "Omen-Adapter", "Doom-Gasket", "Void-Collar", "Ruin-Hub", "Curse-Flange", "Damnation Flange", "Apocalypse Adapter", "Liar Flange", "Graveyard Adapter", "Soulless Flange", "End-Times Adapter", "Betrayal Flange", "Nihilist Spacer", "Funeral Adapter", "God-Complex Flange", "Quiet-Doom Adapter", "Last-Rites Flange"],
          housings: ["Doom-Housing", "Abyss-Plate", "Grave-Cover", "Heresy-Bracket", "Void-Chassis", "Ruin-Plate", "Omen-Cover", "Crypt-Housing", "Doomsday Housing", "Graveyard Plate", "Damnation Cover", "Abyss Bracket", "Apocalypse Chassis", "Soulless Plate", "End-Times Housing", "Funeral Cover", "Nihilist Bracket", "Existential Plate", "Quiet-Doom Housing", "Last-Rites Cover"],
          sensors: ["Doom-Probe", "Omen-Gauge", "Abyss-Stylus", "Heresy-Dial", "Void-Sensor", "Ruin-Gauge", "Crypt-Probe", "Fate-Stylus", "Doomsday Sensor", "Damnation Pin", "Apocalypse Gauge", "All-Knowing Probe", "Graveyard Stylus", "Existential Gauge", "God-Complex Sensor", "Last-Rites Probe", "Nihilist Indicator", "Soulless Gauge", "Quiet-Doom Probe", "Funeral Dial"],
          fixtures: ["Doom-Clamp", "Abyss-Vise", "Heresy-Nest", "Void-Jaw", "Ruin-Clamp", "Omen-Fixture", "Crypt-Strap", "Fate-Vise", "Damnation Clamp", "Coercion Strap", "Graveyard Vise", "Apocalypse Fixture", "Soulless Jaw", "End-Times Clamp", "Merciless Nest", "Last-Rites Vise", "Nihilist Strap", "Existential Fixture", "Quiet-Doom Clamp", "Funeral Jaw"],
          drives: ["Doom-Gear", "Abyss-Clutch", "Heresy-Pinion", "Void-Pulley", "Ruin-Gear", "Omen-Coupling", "Crypt-Sprocket", "Fate-Gearbox", "Damnation Gear", "Apocalypse Gearbox", "Soulless Coupling", "Graveyard Pinion", "End-Times Clutch", "Nihilist Gear", "Existential Pulley", "Last-Rites Coupling", "Quiet-Doom Gear", "Funeral Sprocket", "God-Complex Pinion", "Betrayal Coupling"],
          fluid: ["Doom-Valve", "Abyss-Cylinder", "Heresy-Manifold", "Void-Regulator", "Ruin-Valve", "Omen-Cylinder", "Crypt-Manifold", "Fate-Valve", "Damnation Valve", "Apocalypse Cylinder", "Soulless Manifold", "Graveyard Regulator", "End-Times Valve", "Nihilist Cylinder", "Existential Manifold", "Last-Rites Valve", "Quiet-Doom Regulator", "Funeral Cylinder", "God-Complex Valve", "Despair Manifold"],
          electronics: ["Doom-Cabinet", "Abyss-Panel", "Heresy-Rack", "Void-Box", "Ruin-Bezel", "Omen-Heatsink", "Crypt-Chassis", "Fate-Panel", "Damnation Cabinet", "Apocalypse Panel", "Soulless Enclosure", "Graveyard Heatsink", "End-Times Rack", "Nihilist Box", "Existential Panel", "Last-Rites Cabinet", "Quiet-Doom Bezel", "Funeral Chassis", "God-Complex Panel", "Heresy Enclosure"],
        }),
      },
    },
  };

  return {
    DOMAIN_IDS: DOMAIN_IDS,
    HUMORS: HUMORS,
    techSpecs: techSpecs,
    materials: materials,
    banks: banks,
  };
});
