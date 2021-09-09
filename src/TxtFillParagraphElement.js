import {getParagraphs} from './lib.js';

/**
 * Extend paragraph elements to insert multiple setences of Lorem Ipsum.
 */
class TxtFillParagraphElement extends HTMLParagraphElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['type', 'w', 'm'];
  }

  fillContent() {
    let type = this.getAttribute('type');
    let w = parseInt(this.getAttribute('w'), 10);
    let m = parseInt(this.getAttribute('m'), 10);
    this.innerText = getParagraphs(type, w, m, 1, false);
    return this.innerText;
  }

  attributeChangedCallback() {
    this.fillContent();
  }

  connectedCallback() {
    this.fillContent();
  }
}

export default TxtFillParagraphElement;
customElements.define('txt-fill-p', TxtFillParagraphElement, { extends: 'p' });
