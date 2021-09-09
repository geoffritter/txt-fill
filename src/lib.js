/**
 * Defines some basic functions for generating text based on some fixed set of strings
 */
import LoremIpsum from './LoremIpsum.js';

/**
 * The default types to fill content with.
 */
let TYPE = {
  'LoremIpsum': LoremIpsum
}

// Set reasonable defaults for random title and paragraph lengths.
// These can be overridden in each type file.
let titleMin = 3;
let titleMax = 5;
let sentenceMin = 100;
let sentenceMax = 200;


/**
 * Adds a new text definition to be usable by the elements.
 * @param {string} type The key name to use on the element.
 * @param {DEFINITION} definition The object to use for the titles and sentences.
 */
export function addType(type, definition) {
  if (typeof definition === 'object' && definition.titles && definition.sentences) {
    TYPE[type] = definition;
  }
  let elements = document.querySelectorAll(`[type=${type}]`);
  initTypeHelpers(TYPE[type]);
  for (let i = 0; i < elements.length; i++) {
    elements[i].setAttribute('type', type);
  }
}


/**
 * Counts the number of words in each phrase if not prefilled.
 */
function initWordCount(type) {
  if (TYPE[type] && !TYPE[type].wordCount) {
    let t = TYPE[type]
    if (!t.titles) { t.titles = []; }
    if (!t.sentences) { t.sentences = []; }
    let count = ary => {
      for (let i = 0, il = ary.length; i < il; i++) {
        ary.words[i] = countWords(ary[i]);
      }
    }
    count(t.titles);
    count(t.sentences);
  }
}

/**
 * Gets the next phrase in our list
 */
function next() {
  return this[++this._c >= this.length ? this._c = 0 : this._c];
}

/**
 * Provides a word count of the current phrase
 */
function words() {
  return this.words[this._c];
};

/**
 * Initializes some helpers onto each TYPE object. You can override min, max and _c (starting phrase) in the type file.
 */
function initTypeHelpers(type) {
  initWordCount(type)
  if (type.titles.min === undefined) { type.titles.min = titleMin; }
  if (type.titles.max === undefined) { type.titles.max = titleMax; }
  if (type.titles._c === undefined) { type.titles._c = rand(0, type.titles.length); }
  type.titles.next = next.bind(type.titles);
  type.titles.words = words.bind(type.titles);

  if (type.sentences.min === undefined) { type.sentences.min = sentenceMin; }
  if (type.sentences.max === undefined) { type.sentences.max = sentenceMax; }
  if (type.sentences._c === undefined) { type.sentences._c = -1 }; // start at -1 so next is 0
  type.sentences.next = next.bind(type.sentences);
  type.sentences.words = words.bind(type.sentences);
}

// Initialize all base types. This should be quick enough if we don't add too many.
for (let key in TYPE) {
  if (TYPE.hasOwnProperty(key)) {
    initTypeHelpers(TYPE[key]);
  }
}


/**
 * Simple random number generator for positive integers. Defaults to between 0 and 10.
 */
function rand(min, max) {
  // Min is anything 0 or above.
  let n = Math.max(parseInt(min, 10) || 0, 0) | 0;
  // Max is anything 1 or above. Default 10.
  let m = Math.max(parseInt(max, 10) || 10, 1) | 0;
  if (n === m) {
    return n;
  } else {
    // Ensure max is larger than min.
    [n, m] = n < m ? [n, m] : [m, n]; 
    return ((Math.random() * (m - n + 1)) | 0) + n | 0; 
  }
}


/**
 * Approximates the number of words in a string.
 */
function countWords(str) {
  // Decent average for English and efficient.
  return str.length / 5 | 0
}


/**
 * Returns a short phrase without any html tags.
 */
export function getTitle(type, wordsMin, wordsMax) {
  let t = TYPE[type] === undefined ? TYPE.LoremIpsum : TYPE[type];
  let n = wordsMin | 0;
  let m = wordsMax | 0;
  if (n + m <= 0) {
    // If neither parameter supplied use default values.
    n = t.titles.min;
    m = t.titles.max;
  } else if (n == 0 || m == 0) {
    // Assume the user doesn't want random lengths if only one parameter supplied
    n = m = Math.max(n, m);
  }
  let w = rand(n, m);
  let title = t.titles.next();
  let count = t.titles.words();
  while (count < w) {
    title += ' ' + t.titles.next();
    count += t.titles.words();
  }
  let slice = title.split(' ').slice(0, w);
  // Pesky function words at the end need to be capitalized.
  let lastWord = slice.pop();
  slice.push(lastWord[0].toUpperCase() + lastWord.slice(1,));
  return slice.join(' ');
}


/**
 * Generate paragraphs from phrases separated by wrap tags. If 'br' or 'n', then it will not enclose them, but just
 * separate them. Paragraphs uses the word count to determine how many sentences to append. It does not truncate them
 * to match eactly, only that it is at least as many words. This avoides wastefull word counting, regular expressions,
 * and string splitting.
 * @param {string} type The type of strings to pull, defaults to LoremIpsum
 * @param {number} wordsMin The minimum number of words in each paragraph.
 * @param {number} wordsMax The maximum number of words in each paragraph.
 * @param {number} paragraphs The number of paragraphs to generate.
 * @param {WRAP} wrap How to wrap the paragraphs.
 */
export function getParagraphs(type, wordsMin, wordsMax, paragraphs, wrap) {
  let t = TYPE[type] === undefined ? TYPE.LoremIpsum : TYPE[type];
  let n = wordsMin | 0 || t.sentences.min;
  let m = wordsMax | 0 || t.sentences.max;
  if (n < 10) n = 80;
  if (m < 10) m = n;
  let p = paragraphs || 1;
  let out = [];
  for (let i = 0; i < p; i++) {
    // Loop over current phrase till long enough for our word count length.
    let w = rand(n, m);
    let str = t.sentences.next();
    let count = t.sentences.words();
    while (count <= w) {
      str += ' ' + t.sentences.next();
      count += t.sentences.words();
    }
    out.push(str);
  }

  if ('' + wrap === 'undefined' || '' + wrap === '' || '' + wrap === 'null') { wrap = 'p'; }
  let match;
  if (wrap === 'false' || wrap === false) {
    return out.join('');
  } else if (match = wrap.match(/^(br)+$/g)) {
    match = wrap.match(/br/g);
    let breaks = '';
    for (let i = 0, ml = match.length; i < ml; i++) {
      breaks += '<br>';
    }
    return out.join(breaks);

  } else if (match = wrap.match(/^([n\n]|\\n)+$/g)) {
    match = wrap.match(/[n\n]/g);
    let newLines = '';
    for (let i = 0, ml = match.length; i < ml; i++) {
      newLines += '\n';
    }
    return out.join(newLines);

  } else if (match = wrap.match(/^([s\s]|\\s)+$/g)) {
    match = wrap.match(/[s\s]/g);
    let spaces = '';
    for (let i = 0, ml = match.length; i < ml; i++) {
      spaces += ' ';
    }
    return out.join(spaces);
  }
  return `<${wrap}>` + out.join(`</${wrap}><${wrap}>`) + `</${wrap}>`;
}
