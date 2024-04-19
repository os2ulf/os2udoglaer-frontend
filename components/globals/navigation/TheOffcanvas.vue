<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const navigationMenuData = props.data;
// const navigationMenuDataAtoms = data.value.menu.links;
</script>

<template>
  <div v-if="navigationMenuData" class="offcanvas">
    <button
      type="button"
      aria-label="Luk menu"
      class="offcanvas__close"
      @click="$emit('close')"
    >
      <NuxtIcon name="close" fill />
    </button>

    <div class="offcanvas__heading">Menu</div>

    <div class="offcanvas__menu-wrapper">
      <ul class="offcanvas__menu">
        <HeaderItem
          v-for="(node, index) in navigationMenuData"
          :key="index"
          :node="node"
        />
      </ul>
      <div class="offcanvas__outer-wrapper-footer">
        <div class="offcanvas__footer">
          <div class="offcanvas__text-links">
            <!-- TODO: 2 Atoms once backend fixed -->
            <!-- <NuxtLink
              v-for="(link, index) in navigationMenuDataAtoms"
              :key="index"
              :to="link.url"
              class="link link--primary"
              :target="link.target === '_blank' ? '_blank' : '_self'"
            >
              {{ link.title }}
            </NuxtLink> -->
          </div>

          <div class="offcanvas__social-media">
            <NuxtLink
              aria-label="Kino.dk på Facebook"
              to="https://www.facebook.com/kino.dk"
              target="_blank"
              class="link link--primary offcanvas__social-media-icon"
            >
              <NuxtIcon name="facebook" fill />
            </NuxtLink>

            <NuxtLink
              aria-label="Kino.dk på YouTube"
              to="https://www.youtube.com/kinotvdk"
              target="_blank"
              class="link link--primary offcanvas__social-media-icon"
            >
              <NuxtIcon name="youtube" fill />
            </NuxtLink>

            <NuxtLink
              aria-label="Kino.dk på Instagram"
              to="https://www.instagram.com/kinodk"
              target="_blank"
              class="link link--primary offcanvas__social-media-icon"
            >
              <NuxtIcon name="instagram" fill />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.offcanvas {
  position: fixed;
  top: 0;
  right: 20px;
  left: 0;
  z-index: 999;
  width: 100% @(--sm) 400px;
  height: 100%;
  background: var(--color-white);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  &__close {
    position: absolute;
    top: 28px;
    left: 22px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    color: var(--color-text);
    background-color: var(--color-white);
    border: 1px solid var(--color-white);
    border-radius: 50%;

    &:hover {
      transform: translateY(1px);
    }

    &:active {
      transform: translateY(2px);
    }
  }

  &__heading {
    padding: 40px 0;
    font-weight: 700;
    font-size: 18px;
    text-align: center;
  }

  &__menu-wrapper {
    display: grid;
    height: calc(100% - 78px);
    overflow-y: auto;
  }

  &__menu {
    margin: 0;
    padding: 0;
    font-size: 24px;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 40px;
  }

  &__text-links {
    display: grid;
    padding: 6px 0;
    font-weight: 400;
    font-size: 16px;

    a {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__outer-wrapper-footer {
    display: flex;
    align-self: self-end;
    padding-bottom: 20px;
  }

  &__social-media {
    display: flex;
  }

  &__social-media-icon {
    display: flex;
    justify-content: center;
    margin-left: 10px;
    padding: 10px;
    color: var(--color-black);
    font-size: 18px;
    background-color: var(--color-gray-6);
    border-radius: 50%;
    transition: 0.3s;
  }
}
</style>
