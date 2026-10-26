"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const test = require("node:test");
const data = require("../data.js");
const gen = require("../generator.js");
const i18n = require("../i18n.js");

const HUMORS = data.HUMORS;
const DOMAINS = data.DOMAIN_IDS;

function nounTexts(lang, humor, domain) {
  return data.banks[lang][humor].domains[domain].nouns.map((noun) => noun.text);
}

test("repeated name parts are rejected", () => {
  assert.strictEqual(gen.hasDuplicateToken("Regret-Spindle with Regret"), true);
  assert.strictEqual(gen.hasDuplicateToken("God-Complex Shaft with a God-Complex"), true);
  assert.strictEqual(gen.hasDuplicateToken("After-Hours Axle after Hours"), true);
  assert.strictEqual(gen.hasDuplicateToken("Hardened Gauge Shaft Left"), false);
  assert.strictEqual(gen.hasDuplicateToken("Montagswelle aus Stahl"), false);
  assert.strictEqual(gen.hasDuplicateToken("Besessenes Verzweiflungsventil mit Reue"), false);
});

test("German adjectives inflect by gender", () => {
  assert.strictEqual(gen.inflectDe("gehärtet", "f"), "gehärtete");
  assert.strictEqual(gen.inflectDe("gehärtet", "m"), "gehärteter");
  assert.strictEqual(gen.inflectDe("gehärtet", "n"), "gehärtetes");
  assert.strictEqual(gen.inflectDe("präzise", "m"), "präziser");
  assert.strictEqual(gen.inflectDe("präzise", "f"), "präzise");
  assert.strictEqual(gen.inflectDe("präzise", "n"), "präzises");
  assert.strictEqual(gen.inflectDe("modular", "n"), "modulares");
});

test("word banks stay shaped for exact word counts", () => {
  for (const lang of ["de", "en"]) {
    for (const humor of HUMORS) {
      const block = data.banks[lang][humor];
      for (const stem of block.adjectives) {
        assert.strictEqual(gen.wordCount(stem), 1, stem);
        if (lang === "de" && stem !== "präzise") {
          assert.ok(!/(?:e|er|el)$/.test(stem), "awkward stem " + stem);
          for (const gender of ["m", "f", "n"]) {
            const form = gen.inflectDe(stem, gender);
            assert.ok(!form.endsWith("ee"), form);
            if (gender === "m") assert.ok(form.endsWith("er"), form);
            if (gender === "f") assert.ok(form.endsWith("e"), form);
            if (gender === "n") assert.ok(form.endsWith("es"), form);
          }
        }
      }
      for (const spec of block.specs) assert.strictEqual(gen.wordCount(spec), 1, spec);
      for (const epithet of block.epithets) {
        const count = gen.wordCount(epithet);
        assert.ok(count === 2 || count === 3, epithet + " -> " + count);
      }
      if (humor === "serious") assert.strictEqual(block.epithets.length, 0);
      else assert.ok(block.epithets.some((item) => gen.wordCount(item) >= 2));
      const seen = new Map();
      for (const domain of DOMAINS) {
        const nouns = block.domains[domain].nouns;
        assert.ok(nouns.some((noun) => gen.wordCount(noun.text) === 1), lang + humor + domain);
        for (const noun of nouns) {
          assert.ok(!noun.text.includes("/"), noun.text);
          if (lang === "de") {
            assert.ok(["m", "f", "n"].includes(noun.gender), noun.text);
            assert.strictEqual(gen.wordCount(noun.text), 1, noun.text);
          } else {
            assert.ok(gen.wordCount(noun.text) <= 2, noun.text);
          }
          assert.ok(!seen.has(noun.text), "duplicate noun " + noun.text);
          seen.set(noun.text, domain);
        }
      }
    }
    for (const material of data.materials[lang]) assert.strictEqual(gen.wordCount(material), 1, material);
  }
});

