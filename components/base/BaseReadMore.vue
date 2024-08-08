<script setup>
import { stripHtmlFromString } from '~/utils/stripHtml';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  maxLength: {
    type: Number,
    default: 100,
  },
  searchKeyword: {
    type: String,
    default: '',
  },
});

const strippedText = ref(stripHtmlFromString(props.text));
const searchKeyword = computed(() => props.searchKeyword.toLowerCase());

const highlightKeyword = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<b>$1</b>');
};

const truncatedText = computed(() => {
  let text = strippedText.value;
  if (!isExpanded.value && isTruncated.value) {
    text = strippedText.value.slice(0, props.maxLength);
  }

  return highlightKeyword(text, searchKeyword.value);
});

const isExpanded = ref(false);

const isTruncated = computed(() => strippedText.value.length > props.maxLength);

const toggleReadMore = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="read-more">
    <div
      v-html="truncatedText"
      :class="
        isTruncated && !isExpanded
          ? 'read-more__text--truncated'
          : 'read-more__text'
      "
    ></div>
    <button
      class="read-more__button"
      v-if="isTruncated"
      @click.stop.prevent="toggleReadMore"
    >
      {{ isExpanded ? 'Læs mindre' : 'Læs mere' }}
    </button>
  </div>
</template>

<style lang="postcss" scoped>
.read-more {
  &__button {
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
    color: var(--color-primary);
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    padding-top: 12px;
    border-bottom: 1px solid transparent;
    transition: all 0.3s ease-in-out;

    &:hover {
      border-bottom: 1px solid var(--color-primary);
      opacity: 0.8;
    }
  }

  &__text {
    &--truncated {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>
