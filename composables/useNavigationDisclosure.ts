import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';

export function useNavigationDisclosure(root: Ref<HTMLElement | null>) {
  const activeIndex = ref<number | null>(null);
  const isOpen = computed(() => activeIndex.value !== null);
  let activeTrigger: HTMLElement | null = null;
  let focusOutTimer: ReturnType<typeof setTimeout> | undefined;

  const close = (restoreFocus = false) => {
    clearTimeout(focusOutTimer);
    const trigger = activeTrigger;
    activeIndex.value = null;
    activeTrigger = null;

    if (restoreFocus) trigger?.focus();
  };

  const toggle = (index: number, event: MouseEvent) => {
    if (activeIndex.value === index) {
      close();
    } else {
      activeTrigger = event.currentTarget as HTMLElement;
      activeIndex.value = index;
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen.value) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    }
  };

  const handleFocusOut = (event: FocusEvent) => {
    clearTimeout(focusOutTimer);

    if (event.relatedTarget instanceof Node) {
      if (!root.value?.contains(event.relatedTarget)) close();
      return;
    }

    // During a native focus transfer activeElement may still be the body.
    // When no destination is provided, wait until the browser finishes it.
    focusOutTimer = setTimeout(() => {
      if (!root.value?.contains(document.activeElement)) close();
    }, 0);
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (!root.value?.contains(event.target as Node)) close();
  };

  const handleResize = () => {
    if (!root.value?.getClientRects().length) close();
  };

  onMounted(() => {
    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('resize', handleResize);
  });
  onBeforeUnmount(() => {
    clearTimeout(focusOutTimer);
    document.removeEventListener('pointerdown', handlePointerDown);
    window.removeEventListener('resize', handleResize);
  });

  return { activeIndex, isOpen, toggle, close, handleKeydown, handleFocusOut };
}
