<script setup lang="ts">
import { productionDomains } from './config/productionDomains';

defineProps({
  error: { type: Object, required: true },
});

useHead({
  title: 'Der skete desværre en fejl',
  meta: [
    {
      name: 'description',
      content: 'Vi kunne desværre ikke finde den side, du ledte efter.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
});

const showErrorMessageOnDev = computed(() => {
  if (typeof window !== 'undefined') {
    return (
      window.location.hostname === 'localhost' ||
      !productionDomains.includes(window.location.hostname)
    );
  }
  return false;
});
</script>

<template>
  <div id="app">
    <TheHeaderParent />
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-12 col-sm-12">
          <div class="error">
            <h1>Siden blev ikke fundet</h1>
            <p>Vi beklager, vi kunne ikke finde den side, du anmodede om.</p>

            <ClientOnly>
              <pre class="error__message" v-if="showErrorMessageOnDev">
                {{ error }}
              </pre>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
    <TheFooterParent />
  </div>
</template>

<style lang="postcss">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.error {
  color: var(--theme-color);
  padding-top: 40px;
  &__message {
    padding-top: 20px;
  }
}
</style>
