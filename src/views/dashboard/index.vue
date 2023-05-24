<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{ welcome }}</div>
<!--    <div class="dashboard-text">name: {{ name }}</div>-->
<!--    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>-->
    <el-divider />
    <div class="dashboard-text">个人信息</div>
    <div class="dashboard-infoText">{{ info.username }}</div>
    <div class="dashboard-infoText">{{ info.phoneNumber }}</div>
    <div class="dashboard-infoText">{{ info.email }}</div>
    <el-divider />
    <div class="dashboard-text">修改密码</div>
    <div style="width: 300px;padding-top: 30px">
      <el-form :model="ups" label-width="80px">
        <el-form-item label="当前密码">
          <el-input v-model="ups.old" type="password" placeholder="请输入旧密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="ups.new" type="password" placeholder="请输入新密码" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="ups.again" type="password" placeholder="请在输入一次新密码" clearable></el-input>
        </el-form-item>
        <el-button type="danger" size="mini" @click="changePw">提交修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getInfo, resetPw } from '@/api/user'

export default {
  name: 'Dashboard',
  data() {
    return {
      welcome: '',
      info: {
        username: '',
        phoneNumber: '',
        email: ''
      },
      ups: {
        old: '',
        new: '',
        again: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    this.welcomeText()
    this.infoText()
  },
  methods: {
    welcomeText() {
      const date = new Date()
      const h = parseInt(date.getHours().toString())
      const name = this.$store.state.user.name
      if (h >= 8 && h < 11) {
        this.welcome = '早上好！' + name + '。今天，又是充满希望的一天！'
      } else if (h >= 11 && h < 13) {
        this.welcome = '中午好！' + name + '。午饭睡觉，时间不宜长。'
      } else if (h === 15) {
        this.welcome = '下午好！' + name + '。三点几嚟，饮茶先啦！'
      } else if (h >= 13 && h < 18) {
        this.welcome = '下午好！' + name + '。人间清醒，努力上进！'
      } else if (h >= 18) {
        this.welcome = '晚上好！' + name + '。今晚早滴训啦！'
      }
    },
    infoText() {
      getInfo().then(
        (response) => {
          this.info.username = '用户名：' + response.data.username
          this.info.phoneNumber = '手机号：' + response.data.mobile
          this.info.email = '邮箱：' + response.data.email
        }
      )
    },
    changePw() {
      if (this.ups.new !== this.ups.again) {
        this.$notify.error({
          title: '错误',
          message: '两次输入的密码不一致'
        })
        return
      }
      resetPw({ oldPw: this.ups.old, newPw: this.ups.new }).then(
        (response) => {
          if (response.code === 200) {
            this.$notify({
              title: '成功',
              message: '密码修改成功',
              type: 'success'
            })
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
  &-infoText {
    font-size: 16px;
    line-height: 30px;
  }
}
</style>
