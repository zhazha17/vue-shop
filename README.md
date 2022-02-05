# 1 项目概述

电商后台管理系统用于管理用户账号、商品分类、商品信息、订单、数据统计等业务功能

整体采用前后端分离的开发模式，其中前端项目是基于 Vue 技术栈的 SPA 项目

项目使用Vue3、vite、Vue-router 4、Element-UI Plus、Axios、Echarts技术

# 2 项目初始化

## 2.1 项目初始化步骤

1. 安装 Vue 脚手架
2. 通过 Vue 脚手架创建项目（通过 vite 的方式创建项目 ）
3. 配置 Vue 路由
4. 配置 Element-UI Plus组件库（全局导入）
5. 配置 axios 库
6. 初始化 git 远程仓库
7. 将本地项目托管到 github 或码云中


## 2.2 后台项目的环境安装配置

1. 安装 MySQL 数据库（利用phpstudy_pro导入数据）

2. 安装 Node.js 环境

   在 `vue_api_server`中安装依赖包

   执行`node app.js` 命令，查看所有接口

3. 配置项目相关信息

4. 启动项目

5. 使用 Postaman 测试后台项目接口是否正常

# 3 登录功能

## 3.1 登录概述

**1. 登录业务流程**

1. 在登录页面输入用户名和密码
2. 调用后台接口进行验证
3. 通过验证之后，根据后台的响应状态跳转到项目主页

**2. 登录业务的相关技术点**

- http 是无状态的
- 通过 cookie 的客户端记录状态
- 通过 session 在服务器端记录状态
- 通过 token 方式维持状态（跨域问题）

## 3.2 登录 — token 原理分析

![](C:\Users\DELL\Desktop\前端\前端\项目\电商后台管理项目\CSDN图片\token 原理分析.png)

## 3.3 登录功能实现

![](C:\Users\DELL\Desktop\前端\前端\项目\电商后台管理项目\CSDN图片\login 组件.png)

login 组件中，主要是利用 element ui 的表单域，此项目是全局导入的 element 组件

**登录页面的布局**

通过 Element-UI 组件实现布局

- el-form
- el-form-item
- el-input
- el-button
- 字体图标

#### 3.3.1 全局配置 Element-ui Plus

在 main.js 文件中，全局注册组件

``````javascript
import { createApp } from 'vue'
import App from './App.vue'
// 全局配置element-ui 组件
import ElementPlus from 'element-plus'
// 引入组件样式
import '../node_modules/element-plus/dist/index.css'

const app = createApp(App)
// 挂载 element-ui 模块
app.use(ElementPlus)
app.mount('#app')
``````

#### 3.3.2 使用 element 组件

``````javascript
<!-- 登录表单区域 -->
<el-form ref="LoginFormRef" class="login_form" :model="LoginForm" :rules="LoginFormRules">
   <!-- 用户名 -->
   <el-form-item prop="username">
    <el-input prefix-icon="user" v-model="LoginForm.username" placeholder="用户名"> </el-input>
   </el-form-item>
   <!-- 密码 -->
   <el-form-item prop="password">
     <el-input prefix-icon="lock" v-model="LoginForm.password" show-password placeholder="密码"></el-input>
   </el-form-item>
   <!-- 按钮 -->
   <el-form-item class="btns">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info" @click="resetLoginForm">重置</el-button>
   </el-form-item>
</el-form>
``````

`:module="LoginForm"` ：在两个 input 表单中，表单中双向绑定的数据

``````javascript
data() {
    return {
      // 这是登录表单的数据绑定对象
      LoginForm: {
        username: 'zs',
        password: '123',
      }
    }
  }
``````

`:rules = "loginFormRules"` ：表单验证规则，item 的 prop 属性设置为需 form 绑定值对应的字段名

v-model 绑定的 username 与 prop 的参数要一致

`````
 // 这是表单的验证规则对象
      LoginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '请输入长度2-6的字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 12, message: '请输入长度6-12的字符', trigger: 'blur' }
        ]
      }
`````

获取到表单的实例对象，访问 resetFields 方法，对表单进行重置

为表单添加 `ref="LoginFormRef"` 属性，方便得到表单的实例对象，且调用它的方法

``````
// 点击重置按钮，进行表单重置
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
    }
``````

```````
// 点击登录按钮，拿到表单验证的结果
login() {
      this.$refs.LoginFormRef.validate((valid) => {
        if (!valid) return
      })
}
```````

#### 3.3.3 发起 ajax 请求

在 main.js 中配置 axios 

``````javascript
// 导入 axios
import axios from 'axios'
// 为 axios 配置请求的根路径
// 数据库为本地数据库
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 将 axios 挂载为 app 的全局自定义属性
app.config.globalProperties.$http = axios
``````

在点击登录按钮时，拿到表单的登录信息，向服务器发起 ajax 请求】

``````javascript
 login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.post('/login', this.LoginForm)
        // 如果 status 为200，则验证通过
        if (data.meta.status != 200) {
          return console.log('登录失败')
        }
        console.log('登录成功')
      })
    }
``````

利用打印在控制台的方式显示提示信息的方式不明显，所以，利用 element 中的 message 消息提示组件

