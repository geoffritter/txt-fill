import {addType} from './lib.js';
import TxtFillElement from './TxtFillElement.js';
import TxtFillDivElement from './TxtFillDivElement.js';
import TxtFillParagraphElement from './TxtFillParagraphElement.js';
import TxtFillHeadingElement from './TxtFillHeadingElement.js';
import TxtFillUnwrap from './TxtFillUnwrapElement.js';
import './typedefs.js';

export default TxtFillElement;
export { addType, TxtFillElement, TxtFillUnwrap };

window.txtfill = window.txtfill ? window.txtfill : {
	addType: addType
};