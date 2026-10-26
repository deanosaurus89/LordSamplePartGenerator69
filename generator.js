/* Combines word banks into part names with an exact word count. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./data.js"));
  else root.SampleGenerator = factory(root.SampleData);
})(typeof self !== "undefined" ? self : this, function (data) {
  "use strict";

  var SPECIAL_DE = {
    präzise: { m: "präziser", f: "präzise", n: "präzises" },
  };

  /* mat in German is the two-word phrase "aus <Werkstoff>". */
  var COST = {
    de: { adj: 1, spec: 1, mat: 2, epi2: 2, epi3: 3 },
    en: { adj: 1, spec: 1, mat: 1, epi2: 2, epi3: 3 },
  };

  var RECIPES = {
    de: {
      0: [[]],
      1: [["adj"], ["spec"]],
      2: [["adj", "spec"], ["adj", "adj"], ["epi2"], ["mat"]],
      3: [["adj", "mat"], ["adj", "adj", "spec"], ["adj", "epi2"], ["epi3"]],
    },
    en: {
      0: [[]],
      1: [["adj"], ["spec"]],
      2: [["adj", "spec"], ["adj", "mat"], ["adj", "adj"], ["epi2"]],
      3: [["adj", "mat", "spec"], ["adj", "adj", "spec"], ["adj", "epi2"], ["epi3"]],
    },
  };

  function words(text) {
    return String(text).trim().split(/\s+/).filter(Boolean);
  }

  function wordCount(text) {
    return words(text).length;
  }

  function rnd(n) {
    var cryptoObj = globalThis.crypto;
    if (cryptoObj && cryptoObj.getRandomValues) {
      var buf = new Uint32Array(1);
      cryptoObj.getRandomValues(buf);
      return buf[0] % n;
    }
    return Math.floor(Math.random() * n);
  }

  function pick(list) {
    return list[rnd(list.length)];
  }

  function inflectDe(stem, gender) {
    if (SPECIAL_DE[stem]) return SPECIAL_DE[stem][gender];
    var suffix = { m: "er", f: "e", n: "es" }[gender];
    if (!suffix) throw new Error("bad gender for " + stem);
    return stem + suffix;
  }

  function capFirst(text, lang) {
    if (!text) return text;
    var locale = lang === "de" ? "de-DE" : "en-US";
    return text.charAt(0).toLocaleUpperCase(locale) + text.slice(1);
  }

  function normalizeDomains(input) {
    var wanted = Array.isArray(input) ? input : [];
    var set = {};
    wanted.forEach(function (id) {
      if (data.DOMAIN_IDS.indexOf(id) !== -1) set[id] = true;
    });
    var ids = data.DOMAIN_IDS.filter(function (id) {
      return set[id];
    });
    return ids.length ? ids : data.DOMAIN_IDS.slice();
  }

  function recipeCost(lang, recipe) {
    return recipe.reduce(function (sum, step) {
      return sum + COST[lang][step];
    }, 0);
  }

  function weightOf(recipe, humor) {
    var epi = recipe.some(function (step) {
      return step === "epi2" || step === "epi3";
    });
    if (humor === "unhinged" && epi) return 5;
    if (humor === "wry" && epi) return 3;
    if (humor === "serious" && !epi) return 2;
    return 1;
  }

  function usableRecipes(lang, need, humor, ctx) {
    var recipes = RECIPES[lang][need] || [];
    var weighted = [];
    recipes.forEach(function (recipe) {
      if (recipeCost(lang, recipe) !== need) return;
      var adjN = 0;
      var ok = recipe.every(function (step) {
        if (step === "adj") adjN += 1;
        if (step === "spec") return ctx.specs.length > 0;
        if (step === "mat") return ctx.materials.length > 0;
        if (step === "epi2") return ctx.epi2.length > 0;
        if (step === "epi3") return ctx.epi3.length > 0;
        return true;
      });
      if (!ok || adjN > ctx.adjectives.length) return;
      var weight = weightOf(recipe, humor);
      for (var i = 0; i < weight; i += 1) weighted.push(recipe);
    });
    return weighted;
  }

  function drawDistinct(list, count, blocked) {
    var pool = list.filter(function (item) {
      return !blocked.has(item.toLocaleLowerCase("de-DE"));
    });
    var out = [];
    for (var i = 0; i < count; i += 1) {
      if (!pool.length) return null;
      var idx = rnd(pool.length);
      out.push(pool.splice(idx, 1)[0]);
    }
    return out;
  }

  var STOP_WORDS = {
    aus: 1, mit: 1, ohne: 1, der: 1, des: 1, die: 1, den: 1, dem: 1, für: 1, fürs: 1,
    von: 1, und: 1, ins: 1, zur: 1, zum: 1, nach: 1, wider: 1, auf: 1, bei: 1, vom: 1,
    eine: 1, einer: 1, einem: 1, einen: 1, of: 1, the: 1, a: 1, an: 1, with: 1, for: 1,
    from: 1, without: 1, on: 1, after: 1, before: 1, at: 1, out: 1, past: 1, beyond: 1,
    to: 1, and: 1, in: 1, into: 1, jede: 1, jedem: 1, jeder: 1, jeden: 1
  };

  function contentKey(part) {
    var key = part.toLocaleLowerCase("de-DE");
    if (key.length > 4 && key.endsWith("s")) key = key.slice(0, -1);
    return key;
  }

  function hasDuplicateToken(name) {
    var seen = new Set();
    var tokens = words(name);
    for (var i = 0; i < tokens.length; i += 1) {
      var parts = tokens[i].split("-");
      for (var j = 0; j < parts.length; j += 1) {
        var key = contentKey(parts[j]);
        if (!key || key.length < 3 || STOP_WORDS[key]) continue;
        if (seen.has(key)) return true;
        seen.add(key);
      }
    }
    return false;
  }

  function render(lang, noun, pieces) {
    if (lang === "de") {
      var deParts = pieces.adjs.concat([noun.text]);
      if (pieces.spec) deParts.push(pieces.spec);
      if (pieces.material) deParts.push("aus", pieces.material);
      if (pieces.epithet) deParts.push(pieces.epithet);
      return capFirst(deParts.join(" "), "de");
    }
    var enParts = pieces.adjs.slice();
    if (pieces.material) enParts.push(pieces.material);
    enParts.push(noun.text);
    if (pieces.spec) enParts.push(pieces.spec);
    if (pieces.epithet) enParts.push(pieces.epithet);
    return enParts.join(" ");
  }

  function tryOnce(lang, humor, target, domainIds, block) {
    var domain = pick(domainIds);
    var nouns = block.domains[domain].nouns.filter(function (noun) {
      return wordCount(noun.text) <= target;
    });
    if (!nouns.length) return null;
    var noun = pick(nouns);
    var need = target - wordCount(noun.text);
    var toneSpecs = block.specs;
    var tech = (data.techSpecs[lang] && data.techSpecs[lang][domain]) || [];
    var specs = humor === "serious" ? toneSpecs.concat(tech) : toneSpecs.concat(toneSpecs, tech);
    var epithets = block.epithets;
    var ctx = {
      adjectives: block.adjectives,
      specs: specs,
      materials: data.materials[lang],
      epi2: epithets.filter(function (item) {
        return wordCount(item) === 2;
      }),
      epi3: epithets.filter(function (item) {
        return wordCount(item) === 3;
      }),
    };
    var recipes = usableRecipes(lang, need, humor, ctx);
    if (!recipes.length) return null;
    var recipe = pick(recipes);
    var blocked = new Set();
    words(noun.text).forEach(function (token) {
      blocked.add(token.toLocaleLowerCase("de-DE"));
    });
    var adjCount = recipe.filter(function (step) {
      return step === "adj";
    }).length;
    var rawAdjs = adjCount ? drawDistinct(ctx.adjectives, adjCount, blocked) : [];
    if (adjCount && !rawAdjs) return null;
    var adjs = rawAdjs.map(function (stem) {
      return lang === "de" ? inflectDe(stem, noun.gender || "m") : stem;
    });
    adjs.forEach(function (form) {
      blocked.add(form.toLocaleLowerCase("de-DE"));
    });
    var spec = null;
    if (recipe.indexOf("spec") !== -1) {
      var specPool = ctx.specs.filter(function (item) {
        return !blocked.has(item.toLocaleLowerCase("de-DE"));
      });
      if (!specPool.length) return null;
      spec = pick(specPool);
      blocked.add(spec.toLocaleLowerCase("de-DE"));
    }
    var material = null;
    if (recipe.indexOf("mat") !== -1) {
      var matPool = ctx.materials.filter(function (item) {
        return !blocked.has(item.toLocaleLowerCase("de-DE"));
      });
      if (!matPool.length) return null;
      material = pick(matPool);
    }
    var epithet = null;
    if (recipe.indexOf("epi2") !== -1) epithet = pick(ctx.epi2);
    if (recipe.indexOf("epi3") !== -1) epithet = pick(ctx.epi3);
    var name = render(lang, noun, { adjs: adjs, spec: spec, material: material, epithet: epithet });
    if (wordCount(name) !== target || hasDuplicateToken(name)) return null;
    return {
      name: name,
      noun: noun.text,
      domain: domain,
      lang: lang,
      humor: humor,
      words: target,
    };
  }

  function generatePartName(options) {
    var opts = options || {};
    var lang = opts.lang === "en" ? "en" : "de";
    var humor = data.HUMORS.indexOf(opts.humor) !== -1 ? opts.humor : "serious";
    var target = Number(opts.words);
    if ([1, 2, 3, 4].indexOf(target) === -1) target = 3;
    var domainIds = normalizeDomains(opts.domains);
    var block = data.banks[lang][humor];
    var avoid = opts.avoid || "";
    var avoidNoun = opts.avoidNoun || "";
    var last = null;
    for (var i = 0; i < 80; i += 1) {
      var candidate = tryOnce(lang, humor, target, domainIds, block);
      if (!candidate) continue;
      last = candidate;
      if (candidate.name === avoid) continue;
      if (candidate.noun === avoidNoun && i < 50) continue;
      return candidate;
    }
    return last;
  }

  return {
    generatePartName: generatePartName,
    inflectDe: inflectDe,
    words: words,
    wordCount: wordCount,
    hasDuplicateToken: hasDuplicateToken,
    normalizeDomains: normalizeDomains,
    SPECIAL_DE: SPECIAL_DE,
  };
});
