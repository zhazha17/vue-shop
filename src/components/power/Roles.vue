<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template #default="scope">
            <!-- 利用 for 循环进行数据的渲染 -->
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
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column label="角色描述" prop="roleDesc" />
        <el-table-column label="操作">
          <template #default="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" size="mini" @click="showEditDialog(scope.row.id)"> <i class="iconfont icon-edit"></i>编辑 </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" @click="removeRoleById(scope.row.id)"> <i class="iconfont icon-delete"></i>删除 </el-button>
            <!-- 分配角色 -->
            <el-button type="warning" size="mini" @click="showSetRightDialog(scope.row)"> <i class="iconfont icon-setting"></i>分配权限 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的对话框 -->
    <el-dialog v-model="dialogVisible" title="添加角色" width="50%" height="40%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="addRoleRef" :model="addRoles" :rules="addRoleRules" label-width="100px" :size="formSize">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog v-model="editDialogVisible" title="修改角色" width="50%" height="40%" @close="editDialogClosed">
      <!-- 内容主体区域 -->
      <el-form ref="editRoleRef" :model="editRoles" :rules="editRoleRules" label-width="100px" :size="formSize">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog v-model="setRightDialogVisible" title="分配权限" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 控制角色用户对话框的显示与隐藏
      dialogVisible: false,
      // 添加角色的表单数据
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的验证规则对象
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '输入角色名长度在2-6之间', trigger: 'blur' }
        ]
      },
      // 控制修改角色对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的角色信息对象
      editRoles: {},
      // 编辑角色表单的验证规则
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 6, message: '输入角色名长度在2-6之间', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的树形绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点 ID 值数组(三级全选的ID)
      defKeys: [],
      // 当前即将分配权限的角色 id
      roleId: ''
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
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          message: '用户权限获取失败',
          type: 'error'
        })
      }
      this.rolelist = res.data
    },
    // 监听添加角色的对话框的关闭事件
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields()
    },
    // 表单预校验处理函数
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
        // console.log(res)
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
    },
    // 展示编辑用户的对话框
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
    },
    // 监听编辑用户的对话框的关闭事件
    editDialogClosed() {
      this.$refs.editRoleRef.resetFields()
    },
    // 修改角色信息并进行提交
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
    },
    // 根据 ID 删除对应的用户信息
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
    },
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
      // this.getRolesList()
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 拿到角色的 Id 为之后的添加做准备
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message({
          showClose: true,
          type: 'error',
          message: '获取权限数据失败'
        })
      }
      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data
      // this.defKeys = []

      // 递归获取三级节点的 ID
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的 id ，并保存到 defKeys 数组中
    // node 为节点
    // arr 数组进行保存
    getLeafKeys(node, arr) {
      // 在判断之前，先清空存放 id 的数组，
      // this.defKeys = []

      // 判断是否为三级节点，即判断是否包含 children 属性
      if (!node.children) {
        // 直接将 节点的 Id 值保存到 arr 中
        return arr.push(node.id)
      }
      // 遍历每一个权限节点，如果当前节点是三级节点就保存到数据arr
      // 每循环一项，拿到一个子节点 item，根据 item 再次调用递归函数
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      // 拿到所有全选与半选的 id
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // console.log(keys)
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
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 7px 9px 0px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
  width: 1200px;
  padding: 0 10px;
}
.bdbottom:nth-child(1) {
  border-top: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
