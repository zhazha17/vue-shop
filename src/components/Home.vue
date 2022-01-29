<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toogle-button" @click="toggleCollapse">| | |</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu active-text-color="#409EFF" background-color="#545c64" class="el-menu-vertical-demo" default-active="2" text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false" :router="true" :defaultactive="$route.path">
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单区域 -->
            <template #title>
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/home/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/home/' + subItem.path)">
              <el-icon><list /></el-icon>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <!-- 右边主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠与展开侧边栏
      isCollapse: false
    }
  },
  // 数据要在一登录就进行获取
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      // 跳转到登录页
      this.$router.push('/login')
    },
    // 获取所有的菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '获取不到菜单数据',
          type: 'error'
        })
      } else {
        this.menulist = res.data
      }
    },
    // 点击按钮，切换按钮的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
    // // 保存链接的激活状态
    // saveNavState()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      padding-left: 10px;
    }
  }
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
  color: #eaedf1;
  margin-top: 3px;
}
.toogle-button {
  background-color: #4a5064;
  font-size: 10px;
  height: 30px;
  line-height: 30px;
  color: #fff;
  text-align: center;
  cursor: pointer;
}
</style>
