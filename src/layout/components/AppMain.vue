<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped lang="scss">
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 144 = navbar + tags-view + app-footer = 60 + 44 + 40 */
    min-height: calc(100vh - 88px);
    border-left: 15px solid #f0f2f5;
    border-right: 15px solid #f0f2f5;
  }

  .fixed-header+.app-main {
    padding-top: 88px;
    height: calc(100vh - 30px);
    overflow-y: auto;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
