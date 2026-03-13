import './modules/_skip-link-focus-fix.js'
import './modules/_animate-header'
import './modules/_smooth-scroll'
import Prism from 'prismjs'
import MicroModal from 'micromodal'
import { detect } from 'detect-browser'
const browser = detect()

// handle the case where we don't detect the browser
if (browser) {
	const version = browser.version.split('.')
	document.body.classList.add(`${browser.name}-${version[0]}`)
}

/**
 * Notes:
 *
 * All imports belong at the top of the file.
 *
 * Webpack only outputs this one script file, if you need
 * another file then add it to the scripts-list.js file as
 * another line in the scripts_list object.
 *
 * The scripts_list const is imported into the webpack
 * config. I've done this so that you do not have to
 * wade through the consfig to find what is being
 * compiled out as its own file.
 *
 * Also if you create another js file keep your scripts
 * within an immediately invoked function expression.
 * This will prevent other plugins or your own chunks
 * of code from conflicting with eachother. More info
 * can be found here:
 *
 * @link: http://benalman.com/news/2010/11/immediately-invoked-function-expression/
 */

/*************** Template part region toggle button ***************/
const regions = document.querySelectorAll('.regions')

Array.from(regions).map(regions => {
	regions.addEventListener('click', function (event) {
		event.preventDefault()

		const placeholder = document.querySelectorAll('.placeHolderPosition')

		Array.from(placeholder).map(placeholder => {
			if (placeholder.style.display === 'none') {
				placeholder.style.display = 'block'
			} else {
				placeholder.style.display = 'none'
			}
		})
	})
})

/*************** Prism Syntax Highlighting ***************/
document.querySelectorAll('pre > code[class]').forEach(code => {
	code.parentElement.classList.add('line-numbers')
})
Prism.highlightAll()

/*************** Lazy Load Remodal Images ***************/
Array.from(document.querySelectorAll('.js_sites-gallery__button')).map(button => {
	button.addEventListener('click', function (event) {
		event.preventDefault()
	})
})

MicroModal.init({
	disableScroll: true,
	onShow: modal => {
		const images = modal.getElementsByTagName('img')

		Array.from(images).forEach(image => {
			if (image.dataset.src) {
				image.setAttribute('src', image.dataset.src)
			}
		})
	},
})