在利用全局注册 element 时，element-plus 为 `app.config.globalProperties` 添加了全局方法  `$message`  ,所以可以采用在 method 中调用 `this.$message`  方法唤起  `ElMessage`

```````javascript
用以下的代替上述的console.log('登录失败')与console.log('登录成功')
return this.$message({
            showClose: true,
            message: '用户名或密码错误，请重新输入',
            type: 'error'
          })
this.$message({
          showClose: true,
          message: '请求成功',
          type: 'success'
        })
```````

#### 3.3.4 存储 token

1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
2. 将  `token` 保存在 `sessionDtorage` 中
3. 通过编程式导航跳转到后台主页，地址路由时 `/home`

``````
// 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
window.sessionStorage.setItem('token', data.data.token)
// 2. 通过编程式导航跳转到后台主页，路由地址是 /home
this.$router.push('/home')
``````

# 4 主页布局

## 4.1 新建主页组件

在 router 中的 index.js 中，设置主页组件的路由导航，

`````
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Homde.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})
export default router
`````

## 4.2 路由导航守卫控制访问权限

未登录时（无 token 值），阻止进入 home 组件页面，强制跳转到 login 登录页面。

```````
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果用户进入登录界面，直接放行
  if (to.path === '/login') {
    next()
  } else {
    // 如果在其他界面，判断其是否登录(是否有token值)
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) next('/login')
    else {
      next()
    }
  }
})
```````

## 4.3 实现退出功能

基于 token 的方式实现退出功能，只要销毁本地的 token 即可。

`````
// 清空  token
window
`````

eslint 格式化文件 

新建 `.prettierrc` 文件7、

``````
{
    "semi":false    // 去除 ;
    "singleQuote":true // 启动 '' 格式
}
``````

## 4.4 实现主页整体布局

![](C:\Users\DELL\Desktop\前端\前端\项目\电商后台管理项目\CSDN图片\整体布局.png)

整体分为先上下，后左右布局

利用 container 的布局容器，规划页面大致

```````
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
      <el-aside>1</el-aside>
      <!-- 右边主体区域 -->
      <el-main>2</el-main>
    </el-container>
  </el-container>
```````

## 4.5 左侧菜单

### 4.5.1 左侧菜单布局

在 element-ui 中，引入侧边栏

``````
<el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" default-active="2" text-color="#fff" @open="handleOpen" @close="handleClose">
          <!-- 一级菜单 -->
          <el-sub-menu index="1">
            <!-- 一级菜单区域 -->
            <template #title>
              <el-icon><location /></el-icon>
              <!-- <i class="iconfont"></i> -->
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item index="1-1">
              <el-icon><location /></el-icon>
              <span>用户列表</span>
            </el-menu-item>
          </el-sub-menu>
</el-menu>
``````

### 4.5.2 通过 axios 拦截器添加 token 验证

需要授权的 API，必须在请求头中请求 Authorization 字段提供 token 

``````
// axios 请求拦截
axios.interceptors.request.use(config => {
    // 为请求头对象，添加 token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
``````

### 4.5.3 获取左侧菜单数据

``````
 data() {
    return {
      // 存储左侧菜单数据
      menulist: []
    }
  },
  // 数据要在一登录就进行获取
  created() {
    this.getMenuList()
  },
  methods: {
    // 获取所有的菜单数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '获取不到菜单数据',
          type: 'error'
        })
      } else {
        this.menulist = res.data
      }
    }
  }
``````

### 4.5.4 利用 for 循环进行数据渲染

```````
<el-aside>
        <!-- 侧边栏菜单区域 -->
        <el-menu active-text-color="#409EFF" background-color="#545c64" class="el-menu-vertical-demo" default-active="2" text-color="#fff" @open="handleOpen" @close="handleClose">
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单区域 -->
            <template #title>
              <el-icon><location /></el-icon>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.id" v-for="subItem in item.children" :key="subItem.id">
              <el-icon><list /></el-icon>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
```````

通过自定义图标，修改每个一级图标（利用第三方的字体图标库）

新建一个图标对象，将需要的图标放入，循环生成一级图标

`````
iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
}
`````

`````
<template #title>
	<i :class="iconsObj[item.id]"></i>
	<span>{{ item.authName }}</span>
</template>
`````

为菜单添加 `unique-opened`  属性，可以每次只打开一个菜单

### 4.5.5 侧边栏折叠与展开

element-ui 中的 menu 有一个 collapse 属性，用于是否水平折叠收起菜单，它的值为 true 时水平折叠。element-ui 的`:collapse-transition= 'false'` 关闭了折叠动画

为菜单添加一个动态的 width 属性，并进行一个判断，当 isCollapsen为 true 时，将宽度设为小值

````````
<el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toogle-button" @click="toggleCollapse">| | |</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu active-text-color="#409EFF" background-color="#545c64" class="el-menu-vertical-demo" default-active="2" text-color="#fff" unique-opened :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-sub-menu :index="item.id" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单区域 -->
            <template #title>
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.id" v-for="subItem in item.children" :key="subItem.id">
              <el-icon><list /></el-icon>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
</el-aside>
````````

### 4.5.6 侧边栏路由链接

在 element-ui 中的 menu 组件，有 router 属性，启用该模式会在激活导航时以 index 作为 path 进行路由跳转。

