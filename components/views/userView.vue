<script setup lang="ts">
import { scrollTo } from '~/utils/scrollTo';
import { filterGroups } from '~/utils/dataFilter';

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: null,
  },
});

const practicalInfoData = computed(() => {
  const data = [
    {
      group: [
        {
          type: 'user_profile',
          title: props.data?.field_name,
        },
      ],
    },
    {
      group: [
        {
          type: 'user_profile',
          title: props.data?.field_name,
          content: [
            props.data?.field_view_on_map == 'show_vendor_address' &&
            props.data?.provider
              ? props.data?.provider.field_location_name
              : props.data?.field_location_name,
            props.data?.field_view_on_map == 'show_vendor_address' &&
            props.data?.provider
              ? props.data?.provider.field_location_street
              : props.data?.field_location_street,
            props.data?.field_view_on_map == 'show_vendor_address' &&
            props.data?.provider
              ? props.data?.provider.field_location_zipcode +
                ' ' +
                props.data?.provider.field_location_city
              : props.data?.field_location_zipcode +
                ' ' +
                props.data?.field_location_city,
          ],
          description: props.data?.field_location_description
            ? props.data?.field_location_description
            : '',
        },
        {
          type: 'user_profile',
          content: [
            props.data?.field_phone
              ? '<a href="tel:' +
                props.data?.field_phone +
                '">' +
                props.data?.field_phone +
                '</a>'
              : '',
            props.data?.field_mail
              ? '<a href="mailto:' +
                props.data?.field_mail +
                '">' +
                props.data?.field_mail +
                '</a>'
              : '',
            props.data?.field_homepage?.url
              ? '<a href="' +
                props.data?.field_homepage?.url +
                '" target="_blank">' +
                props.data?.field_homepage?.url +
                '</a>'
              : '',
          ],
        },
      ],
    },
    {
      group: [
        {
          type: 'user_profile',
          title: 'Branche',
          content: props.data?.field_brancher,
        },
      ],
    },
    {
      group: [
        {
          type: 'user_profile',
          title: 'Muligheder',
          content: props.data?.field_posibilities,
        },
      ],
    },
  ];
  return filterGroups(data);
});

const relatedContent = ref(props.data?.related_content);
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
            <h2>Præsentation</h2>
            <BaseRte :content="data.field_presentation" />
          </div>

          <div
            class="user__paragraph-item"
            v-if="data.field_educational_profile"
          >
            <h3>Pædagogisk profil</h3>
            <BaseRte :content="data.field_educational_profile" />
          </div>

          <div class="user__paragraph-item" v-if="data.field_intro">
            <h4>Entré</h4>
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
          class="col-xs-12 col-sm-12 col-md-12 user__section-related-content"
          v-if="relatedContent?.results?.length > 0"
        >
          <div class="user__related-content">
            <RelatedContent
              :data="{ relatedContent, title: data?.field_name }"
            />
          </div>
        </div>

        <!-- Section kontakt -->
        <div
          id="contact__section"
          class="col-xs-12 col-sm-12 col-md-12 user__section-contact"
          v-if="data?.field_contact?.length > 0"
        >
          <div class="user__contact">
            <KontaktProvider
              :data="data?.field_contact"
              :type="
                props.data.roles?.includes('corporation')
                  ? 'virksomhed'
                  : props.data.roles?.includes('course_provider')
                    ? 'udbyder'
                    : ''
              "
            />
          </div>
        </div>
        <!-- Section information -->
        <div
          class="user__section-user-info"
          v-if="
            data?.field_other_info_description !== null ||
            data?.field_other_info[0]?.field_external_link !== null
          "
        >
          <div class="col-xs-12 col-sm-12 col-md-5">
            <div class="user__info-title">
              <h2>
                {{
                  props.data.roles?.includes('corporation')
                    ? 'Yderligere information om virksomhed'
                    : props.data.roles?.includes('course_provider')
                      ? 'Yderligere information om udbyder'
                      : 'Yderligere information'
                }}
              </h2>
            </div>
          </div>

          <div class="col-xs-12 col-sm-12 col-md-6 col-md-offset-1">
            <div class="user__info-description">
              <div
                v-if="data?.field_other_info_description"
                v-html="data?.field_other_info_description"
                class="user__info-description--text"
              ></div>

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
                    v-if="
                      button?.field_file ||
                      (button?.field_external_link?.url &&
                        button?.field_material_download_text)
                    "
                    class="user__info-description__button-item__link button button--ghost"
                    :to="
                      button?.field_file
                        ? button?.field_file
                        : button?.field_external_link?.url
                    "
                    aria-label="Download link"
                  >
                    <span
                      class="user__info-description--button-item__link-text"
                    >
                      {{ button?.field_material_download_text }}
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
  </div>
</template>

<style lang="postcss" scoped>
.user {
  color: var(--color-text);
  background-color: var(--color-gray-8);

  &__top-section {
    padding: 32px 0 @(--sm) 64px 0;
    background-color: var(--color-primary-lighten-5);
  }

  &__tags-wrapper {
    padding-top: 24px;
    display: grid @(--sm) flex;
    gap: 12px @(--sm) 16px;
    margin-bottom: 32px;
  }

  &__page-heading-wrapper {
    display: grid @(--md) flex;
    justify-content: space-between;
    margin-bottom: 48px;
    align-items: center;
  }

  &__page-title {
    font-weight: 700;
    word-break: break-word;
  }

  &__page-heading-button-container {
    margin-top: 10px @(--md) 0;
    display: grid @(--sm) flex;
    gap: 10px @(--sm) 0;

    .button {
      margin-left: 0 @(--md) 12px;
      white-space: normal @(--sm) nowrap;
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
    color: var(--color-tertiary-text);
    border-color: var(--color-tertiary);

    &:hover {
      color: var(--color-tertiary-text) !important;
      background-color: var(--color-tertiary);
    }
  }

  &__second-section {
    padding-top: 48px @(--md) 96px;
    padding-bottom: 48px @(--md) 96px;
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
  &__section-related-content {
    padding-top: 48px @(--md) 96px;
  }

  &__section-user-info {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 1;
    flex-wrap: wrap;
    width: 100%;
  }

  &__info-description {
    &--text {
      margin-bottom: 24px;
    }

    &--button-item {
      display: block;
      float: left;
      margin-right: 24px;
      margin-bottom: 24px;

      &__link {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
  }

  :deep(.user__info-description--button-item__icon) {
    margin-bottom: 0;
    margin-left: 8px;
  }

  :deep(svg) {
    font-size: 24px;
  }
}
</style>
