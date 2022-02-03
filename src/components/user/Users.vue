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
      <!-- 搜索添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList" @keyup.enter="getUserList">
            <template #append>
              <el-button @click="getUserList">
                <i class="iconfont icon-search1"></i>
              </el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="邮箱" prop="email" />
        <el-table-column label="电话" prop="mobile" />
        <el-table-column label="角色" prop="role_name" />
        <el-table-column prop="mg_state" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="date">
          <template #default="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" circle @click="showEditDialog(scope.row.id)">
              <i class="iconfont icon-edit"></i>
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" circle @click="removeUserById(scope.row.id)">
              <i class="iconfont icon-delete"></i>
            </el-button>
            <!-- 分配角色 -->
            <el-tooltip class="box-item" effect="dark" content="分配角色" placement="top-start">
              <el-button type="warning" circle @click="setRole(scope.row)">
                <i class="iconfont icon-setting"></i>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页效果区域 -->
      <el-pagination v-model:currentPage="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog v-model="dialogVisible" title="添加用户" width="50%" height="40%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
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
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <!--  修改用户的对话框-->
    <el-dialog v-model="editDialogVisible" title="修改用户" width="50%" height="40%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog v-model="setRoleDialogVisible" title="分配角色" width="50%" @close="setRoleDialogClosed">
      <!-- 主体内容 -->
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的用户：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data() {
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
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示数据条数
        pagesize: 2
      },
      // 所有的用户列表
      userList: [],
      // 总数据条数
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
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
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
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
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的列表数据
      rolesList: [],
      // 已选中的角色 id 值
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      // console.log(res)
      if (res.meta.status !== 200)
        return this.$message({
          showClose: true,
          message: '用户列表请求数据出错',
          type: 'error'
        })
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      // 获取到最新的数据
      this.queryInfo.pagesize = newSize
      // 重新发起数据请求
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      // 获取到最新的页数
      this.queryInfo.pagenum = newPage
      // 重新发起数据请求
      this.getUserList()
    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      // console.log(res)
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
    },
    // 监听添加用户的对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户。表单预校验处理函数
    addUser() {
      // this.$refs.addFormRef 整个表单的对象
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
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
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '查询用户信息失败',
          type: 'error'
        })
      }
      // 数据获取成功，把查询到的数据保存到 data 上
      this.editForm = res.data

      this.editDialogVisible = true
      // 隐藏编辑用户的对话框
      // this.editDialogVisible = false
      // 刷新用户列表，重新获取用户列表数据
      // this.getUserList()
    },
    // 监听编辑用户的对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并进行提交
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
    },
    // 根据 ID 删除对应的用户信息
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
      // console.log(confirmResult)
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
    },
    // 展示分配角色对话框
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
    },
    // 点击按钮，分配角色
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
    },
    // 监听分配角色对话框的关闭
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-input-group > .el-input__inner {
  height: 40px;
  line-height: 40px;
}
.icon-search1::before {
  font-size: 18px;
}
</style>
