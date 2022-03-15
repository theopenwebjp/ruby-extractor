/*
SPEC:

Single Ruby:
<ruby>
    <rb>Base tag</rb>/Can be implied without using tag.
    <rt>Ruby text</rt>
    <rp></rp>Ruby fallback text.
</ruby>

Multiple ruby:
<ruby>
    <rb>...</rb> + text count = below rt count
    <rt>...</rt>
</ruby>

https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rb

RB is not required. rt MUST be matched with rb(if not exist, uses text node before.)

Extracted ruby data then can be aggregated into a dictionary.

Currently 1 word per ruby is collected by joining all rt tags together.
Test on real sites to see how websites usually use ruby tags and then reconsider spec.
*/

/**
 * @typedef {Object} RubyData
 * @property {string} str
 * @property {string} ruby
 */

/**
 * @typedef {Object} ReadableOptions
 * @property {string} [lf] 
 */

/**
 * Helper function for getting ruby data as readable text.
 * @param {ReadableOptions} [options]
 * @public
 */
export function extractReadableRubyFromPage(options = {}) {
    const rubyDataList = extractRubyFromPage();
    return makeRubyDataListReadable(rubyDataList, options);
}

/**
 * Extracts ruby data from page.
 * @public
 */
export function extractRubyFromPage() {
    return extractRubyFromElement(document.body);
}

/**
 * Extract ruby data from specified Element.
 * @public
 * @param {HTMLElement} element 
 */
export function extractRubyFromElement(element){
    /**
     * @type { boolean | { str: string; ruby: string;}[]}
     */
    const rubyList = [];

    /*
    SPEC:
    
    Take direct ruby element rt as pronunciation and outside child as text.
    Returns false if nothing found.
    */
    // TODO: rubyList.push(ruby);
    
    const rubyEls = [...Array.from(element.querySelectorAll('ruby'))]
    rubyEls.forEach(rubyEl => {
        const rubyData = extractFromRubyElement(rubyEl)
        rubyList.push(rubyData)
    })
    
    return rubyList
}

/**
 * Extracts data from specified <rb> Ruby Element.
 * @public
 * @param {HTMLElement} rubyEl 
 */
export function extractFromRubyElement(rubyEl) {
    const rtList = Array.from(rubyEl.getElementsByTagName("rt"))
    const rtText = rtList.map(rt => (rt.textContent || '').trim()).join('')

    // Ruby data object
    /**
     * @type {RubyData}
     */
     const ruby = {
        str: getRubyBaseText(rubyEl),
        ruby: rtText
    };

    return ruby;
}

/**
 * For testing and display purposes.
 * @param {RubyData[]} rubyDataList
 * @param {ReadableOptions} [options]
 */
export function makeRubyDataListReadable(rubyDataList, options = {}) {
    const lf = options.lf || '\n\r'
    const formatRubyData = /** @param {RubyData} d */ (d) => `${d.str}: ${d.ruby}`
    return rubyDataList.map(i => formatRubyData(i)).join(lf)
}

/**
 * @param {HTMLElement} rubyEl 
 */
function getRubyBaseText(rubyEl){
    /*
    SPEC:
    
    rb or text
    */
    
    let text = "";
    
    // Text
    const normalText = getNonNestedElementText(rubyEl);
    text+= normalText;
    
    // Rb
    const rbList = rubyEl.getElementsByTagName("rb");
    for(let i=0; i<rbList.length; i++){
        text+= (rbList[i].textContent || '').trim();
    }
    
    return text;
}

/**
 * @param {HTMLElement} element
 */
function getNonNestedElementText(element){
    const textNodes = getElementTextNodes(element);
    let text = "";
    
    for(let i=0; i<textNodes.length; i++){
        text+= (textNodes[i].textContent || '').trim();
    }
    
    return text;
}

/**
 * @param {HTMLElement} element
 */
function getElementTextNodes(element){
    const nodes = element.childNodes;
    let node;
    const textNodes = [];
    
    for(let i=0; i<nodes.length; i++){
        node = nodes[i];
        
        if(node.nodeType === Node.TEXT_NODE){
            textNodes.push(node);
        }
    }
    
    return textNodes;
}

/**
 * TODO: Not used. Utilize OR move.
 * @param {HTMLElement} element 
 * @param {string} tagName 
 */
function getShallowElementsByTagName(element, tagName) {
    const childElements = element.children;
    const returnElements = [];

    for (let i = 0; i < childElements.length; i++) {
        if (childElements[i].tagName.toLowerCase() === tagName.toLowerCase()) {
            returnElements.push(childElements[i]);
        }
    }

    return returnElements;
}
