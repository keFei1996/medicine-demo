<template>
  <div class="app-footer">
<!--    <div class="footer-link">-->
<!--      <p>-->
<!--        <a href="http://www.tomtawsoft.com/about/intro.shtml/" target="_blank">关于我们</a>-->
<!--        <a>法律声明</a>-->
<!--        <a>友情链接</a>-->
<!--      </p>-->
<!--    </div>-->
    <div class="footer-copyright">
      <p>Copyright &copy 2017-2020版权所有万达信息股份有限公司</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDashboard: this.$router.currentRoute.path === '/dashboard/index'
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
  },
  watch: {
    $route(to, from) {
      if (to.path === '/dashboard/index') {
        this.isDashboard = true
      } else {
        this.isDashboard = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-footer {
    height: 30px;
    overflow: hidden;
    position: relative;
    background: #fff;
    font-size: 12px;
    color: #666;

      .footer-link, .footer-copyright {
        line-height: 30px;
        text-align: center;
        p {
          margin: 0;
        }
      }
  }
  .isDashboard {
    background-color: #fff;
  }
</style>
