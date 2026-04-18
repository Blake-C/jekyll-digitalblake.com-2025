import Prism from 'prismjs'

document.querySelectorAll('pre > code[class]').forEach(code => {
	code.parentElement.classList.add('line-numbers')
})

Prism.highlightAll()
