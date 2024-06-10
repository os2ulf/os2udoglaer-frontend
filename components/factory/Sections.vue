<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { pascalCase } from '~/utils/pascalCase';

const props = defineProps({
  sections: {
    type: Object,
    required: true,
    default: null,
  },
});

// Dynamically import block components
const renderLayoutBlock = (componentName: string) => {
  return defineAsyncComponent(() =>
    import(`@/components/blocks/${pascalCase(componentName)}Block.vue`)
      // If component doesnt exist, render a placeholder instead
      .catch((err) => {
        return import('~~/components/blocks/UnknownBlock.vue');
      }),
  );
};

// Assign the correct number of columns to the region based on the layout settings
const assignMdCollumnsHandler = (
  colValue: string,
  colIndex: string | number,
) => {
  if (colValue === '33-33-33') {
    return 4;
  } else if (colValue === '50-50') {
    return 6;
  } else if (colValue === '67-33') {
    return colIndex === 'first' ? 8 : 4;
  } else if (colValue === '33-67') {
    return colIndex === 'first' ? 4 : 8;
  } else if (colValue === '') {
    return 12;
  }
};
</script>

<template>
  <div class="layout-builder">
    <div
      v-for="section in sections"
      :key="section.id"
      class="dark"
      :class="[
        'section',
        section.layout_id,
        section.layout_settings.column_widths
          ? 'column-widths--' + section.layout_settings.column_widths
          : '',
        section.layout_settings.color_theme
          ? section.layout_settings.color_theme
          : '',
        section.layout_settings.column_spacing_top,
        section.layout_settings.column_spacing_bottom,
      ]"
    >
      <div
        :class="[
          'container',
          section.layout_settings.column_width === 'section--width-full'
            ? 'container--full'
            : '',
          section.layout_settings.column_width === 'section--width-narrow'
            ? 'container--narrow'
            : '',
        ]"
      >
        <div class="row">
          <div
            v-for="(region, index) in section.regions"
            :key="index"
            class="col-xs-12"
            :class="
              'col-md-' +
              assignMdCollumnsHandler(
                section.layout_settings.column_widths,
                index,
              )
            "
          >
            <div
              v-for="content in region"
              :key="content?.id"
              :class="[content?.bundle && 'layout-block--' + content.bundle]"
            >
              <component
                :is="renderLayoutBlock(content.bundle)"
                v-if="content"
                :block-data="content"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.section {
  padding-top: var(--section-spacing-mobile);
  padding-bottom: var(--section-spacing-mobile);
  background-color: var(--theme-background-color);

  @media (--viewport-md-min) {
    padding-top: var(--section-spacing);
    padding-bottom: var(--section-spacing);
  }

  &.layout_twocol_section {
    .col-xs-12:first-child {
      margin-bottom: 40px;

      @media (--viewport-sm-min) {
        margin-bottom: 44px;
      }

      @media (--viewport-md-min) {
        margin-bottom: 0;
      }
    }
  }

  &.layout_threecol_section {
    .col-xs-12:first-child,
    .col-xs-12:nth-child(2) {
      margin-bottom: 20px;

      @media (--viewport-sm-min) {
        margin-bottom: 44px;
      }

      @media (--viewport-md-min) {
        margin-bottom: 0;
      }
    }
  }

  &--no-spacing {
    padding-top: 0;
    padding-bottom: 0;
  }

  &--spacing-top-none {
    padding-top: 0;
  }

  &--spacing-bottom-none {
    padding-bottom: 0;
  }

  &--spacing-top-small {
    padding-top: var(--section-spacing-mobile);

    @media (--viewport-md-min) {
      padding-top: var(--section-spacing);
    }
  }

  &--spacing-top-medium {
    padding-top: calc(var(--section-spacing-mobile) * 1.5);

    @media (--viewport-md-min) {
      padding-top: calc(var(--section-spacing) * 1.5);
    }
  }

  &--spacing-top-large {
    padding-top: calc(var(--section-spacing) * 1.5);

    @media (--viewport-md-min) {
      padding-top: calc(var(--section-spacing) * 2);
    }
  }

  &--spacing-bottom-small {
    padding-bottom: var(--section-spacing-mobile);

    @media (--viewport-md-min) {
      padding-bottom: var(--section-spacing);
    }
  }

  &--spacing-bottom-medium {
    padding-bottom: calc(var(--section-spacing-mobile) * 1.5);

    @media (--viewport-md-min) {
      padding-bottom: calc(var(--section-spacing) * 1.5);
    }
  }

  &--spacing-bottom-large {
    padding-bottom: calc(var(--section-spacing) * 1.5);

    @media (--viewport-md-min) {
      padding-bottom: calc(var(--section-spacing) * 2);
    }
  }

  &__inner {
    padding-top: calc(var(--section-spacing-mobile) * 0.5);

    @media (--viewport-md-min) {
      padding-top: calc(var(--section-spacing) * 0.5);
    }
  }
}
</style>
