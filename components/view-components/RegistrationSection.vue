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
  // the format with ". . .""
  const dateMatch2 = deadlineString.value.match(/\b(\d{2}.\d{2}.\d{4})\b/);
  // the format with "/ / /"
  const dateMatch = deadlineString.value.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);

  if (dateMatch2[0]) {
    const formattedDate = dateMatch2[0];

    return formattedDate;
  } else if (dateMatch[0]) {
    const date = dateMatch[0];
    const formattedDate = date.replace(/\//g, '.');

    return formattedDate;
  } else {
    return deadlineString.value;
  }
});

const pretixRef = ref(null);
const observer = ref<IntersectionObserver | null>(null);
const invokePretix = () => {
  window.PretixWidget.buildWidgets();
};

onBeforeMount(() => {
  if (props.data?.event_shop_url && props.data?.field_pretix_widget_type) {
    // Inject a script dynamically if needed.
    const script = document.createElement('script');
    script.src = 'https://pretix.eu/widget/v1.da.js';
    script.crossOrigin = 'anonymous';
    script.async = true;
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = props.data.event_shop_url + 'widget/v1.css';
    document.head.appendChild(link);
  }
});

onMounted(() => {
  if (typeof window !== 'undefined') {
    observer.value = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        invokePretix();
        observer.value?.disconnect();
      }
    });

    if (pretixRef.value) {
      observer.value.observe(pretixRef.value);
    }

    return () => {
      observer.value?.disconnect();
    };
  }
});

onBeforeUnmount(() => {
  observer.value?.disconnect();
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
        v-if="props?.data?.free && props?.data?.sales_banner"
        :data="{ label: data?.sales_banner ? data?.sales_banner : 'Gratis' }"
        color="secondary"
      />
      <div
        v-else-if="props.data.price"
        v-for="(price, index) in props.data.price"
        :key="index"
        class="course__registration__price-item"
      >
        <div>
          {{ price?.field_price ? price?.field_price + ' kr.' : '' }}
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
    <div
      v-if="props.data.event_shop_url && props.data.field_pretix_widget_type"
      class="course__registration__pretix"
      ref="pretixRef"
    >
      <ClientOnly>
        <pretix-widget
          :event="props.data.event_shop_url"
          :list-type="props.data.field_pretix_widget_type"
        ></pretix-widget>
        <noscript>
          <div class="pretix-widget">
            <div class="pretix-widget-info-message">
              JavaScript is disabled in your browser. To access our ticket shop
              without JavaScript, please
              <a target="_blank" :href="props.data.event_shop_url">click here</a
              >.
            </div>
          </div>
        </noscript>
      </ClientOnly>
    </div>
    <div v-if="props.data.url" class="course__registration__url">
      <a
        :href="props.data.url"
        class="button button--secondary"
        target="_blank"
        >{{ props.data.title ? props.data.title : props.data.url }}</a
      >
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

  &__description {
    width: 100% @(--sm) 684px;
    margin: 0 auto;
    color: var(--color-tertiary);

    :deep(p) {
      font-size: 16px @(--md) 22px;
      line-height: 1.3;
    }
  }
}

/* Pretix widget styling */
:deep(.pretix-widget) {
  margin: 30px 0;
  border: none;
}

:deep(.pretix-widget .pretix-widget-event-calendar) {
  width: 100% @(--sm) 684px;
  margin: 0 auto;
  padding: 5px;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);
}

:deep(
    .pretix-widget
      .pretix-widget-event-calendar
      .pretix-widget-event-calendar-table
      td
  ) {
  background: #f9f9f9;
}

:deep(
    .pretix-widget
      .pretix-widget-event-calendar
      .pretix-widget-event-calendar-event
  ) {
  font-size: 14px;
  line-height: 1.3;
}

:deep(
    .pretix-widget
      .pretix-widget-event-calendar
      .pretix-widget-event-calendar-event
      strong
  ) {
  font-weight: 400;
}

:deep(.pretix-widget .pretix-widget-event-list) {
  width: 100% @(--lg) 1068px;
  margin: 0 auto;
  padding: 0;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 10px 4px rgba(var(--color-primary-rgb), 0.1);
}

:deep(.pretix-widget .pretix-widget-event-list-entry) {
  padding: 10px;
}

:deep(.pretix-widget .pretix-widget-event-list-entry:not(:last-child)) {
  border-bottom: 1px solid #ccc;
}

:deep(
    .pretix-widget
      .pretix-widget-event-list-entry
      .pretix-widget-event-list-entry-name
  ) {
  font-weight: 700;
}

:deep(
    .pretix-widget
      .pretix-widget-event-list-entry
      .pretix-widget-event-list-entry-name
  ),
:deep(
    .pretix-widget
      .pretix-widget-event-list-entry
      .pretix-widget-event-list-entry-date
  ) {
  text-align: left;
  width: auto;
  padding-right: 20px;
}

:deep(
    .pretix-widget
      .pretix-widget-event-list-entry
      .pretix-widget-event-list-entry-date
  ) {
  color: #9b9b9b;
}

:deep(
    .pretix-widget
      .pretix-widget-event-list-entry
      .pretix-widget-event-list-entry-availability
  ) {
  text-align: right;
  width: auto;
  margin-left: auto;
  padding-top: 3px;
}
</style>
