import {getTitle, getParagraphs} from './lib.js';

/**
 * Generates Lorem Ipsum text and replaces it self with that content.  This is to make prototyping more natural without
 * having to style around the x-lip element in the HTML.  This also makes per-element overrides superfluous.
 */
class TxtFillUnwrappedElement extends HTMLElement {
  constructor() {
    super();
    this.replaceContent();
  }

  static get observedAttributes() {
    return ['type', 'w', 'm', 'p', 'wrap'];
  }

  replaceContent() {
    let type = this.getAttribute('type');
    let w = parseInt(this.getAttribute('w'), 10);
    let m = parseInt(this.getAttribute('m'), 10);
    let p = parseInt(this.getAttribute('p'), 10);
    let wrap = this.getAttribute('wrap');
    let template = document.createElement('template');
    let parentNode = this.parentNode;
    let replaceNode = this;

    if (parentNode instanceof HTMLParagraphElement &&
      ('' + wrap === 'undefined' || '' + wrap === '' || wrap === 'p') &&
      (parentNode.children.length <= 1 || parentNode.childNodes.find(e => e.nodeName === '#text' && e.trim().length > 0))
    ) {
      // Assume what the user meant was to replace the paragraph element with multiple paragraph elements and not nested.
      wrap = 'p';
      template.innerHTML = getParagraphs(w, m, p, wrap);
      replaceNode = parentNode;
      parentNode = replaceNode.parentNode;
    } else if (this.parentNode instanceof HTMLHeadingElement) {
      // Assume user wants short, unwrapped text for heading elements.
      template.innerHTML = getTitle(type, w, m);
    } else if (!p && !wrap && (w > 0 || m > 0) && (w <= 20 || m <= 20)) {
      // Assume user wants short, unwrapped text
      template.innerHTML = getTitle(type, w, m);
    } else {
      // Default behavior for all other cases.
      template.innerHTML = getParagraphs(type, w, m, p, wrap);
    }
    return parentNode.replaceChild(template.content, replaceNode);
  }
}

export default TxtFillUnwrappedElement;
customElements.define('txt-fill-unwrap', TxtFillUnwrappedElement);