````````
<el-menu-item :index="'/home/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
	<el-icon><list /></el-icon>
	<span>{{ subItem.authName }}</span>
</el-menu-item>
````````



## 4.6 首页路由重定向

用户成功登录进入 /home 界面后，应该直接进入用户管理的用户列表界面，所以将 /home 进行路由重定向

1. 创建一个新的组件 Welcome 组件
2. 在路由的 index.js 文件中的 /home 路由中嵌套 /welcome 子路由
3. 在 Home.vue 组件中加入路由定位符

```````
// home.vue 
<!-- 右边主体区域 -->
<el-main>
	<router-view></router-view>
</el-main>
```````

在 index.js 中配置路由

```````
// router/index.js
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/home', component: Home, redirect: '/welcome', children: [{ path: '/welcome', component: Welcome }] }
  ]
})
```````

# 5 实现用户管理/用户列表功能

## 5.1 创建用户列表的路由

新建Users.vue 组件，在 router/index.js 中，home 路由中嵌套子路由

```````
{
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: 'users', component: Users }
      ]
}
```````

## 5.2 用户列表组件布局

用 element-ui 中的 Card 卡片和 Input 输入框和Layout 布局

```````
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 用户名搜索框 -->
          <el-input placeholder="请输入内容">
            <template #append>
              <el-button>
                <i class="iconfont icon-search1"></i>
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
```````

![](C:\Users\DELL\Desktop\前端\前端\项目\电商后台管理项目\CSDN图片\用户列表.png)

## 5.3 获取用户列表数据

```````
//components/Users.vue
<script>
export default {
  name: 'Users',
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      // 所有的用户列表
      userList: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: '用户列表请求数据出错',
          type: 'error'
        })
      this.userList = res.data.users
      this.total = res.data.total
    }
  }
}
</script>
```````

## 5.4 渲染用户列表数据

使用 element-ui 中的 table 表格

``````
<!-- 用户列表区域 -->
<el-table :data="userList" border stripe>
    <el-table-column label="#" type="index" />
    <el-table-column label="姓名" prop="username" />
    <el-table-column label="邮箱" prop="email" />
    <el-table-column label="电话" prop="mobile" />
    <el-table-column label="角色" prop="role_name" />
    <el-table-column label="状态" prop="mg_state" />
    <el-table-column label="操作" prop="date" />
</el-table>
``````

![](C:\Users\DELL\Desktop\前端\前端\项目\电商后台管理项目\CSDN图片\渲染用户列表数据.png)

### 5.4.1 状态栏改为开关

利用作用域插槽

```````
<el-table-column prop="mg_state" label="状态">
    <template #default="scope">
    	<el-switch v-model="scope.row.mg_statue" />
    </template>
</el-table-column>
```````

### 5.4.2 改造操作列

利用作用域插槽，找到数据的 id，进行编辑，删除和分配角色

一个 `tooltip` 组件，鼠标放上时，会显示文字提示

```````
<el-table-column label="操作" prop="date">
    <template #default>
   	<!-- 编辑按钮 -->
   	 <el-button type="primary" circle>
    	<i class="iconfont icon-edit"></i>
   	 </el-button>
    <!-- 删除按钮 -->
   	 <el-button type="danger" circle>
   		 <i class="iconfont icon-delete"></i>
     </el-button>
    <!-- 分配角色 -->
     <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top-start">
    	<el-button type="warning" circle>
    		<i class="iconfont icon-setting"></i>
    	</el-button>
     </el-tooltip>
    </template>
</el-table-column>
```````

## 5.5 实现数据分页效果

利用 pagination 分页组件

````````
<el-pagination 
  v-model:currentPage="queryInfo.pagenum" 
  :page-sizes="[1, 2, 5, 10]" 
  :page-size="queryInfo.pagesize" 
  layout="total, sizes, prev, pager, next, jumper" 
  :total="total" 
  @size-change="handleSizeChange" 
  @current-change="handleCurrentChange"> 
</el-pagination>
````````

- page-sizes： 控制每页显示的条数
- page-size： 当前每页显示的条数
- layout： 要被显示的部件
- total：总条数
- size-change：pageSize 改变时会触发，返回值每页条数
- current-change：currentPage 改变时会触发，返回值是当前页数
- pagenum：在 data 中定义的当前页数
- pagesize：在data 中定义的当前每页的显示条数

```````
// 监听 pagesize 改变的事件
handleSizeChange(newSize) {
// 获取到最新的数据
	this.queryInfo.pagesize = newSize
// 重新发起数据请求
	this.getUserList()
},
// 监听页码值改变的事件
handleCurrentChange(newPage) {
// 获取到最新的页数
	this.queryInfo.pagenum = newPage
// 重新发起数据请求
	this.getUserList()
}
```````

## 5.6 实现用户状态的修改

将用户状态的修改同步保存到后台数据库

1. 监听到 switch 开关状态的改变
2. 把最新的状态的改变保存到数据库中

switch 开关状态的改变会触发 change 事件，会拿到最新的状态的值

``````
<el-table-column prop="mg_state" label="状态">
	<template #default="scope">
		<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)" />
	</template>
</el-table-column>
``````

