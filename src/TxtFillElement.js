import {getTitle, getParagraphs} from './lib.js';

/**
 * Generates Lorem Ipsum text in a custom element. Depending on parameters, it will either be a short phrase for
 * a header or paragraph(s) wrapped in 'p', 'br', '\n', or 'custom-tags' based on the wrap attribute.
 */
class TxtFillElement extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['type', 'w', 'm', 'p', 'wrap'];
  }

  fillContent() {
    let type = this.getAttribute('type');
    let w = parseInt(this.getAttribute('w'), 10);
    let m = parseInt(this.getAttribute('m'), 10);
    let p = parseInt(this.getAttribute('p'), 10);
    let wrap = this.getAttribute('wrap');
    if (!p && w > 0) {
      this.innerText = getTitle(type, w, m);
    } else {
      this.innerHTML = getParagraphs(type, w, m, p, wrap);
    }
    return this.innerHTML;
  }

  attributeChangedCallback() {
    this.fillContent();
  }

  connectedCallback() {
    this.fillContent();
  }
}

export default TxtFillElement;
customElements.define('txt-fill', TxtFillElement);
