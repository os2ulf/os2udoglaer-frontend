<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const hasChildren = computed(() => {
  const { below } = props.node;

  if (below.length === 0) {
    return false;
  } else if (below.length > 0) {
    return true;
  }
});

const isOpen = ref(false);
const toggle = () => {
  isOpen.value = !isOpen.value;
};

const removeNoScroll = () => {
  document.body.classList.remove('no-scroll');
};
</script>

<template>
  <li class="header-item">
    <div class="header-item__item">
      <NuxtLink
        v-if="node?.url && !hasChildren"
        :to="node?.url"
        :target="node?.url_options?.attributes?.target"
        class="header-item__link"
        :aria-label="'Gå til' + node?.title"
        @click="removeNoScroll"
      >
        {{ node?.title }}
      </NuxtLink>
      <span v-if="node?.description" class="header-item__tooltip">
        {{ node?.description }}
      </span>

      <span
        v-if="hasChildren && !node?.url"
        class="header-item__trigger"
        aria-label="Åben menu"
        :class="{ 'header-item__trigger--open': isOpen }"
        type="button"
        @click="toggle"
      >
        <span class="header-item__link">
          {{ node?.title }}
        </span>
        <NuxtIcon class="button__icon-after" name="chevron-down" fill />
      </span>
      <span
        v-else-if="hasChildren && node?.url"
        class="header-item__trigger"
        :class="{ 'header-item__trigger--open': isOpen }"
      >
        <NuxtLink
          :to="node?.url"
          :target="node?.url_options?.attributes?.target"
          class="header-item__link"
          :aria-label="'Gå til' + node?.title"
          @click="removeNoScroll"
        >
          {{ node?.title }}
        </NuxtLink>
        <NuxtIcon
          class="button__icon-after"
          name="chevron-down"
          fill
          aria-label="Åben menu"
          type="button"
          @click="toggle"
        />
      </span>
    </div>

    <ul v-if="hasChildren && isOpen" class="header-item__children">
      <HeaderItem v-for="child in node?.below" :key="child.id" :node="child" />
    </ul>
  </li>
</template>

<style lang="postcss" scoped>
.header-item {
  &__item {
    position: relative;
    display: flex;
    justify-content: space-between;
    padding: 12px 40px;

    &:hover {
      .header-item__tooltip {
        visibility: visible;
        opacity: 1;
      }
    }
  }

  &__link {
    color: var(--color-text);
    font-weight: 400;
    font-size: 20px;
    text-decoration: none;
  }

  &__tooltip {
    position: absolute;
    top: 50%;
    right: 70px;
    z-index: 1;
    display: none;
    padding: 2px 10px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    background-color: var(--color-text);
    border-radius: 6px;
    transform: translateY(-50%);
    visibility: hidden;
    opacity: 0;
    transition:
      opacity 0.2s,
      visibility 0.2s;

    @media (--viewport-sm-min) {
      display: block;
    }
  }

  &__children {
    margin: 0;
    padding: 0 10px 20px 28px;
    font-size: 0.8em;
    list-style: none;

    &:last-child {
      padding-bottom: 0;
    }

    .header-item {
      & a {
        font-size: 18px;
      }

      &:first-child {
        padding-top: 12px;
      }

      &__item {
        padding-top: 0;
        padding-bottom: 12px;
      }
    }
  }

  &__trigger {
    position: relative;
    padding-right: 25px;
    color: var(--color-text);
    font-weight: bold;
    font-size: 15px;
    background: none;
    border: none;

    .nuxt-icon {
      position: absolute;
      top: 10px;
      right: 0;
      display: block;
      transform: rotate(0);
      transition: transform 0.2s;
    }

    &--open {
      .nuxt-icon {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
