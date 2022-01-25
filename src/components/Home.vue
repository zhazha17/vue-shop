<template>
  <div>
    <el-button type="info" @click="logout">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      // 跳转到登录页
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped></style>
