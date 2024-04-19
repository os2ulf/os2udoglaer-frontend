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
  loading: {
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
  if (props.ghost) {
    classes.push('button--ghost');
  }
  if (props.loading) {
    classes.push('button--loading');
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
</script>

<template>
  <component
    :is="component"
    :to="buttonData?.url"
    :target="buttonData?.target ? buttonData?.target : ''"
    :class="buttonClasses"
    :disabled="disabled"
  >
    <NuxtIcon v-if="icon" class="button__icon" :name="icon" fill />
    <NuxtIcon v-if="loading" class="button__loading-icon" name="loading" fill />
    <span class="button__text">
      {{ buttonData?.title }}
    </span>

    <NuxtIcon v-if="link" class="button__icon-after" name="chevron-down" fill />
  </component>
</template>