test("humor levels do not share nouns inside a domain", () => {
  for (const lang of ["de", "en"]) {
    for (const domain of DOMAINS) {
      const sets = HUMORS.map((humor) => new Set(nounTexts(lang, humor, domain)));
      for (let i = 0; i < sets.length; i += 1) {
        for (let j = i + 1; j < sets.length; j += 1) {
          for (const text of sets[i]) {
            assert.ok(!sets[j].has(text), text + " shared by " + HUMORS[i] + " and " + HUMORS[j]);
          }
        }
      }
    }
  }
});

test("generated names hit the word count, domain, and humor", () => {
  const domainChoices = [[]].concat(DOMAINS.map((id) => [id]));
  for (const lang of ["de", "en"]) {
    for (const humor of HUMORS) {
      for (const words of [1, 2, 3, 4]) {
        for (const domains of domainChoices) {
          let previous = "";
          for (let n = 0; n < 12; n += 1) {
            const result = gen.generatePartName({ lang, humor, words, domains, avoid: previous });
            assert.ok(result, "no result");
            assert.strictEqual(gen.wordCount(result.name), words, result.name);
            assert.strictEqual(result.lang, lang);
            assert.strictEqual(result.humor, humor);
            const allowed = domains.length ? domains : DOMAINS;
            assert.ok(allowed.includes(result.domain), result.domain);
            const pool = new Set(nounTexts(lang, humor, result.domain));
            assert.ok(pool.has(result.noun), result.noun + " not in " + result.domain);
            assert.ok((" " + result.name + " ").includes(" " + result.noun + " "), result.name);
            if (humor === "serious") {
              const foreign = data.banks[lang].wry.epithets.concat(data.banks[lang].unhinged.epithets);
              for (const epithet of foreign) {
                assert.ok(!result.name.includes(epithet), result.name);
              }
            }
            previous = result.name;
          }
        }
      }
    }
  }
});

test("unhinged names lean on dark epithets when there is room", () => {
  const markers = {
    de: ["ohne ", "mit ", "für ", "fürs ", "des ", "der ", "aus der ", "wider ", "ins ", "zur ", "nach dem "],
    en: ["without ", "with ", "of ", "for ", "from ", "at ", "past ", "beyond ", "after ", "before "],
  };
  for (const lang of ["de", "en"]) {
    let hits = 0;
    for (let n = 0; n < 40; n += 1) {
      const result = gen.generatePartName({ lang, humor: "unhinged", words: 4, domains: ["shafts"] });
      const padded = result.name + " ";
      if (markers[lang].some((marker) => padded.toLowerCase().includes(marker.toLowerCase()))) hits += 1;
    }
    assert.ok(hits >= 8, lang + " epithet hits " + hits);
  }
});

test("one-word mode still changes tone with the humor level", () => {
  for (const lang of ["de", "en"]) {
    for (const domain of DOMAINS) {
      const serious = new Set(nounTexts(lang, "serious", domain));
      const unhinged = new Set(nounTexts(lang, "unhinged", domain));
      for (let n = 0; n < 20; n += 1) {
        const calm = gen.generatePartName({ lang, humor: "serious", words: 1, domains: [domain] });
        const wild = gen.generatePartName({ lang, humor: "unhinged", words: 1, domains: [domain] });
        assert.ok(serious.has(calm.name), calm.name);
        assert.ok(unhinged.has(wild.name), wild.name);
        assert.ok(!serious.has(wild.name), wild.name);
      }
    }
  }
});

test("UI strings exist in both languages", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const keys = new Set();
  for (const match of html.matchAll(/data-i18n="([^"]+)"/g)) keys.add(match[1]);
  assert.ok(keys.size > 20);
  for (const key of keys) {
    assert.ok(i18n.strings.de[key], "missing de " + key);
    assert.ok(i18n.strings.en[key], "missing en " + key);
    assert.notStrictEqual(i18n.t("de", key), "");
    assert.notStrictEqual(i18n.t("en", key), "");
  }
  assert.ok(i18n.metaLine("de", { words: 1, humor: "serious", domain: "shafts" }).includes("Welle"));
  assert.ok(i18n.metaLine("en", { words: 4, humor: "unhinged", domain: "sensors" }).includes("Sensors"));
});
