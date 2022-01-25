<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="LoginFormRef" class="login_form" :model="LoginForm" :rules="LoginFormRules">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="user" v-model="LoginForm.username" placeholder="用户名"> </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <!-- unlock -->
          <el-input prefix-icon="lock" v-model="LoginForm.password" show-password placeholder="密码"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login" :plain="true">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      // 这是登录表单的数据绑定对象
      LoginForm: {
        username: 'admin',
        password: '123456'
      },
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
    }
  },
  methods: {
    // 点击重置按钮，进行表单重置
    resetLoginForm() {
      this.$refs.LoginFormRef.resetFields()
    },
    // 点击登录按钮，拿到表单验证的结果
    login() {
      this.$refs.LoginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data } = await this.$http.post('/login', this.LoginForm)
        // 如果 status 为200，则验证通过
        if (data.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: '用户名或密码错误，请重新输入',
            type: 'error'
          })
        }

        this.$message({
          showClose: true,
          message: '请求成功',
          type: 'success'
        })
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', data.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: transparent;
      // background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: transparent;
      }
    }
  }
}
.login_form {
  position: absolute;
  bottom: 40px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  float: right;
}
</style>
