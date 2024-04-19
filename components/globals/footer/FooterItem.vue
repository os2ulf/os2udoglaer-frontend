<script setup>
const props = defineProps({
  node: {
    type: Object,
    required: false,
  },
});

const showAcc = ref(false);

const hasChildren = computed(() => {
  const { below } = props.node;

  if (below.length === 0) {
    return false;
  } else if (below.length > 0) {
    return true;
  }
});
</script>

<template>
  <div class="col-footer-item footer-item--heading">
    <div
      :class="
        (!node?.url ? 'footer-headline ' : '') + (showAcc ? 'active-acc' : '')
      "
    >
      <div v-if="!node?.url" class="footer-item__link footer-item__link--title">
        {{ node?.title }}
      </div>

      <NuxtLink
        v-else
        :to="node?.url"
        class="footer-item__link"
        :class="!node?.url ? 'footer-item__link--title' : ''"
      >
        {{ node?.title }}
      </NuxtLink>
    </div>

    <div
      v-if="hasChildren"
      class="footer-item__children"
      :class="showAcc ? 'footer-item__children--active' : ''"
    >
      <NuxtLink
        v-for="child in node?.below"
        :key="child.id"
        :to="child?.url"
        class="footer-item__link"
        :class="child?.description ? 'footer-item__link--tooltip' : ''"
      >
        {{ child?.title }}

        <span v-if="child?.description" class="footer-item__tooltip">
          {{ child?.description }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.footer-headline {
  display: flex;
  justify-content: space-between;
  border: none;
  cursor: auto;
}

.footer-item {
  &__link {
    padding: 0.4em 0;
    color: var(--color-white);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      opacity: 1;
    }

    &--title {
      color: var(--color-white);
      font-weight: 700;
      font-size: 16px;
      text-transform: uppercase;
      opacity: 0.5;

      &:hover {
        text-decoration: none;
        opacity: 0.5;
      }

      @media (--viewport-ms-max) {
        /* mobile view */
        font-weight: 400;
        font-size: 18px;
        line-height: 26px;
      }
    }
  }

  &__children {
    display: grid;

    @media (--viewport-ms-max) {
      display: none;
    }

    &--active {
      display: grid;
    }
  }
}

.footer-item__link--tooltip:hover {
  .footer-item__tooltip {
    visibility: visible;
    opacity: 1;
  }
}
</style>
