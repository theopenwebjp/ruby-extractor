# Description

Ruby extraction library.
Extracts information from ruby tags including the Katakana/hiragana AND the linked Japanese character(s).

## Usage

```js
import { 
    extractReadableRubyFromPage,
    extractRubyFromPage,
    extractRubyFromElement,
    extractFromRubyElement,
    makeRubyDataListReadable
} from './index.js'

/*
RubyData: {
    str: string;
    ruby: string;
}
*/

/**
 * 🐹: ハムスター<br>🐼: パンダー
 */
extractReadableRubyFromPage({ lf: '<br>' }) // 1st arg optional

/**
 * @return {RubyData[]}
 */
extractRubyFromPage()

/**
 * @return {RubyData[]}
 */
extractRubyFromElement(element)

/**
 * @return {RubyData[]}
 */
extractFromRubyElement(rb)

/**
 * 🐹: ハムスター<br>🐼: パンダー
 * @param {RubyData[]} rubyDataList
 */
makeRubyDataListReadable(rubyDataList, { lf: '<br>' })  // 2nd arg optional

```

## Test

```bash
npx http-server ./
# http://localhost:8080
```

## Localization

- [日本語](./README_JA.md)
