import {getParagraphs} from './lib.js';

/**
 * Extend the div element with Lorem Ipsum text.  The wrap attribute will determine how paragraph(s) are separated.
 * @example
 * <div is="txt-fill-div" wrap="p" w="80" m="120" p="2"></div>
 */
class TxtFillDivElement extends HTMLDivElement {
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
    this.innerHTML = getParagraphs(type, w, m, p, wrap);
    return this.innerHTML;
  }

  attributeChangedCallback() {
    this.fillContent();
  }

  connectedCallback() {
    this.fillContent();
  }
}

export default TxtFillDivElement;
customElements.define('txt-fill-div', TxtFillDivElement, { extends: 'div' });
