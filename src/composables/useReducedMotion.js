import { ref, onMounted, onUnmounted } from 'vue'

export function useReducedMotion() {
  const reduced = ref(
    typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  return { reduced }
}

export function useIsMobile(breakpoint = 900) {
  const mobile = ref(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  )

  onMounted(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`)
    const update = () => { mobile.value = mq.matches }
    mq.addEventListener('change', update)
    onUnmounted(() => mq.removeEventListener('change', update))
  })

  return { mobile }
}
