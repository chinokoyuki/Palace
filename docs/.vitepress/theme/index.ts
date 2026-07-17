import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import AIHero from './components/AIHero.vue'
import BooksPage from './components/BooksPage.vue'
import './styles/alice-future.css'
import './styles/overrides.css'

function setupOutlineScroll() {
  nextTick(() => {
    const outline = document.querySelector('.VPDocAsideOutline')
    const container = document.querySelector('.VPDoc .aside-container')
    if (!outline || !container) return

    const observer = new MutationObserver(() => {
      const active = outline.querySelector('.outline-link.active')
      if (!active) return

      const containerRect = container.getBoundingClientRect()
      const activeRect = active.getBoundingClientRect()
      const scrollTop = container.scrollTop

      if (activeRect.top < containerRect.top + 8) {
        container.scrollTop = scrollTop + activeRect.top - containerRect.top - 8
      } else if (activeRect.bottom > containerRect.bottom - 8) {
        container.scrollTop = scrollTop + activeRect.bottom - containerRect.bottom + 8
      }
    })

    observer.observe(outline, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class'],
    })
  })
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AIHero', AIHero)
    app.component('BooksPage', BooksPage)
  },
  setup() {
    const route = useRoute()

    onMounted(setupOutlineScroll)
    watch(() => route.path, setupOutlineScroll)
  },
} satisfies Theme
