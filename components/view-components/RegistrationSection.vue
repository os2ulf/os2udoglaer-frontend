<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});
</script>

<template>
  <div class="course__registration">
    <h2>Tilmelding</h2>
    <div v-if="props.data.free || props.data.price" class="course__registration__prices">
      <BaseTag
        v-if="props.data.free"
        :data="{ label: 'Gratis' }"
        color="secondary"
      />
      <div
        v-else-if="props.data.price"
        v-for="(price, index) in props.data.price"
        :key="index"
        class="course__registration__price-item"
      >
        <div>
          {{ price?.field_price }} kr.
          {{ price?.field_price_settlement_unit?.label }}
        </div>
        <div>{{ price?.field_price_vat?.label }}</div>
      </div>
    </div>
    <div v-if="props.data.description" class="course__registration__price-description" v-html="props.data.price_description" />
    <div v-if="props.data.description" class="course__registration__description" v-html="props.data.description" />
    <div v-if="props.data.deadline" class="course__registration__description">
      Tilmeldingsfrist: {{ props.data.deadline.text }}
    </div>
    <div v-if="props.data.phone" class="course__registration__phone">
      Tlf.: {{ props.data.phone }}
    </div>
    <div v-if="props.data.email" class="course__registration__email">
      Email: <a :href="'mailto:' + props.data.email">{{ props.data.email }}</a>
    </div>
    <div v-if="props.data.url" class="course__registration__url">
      <a :href="props.data.url" target="_blank">{{ props.data.title ? props.data.title : props.data.url }}</a>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
  .course__registration {
    text-align: center;
    padding: 48px var(--grid-gutter-half) @(--md) 96px var(--grid-gutter-half);
    background: var(--color-secondary-lighten-5);

    & h2 {
      margin-bottom: 16px;
    }

    &__price-item {
      margin-bottom: 16px;
      font-size: 16px @(--md) 22px;
    }

    &__url {
      margin-top: 16px;
      font-size: 16px @(--md) 22px;
    }
  }
</style>