```````
async userStateChanged(userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果用户状态更新失败，把状态取反，保证用户状态没有变化
        userinfo.mg_state = !userinfo.mg_state
        return this.$message({
          showClose: true,
          message: '设置用户状态失败',
          type: 'error'
        })
      } else {
        this.$message({
          showClose: true,
          message: '设置用户状态成功',
          type: 'success'
        })
      }
    }
```````

## 5.7 实现搜索功能

1. 将文本框与 data 中的数据做双向绑定`v-model="queryInfo.query"`
2. 点击搜索按钮时，调用获取用户列表数据的函数，来进行数据的查询

```````
<el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <template #append>
              <el-button @click="getUserList">
                <i class="iconfont icon-search1"></i>
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
</el-row>
```````

利用 input 组件中的一键清空功能，即为 input 输入框添加一个 `clearable`  属性

利用 clear 事件，在点击由 `clearable` 属性生成的清空按钮时触发

在搜索框输入后点击回车后，也可以进行搜索`@keyup.enter="getUserList">`

```````
<el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter="getUserList">>
            <template #append>
              <el-button @click="getUserList">
                <i class="iconfont icon-search1"></i>
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
</el-row>
```````

## 5.8 添加用户功能

###5.8.1 添加用户的对话框

利用 dialog 对话框组件

````````
<!-- 添加用户的对话框 -->
<el-dialog v-model="dialogVisible" title="提示" width="40%" height="30%">
      <!-- 内容主体区域 -->
      <span>添加用户</span>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
        </span>
      </template>
</el-dialog>
````````

dialogVisible 是控制添加用户对话框的显示与隐藏，`dialogVisible =false` 时，对话框隐藏

给 "添加用户"按钮，添加点击事件`@click="dialogVisible = true"`  点击按钮时，对话框显示

### 5.8.2 渲染添加用户的表单

包含用户名，密码，邮箱，手机号

```````
<el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px" :size="formSize">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
</el-form>
```````

```````
// 添加用户的表单数据
addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
// 添加表单的验证规则对象
addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '输入用户名长度在2-6之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '输入密码长度在6-15之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
```````

###5.8.3 自定义邮箱与手机号验证规则 

```````
 // 定义验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
   const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法手机号
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    
addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 6, message: '输入用户名长度在2-6之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '输入密码长度在6-15之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
}
```````

### 5.8.4 关闭对话框后重置表单

1. 监听对话框的关闭事件
2. 在关闭事件中重置表单

```````
 <el-dialog v-model="dialogVisible" title="添加用户" width="40%" height="30%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px" :size="formSize">
      </el-form>
</el-dialog>
```````

```````
// 在关闭事件中重置表单
// 监听添加用户的对话框的关闭事件
addDialogClosed() {
	this.$refs.addFormRef.resetFields()
}
```````

### 5.8.5 表单预校验

在填写完用户信息后，点击确认不是直接关闭对话框，而是先进行表单的预校验。点击确认按钮，检查当前表单的预校验结果是否通过，如果没有通过则直接返回，如果通过预校验则发起添加用户的网络请求

````````
将“确认”按钮处的 click 点击事件改为 addUser
// 点击按钮，添加新用户。表单预校验处理函数
addUser() {
      // this.$refs.addFormRef 整个表单的对象
      this.$refs.addFormRef.validate((valid) => {
        // console.log(valid)
        if (!valid) 
        return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
      })
    }
````````

###5.8.6 发起请求添加一个新用户

``````
addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid)
          return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
        // 发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          this.$message({
            showClose: true,
            message: '添加用户失败',
            type: 'error'
          })
        } else {
          this.$message({
            showClose: true,
            message: '添加用户成功',
            type: 'success'
          })
          // 隐藏添加用户的对话框
          this.dialogVisible = false
          // 刷新用户列表，重新获取用户列表数据
          this.getUserList()
        }
      })
    }
``````

## 5.9 修改用户操作

###5.9.1 添加修改用户的对话框

添加修改用户的对话框

``````
<el-dialog v-model="editDialogVisible" title="修改用户" width="50%" height="40%">
      <!-- 内容主体区域 -->
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </template>
</el-dialog>
``````

为编辑按钮添加点击事件，进行编辑用户信息对话框的显示与隐藏

```````
<!-- 编辑按钮 -->
<el-button type="primary" circle @click="showEditDialog()">
	<i class="iconfont icon-edit"></i>
</el-button>

// 展示编辑用户的对话框
showEditDialog() {
	this.editDialogVisible = true
}
```````

### 5.9.2 根据 ID 查询用户信息

点击按钮，根据用户的 ID 查询到用户的旧数据，并且保存起来，提供在表单中进行填充

拿到用户的 ID：在修改按钮的点击事件中通过形参的形式传递 ID

点击事件外面通过作用域插槽接收到 scope 数据对象，通过 `scope.row` 拿到这一行对应的数据信息

``````
// 编辑信息的按钮
<template #default="scope">
<!-- 编辑按钮 -->
	<el-button type="primary" circle @click="showEditDialog(scope.row.id)">
		<i class="iconfont icon-edit"></i>
	</el-button>
</template>
``````

`````
// data中定义
// 查询到的用户信息对象
editForm:{}
`````

``````
// 发起请求，根据用户ID查询用户数据信息
async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '查询用户信息失败',
          type: 'error'
        })
      }
      // 数据获取成功，把查询到的数据保存到 data 上
      this.editForm=res.data      
      this.editDialogVisible = true
    }
