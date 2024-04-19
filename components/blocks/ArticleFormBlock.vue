<template>
  <div class="article-form">
    <!-- <div class="article-form__filters">
      <div
        v-for="filter in blockData.field_articles_form.initial.facets"
        :key="filter"
      >
        <div v-if="!blockData.field_articles_form.facets[filter]"></div>
        <BaseSelect
          v-else-if="
            blockData.field_articles_form.facets[filter].type === 'select'
          "
          :select="blockData.field_articles_form.facets[filter]"
          v-model="state[filter]"
          @input="handleInput"
        />
        <BaseCheckboxes
          v-else-if="
            blockData.field_articles_form.facets[filter].type === 'checkboxes'
          "
          :checkboxes="blockData.field_articles_form.facets[filter]"
          v-model="state[filter]"
          @input="handleInput"
        />
        <div v-else>
          <kbd>{{ blockData.field_articles_form.facets[filter].type }}</kbd>
          not implemented
        </div>
      </div>
    </div> -->

    <div
      class="article-form__content"
      :class="{ 'article-form__content--loading': loading }"
    >
      <BaseArticle
        v-for="article in content"
        :key="article.id"
        :article="article"
      />
    </div>

    <BasePager
      v-if="blockData.field_articles_form.initial.pagination"
      :pager="pager"
      @change="handlePager"
    />
  </div>
</template>

<script setup>
const config = useRuntimeConfig();

const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});

const object = {};
const facets = props.blockData.field_articles_form.facets;
Object.keys(facets).map((key) => {
  object[key] = Number.isInteger(facets[key].default_value)
    ? facets[key].default_value.toString()
    : facets[key].default_value;
});
object.page = props.blockData.field_articles_form.initial.page;

const state = ref(object);
const pager = ref(props.blockData.field_articles_form.content.pager);
const dynamicContent = ref(null);
const loading = ref(false);

const content = computed(() =>
  dynamicContent.value
    ? dynamicContent.value
    : props.blockData.field_articles_form.content.content,
);

const handlePager = (page) => {
  state.value.page = page;

  updateContent();
};

const handleInput = () => {
  state.value.page = 0;

  updateContent();
};

const updateContent = async () => {
  loading.value = true;

  const params = {
    pagination: 1,
  };

  Object.keys({ ...state.value }).map((key) => {
    if (typeof state.value[key] === 'object') {
      Object.keys(state.value[key]).map((key2) => {
        params[`fields[${key}][${key2}]`] = state.value[key][key2];
      });
    } else {
      params[key] = state.value[key];
    }
  });

  const response = await $fetch(props.blockData.field_articles_form.endpoint, {
    params,
    baseURL: config.API_BASE_URL,
    cache: 'no-cache',
    keepalive: true,
  });

  dynamicContent.value = response.content;
  pager.value = response.pager;
  loading.value = false;
};
</script>

<style lang="postcss" scoped>
.article-form {
  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    padding: 30px 0;
  }

  &__content {
    @media (--viewport-sm-min) {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 30px;
    }

    &--loading {
      cursor: wait;
      opacity: 0.5;
    }
  }
}
</style>
