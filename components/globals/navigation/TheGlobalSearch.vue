<script lang="ts" setup>
import { useRoute } from 'vue-router';
const route = useRoute();
const { sharedSearchKeyword } = useSharedSearchKeyword();

const inputRef = ref(null);

const searchKeyword = computed({
  get: () => sharedSearchKeyword.value,
  set: (value) => (sharedSearchKeyword.value = value),
});

const handleSearch = () => {
  if (searchKeyword.value && route.path !== '/search') {
    navigateTo(`/search?search_string=${searchKeyword.value}`);
  } else {
    return;
  }
};
</script>

<template>
  <div class="global-search">
    <form @submit.prevent="handleSearch">
      <input
        type="search"
        ref="inputRef"
        required
        placeholder="Søg"
        aria-label="Søg"
        v-model="searchKeyword"
      />
      <button
        type="submit"
        class="global-search__submit"
        aria-label="Søg"
      >
        <NuxtIcon
          name="search"
          filled
          class="icon"
        />
      </button>
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.global-search {
  padding-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text);
  cursor: pointer;

  :deep(svg) {
    font-size: 24px;
  }

  form {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1s;
    width: 50px;
    height: 50px;
  }

  input {
    color: var(--color-text);
    box-sizing: border-box;
    width: 100%;
    height: 48px;
    outline: 0;
    border: 0;
    display: none;
    border-radius: 24px;
    padding: 0 45px 0 20px;
    border: 1px solid var(--color-primary);
    box-shadow: 0 4px 30px 0px rgba(var(--color-primary-rgb), 0.15) !important;
  }

  &__submit {
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    display: flex;
    width: 48px;
    height: 48px;
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 24px;
    text-align: center;
    border: 1px solid #d1cfcd;
    transition: all 1s;
  }

  &:hover form,
  form:focus-within {
    width: 230px;
    cursor: pointer;
  }

  &:hover input,
  form:focus-within input {
    display: block;
  }

  &:hover button {
    background: var(--color-primary);
    border-color: var(--color-primary);
    height: 48px;
    width: 48px;

    :deep(path) {
      fill: var(--color-white);
    }
  }

  input[type='search']::-webkit-search-cancel-button {
    display: none;
  }
}
</style>