``````

### 5.9.3 制作修改用户信息的表单

````````
<el-form ref="editFormRef" :model="editForm" label-width="120px" :rules="editFormRules">
	<el-form-item label="用户名">
		<el-input v-model="editForm.username" disabled></el-input>
	</el-form-item>
	<el-form-item label="邮箱" prop="email">
		<el-input v-model="editForm.email"></el-input>
	</el-form-item>
	<el-form-item label="手机号" prop="mobile">
		<el-input v-model="editForm.mobile"></el-input>
	</el-form-item>
</el-form>
````````

```````
// 编辑表单的验证规则
editFormRules: {
	email: [
		{ required: true, message: '请输入邮箱', trigger: 'blur' },
		{ validator: checkEmail, trigger: 'blur' }
	],
	mobile: [
		{ required: true, message: '请输入手机号', trigger: 'blur' },
		{ validator: checkMobile, trigger: 'blur' }
	]
}
```````

### 5.9.4 关闭对话框后的重置

``````
<el-dialog v-model="editDialogVisible" title="修改用户" width="50%" height="40%" @close="editDialogClosed">
</el-dialog>
``````

```````
// 监听编辑用户的对话框的关闭事件
editDialogClosed() {
	this.$refs.editFormRef.resetFields()
}
```````

### 5.9.5 表单预校验

```````
将编辑对话框的确认按钮的点击事件改为 editUser
// 修改用户信息并进行提交
    editUser() {
      this.$refs.editFormRef.validate((valid) => {
        if (!valid)
          return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
      })
    }
```````

### 5.9.6 修改用户信息

`````
 editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid)
          return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
        // 发起编辑用户的网络请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: '更新用户信息失败',
            type: 'error'
          })
        }
        this.$message({
          showClose: true,
          message: '更新用户信息成功',
          type: 'success'
        })
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 刷新用户列表，重新获取用户列表数据
        this.getUserList()
      })
    }
`````

##5.10 删除用户信息

利用 messgaebox 弹出框组件，提示确认删除，防止误操作

其中的“确认消息”组件中，可直接利用  `this.$messageBox.confirm` 使用此组件的弹框

- 为删除按钮添加点击删除事件`removeUserById(scope.row.id)`，并传递id参数

进行取消删除操作提示信息

```````
async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$messageBox
        .confirm('确定要永久删除此用户信息吗?', '提示', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已经取消了删除操作'
          })
        })
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
    }
```````

删除单个用户的请求方式`delete` ，请求路径为 `users/:id`

```````
async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$messageBox
        .confirm('确定要永久删除此用户信息吗?', '提示', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已经取消了删除操作'
          })
        })
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '删除用户失败',
          type: 'error'
        })
      }
      this.$message({
        showClose: true,
        message: '删除用户成功',
        type: 'success'
      })
      // 刷新数据列表
      this.getUserList()
    }
```````

## 5.11 分配角色

完成 权限管理中的 分配权限 功能后，再进行此功能

###5.11.1 展示分配角色的对话框

为 分配角色按钮 添加一个事件 `@click="setRole"`

```````
<el-dialog v-model="setRoleDialogVisible" title="分配角色" width="50%">
      <!-- 主体内容 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="setRoleDialogVisible = false">确认</el-button>
        </span>
      </template>
</el-dialog>
```````

```````
setRole(userInfo) {
	// 展示分配角色对话框
	this.setRoleDialogVisible = true
}
```````

``````
// data 中定义 setRoleDialogVisible
setRoleDialogVisible:false
``````

###5.11.2 添加主体内容

通过 作用域插槽的 `scope.row`  传递每一行的需要被分配角色的用户信息 `userInfo`

获取所有角色的列表数据`roleList`，并显示到对话框主体内容的下拉菜单中

利用select 选择器组件展示下拉菜单，`selectedRoleId` 为双向绑定的已选中的角色 Id 值

`````````
// 通过插槽的方式显示 “姓名”与“角色”
<el-dialog v-model="setRoleDialogVisible" title="分配角色" width="50%">
      <!-- 主体内容 -->
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的用户：{{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="setRoleDialogVisible = false">确认</el-button>
        </span>
      </template>
</el-dialog>
`````````

````````
async setRole(userInfo) {
// 在展示对话框之前，获取所有角色列表
	const { data: res } = await this.$http.get('roles')
	if (res.meta.status !== 200) {
		return this.$message({
			showClose: true,
			type: 'error',
			message: '获取角色列表失败'
		})
	}
	this.rolesList = res.data
	this.userInfo = userInfo
	// 展示分配角色对话框
	this.setRoleDialogVisible = true
}
````````

### 5.11.3 将分配的新角色保存

点击 确认 按钮后，将分配的新角色保存到用户信息中

为 确认 按钮绑定 `@click="saveRoleInfo"` 事件

````````
async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message({
          showClose: true,
          type: 'error',
          message: '请选择要分配的角色'
        })
      }
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          type: 'error',
          message: '更新角色失败'
        })
      }
      this.$message({
        showClose: true,
        type: 'success',
        message: '更新角色成功'
      })
      // 刷新当前的列表
      this.getUserList()
      // 隐藏分配角色对话框
      this.setRoleDialogVisible = false
}
````````

