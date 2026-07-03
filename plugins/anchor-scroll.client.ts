import { nextTick } from 'vue'

const getHashId = (hash: string) => {
  const id = hash.replace(/^#/, '')

  try {
    return decodeURIComponent(id)
  } catch {
    return id
  }
}

const scrollToHash = async (hash: string) => {
  if (!hash) return

  await nextTick()

  requestAnimationFrame(() => {
    const element = document.getElementById(getHashId(hash))

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const handleAnchorClick = (event: MouseEvent) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const target = event.target instanceof Element ? event.target : null
    const anchor = target?.closest('a[href*="#"]') as HTMLAnchorElement | null

    if (!anchor || (anchor.target && anchor.target !== '_self')) return

    const url = new URL(anchor.href, window.location.href)
    const isSamePage =
      url.origin === window.location.origin &&
      url.pathname === window.location.pathname &&
      url.search === window.location.search

    if (!isSamePage || !url.hash) return

    event.preventDefault()
    const nextUrl = `${url.pathname}${url.search}${url.hash}`

    if (
      `${window.location.pathname}${window.location.search}${window.location.hash}` !==
      nextUrl
    ) {
      history.pushState(null, '', nextUrl)
    }

    scrollToHash(url.hash)
  }

  document.addEventListener('click', handleAnchorClick)

  router.afterEach((to) => {
    if (to.hash) {
      scrollToHash(to.hash)
    }
  })

  nuxtApp.hook('page:finish', () => {
    if (window.location.hash) {
      scrollToHash(window.location.hash)
    }
  })
})
