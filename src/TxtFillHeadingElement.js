import {getTitle, getParagraphs} from './lib.js';

/**
 * Extend the Heading element to generate short Lorem Ipsum titles. Wrap not supported.
 */
class TxtFillHeadingElement extends HTMLHeadingElement {
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
    this.innerText = getTitle(type, w, m);
    return this.innerHTML;
  }

  attributeChangedCallback() {
    this.fillContent();
  }

  connectedCallback() {
    this.fillContent();
  }
}

export default TxtFillHeadingElement;
customElements.define('txt-fill-heading', TxtFillHeadingElement, { extends: 'h1' });
