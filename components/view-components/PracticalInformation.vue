<script setup lang="ts">
import { scrollTo } from '~/utils/scrollTo';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },

  userProfilePage: {
    type: Object,
    required: false,
    default: null,
  },

  isFree: {
    type: [String, Boolean],
    required: false,
    default: false,
  },
});
</script>

<template>
  <div class="practical-information">
    <div
      class="practical-information__user-provider-logo"
      v-if="userProfilePage?.logo?.src"
    >
      <img
        :src="props.userProfilePage?.logo?.src"
        :alt="userProfilePage.logo?.alt"
      />
    </div>

    <h3 class="practical-information__title">
      {{
        !props.userProfilePage
          ? 'Praktisk information'
          : props.userProfilePage.roles?.includes('corporation')
            ? 'Virksomhed'
            : props.userProfilePage.roles?.includes('course_provider')
              ? 'Udbyder'
              : ''
      }}
    </h3>

    <!--Practical information data for loop START -->
    <div
      class="practical-information__group"
      v-for="(groups, index) in props.data"
      :key="index"
    >
      <div
        class="practical-information__item"
        v-for="(item, index) in groups.group"
        :key="index"
      >
        <!-- Places to visit element -->
        <div v-if="item.type === 'places_to_visit'">
          <div class="practical-information__item-container">
            <div class="practical-information__item-heading">
              {{ item?.title }}
            </div>
          </div>
          <div
            class="practical-information__item-value practical-information__item-value--places-to-visit"
          >
            <PlacesToVisit :places="item.content" />
          </div>
        </div>

        <!-- Sustainability goals element -->
        <div v-if="item.type === 'sustainability_goals'">
          <div class="practical-information__item-container">
            <div class="practical-information__item-heading">
              {{ item?.title }}
            </div>
          </div>
          <div class="practical-information__sdg-wrapper">
            <div
              class="practical-information__sdgs"
              v-for="goals in item.content"
              :key="goals"
            >
              <NuxtLink
                :to="goals?.field_link?.url"
                target="_blank"
                aria-label="Link til SDG"
              >
                <img :src="goals?.field_logo?.src" alt="SDG" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- User Profile element -->
        <div v-else-if="item.type === 'user_profile'">
          <div
            class="practical-information__item-container practical-information__item-container--profile"
          >
            <div
              class="practical-information__item-heading practical-information__item-heading--profile"
            >
              {{ item.title }}
            </div>

            <div
              class="practical-information__item-value practical-information__item-value--profile"
            >
              <div v-for="(content, index) in item.content" :key="index">
                <div v-if="content" v-html="content"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="item.type === 'content_author'">
          <div class="practical-information__item-container">
            <div class="practical-information__item-heading">
              {{ item?.title }}
            </div>

            <div class="practical-information__item-value">
              <NuxtLink
                class="practical-information__item-value--author-link"
                :aria-label="`Link til ${item?.author_name}`"
                :to="item?.content"
                >{{ item?.author_name }}</NuxtLink
              >
            </div>
          </div>
        </div>

        <!-- Basic element with title, content & description -->
        <div
          v-else
          class="practical-information__item-container"
          :class="
            !item.title || item.type === 'places_to_visit'
              ? 'practical-information__item-container--empty'
              : ''
          "
        >
          <div
            class="practical-information__item-heading"
            v-if="item.title && item.type !== 'places_to_visit'"
          >
            {{ item.title }}
          </div>

          <!-- Price items inside basic element -->
          <div
            v-if="item.type === 'price' && !item.free"
            class="practical-information__item-value"
          >
            <div
              v-for="(price, index) in item.content"
              :key="index"
              class="practical-information__prices"
            >
              <div v-if="price?.field_price">
                {{ price?.field_price }} kr.
                {{ price?.field_price_settlement_unit?.label }}
              </div>
              <div>{{ price?.field_price_vat?.label }}</div>
            </div>
          </div>

          <!-- Price free label inside basic element -->
          <div
            v-else-if="item.type === 'price' && item.free"
            class="practical-information__item-value"
          >
            <BaseTag
              :data="{
                label: 'Gratis',
              }"
              color="secondary"
            />
          </div>

          <!-- Basic element content array loop -->
          <div
            v-else-if="Array.isArray(item.content)"
            class="practical-information__item-value"
          >
            <!-- IF All elements inside the array are null -->
            <div
              v-if="item.content.every((content: string) => content === null)"
            >
              Ikke angivet
            </div>
            <div v-else>
              <div v-for="(content, index) in item.content" :key="index">
                <span v-if="content && item.type !== 'places_to_visit'">{{
                  content
                }}</span>
              </div>
            </div>
          </div>

          <!-- Basic element content string -->
          <div v-else class="practical-information__item-value">
            <div v-if="item?.content == null && !item.description">
              Ikke angivet
            </div>
            <div v-else-if="!item?.content"></div>
            <div v-else v-html="item?.content"></div>
          </div>
        </div>

        <!-- Basic description element -->
        <details
          class="practical-information__accordion-container"
          v-if="item.description"
        >
          <summary class="practical-information__accordion-container--cta">
            <span class="practical-information__see-more-cta collapsed"
              >Se flere detaljer</span
            >
            <span class="practical-information__see-more-cta expanded"
              >Skjul detaljer</span
            >
            <NuxtIcon
              class="practical-information__accordion-icon collapsed"
              name="plus"
            />
            <NuxtIcon
              class="practical-information__accordion-icon expanded"
              name="minus"
            />
          </summary>
          <div class="practical-information__accordion-content">
            <span v-html="item.description"> </span>
          </div>
        </details>
      </div>
    </div>
    <!-- Practical information data for loop END -->
    <div
      class="practical-information__user-profile-button"
      v-if="props.userProfilePage?.hasContactsData"
    >
      <BaseButton
        v-if="props.userProfilePage?.hasContactsData"
        :button-data="{
          title: props.userProfilePage.roles?.includes('corporation')
            ? 'Kontakt virksomhed'
            : props.userProfilePage.roles?.includes('course_provider')
              ? 'Kontakt udbyder'
              : '',
        }"
        @click="scrollTo('contact__section')"
        class="button button--secondary button--secondary--ghost"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.practical-information {
  padding: 48px 32px;
  color: var(--color-text);
  background-color: var(--color-white);
  border: 2px solid var(--color-primary-lighten-4);
  box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);

  &__group {
    margin-top: 22px;
    padding-top: 14px;
    border-top: 1px solid var(--color-gray-20);
  }

  &__title {
    margin: 0;
    word-break: break-word;
  }

  &__item-heading {
    width: 50%;
    font-weight: 700;
    font-family: var(--heading-font-family);

    &--profile {
      width: 100%;
      margin-bottom: 4px;
    }
  }

  &__item-container {
    padding-top: 12px;
    display: flex;
    justify-content: space-between;

    &--empty {
      padding-top: 0;
    }

    &--profile {
      flex-direction: column;
    }
  }

  &__item-value {
    text-decoration: none;
    line-height: 24px;
    width: 50%;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;

    &--profile {
      width: 100%;
    }

    &--places-to-visit {
      width: 100%;
    }

    &--link {
      color: var(--color-primary);
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease-in-out;

      &:hover {
        opacity: 0.8;
        border-bottom: 1px solid var(--color-primary);
      }
    }

    &--author-link {
      text-decoration: none;
      color: var(--color-primary);
      font-weight: 400;
      border-bottom: 1px solid var(--color-primary);
      opacity: 1;
      transition: opacity 0.3s ease-in-out;

      &:hover {
        opacity: 0.8;
      }
    }

    :deep(p) {
      margin-bottom: 0;
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

      :deep(svg) {
        font-size: 24px;
      }
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

    summary::-webkit-details-marker {
      display: none;
    }
  }

  &__user-profile-button {
    padding-top: 22px;
  }

  &__user-provider-logo {
    margin-bottom: 22px;
  }

  :deep(a:not(.button)) {
    color: var(--color-primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
