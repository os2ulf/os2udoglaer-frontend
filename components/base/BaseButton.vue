<script setup>
const props = defineProps({
  buttonData: {
    type: Object,
    required: false,
    default: null,
  },
  color: {
    type: String,
    required: false,
    default: null,
  },
  icon: {
    type: String,
    required: false,
    default: null,
  },
  iconAfter: {
    type: String,
    required: false,
    default: null,
  },
  small: {
    type: Boolean,
    required: false,
  },
  ghost: {
    type: Boolean,
    required: false,
  },
  link: {
    type: Boolean,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
  },
});

const buttonClasses = computed(() => {
  const classes = ['button'];
  if (props.buttonData?.class) {
    classes.push(props.buttonData?.class);
  }
  if (props.color) {
    classes.push(`button--${props.color}`);
  }
  if (props.small) {
    classes.push('button--small');
  }
  if (props.icon) {
    classes.push('button--icon');
  }
  if (props.iconAfter) {
    classes.push('button--icon-after');
  }
  if (props.ghost) {
    classes.push('button--ghost');
  }
  if (props.disabled) {
    classes.push('button--disabled');
  }
  if (props.link) {
    classes.push('button--link');
  }

  return classes.join(' ');
});

const component = computed(() => {
  if (props.buttonData?.url !== null) {
    return resolveComponent('NuxtLink');
  }
  return 'button';
});

const handleKeyDown = (event) => {
  if (event.key === 'Enter' || event.keyCode === 13) {
    event.preventDefault();
    event.stopPropagation();

    if (
      event.target instanceof HTMLButtonElement ||
      event.target.tagName === 'BUTTON'
    ) {
      event.target.click();
    }
  }
};
</script>

<template>
  <component
    :is="component"
    :to="buttonData?.url"
    :target="buttonData?.target ? buttonData?.target : ''"
    :class="buttonClasses"
    :disabled="disabled"
    :type="component === 'button' ? 'button' : undefined"
    tabindex="0"
    @keydown="handleKeyDown"
  >
    <NuxtIcon v-if="icon" class="button__icon" :name="icon" filled />
    <span class="button__text" v-if="buttonData?.title">
      {{ buttonData?.title }}
    </span>

    <NuxtIcon
      v-if="iconAfter"
      class="button__icon-after"
      :name="iconAfter"
      filled
    />
  </component>
</template>

<style lang="postcss">
.button {
  .nuxt-icon svg path {
    stroke: currentColor;
  }
}
</style>
