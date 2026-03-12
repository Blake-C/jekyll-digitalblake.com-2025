document.addEventListener('DOMContentLoaded', () => {
    // ── Normalize Prism class names (lang-* → language-*) ───────────────────────
    document.querySelectorAll('pre code[class]').forEach((el) => {
        el.className = el.className.replace(/\blang-(\w+)/g, 'language-$1')
    })

    if (typeof Prism !== 'undefined') {
        Prism.highlightAll()
    }

    // ── Gallery modal buttons — prevent anchor navigation ───────────────────────
    document.querySelectorAll('.js_sites-gallery__button').forEach((el) => {
        el.addEventListener('click', (e) => e.preventDefault())
    })

    // ── MicroModal init ─────────────────────────────────────────────────────────
    if (typeof MicroModal !== 'undefined') {
        MicroModal.init({ disableScroll: true })
    }

    // ── Header shrink on scroll ─────────────────────────────────────────────────
    const header = document.getElementById('top_header')

    if (header) {
        const onScroll = () => {
            header.classList.toggle('smaller', window.scrollY > 50)
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll() // run once on load to handle refreshed-while-scrolled
    }
})
