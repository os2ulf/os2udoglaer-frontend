<script setup lang="ts">
const props = defineProps({
  blockData: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="video-block">
    <ClientOnly>
      <VideoComponent
        v-if="
          blockData?.field_title ||
          blockData?.field_text ||
          blockData?.field_video_paragraph?.length > 0
        "
        :data="{
          videoTitle: blockData?.field_title,
          videoDescription: blockData?.field_text,
          videoArr: blockData?.field_video_paragraph,
        }"
        :layoutType="
          blockData.field_video_paragraph.length > 1 ? 'carousel' : 'flex'
        "
      />
    </ClientOnly>
  </div>
</template>
