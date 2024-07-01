<script setup lang="ts">
import { scrollTo } from '~/utils/scrollTo';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

useHead({
  title:
    props.data?.field_meta_tags?.html_head?.title?.atributes?.content ||
    props.data?.field_name,
});

console.log('userView.vue', props.data);

const practicalInfoData = computed(() => {
  return [
    {
      group: [
        {
          type: 'user_profile',
          title: props.data?.field_name,
        },
      ],
    },
  ];
});
</script>

<template>
  <div class="user">
    <div class="user__top-section">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-12 col-md-12">
            <div class="user__page-heading-wrapper">
              <h1 class="user__page-title">{{ data?.field_name }}</h1>
              <div class="user__page-heading-button-container">
                <!-- TODO: connect buttons -->
                <BaseButton
                  icon-after="arrow-right"
                  :button-data="{ title: 'Find forløb' }"
                  class="button button--secondary"
                />
                <BaseButton
                  v-if="data?.field_contact?.length > 0"
                  :button-data="{
                    title: props.data.roles?.includes('corporation')
                      ? 'Kontakt virksomhed'
                      : props.data.roles?.includes('course_provider')
                        ? 'Kontakt udbyder'
                        : '',
                  }"
                  @click="scrollTo('contact__section')"
                  class="button button--secondary--ghost"
                />
              </div>
            </div>

            <div class="user__banner-image">
              <BaseImage v-if="data.field_image" :image="data.field_image" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container user__second-section">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-7 col-xl-6">
          <div v-if="data.field_presentation">
            <BaseRte :content="data.field_presentation" />
          </div>

          <div
            class="user__paragraph-item"
            v-if="data.field_educational_profile"
          >
            <BaseRte :content="data.field_educational_profile" />
          </div>

          <div class="user__paragraph-item" v-if="data.field_intro">
            <BaseRte :content="data.field_intro" />
          </div>
        </div>
        <div
          class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1 col-xl-offset-2"
        >
          <SharePage />
          <PracticalInformation
            :data="practicalInfoData"
            :userProfilePage="{
              isUserProfilePage: true,
              hasContactsData: data?.field_contact?.length > 0,
              logo: data.field_logo,
              roles: props.data.roles,
            }"
          >
            <div>
              {{ data?.field_location_name }} <br />
              {{ data?.field_location_street }} <br />
              {{ data?.field_location_zipcode }}
              {{ data?.field_location_city }} <br />
            </div>

            <div>
              {{ data?.field_cvr }}
            </div>

            <div class="user__links-wrapper">
              <div>
                <NuxtLink
                  aria-label="Call phone number"
                  class="user__link"
                  :to="'tel:' + data?.field_phone"
                  >{{ data?.field_phone }}</NuxtLink
                >
              </div>

              <div>
                <NuxtLink
                  class="user__link"
                  aria-label="Send email"
                  :href="'mailto:' + data?.field_mail"
                  >{{ data?.field_mail }}</NuxtLink
                >
              </div>

              <div>
                <NuxtLink
                  aria-label="Visit website"
                  class="user__link"
                  target="_blank"
                  :to="data?.field_homepage?.url"
                  >{{ data?.field_homepage?.url }}</NuxtLink
                >
              </div>
            </div>
          </PracticalInformation>
        </div>

        <div class="col-xs-12 col-sm-12 col-md-12 user__divider">
          <BaseDivider />
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-12"
          v-if="
            data.field_video_title ||
            data.field_video_description ||
            data.field_video_thumbnail ||
            data.field_video
          "
        >
          <ClientOnly>
            <VideoComponent
              v-if="
                data?.field_video_title ||
                data?.field_video_description ||
                data?.field_video?.length > 0
              "
              :data="{
                videoTitle: data?.field_video_title,
                videoDescription: data?.field_video_description,
                videoArr: data?.field_video,
              }"
              :layoutType="data.field_video.length > 1 ? 'carousel' : 'flex'"
            />
          </ClientOnly>
        </div>

        <!-- Section related articles -->
        <div
          class="col-xs-12 col-sm-12 col-md-12 user__section-related-articles"
        >
          <div class="user__related-articles">
            <h3>Relaterede forløb</h3>
            <div>article cards soon to come..</div>
          </div>
        </div>

        <!-- Section kontakt -->
        <div
          id="contact__section"
          class="col-xs-12 col-sm-12 col-md-12 user__section-contact"
          v-if="data?.field_contact?.length > 0"
        >
          <div class="user__contact">
            <KontaktProvider :data="data?.field_contact" />
          </div>
        </div>

        <!-- Section information -->
        <div class="col-xs-12 col-sm-12 col-md-5 user__section-user-info">
          <div class="user__info-title">
            <h2>Yderligere information om udbyder</h2>
          </div>
        </div>

        <div
          class="col-xs-12 col-sm-12 col-md-5 col-md-offset-1 user__section-user-info"
        >
          <div class="user__info-description">
            <div v-html="data?.field_other_info_description"></div>

            <div
              class="user__info-description--buttons"
              v-if="data?.field_other_info?.length > 0"
            >
              <div
                class="user__info-description--button-item"
                v-for="button in data?.field_other_info"
                :key="button"
              >
                <NuxtLink
                  class="user__info-description__button-item__link button button--primary button--primary--ghost"
                  :to="
                    button?.field_file
                      ? button?.field_file
                      : button?.field_link?.url
                  "
                  aria-label="Download link"
                >
                  <span class="user__info-description--button-item__link-text">
                    {{ button?.field_link?.title }}
                  </span>
                  <NuxtIcon
                    class="user__info-description--button-item__icon"
                    name="arrow-right"
                    filled
                  />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.user {
  color: var(--color-text);
  background-color: var(--color-tertiary-lighten-6);

  &__top-section {
    padding: 32px 0 @(--sm) 64px 0;
    background-color: var(--color-primary-lighten-5);
  }

  &__tags-wrapper {
    padding-top: 24px;

    display: flex;
    margin-bottom: 32px;
  }

  &__tags-item {
    margin-right: 16px;
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
    display: flex;

    .button {
      margin-right: 12px @(--md) 0;
      margin-left: 0 @(--md) 12px;
    }
  }

  &__paragraph-item {
    padding-top: 36px;

    &:last-child {
      margin-bottom: 36px;
    }
  }

  &__practical-buttons {
    margin-top: 24px;
    padding: 0 15px;
    display: grid;
    gap: 16px;
  }

  &__contact-button {
    color: var(--color-tertiary);
    border-color: var(--color-tertiary);

    &:hover {
      color: var(--color-white) !important;
      background-color: var(--color-tertiary);
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
  }

  &__divider {
    padding-top: 43px @(--sm) 97px;
    margin-bottom: 43px @(--sm) 97px;
  }

  &__links-wrapper {
    padding-top: 8px;
  }

  &__link {
    color: var(--color-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-bottom 0.3s ease-in-out;

    &:hover {
      border-bottom: 1px solid var(--color-primary);
    }
  }

  &__section-video,
  &__section-contact,
  &__section-user-info,
  &__section-related-articles {
    padding-top: 48px @(--md) 96px;
  }

  &__section-user-info {
    :not(:first-child) {
      margin-bottom: 48px @(--md) 96px;
    }
  }

  &__info-description {
    :last-child {
      margin-bottom: 36px;
    }

    &--buttons {
      display: flex;
      gap: 24px;
    }

    &--button-item {
      &__link {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  :deep(.user__info-description--button-item__icon) {
    margin: 0;
    margin-left: 8px;
  }

  :deep(svg) {
    font-size: 24px;
  }

  :deep(.practical-information__item-heading) {
    width: 100%;
  }
}
</style>