### 5.11.4 清空下拉菜单

更改完角色后，再次进入下拉菜单的选择还是上一次的选择，所以要在关闭对话框时，把下拉菜单进行清空

为 对话框添加 `@close="setRoleDialogClosed"`

`````````
setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
}
`````````



# 6 权限管理

## 6.1 权限列表

### 6.1.1 添加用户权限的路由

新建 power 文件夹下的 Rights.vue 

```````
// router/index.js
import Rights from '../components/power/Rights.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: 'users', component: Users },
        { path: 'rights', component: Rights }
      ]
    }
  ]
})
```````

### 6.1.2 制作面包屑和卡片区域

```````
<!-- 面包屑导航区域 -->
<el-breadcrumb separator="/">
	<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	<el-breadcrumb-item>权限管理</el-breadcrumb-item>
	<el-breadcrumb-item>权限列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card> </el-card>
```````

### 6.1.3 获取权限列表的数据

```````
data() {
    return {
      // 权限列表
      rightsList: []
    }
  },
  created() {
    // 获取所有的权限
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '用户权限获取失败',
          type: 'error'
        })
      }
      // 获取到的数据挂载到 rightsList 供页面的木板结构使用
      this.rightsList = res.data
    }
  }
```````

### 6.1.4 渲染列表中的数据

``````
<el-table :data="rightsList" border style="width: 100%" stripe>
    <el-table-column label="#" type="index" />
    <el-table-column label="权限名称" prop="authName" />
    <el-table-column label="路径" prop="path" />
    <el-table-column label="权限等级" prop="level" />
</el-table>
``````

利用element-ui 中的 tag 标签美化最后一列的 权限等级

通过作用域插槽的方式自定义输入格式

``````
<el-table-column label="权限等级" prop="level">
    <template #default="scope">
    	<el-tag v-if="scope.row.level === '0'">一级</el-tag>
    	<el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
    	<el-tag type="danger" v-else>三级</el-tag>
    </template>
</el-table-column>
``````

## 6.2 角色列表

### 6.2.1 新建角色列表的路由

在 power 文件夹中新建 Roles.vue 文件

```````
// router/index.js
import Roles from '../components/power/Roles.vue'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: 'users', component: Users },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles }
      ]
    }
  ]
})
```````

### 6.2.2 绘制面包屑和卡片视图

``````
<!-- 面包屑导航区域 -->
<el-breadcrumb separator="/">
	<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
	<el-breadcrumb-item>权限管理</el-breadcrumb-item>
	<el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图区域 -->
<el-card>
	<!-- 添加角色按钮 -->
	<el-button type="primary">添加角色</el-button>
</el-card>
``````

### 6.2.3 获取角色列表的数据

```````
data() {
    return {
      // 所有角色列表数据
      rolelist: []
    }
  },
  created() {
    // 获取所有角色的列表数据
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '用户权限获取失败',
          type: 'error'
        })
      }
      this.rolelist = res.data
    }
  }
```````

## 6.3 角色列表的添加角色

### 6.3.1 添加角色的对话框

利用 dialog 对话量框

```````
<el-dialog v-model="dialogVisible" title="添加角色" width="50%" height="40%">
      <!-- 内容主体区域 -->
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
        </span>
      </template>
</el-dialog>
```````

### 6.3.2 渲染添加角色的表单

`````````
<el-dialog v-model="dialogVisible" title="添加角色" width="50%" height="40%">
      <!-- 内容主体区域 -->
      <el-form ref="addRolermRef" :model="addRole" :rules="addRolemRules" label-width="100px" :size="formSize">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
        </span>
      </template>
</el-dialog>
`````````

`````````
// 控制角色用户对话框的显示与隐藏
dialogVisible: false,
      // 添加角色的表单数据
      addRole: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      addRolemRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '输入角色名长度在2-6之间', trigger: 'blur' }
        ]
      }
`````````

###6.3.3  关闭对话框后重置表单 

```````
<!-- 添加用户的对话框 -->
<el-dialog v-model="dialogVisible" title="添加角色" width="50%" height="40%" @close="addDialogClosed">
</el-dialog>
```````

```````
// 监听添加角色的对话框的关闭事件
addDialogClosed() {
	this.$refs.addRoleRef.resetFields()
}
```````

### 6.3.4 表单预校验

