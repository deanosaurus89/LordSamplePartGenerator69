/* Wires the nameplate UI to the generator. No network. */
(function () {
  "use strict";

  var generator = window.SampleGenerator;
  var i18n = window.SampleI18n;
  var STORAGE_KEY = "lord-sample-settings-v1";

  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); };

  var state = loadState();
  var current = null;
  var minted = false;
  var copyTimer = 0;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadState() {
    var defaults = { lang: "de", words: 3, humor: "wry", domains: [] };
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      var parsed = JSON.parse(raw);
      var lang = parsed.lang === "en" ? "en" : "de";
      var words = Number(parsed.words);
      if ([1, 2, 3, 4].indexOf(words) === -1) words = 3;
      var humor = parsed.humor === "serious" || parsed.humor === "unhinged" ? parsed.humor : "wry";
      if (parsed.humor === "wry") humor = "wry";
      var domains = Array.isArray(parsed.domains) ? parsed.domains.filter(knownDomain) : [];
      return { lang: lang, words: words, humor: humor, domains: domains };
    } catch (err) {
      return defaults;
    }
  }

  function knownDomain(id) {
    return window.SampleData.DOMAIN_IDS.indexOf(id) !== -1;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      /* private mode can reject storage; the page still works */
    }
  }

  function t(key) {
    return i18n.t(state.lang, key);
  }

  function applyI18n() {
    clearTimeout(copyTimer);
    var copyBtn = $("#copy");
    copyBtn.classList.remove("is-copied", "is-failed");
    document.documentElement.lang = state.lang;
    document.title = t("docTitle");
    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("description"));
    $$("[data-i18n]").forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      node.textContent = t(key);
    });
    refreshGenerateLabel();
    updateHint();
    if (current) paint(current, false);
  }

  function refreshGenerateLabel() {
    $("#generate").textContent = minted ? t("regenerate") : t("generate");
  }

  function updateHint() {
    var hint = $("#domainHint");
    var mix = $("#mix");
    var empty = state.domains.length === 0;
    hint.textContent = empty ? t("domainHintEmpty") : t("domainHintSelected");
    mix.classList.toggle("is-on", empty);
    mix.setAttribute("aria-pressed", empty ? "true" : "false");
  }

  function syncControls() {
    $$('input[name="lang"]').forEach(function (input) {
      input.checked = input.value === state.lang;
    });
    $$('input[name="words"]').forEach(function (input) {
      input.checked = Number(input.value) === state.words;
    });
    $$('input[name="humor"]').forEach(function (input) {
      input.checked = input.value === state.humor;
    });
    $$('input[name="domain"]').forEach(function (input) {
      input.checked = state.domains.indexOf(input.value) !== -1;
    });
    document.body.dataset.humor = state.humor;
  }

  function readControls() {
    var langInput = $('input[name="lang"]:checked');
    var wordsInput = $('input[name="words"]:checked');
    var humorInput = $('input[name="humor"]:checked');
    state.lang = langInput ? langInput.value : "de";
    state.words = wordsInput ? Number(wordsInput.value) : 3;
    state.humor = humorInput ? humorInput.value : "wry";
    state.domains = $$('input[name="domain"]:checked').map(function (input) {
      return input.value;
    });
    document.body.dataset.humor = state.humor;
  }

  function partNumber(name) {
    var hash = 2166136261;
    for (var i = 0; i < name.length; i += 1) {
      hash ^= name.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    var n = (hash >>> 0) % 900 + 100;
    return "LS-69-" + n;
  }

  function paint(result, animate) {
    var nameEl = $("#name");
    nameEl.textContent = result.name;
    nameEl.lang = result.lang;
    nameEl.classList.toggle("is-long", result.name.length > 32);
    nameEl.classList.toggle("is-huge", result.name.length > 52);
    if (animate && !reduceMotion) {
      nameEl.classList.remove("is-updating");
      void nameEl.offsetWidth;
      nameEl.classList.add("is-updating");
    }
    $("#pn").textContent = partNumber(result.name);
    $("#meta").textContent = i18n.metaLine(state.lang, result);
    var badge = $("#badge");
    var badgeKey = result.humor === "serious" ? "badgeSerious" : result.humor === "unhinged" ? "badgeUnhinged" : "badgeWry";
    badge.textContent = t(badgeKey);
    badge.dataset.tone = result.humor;
    $("#live").textContent = t("srReady") + " " + result.name;
  }

  function generate() {
    if (!generator) return;
    var result = generator.generatePartName({
      lang: state.lang,
      words: state.words,
      humor: state.humor,
      domains: state.domains,
      avoid: current ? current.name : "",
      avoidNoun: current ? current.noun : "",
    });
    if (!result || !result.name) {
      $("#live").textContent = t("error");
      return;
    }
    current = result;
    minted = true;
    refreshGenerateLabel();
    paint(result, true);
  }

  function legacyCopy(text) {
    var area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "0";
    area.style.left = "0";
    area.style.width = "2em";
    area.style.height = "2em";
    area.style.padding = "0";
    area.style.border = "none";
    area.style.outline = "none";
    area.style.boxShadow = "none";
    area.style.background = "transparent";
    document.body.appendChild(area);
    area.focus();
    area.select();
    try {
      area.setSelectionRange(0, text.length);
    } catch (err) {
      /* some browsers reject setSelectionRange on certain inputs */
    }
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err2) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function flashCopy(ok) {
    var btn = $("#copy");
    btn.textContent = ok ? t("copied") : t("copyFailed");
    btn.classList.toggle("is-copied", ok);
    btn.classList.toggle("is-failed", !ok);
    $("#live").textContent = (ok ? t("copied") : t("copyFailed")) + (current ? ": " + current.name : "");
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      btn.textContent = t("copy");
      btn.classList.remove("is-copied", "is-failed");
    }, 2200);
  }

  function onCopy() {
    if (!current || !current.name) return;
    var text = current.name;
    /* Must run during the click. A later clipboard promise is no longer a user gesture. */
    var synced = legacyCopy(text);
    var clipboard = navigator.clipboard;
    var canAsync = clipboard && window.isSecureContext && clipboard.writeText;
    if (synced) {
      flashCopy(true);
      if (canAsync) clipboard.writeText(text).catch(function () {});
      return;
    }
    if (!canAsync) {
      flashCopy(false);
      return;
    }
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      flashCopy(false);
    }, 700);
    clipboard.writeText(text).then(function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      flashCopy(true);
    }).catch(function () {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      flashCopy(false);
    });
  }

  if (!generator || !i18n || !window.SampleData) {
    $("#name").textContent = "Generator fehlt.";
    return;
  }

  syncControls();
  applyI18n();
  generate();

  $("#console").addEventListener("submit", function (event) {
    event.preventDefault();
    readControls();
    save();
    generate();
  });

  /* Language radios live in the header, outside the form. */
  document.addEventListener("change", function (event) {
    var name = event.target && event.target.name;
    if (name !== "lang" && name !== "words" && name !== "humor" && name !== "domain") return;
    var prevLang = state.lang;
    readControls();
    save();
    if (state.lang !== prevLang) applyI18n();
    else updateHint();
    generate();
  });

  $("#again").addEventListener("click", function () {
    generate();
  });

  $("#copy").addEventListener("click", onCopy);

  $("#mix").addEventListener("click", function () {
    state.domains = [];
    $$('input[name="domain"]').forEach(function (input) {
      input.checked = false;
    });
    save();
    updateHint();
    generate();
  });
})();
