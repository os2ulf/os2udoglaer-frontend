<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const formatDeadlineString = computed(() => {
  const deadlineString = ref(props.data?.deadline?.text);

  if (!deadlineString.value) return null;

  const dateMatch = deadlineString.value.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);

  if (!dateMatch) {
    return null;
  }

  if (dateMatch) {
    const date = dateMatch[0];
    const formattedDate = date.replace(/\//g, '.');

    return formattedDate;
  } else {
    return null;
  }
});
</script>

<template>
  <div class="course__registration">
    <h2 v-if="props.data.bundle == 'internship'">Ansøgning</h2>
    <h2 v-else>Tilmelding</h2>
    <div
      v-if="props.data.free || props.data.price"
      class="course__registration__prices"
    >
      <BaseTag
        v-if="props.data.free"
        :data="{ label: data?.field_sold_out ? 'Udsolgt' : 'Gratis' }"
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
    <div
      v-if="props.data.price_description"
      class="course__registration__price-description"
    >
      <div v-html="props.data.price_description"></div>
    </div>
    <div
      v-if="props.data.description != null"
      class="course__registration__description"
      v-html="props.data.description"
    ></div>

    <div v-if="formatDeadlineString" class="course__registration__description">
      Tilmeldingsfrist: {{ formatDeadlineString }}
    </div>
    <div v-if="props.data.phone" class="course__registration__phone">
      Tlf.: {{ props.data.phone }}
    </div>
    <div v-if="props.data.email" class="course__registration__email">
      Email: <a :href="'mailto:' + props.data.email">{{ props.data.email }}</a>
    </div>
    <div v-if="props.data.url" class="course__registration__url">
      <a :href="props.data.url" target="_blank">{{
        props.data.title ? props.data.title : props.data.url
      }}</a>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.course__registration {
  text-align: center;
  padding: 48px var(--grid-gutter-half) @(--md) 96px var(--grid-gutter-half);
  background: var(--color-secondary-lighten-5);

  &__prices {
    margin-bottom: 16px;
  }

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