````````
// 将“确认”按钮处的 click 点击事件改为 addRole
addRole() {
     this.$refs.addRoleRef.validate((valid) => {
       if (!valid)
         return this.$message({
           showClose: true,
           message: '请填写合法的信息',
           type: 'error'
         })
})
````````

### 6.3.5 发起请求添加新角色

````````
addRole() {
      this.$refs.addRoleRef.validate(async (valid) => {
        if (!valid)
          return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
        // 发起添加角色的网络请求
        const { data: res } = await this.$http.post('roles', this.addRoles)
        if (res.meta.status !== 201) {
          this.$message({
            showClose: true,
            message: '添加角色失败',
            type: 'error'
          })
        } else {
          this.$message({
            showClose: true,
            message: '添加角色成功',
            type: 'success'
          })
          // 隐藏添加角色的对话框
          this.dialogVisible = false
          // 刷新角色列表，重新获取角色列表数据
          this.getRolesList()
        }
      })
    }
````````

## 6.4 角色列表的编辑用户操作

### 6.4.1 添加修改角色的对话框

添加修改角色的对话框

```````
<el-dialog v-model="editDialogVisible" title="修改角色" width="50%" height="40%">
      <!-- 内容主体区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </template>
</el-dialog>
```````

为编辑按钮添加点击事件，进行编辑用户信息对话框的显示与隐藏

```````
<el-button type="primary" circle @click="showEditDialog()">
	<i class="iconfont icon-edit"></i>
</el-button>

// 展示编辑角色的对话框
showEditDialog() {
	this.editDialogVisible = true
}
```````

###6.4.2 根据 ID 查询角色信息

```````
// 编辑信息的按钮
<template #default="scope">
<!-- 编辑按钮 -->
	<el-button type="primary" circle @click="showEditDialog(scope.row.id)">
		<i class="iconfont icon-edit"></i>
	</el-button>
</template>
```````

```````
// data中定义
// 查询到的用户信息对象
editRoles:{}
```````

```````
async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '查询角色信息失败',
          type: 'error'
        })
      }
      // 角色信息获取成功，把查询到的数据保存到 data 上
      this.editRoles = res.data
      // 展示编辑用户的对话框
      this.editDialogVisible = true
    }
```````

### 6.4.3 制作修改角色信息的表单

```````
<el-form ref="editRoleRef" :model="editRoles" :rules="editRoleRules" label-width="100px" :size="formSize">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
</el-form>
```````

``````````
// 编辑角色表单的验证规则
editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '输入角色名长度在2-6之间', trigger: 'blur' }
        ]
}
``````````

### 6.4.4 关闭对话框后的重置

为 dialog 对话框添加 close 关闭事件` @close="editDialogClosed`

````````
// 监听编辑用户的对话框的关闭事件
editDialogClosed() {
	this.$refs.editRoleRef.resetFields()
}
````````

### 6.4.5 表单预校验

为 确认按钮的 click 点击修改为 `@click="editRole"`

````````
editRole() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid)
          return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
      })
}
````````

### 6.4.6 修改角色信息

```````
editRole() {
      this.$refs.editRoleRef.validate(async (valid) => {
        if (!valid)
          return this.$message({
            showClose: true,
            message: '请填写合法的信息',
            type: 'error'
          })
        // 发起编辑角色的网络请求
        const { data: res } = await this.$http.put('roles/' + this.editRoles.roleId, {
          roleName: this.editRoles.roleName,
          roleDesc: this.editRoles.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: '更新角色信息失败',
            type: 'error'
          })
        }
        this.$message({
          showClose: true,
          message: '更新角色信息成功',
          type: 'success'
        })
        // 隐藏添加用户的对话框
        this.editDialogVisible = false
        // 刷新用户列表，重新获取用户列表数据
        this.getRolesList()
      })
    }
```````

## 6.5 角色列表的删除用户操作

为删除按钮添加点击删除事件`removeRoleById(scope.row.id)`，并传递id参数

```````
async removeRoleById(id) {
      // 弹框询问用户是否删除数据
      await this.$messageBox
        .confirm('确定要永久删除此角色信息吗?', '提示', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已经取消了删除操作'
          })
        })
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '删除角色失败',
          type: 'error'
        })
      }
      this.$message({
        showClose: true,
        message: '删除角色成功',
        type: 'success'
      })
      // 刷新角色数据列表
      this.getRolesList()
    }
```````

## 6.6 角色下权限数据的渲染

### 6.6.1 渲染一级权限

1. 在展开行中拿到当前角色对应的权限
   + 在请求数据列表的时候，返回的数据包含了每个角色的权限。拿到每一行对应的角色信息的 children 属性
   + 利用作用域插槽进行渲染

在角色列表区域的展开列中，利用 layout 布局对一级权限与二级三级权限进行分隔

````````
<el-table-column type="expand">
          <template #default="scope">
            <!-- 利用 for 循环进行数据的渲染 -->
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19"></el-col>
            </el-row>
            <pre>{{ scope.row.children }}</pre>
          </template>
</el-table-column>
````````

 为一级权限添加右箭头的字体图标，并修改样式

### 6.6.2 渲染二级三级权限

````````
<el-col :span="19">
<!-- 通过 for 循环渲染所有的二级权限 -->
	<el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
		<el-col :span="6">
        	<el-tag type="success" closable>
             {{ item2.authName }}
            </el-tag>
            <el-icon :size="size"><CaretRight></CaretRight></el-icon>
         </el-col>
		<el-col :span="18">
			<el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable>
             {{ item3.authName }}
			</el-tag>
		</el-col>
	</el-row>
</el-col>
````````

利用 tag 标签组件中的属性为标签添加为可移除标签

### 6.6.3 为标签添加关闭事件

为标签添加 close 关闭事件，并利用 messagebox 组件提示删除确认消息框

