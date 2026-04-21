<script setup lang="ts">
import { useSettingsDataStore } from '~/stores/settingsData';
const settingsDataStore = useSettingsDataStore();

const fontFamily = computed(() => settingsDataStore.settingsData?.font);
const favIcon = computed(() => settingsDataStore.settingsData?.favicon);

const primaryBgColor = computed(
  () => settingsDataStore.settingsData?.primary_background_color,
);
const primaryBgTextColor = computed(
  () => settingsDataStore.settingsData?.primary_background_text_color,
);
const secondaryBgColor = computed(
  () => settingsDataStore.settingsData?.secondary_background_color,
);
const secondaryBgTextColor = computed(
  () => settingsDataStore.settingsData?.secondary_background_text_color,
);
const tertiaryBgColor = computed(
  () => settingsDataStore.settingsData?.tertiary_background_color,
);
const tertiaryBgTextColor = computed(
  () => settingsDataStore.settingsData?.tertiary_background_text_color,
);

const positiveFontColor = computed(
  () => settingsDataStore.settingsData?.text_positive_color,
);

const primaryButtonColor = computed(
  () => settingsDataStore.settingsData?.primary_button_color,
);
const primaryButtonTextColor = computed(
  () => settingsDataStore.settingsData?.primary_button_text_color,
);
const primaryButtonHoverColor = computed(
  () => settingsDataStore.settingsData?.primary_button_hover_color,
);
const primaryButtonHoverTextColor = computed(
  () => settingsDataStore.settingsData?.primary_button_hover_text_color,
);

const secondaryButtonColor = computed(
  () => settingsDataStore.settingsData?.secondary_button_color,
);
const secondaryButtonTextColor = computed(
  () => settingsDataStore.settingsData?.secondary_button_text_color,
);
const secondaryButtonHoverColor = computed(
  () => settingsDataStore.settingsData?.secondary_button_hover_color,
);
const secondaryButtonHoverTextColor = computed(
  () => settingsDataStore.settingsData?.secondary_button_hover_text_color,
);

// Function to convert hex to RGB
function hexToRgb(hex: string) {
  try {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `${r}, ${g}, ${b}`;
  } catch (error) {
    return '255, 255, 255';
  }
}

const textPositiveColor = ref(positiveFontColor);
let primaryColor = '#297F78';
let primaryColorRgb = hexToRgb(primaryColor);
let primaryTextColor = '#fff';

let secondaryColor = '#FBD800';
let secondaryTextColor = '#000';

let tertiaryColor = '#40362E';
let tertiaryTextColor = '#fff';

useHead({
  link: [{ rel: 'icon', type: 'image/x-icon', href: favIcon?.value }],
});

onBeforeMount(() => {
  if (settingsDataStore.settingsData === null) {
    settingsDataStore.getSettingsData();
  }

  if (fontFamily.value) {
    const fontValue = fontFamily.value;

    if (fontValue === 'Roboto') {
      document.documentElement.style.setProperty(
        '--body-font-family',
        "'Roboto Slab', sans-serif",
      );
      document.documentElement.style.setProperty(
        '--heading-font-family',
        "'Roboto', sans-serif",
      );
      document.documentElement.style.setProperty('--body-font-weight', '300');
    } else {
      document.documentElement.style.setProperty(
        '--body-font-family',
        "'" + fontValue + "', sans-serif",
      );
      document.documentElement.style.setProperty(
        '--heading-font-family',
        "'" + fontValue + "', sans-serif",
      );
    }
  }

  if (primaryBgColor.value) {
    primaryColor = primaryBgColor.value;
    primaryColorRgb = hexToRgb(primaryColor);
  }

  if (primaryBgTextColor.value) {
    primaryTextColor = primaryBgTextColor.value;
  }

  if (secondaryBgColor.value) {
    secondaryColor = secondaryBgColor.value;
  }

  if (secondaryBgTextColor.value) {
    secondaryTextColor = secondaryBgTextColor.value;
  }

  if (tertiaryBgColor.value) {
    tertiaryColor = tertiaryBgColor.value;
  }

  if (tertiaryBgTextColor.value) {
    tertiaryTextColor = tertiaryBgTextColor.value;
  }

  if (primaryButtonColor.value) {
    document.documentElement.style.setProperty(
      '--color-primary-button-color',
      primaryButtonColor.value,
    );
  }

  if (primaryButtonTextColor.value) {
    document.documentElement.style.setProperty(
      '--color-primary-button-text-color',
      primaryButtonTextColor.value,
    );
  }

  if (primaryButtonHoverColor.value) {
    document.documentElement.style.setProperty(
      '--color-primary-button-hover-color',
      primaryButtonHoverColor.value,
    );
  }

  if (primaryButtonHoverTextColor.value) {
    document.documentElement.style.setProperty(
      '--color-primary-button-hover-text-color',
      primaryButtonHoverTextColor.value,
    );
  }

  if (secondaryButtonColor.value) {
    document.documentElement.style.setProperty(
      '--color-secondary-button-color',
      secondaryButtonColor.value,
    );
  }

  if (secondaryButtonTextColor.value) {
    document.documentElement.style.setProperty(
      '--color-secondary-button-text-color',
      secondaryButtonTextColor.value,
    );
  }

  if (secondaryButtonHoverColor.value) {
    document.documentElement.style.setProperty(
      '--color-secondary-button-hover-color',
      secondaryButtonHoverColor.value,
    );
  }

  if (secondaryButtonHoverTextColor.value) {
    document.documentElement.style.setProperty(
      '--color-secondary-button-hover-text-color',
      secondaryButtonHoverTextColor.value,
    );
  }

  document.documentElement.style.setProperty('--color-primary', primaryColor);
  document.documentElement.style.setProperty(
    '--color-primary-rgb',
    primaryColorRgb,
  );
  document.documentElement.style.setProperty(
    '--color-primary-text',
    primaryTextColor,
  );
  document.documentElement.style.setProperty(
    '--color-secondary',
    secondaryColor,
  );
  document.documentElement.style.setProperty(
    '--color-secondary-text',
    secondaryTextColor,
  );
  document.documentElement.style.setProperty('--color-tertiary', tertiaryColor);
  document.documentElement.style.setProperty(
    '--color-tertiary-text',
    tertiaryTextColor,
  );

  if (textPositiveColor.value) {
    document.documentElement.style.setProperty(
      '--color-text',
      textPositiveColor.value,
    );
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Page transition when routing */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
