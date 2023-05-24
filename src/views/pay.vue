<template>
  <div class="app">
    <el-steps :active="stepsActive" :process-status="processStatus" finish-status="success" align-center class="steps">
      <el-step title="身份认证" />
      <el-step title="支付押金" />
      <el-step title="支付租金" />
    </el-steps>
    <el-form v-show="stepsActive === 0" :model="form" label-position="left" class="form">
      <div class="title-container">
        <h3 class="title">房屋租赁在线支付系统</h3>
      </div>
      <el-form-item label="手机号">
        <el-input v-model="form.phone" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="form.code" placeholder="请输入验证码">
          <el-button slot="append" :disabled="codeBtnDisabled" @click="getCode">{{ codeMsg }}</el-button>
        </el-input>
      </el-form-item>
      <span style="color: red;font-size: 14px">{{ tip }}</span>
      <div style="margin-top: 80px">
        <el-button v-loading="formBtnLoading" type="primary" icon="el-icon-right" circle style="display:block;margin:0 auto;font-size: 150%" @click="identityAuthentication" />
      </div>
    </el-form>

    <el-container v-show="stepsActive ===1" direction="vertical" class="depositContainer">
      <el-table v-loading="depositListLoading" :data="depositList" stripe>
        <el-table-column label="押金单号" align="center" min-width="130">
          <template v-slot="{ row }">
            <span>{{ row.depositSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="租客姓名" align="center" min-width="80px">
          <template v-slot="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" class-name="status-col" min-width="80px">
          <template v-slot="{row}">
            <el-tag :type="row.status | depositStatusFilter">
              {{ depositStatusKeyValue[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="押金" min-width="80px" align="center">
          <template v-slot="{ row }">
            <span>{{ row.deposit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template v-slot="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 30px">
        <span>需支付费用：</span>
        <span style="color: orange">￥</span>
        <span style="font-size: 32px;color: orange">{{ depositPrice }}</span>
      </div>
      <el-container style="margin-top: 80px">
        <el-tooltip class="item" effect="dark" content="暂未开通微信支付，如有不便敬请谅解。" placement="bottom">
          <el-button type="success" :disabled="payDepositDisabled" circle style="display:block;margin:0 auto;font-size: 150%">
            <svg-icon icon-class="weChatPay" />
          </el-button>
        </el-tooltip>
        <el-button type="primary" :disabled="payDepositDisabled" circle style="display:block;margin:0 auto;font-size: 150%" @click="payDeposit">
          <svg-icon icon-class="alipay" />
        </el-button>
      </el-container>
      <div style="margin-top: 150px">
        <el-button icon="el-icon-back" circle style="display:block;float: left;font-size: 150%" @click="back" />
        <el-button icon="el-icon-right" circle style="display:block;float: right;font-size: 150%" @click="next(stepsActive)" />
      </div>
    </el-container>

    <el-container v-show="stepsActive === 2" direction="vertical" class="orderContainer">
      <el-table v-loading="orderListLoading" :data="orderList" stripe>
        <el-table-column label="租单编号" align="center" min-width="130px">
          <template v-slot="{ row }">
            <span>{{ row.orderSn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总费用" width="100px" align="center">
          <template v-slot="{ row }">
            <span>{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" class-name="status-col" min-width="80px">
          <template v-slot="{row}">
            <el-tag :type="row.orderStatus | orderStatusFilter">
              {{ orderStatusKeyValue[row.orderStatus] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="地址" min-width="250px" align="center">
          <template v-slot="{ row }">
            <span>{{ row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column label="租期/月" width="100px" align="center">
          <template v-slot="{ row }">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="150px" align="center">
          <template v-slot="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="tips">
        <span style="margin-left: 10px">以下为附加费详情：</span>
      </div>

      <el-table v-loading="drawerListLoading" :data="drawerList" stripe style="margin-top: 10px">
        <el-table-column label="内容" min-width="150px">
          <template v-slot="{ row }">
            <span>{{ row.key }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价" min-width="150px">
          <template v-slot="{ row }">
            <span>{{ row.value }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" min-width="150px">
          <template v-slot="{ row }">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="100px">
          <template v-slot="{ row }">
            <span>{{ row.remark }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 30px">
        <span>需支付费用：</span>
        <span style="color: orange">￥</span>
        <span style="font-size: 32px;color: orange">{{ orderPrice }}</span>
      </div>

      <el-container style="margin-top: 80px">
        <el-tooltip class="item" effect="dark" content="暂未开通微信支付，如有不便敬请谅解。" placement="bottom">
          <el-button type="success" :disabled="payOrderDisabled" circle style="display:block;margin:0 auto;font-size: 150%">
            <svg-icon icon-class="weChatPay" />
          </el-button>
        </el-tooltip>
        <el-button type="primary" :disabled="payOrderDisabled" circle style="display:block;margin:0 auto;font-size: 150%" @click="payOrder">
          <svg-icon icon-class="alipay" />
        </el-button>
      </el-container>
      <div style="margin-top: 100px">
        <el-button icon="el-icon-back" circle style="display:block;float: left;font-size: 150%" @click="back" />
        <el-button icon="el-icon-right" circle style="display:block;float: right;font-size: 150%" @click="next" />
      </div>
    </el-container>

    <el-container v-show="stepsActive ===3" direction="vertical" class="successContainer">
      <el-button type="success" circle icon="el-icon-check" style="display:block;margin:0 auto;font-size: 500%" @click="clear" />
      <div style="margin-top: 50px; text-align: center">
        <span style="color: green;font-size: 20px">您已完成支付</span>
      </div>
    </el-container>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="300px">
      <span>是否成功支付？</span>
      <span slot="footer">
        <el-button @click="dialogVisible = false;processStatus='error'">取 消</el-button>
        <el-button v-loading="haveToPayBtnLoading" type="primary" @click="haveToPay">我已支付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { validPhone, validCode } from '@/utils/validate'
import { sandCodeToTenant } from '@/api/notify'
import { getPaymentMsg } from '@/api/payment'
import { payDepositByPC, payDepositByPhone, payOrderByPC, payOrderByPhone } from '@/api/pay'

const depositStatusOptions = [
  {
    key: '0',
    display_name: '未付款'
  },
  {
    key: '1',
    display_name: '已付款'
  },
  {
    key: '2',
    display_name: '已退款'
  }
]

const orderStatusOptions = [
  {
    key: '1',
    display_name: '未付款'
  },
  {
    key: '2',
    display_name: '已付款'
  }
]

const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const depositStatusKeyValue = depositStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Pay',
  filters: {
    depositStatusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'info',
        0: 'danger'
      }
      return statusMap[status]
    },
    orderStatusFilter(status) {
      const statusMap = {
        1: 'danger',
        2: 'success'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      stepsActive: 0,
      dialogVisible: false,
      processStatus: 'process', // wait / process / finish / error / success
      form: {
        phone: '13512345678',
        code: '280758'
      },
      tip: '',
      codeMsg: '获取验证码',
      codeBtnDisabled: false,
      payTemp: {
        depositSn: undefined,
        orderSn: undefined
      },
      depositList: null,
      orderList: null,
      drawerList: null,
      formBtnLoading: false,
      depositListLoading: false,
      orderListLoading: false,
      drawerListLoading: false,
      haveToPayBtnLoading: false,
      payDepositDisabled: false,
      payOrderDisabled: false,
      depositPrice: 0,
      orderPrice: 0,
      imageUrl: undefined,
      depositStatusOptions,
      depositStatusKeyValue,
      orderStatusOptions,
      orderStatusKeyValue
    }
  },
  created() {
    const route = this.$route
    if (route.query.p !== undefined && route.query.c !== undefined) {
      this.form.phone = route.query.p
      this.form.code = route.query.c
      this.identityAuthentication()
    }
  },
  methods: {
    initStatus() {
      this.processStatus = 'process'
    },
    next() {
      if (this.stepsActive === 1 && this.depositList[0].status === 0) {
        this.$notify({
          title: 'ERROR',
          message: '您还未支付押金',
          type: 'error',
          duration: 2000
        })
        return false
      }
      if (this.stepsActive === 2 && this.orderList[0].orderStatus === 1) {
        this.$notify({
          title: 'ERROR',
          message: '您还未支付租金',
          type: 'error',
          duration: 2000
        })
        return false
      }
      this.stepsActive = this.stepsActive + 1
      return this.stepsActive === 3
    },
    back() {
      this.stepsActive = this.stepsActive - 1
    },
    async identityAuthentication() {
      if (!validPhone(this.form.phone)) {
        this.tip = '请检查手机号格式是否正确'
        return
      }
      if (!validCode(this.form.code)) {
        this.tip = '请检查验证码格式是否正确'
        return
      }
      this.tip = ''
      this.formBtnLoading = true

      // api..
      const a = await this.getData()
      if (a === 1) {
        this.$notify({
          title: 'Success',
          message: 'Authentication Successfully',
          type: 'success',
          duration: 2000
        })
        while (this.next());
      } else {
        this.form.code = ''
        this.processStatus = 'error'
        this.formBtnLoading = false
      }
    },
    getData() {
      const tempData = Object.assign({}, this.form)
      return getPaymentMsg(tempData).then(
        (response) => {
          if (response.code === 200) {
            this.depositList = response.data.depositList
            this.orderList = response.data.orderList
            this.drawerList = response.data.orderAdditionalList
            this.formBtnLoading = false
            this.initStatus()
            if (this.depositList[0].status === 0) {
              this.depositPrice = this.depositList[0].deposit
              this.payTemp.depositSn = this.depositList[0].depositSn
            } else {
              this.payDepositDisabled = true
            }
            if (this.orderList[0].orderStatus === 1) {
              this.orderPrice = this.orderList[0].price
              this.payTemp.orderSn = this.orderList[0].orderSn
            } else {
              this.payOrderDisabled = true
            }
            return 1
          }
        }
      ).catch(
        () => {
          return 0
        }
      )
    },
    payDeposit() {
      const data = { sn: this.payTemp.depositSn, quitUrl: window.location.href }
      if (this._isMobile()) {
        payDepositByPhone(data).then(
          (response) => {
            window.open(response.data)
          }
        )
      } else {
        payDepositByPC(data).then(
          (response) => {
            window.open(response.data)
          }
        )
      }
      this.dialogVisible = true
    },
    payOrder() {
      const data = { sn: this.payTemp.orderSn, quitUrl: window.location.href }
      console.log(data)
      if (this._isMobile()) {
        console.log('phone')
        payOrderByPhone(data).then(
          (response) => {
            window.open(response.data)
          }
        )
      } else {
        console.log('pc')
        payOrderByPC(data).then(
          (response) => {
            window.open(response.data)
          }
        )
      }
      this.dialogVisible = true
    },
    clear() {
      this.initStatus()
      this.form.phone = undefined
      this.form.code = undefined
      this.depositList = null
      this.orderList = null
      this.drawerList = null
      this.stepsActive = 0
    },
    getCode() {
      if (!validPhone(this.form.phone)) {
        this.tip = '请检查手机号格式是否正确'
        return
      }
      this.tip = ''
      this.codeBtnDisabled = true
      let s = 60
      sandCodeToTenant(this.form.phone).then(
        (response) => {
          if (response.msg === 'OK') {
            setInterval(() => {
              this.codeMsg = '验证码已发送(' + s + ')'
              if (s === 0) {
                this.codeMsg = '获取验证码'
                this.codeBtnDisabled = false
                return
              }
              s--
            }, 1000)
          } else {
            this.$notify.error({
              title: 'Send Fail',
              message: response.msg,
              duration: 2000
            })
            this.codeBtnDisabled = false
          }
        }
      )
    },
    async haveToPay() {
      this.haveToPayBtnLoading = true
      await this.getData()
      if (this.next()) {
        this.dialogVisible = false
      }
      this.haveToPayBtnLoading = false
    },
    _isMobile() {
      return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    }
  }
}
</script>

<style scoped>
.app {
  position: absolute;
  width: 100%;
  min-height: 100%;
  background-color: #eeebe8;
}

.steps {
  margin-top: 30px;
}

.title-container {
  position: relative;
}

.title {
  font-size: 26px;
  color: gray;
  margin: 0 auto 40px auto;
  text-align: center;
  font-weight: bold;
}

.form {
  position: relative;
  width: 450px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.depositContainer {
  position: relative;
  width: 1000px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.orderContainer {
  position: relative;
  width: 1000px;
  max-width: 100%;
  padding: 100px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.successContainer {
  position: relative;
  width: 1000px;
  max-width: 100%;
  padding: 160px 35px 0;
  margin: 0 auto;
  overflow: hidden;
}

.tips {
  font-size: 14px;
  margin-top: 50px;
  color: #99a9bf;
  margin-bottom: 10px;
}
</style>