```````
<el-row :class="['bdbottom', 'vcenter']" v-for="item1 in scope.row.children" :key="item1.id">
	<!-- 渲染一级权限 -->
	<el-col :span="5">
		<el-tag closable @close="removeRightById(scope.row, item1.id)">
		{{ item1.authName }}
        </el-tag>
        <el-icon :size="size"><CaretRight></CaretRight></el-icon>
	</el-col>
	<!-- 渲染二级和三级权限 -->
	<el-col :span="19">
	<!-- 通过 for 循环渲染所有的二级权限 -->
		<el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
			<el-col :span="6">
				<el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
        		{{ item2.authName }}
        		</el-tag>
        		<el-icon :size="size"><CaretRight></CaretRight></el-icon>
        	</el-col>
        	<el-col :span="18">
        		<el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
        		{{ item3.authName }}
        		</el-tag>
        	</el-col>
        </el-row>
	</el-col>
</el-row>
```````

````````
// 根据ID删除对应的权限标签
async removeRightById(role, rightId) {
      // 弹框提示用户是否要删除
      await this.$messageBox
        .confirm('此操作将永久删除. 是否继续?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: '提示'
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已经取消了删除操作'
          })
        })
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '删除权限失败'
        })
      }
      // 为数据重新赋值权限
      role.children = res.data
    }
````````

## 6.7 分配权限

###6.7.1 添加对话框并获取权限数据

点击分配权限按钮，显示分配权限的对话框，并获取到所有权限的数据

为 分配权限的按钮添加 `@click="showSetRightDialog"` 点击事件

```````
<el-dialog v-model="setRightDialogVisible" title="分配权限" width="50%">
      <span>This is a message</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRightDialogVisible = false">确 认</el-button>
        </span>
      </template>
</el-dialog>
```````

```````
// 展示分配权限的对话框
async showSetRightDialog() {
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: '获取权限数据失败'
        })
      }
      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      this.setRightDialogVisible = true
    }
```````

### 6.7.2 将权限数据加载到对话框中

利用 tree 树形组件，并为其添加 复选框，全部展示，选中ID 等属性功能

```````
<el-dialog v-model="setRightDialogVisible" title="分配权限" width="50%">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setRightDialogVisible = false">确 认</el-button>
        </span>
      </template>
</el-dialog>
```````

````````
// 树形控件的树形绑定对象
treeProps: {
	children: 'children',
	label: 'authName'
},
````````

### 6.7.3 将数据上存在的权限，默认加载到对话框中

利用 `default-checked-keys` 属性，将三级权限的 ID 值放到一个数组中，然后进行双向绑定

利用递归函数，将角色信息传递到递归函数中，通过递归的形式将所有三级节点的 ID 保存到数组中

````````
<!-- 树形控件 -->
<el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" />
````````

``````
// 默认选中的节点 ID 值数组(三级全选的ID)
defKeys: []
``````

``````
// 通过递归的形式，获取角色下所有三级权限的 id ，并保存到 defKeys 数组中
// node 为节点
// arr 数组进行保存
getLeafKeys(node, arr) {
// 判断是否为三级节点，即判断是否包含 children 属性
	if (!node.children) {
	// 直接将 节点的 Id 值保存到 arr 中
		return arr.push(node.id)
	}
// 遍历每一个权限节点，如果当前节点是三级节点就保存到数据arr
// 每循环一项，拿到一个子节点 item，根据 item 再次调用递归函数
	node.children.forEach((item) => this.getLeafKeys(item, arr))
}
``````

````````
// 在展示分配权限之前调用递归函数，将 Id 值存入数组中
async showSetRightDialog(role) {
// 获取所有权限的数据
	const { data: res } = await this.$http.get('rights/tree')
	if (res.meta.status !== 200) {
		return this.$message({
			type: 'error',
			message: '获取权限数据失败'
		})
	}
	// 把获取到的权限数据保存到 data 中
	this.rightslist = res.data
	// 递归获取三级节点的 ID
	this.getLeafKeys(role, this.defKeys)
	this.setRightDialogVisible = true
}
````````

每次点击按钮都会将当前角色有的权限的 id 保存到数组中，但是在关闭时，没有清空，所以点击下一个的时候会叠加显示选中的标签

每次对话框关闭时，都清空一下数组中的数据

为对话框添加 `@close="setRightDialogClosed"` 关闭事件

```````
// 监听分配权限对话框的关闭事件
setRightDialogClosed() {
	this.defKeys = []
}
```````

### 6.7.4 将勾选的权限保存到服务器中

点击确认按钮，发起请求，将勾选的权限保存到服务器中

利用 tree 组件中的 `getCheckedKeys` 方法和 `getHalfCheckedKeys`  

为 确认 按钮添加 `@click="allotRights" `  事件

```````
async allotRights() {
      // 拿到所有全选与半选的 id
      const keys = [
      	...this.$refs.treeRef.getCheckedKeys(), 
      	...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将拿到的 Id 用英文 , 为分隔，进行拼接
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          type: 'error',
          message: '分配权限失败'
        })
      }
      this.$message({
        showClose: true,
        type: 'success',
        message: '分配权限成功'
      })
      // 重新刷新数据列表
      this.getRolesList()
      // 隐藏对话框
      this.setRightDialogVisible = false
}
```````

```````
// 在 展示分配权限的对话框函数中，获取到角色的 Id
showSetRightDialog(role) {
      // 拿到角色的 Id 为之后的添加做准备
      this.roleId = role.id
}
```````



#  改进

因为有许多相似以及重复的地方，或许可以封装函数来进行改进







