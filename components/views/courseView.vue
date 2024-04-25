<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

console.log('data content-type', props.data);
</script>

<template>
  <div class="course">
    <div class="course__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="course__breadcrumbs-wrapper">
              La place for breadcrumbs
            </div>
            <div class="course__tags-wrapper">
              <div class="course__tags-item" v-if="data?.field_target_group">
                {{ data?.field_target_group }}
              </div>
              <div class="course__tags-item">tag</div>
            </div>
            <div class="course__page-heading-wrapper">
              <h1 class="course__page-title">{{ data?.label }}</h1>
              <div class="course__page-heading-button-container">
                <button class="button">button</button>
                <button class="button button--ghost">button</button>
              </div>
            </div>

            <div class="course__banner-image">
              <span>IMAGINE A BIG-ASS IMAGE BANNER HERE</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container course__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-6">
          <BaseRte :content="data.body" />
        </div>
        <div class="col-xs-12 col-sm-12 col-md-4 col-md-offset-2">
          <ShareContent />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.course {
  &__top-section {
    /* TODO: set var */
    background-color: #eaf2f2;
    padding-bottom: 64px;
  }

  &__breadcrumbs-wrapper {
    padding-top: 24px;
    margin-bottom: 64px;
  }

  &__tags-wrapper {
    display: flex;
    margin-bottom: 32px;
  }

  &__tags-item {
    margin-right: 12px;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 14px;
    padding: 7px 16px;
    border-radius: 4px;

    /* TODO: bg color (1-2-3 tags) and text color (differs) */
    background-color: orange;
  }

  &__page-heading-wrapper {
    display: grid @(--md) flex;
    justify-content: space-between;
    margin-bottom: 48px;
    align-items: center;
  }

  &__page-title {
    font-weight: 700;
  }

  &__page-heading-button-container {
    margin-top: 10px @(--md) 0;

    .button {
      margin-right: 12px @(--md) 0;
      margin-left: 0 @(--md) 12px;
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
  }
}
</style>
