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
  <div class="practical-information">
    <h3 class="practical-information__title">Praktisk information</h3>

    <!--Practical information data for loop START -->
    <div v-for="(item, index) in props.data" :key="index">

      <!-- Divider element -->
      <BaseDivider v-if="item.type === 'divider'" class="practical-information__divider" />

      <!-- Sustainability goals element -->
      <div v-else-if="item.type === 'sustainability_goals'">
        <div class="practical-information__item-container">
          <div class="practical-information__item-heading">{{ item.title }}</div>
        </div>
        <div class="practical-information__sdg-wrapper">
          <div
            class="practical-information__sdgs"
            v-for="goals in item.content"
            :key="goals"
          >
            <NuxtLink :to="goals?.field_link?.url" target="_blank">
              <img :src="goals?.field_logo?.src" alt="SDG" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Basic element with title, content & description -->
      <div v-else class="practical-information__item-container">
        <div class="practical-information__item-heading">{{ item.title }}</div>

        <!-- Price items inside basic element -->
        <div v-if="item.type === 'price' && !item.free" class="practical-information__item-value">
          <div v-for="(price, index) in item.content" :key="index" class="practical-information__prices">
            <div>{{ price.field_price }} {{ price.field_price_settlement_unit.label }}</div>
            <div>{{ price.field_price_vat.label }}</div>
          </div>
        </div>

        <!-- Price free label inside basic element -->
        <div v-else-if="item.type === 'price' && item.free" class="practical-information__item-value">
          <BaseTag
            :data="{ label: 'Gratis' }"
            color="secondary"
          />
        </div>

        <!-- Basic element content array loop -->
        <div v-else-if="Array.isArray(item.content)" class="practical-information__item-value">
          <div v-for="(content, index) in item.content" :key="index">
            {{ content }}
          </div>
        </div>

        <!-- Basic element content string -->
        <div v-else class="practical-information__item-value" v-html="item.content"></div>
      </div>

      <!-- Basic description element -->
      <details
        class="practical-information__accordion-container"
        v-if="item.description"
      >
        <summary class="practical-information__accordion-container--cta">
          <span class="practical-information__see-more-cta collapsed">Se flere detaljer</span>
          <span class="practical-information__see-more-cta expanded">Skjul detaljer</span>
          <NuxtIcon class="practical-information__accordion-icon collapsed" name="plus" />
          <NuxtIcon class="practical-information__accordion-icon expanded" name="minus" />
        </summary>
        <div class="practical-information__accordion-content">
          <span v-html="item.description"> </span>
        </div>
      </details>
    </div>
    <!-- Practical information data for loop END -->

  </div>
</template>

<style lang="postcss" scoped>
.practical-information {
  padding: 48px 32px;
  color: var(--color-tertiary);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary-lighten-4);
  box-shadow: 0 4px 10px 4px #297f781a;

  &__title {
    margin: 0;
  }

  &__divider {
    margin: 22px 0 14px 0;
    color: var(--color-tertiary-lighten-4);
  }

  &__item-heading {
    width: 50%;
    font-weight: 700;
    font-family: var(--heading-font-family);
  }

  &__item-container {
    padding-top: 12px;
    display: flex;
    justify-content: space-between;
  }

  &__item-value {
    text-decoration: none;
    line-height: 24px;
    width: 50%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;

    &--link {
      color: var(--color-primary);
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease-in-out;

      &:hover {
        opacity: 0.8;
        border-bottom: 1px solid var(--color-primary);
      }
    }
  }

  &__accordion-container {
    padding-top: 12px;

    &--cta {
      width: 100%;
      display: flex;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin: 0;
      justify-content: space-between;
      font-family: var(--heading-font-family);
    }

    p {
      margin: 0;
    }
  }

  &__accordion-icon {
    color: var(--color-primary);
  }

  &__accordion-content {
    padding-top: 12px;
    font-size: 16px;

    :deep(p) {
      margin-bottom: 12px;
    }
  }

  &__prices {
    &:not(:first-child) {
      padding-top: 8px;
    }
  }

  &__sdg-wrapper {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -12px;
  }

  &__sdgs {
    width: 25% @(--ms) 20% @(--sm) 15% @(--md) 50% @(--lg) 33% @(--xl) 25%;
    padding: 12px;

    &:last-child {
      margin-right: 0;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  details {
    .expanded {
      display: none;
    }

    .collapsed {
      display: flex;
    }

    &[open] {
      .expanded {
        display: flex;
      }

      .collapsed {
        display: none;
      }
    }
  }
}
</style>
