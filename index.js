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

// TODO: Currently 1 word per ruby is collected by joining all rt tags together. Test on real sites to see how websites usually use ruby tags and then reconsider spec.
*/

/**
 * @public
 */
export function exportRubyFromPage() {
    var rubyList = extractRubyFromPage();
    var data = serializeRubyList(rubyList);
    console.log(data);
}

/**
 * @public
 */
export function extractRubyFromPage() {
    var rubyList = extractRubyFromElement(document.body);

    return rubyList;
}

/**
 * @typedef {Object} RubyData
 * @property {string} str
 * @property {string} ruby
 */

 /**
  * @param {RubyData[]} list 
  */
function serializeRubyList(list){
    return JSON.stringify(list);
}

/**
 * @param {HTMLElement} element 
 */
function extractRubyFromElement(element){
    /**
     * @type { boolean | { str: string; ruby: string;}[]}
     */
    var rubyList = [];

    /*
    SPEC:
    
    Take direct ruby element rt as pronunciation and outside child as text.
    Returns false if nothing found.
    */
    // TODO: rubyList.push(ruby);
    
    var rubyEls = [...Array.from(element.querySelectorAll('ruby'))]
    rubyEls.forEach(rubyEl => {
        const rubyData = extractFromRubyElement(rubyEl)
        rubyList.push(rubyData)
    })
    
    return rubyList
}

/**
 * @param {HTMLElement} rubyEl 
 */
function extractFromRubyElement(rubyEl) {
    const rtList = Array.from(rubyEl.getElementsByTagName("rt"))
    const rtText = rtList.map(rt => rt.textContent.trim()).join('')

    //Ruby data object
    /**
     * @type {RubyData}
     */
    var ruby = {
        str: getRubyBaseText(rubyEl),
        ruby: rtText
    };

    return ruby;
}

/**
 * @param {HTMLElement} rubyEl 
 */
function getRubyBaseText(rubyEl){
    /*
    SPEC:
    
    rb or text
    */
    
    var text = "";
    
    //Text
    var normalText = getNonNestedElementText(rubyEl);
    text+= normalText;
    
    //Rb
    var rbList = rubyEl.getElementsByTagName("rb");
    for(let i=0; i<rbList.length; i++){
        text+= rbList[i].textContent.trim();
    }
    
    return text;
}

/**
 * @param {HTMLElement} element
 */
function getNonNestedElementText(element){
    var textNodes = getElementTextNodes(element);
    var text = "";
    
    for(var i=0; i<textNodes.length; i++){
        text+= textNodes[i].textContent.trim();
    }
    
    return text;
}

/**
 * @param {HTMLElement} element
 */
function getElementTextNodes(element){
    var nodes = element.childNodes;
    var node;
    var textNodes = [];
    
    for(var i=0; i<nodes.length; i++){
        node = nodes[i];
        
        if(node.nodeType === Node.TEXT_NODE){
            textNodes.push(node);
        }
    }
    
    return textNodes;
}

/**
 * @param {HTMLElement} element 
 * @param {string} tagName 
 */
function getShallowElementsByTagName(element, tagName) {
    var childElements = element.children;
    var returnElements = [];

    for (var i = 0; i < childElements.length; i++) {
        if (childElements[i].tagName.toLowerCase() === tagName.toLowerCase()) {
            returnElements.push(childElements[i]);
        }
    }

    return returnElements;
}