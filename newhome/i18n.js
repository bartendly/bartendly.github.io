(function () {
    'use strict';
    
    async function loadTranslations(url) {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
    throw new Error('Unable to load translations.');
    }
    return response.json();
    }
    
    function getNestedValue(obj, key) {
        if (!obj) {
        return undefined;
        }
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
        }
        return key.split('.').reduce(function (acc, part) {
        return acc && Object.prototype.hasOwnProperty.call(acc, part) ? acc[part] : undefined;
        }, obj);
    }
    
    function createFlatLookup(localeObject) {
    return new Proxy({}, {
    get: function (_, prop) {
    return getNestedValue(localeObject, String(prop));
    }
    });
    }
    
    function detectPreferredLanguage(availableLanguages) {
    var saved = window.localStorage.getItem('bartendly-language');
    if (saved && availableLanguages.includes(saved)) {
    return saved;
    }
    var browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
    if (availableLanguages.includes(browser)) {
    return browser;
    }
    return availableLanguages[0] || 'en';
    }
    
    function translateDocument(flat) {
    document.querySelectorAll('[data-i18n]').forEach(function (node) {
    var key = node.getAttribute('data-i18n');
    var value = flat[key];
    if (typeof value === 'string') {
    node.textContent = value;
    }
    });
    
    document.querySelectorAll('[data-i18n-html]').forEach(function (node) {
    var key = node.getAttribute('data-i18n-html');
    var value = flat[key];
    if (typeof value === 'string') {
    node.innerHTML = value;
    }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (node) {
    var key = node.getAttribute('data-i18n-placeholder');
    var value = flat[key];
    if (typeof value === 'string') {
    node.setAttribute('placeholder', value);
    }
    });
    
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (node) {
    var key = node.getAttribute('data-i18n-aria-label');
    var value = flat[key];
    if (typeof value === 'string') {
    node.setAttribute('aria-label', value);
    }
    });
    }
    
    async function initI18n() {
    var translations = await loadTranslations('translations.json');
    var availableLanguages = Object.keys(translations);
    var currentLanguage = detectPreferredLanguage(availableLanguages);
    var selector = document.querySelector('[data-language-select]');
    var selectorWrap = document.querySelector('[data-language-wrap]');
    var flat = createFlatLookup(translations[currentLanguage]);
    
    document.documentElement.lang = currentLanguage;
    translateDocument(flat);
    window.__BARTENDLY_I18N__ = {
    translations: translations,
    currentLanguage: currentLanguage,
    flat: flat
    };
    
    if (selector) {
    selector.innerHTML = '';
    availableLanguages.forEach(function (language) {
    var option = document.createElement('option');
    option.value = language;
    option.textContent = flat['lang.' + language] || language.toUpperCase();
    if (language === currentLanguage) {
    option.selected = true;
    }
    selector.appendChild(option);
    });
    selector.addEventListener('change', function (event) {
        var nextLanguage = event.target.value;
        var nextFlat = createFlatLookup(translations[nextLanguage]);
        window.localStorage.setItem('bartendly-language', nextLanguage);
        document.documentElement.lang = nextLanguage;
        translateDocument(nextFlat);
        window.__BARTENDLY_I18N__ = {
        translations: translations,
        currentLanguage: nextLanguage,
        flat: nextFlat
        };
        document.dispatchEvent(new CustomEvent('bartendly:i18n-ready', {
        detail: {
        translations: translations,
        currentLanguage: nextLanguage,
        flat: nextFlat
        }
        }));
    });
    }
    
    if (selectorWrap) {
    selectorWrap.hidden = availableLanguages.length <= 1;
    }
    
    document.dispatchEvent(new CustomEvent('bartendly:i18n-ready', {
    detail: {
    translations: translations,
    currentLanguage: currentLanguage,
    flat: flat
    }
    }));
    }
    
    window.BartendlyI18n = {
    init: initI18n
    };
    
    document.addEventListener('DOMContentLoaded', function () {
    initI18n().catch(function (error) {
    console.error(error);
    });
    });
    })();