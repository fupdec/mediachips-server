<template>
  <div class="mx-4">
    <v-divider class="mt-10 mb-2" />
    <div class="subtitle-2 text-right mb-4">Clear generated images</div>

    <v-alert type="info" class="caption mb-6" dense text outlined>
      You can delete generated images to save disk space. They will be
      automatically recreated when needed.
    </v-alert>
    
    <SettingsClearGeneratedImagesButton
      button="Timelines"
      imageType="timelines"
    />
    <SettingsClearGeneratedImagesButton button="Grids" imageType="grids" />
    <SettingsClearGeneratedImagesButton button="Marks" imageType="marks" />
  </div>
</template>


<script>
export default {
  name: "SettingsClearGeneratedImages",
  components: {
    SettingsClearGeneratedImagesButton: () =>
      import("@/components/settings/SettingsClearGeneratedImagesButton.vue"),
  },
};
</script>