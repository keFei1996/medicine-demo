<template>
  <div class="container">
    <keep-alive>
      <iframe :src="outPageUrl" style="width: 100%" :height="iframeHeight + 'px'" />
    </keep-alive>
  </div>
</template>

<script>
// import Cookies from 'js-cookie'

export default {
  name: 'OutPage',
  components: { },
  data() {
    return {
      // chis_token: Cookies.get('CHIS_TOKEN')
    }
  },
  computed: {
    iframeHeight() {
      return window.innerHeight - 120
    },
    outPageUrl() {
      // return `${this.$route.meta.outPage}?jwt=${this.chis_token}`
      return 'http://www.baidu.com'
    }
  },
  created() {
    // console.log()
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
  .container {
    position: relative;
    padding: 0 15px;
    font-size: 14px;
  }
</style>
