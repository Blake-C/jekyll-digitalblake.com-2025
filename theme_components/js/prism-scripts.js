import Prism from 'prismjs'

import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-css-extras'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-php-extras'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'

import 'prismjs/plugins/line-numbers/prism-line-numbers'
import 'prismjs/plugins/autolinker/prism-autolinker'
import 'prismjs/plugins/normalize-whitespace/prism-normalize-whitespace'
import 'prismjs/plugins/toolbar/prism-toolbar'
import 'prismjs/plugins/show-language/prism-show-language'
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard'

document.querySelectorAll('pre > code[class]').forEach(code => {
	code.parentElement.classList.add('line-numbers')
})

Prism.highlightAll()
