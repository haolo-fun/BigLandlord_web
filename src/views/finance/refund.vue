<template>
  <el-tabs v-model="activeName" type="border-card" style="margin: 20px">
    <el-tab-pane label="退押金" name="depositRefund">
      <el-container>
        <el-header>
          <el-input v-model="depositSn" placeholder="押金单号" clearable style="width: 200px" />
          <el-button v-waves type="primary" icon="el-icon-search" style="margin-left: 10px" @click="selectDeposit">
            查询
          </el-button>
        </el-header>
        <el-main>
          <el-card style="width: 420px">
            <div style="margin: 10px">
              <span>押金单号：</span>
              <span style="color: lightslategray;float: right">{{ deposit.depositSn }}</span>
            </div>
            <div style="margin: 10px">
              <span>押金：</span>
              <span style="color: lightslategray;float: right">{{ deposit.deposit }}</span>
            </div>
            <div style="margin: 10px">
              <span>租客姓名：</span>
              <span style="color: lightslategray;float: right">{{ deposit.name }}</span>
            </div>
            <div style="margin: 10px">
              <span>状态：</span>
              <span style="color: red;float: right">{{ depositStatusKeyValue[deposit.status] }}</span>
            </div>
            <div style="margin: 10px">
              <span>支付交易号：</span>
              <span style="color: lightslategray;float: right">{{ deposit.payId }}</span>
            </div>
            <div style="margin: 10px">
              <span>支付时间：</span>
              <span style="color: lightslategray;float: right">{{ deposit.payTime }}</span>
            </div>
            <div style="margin: 10px">
              <span>创建时间：</span>
              <span style="color: lightslategray;float: right">{{ deposit.createTime }}</span>
            </div>
          </el-card>
          <el-input v-model="depositRefund" placeholder="退款金额（可选）" oninput="value=value.replace(/[^0-9.]/g,'')" clearable style="margin-top: 20px; width: 200px" @clear="depositRefundPrice=deposit.deposit" @input="depositRefundPrice=depositRefund" />
          <el-popover v-model="depositPopoverVisible" placement="top" width="160">
            <p>退款交易不可逆，确定吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="depositPopoverVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDepositRefund">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-refresh-left" style="margin-left: 50px">退款</el-button>
          </el-popover>
          <div style="margin-top: 50px">
            <span>本次退款金额为：</span>
            <span style="color: orange">￥</span>
            <span style="font-size: 32px;color: orange">{{ depositRefundPrice }}</span>
          </div>
        </el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="退租金" name="rentRefund">
      <el-container>
        <el-header>
          <el-input v-model="orderSn" placeholder="请输入租单号" clearable style="width: 200px" />
          <el-button v-waves type="primary" icon="el-icon-search" style="margin-left: 10px" @click="selectRent">
            查询
          </el-button>
        </el-header>
        <el-main>
          <el-card style="width: 420px">
            <div style="margin: 10px">
              <span>租单编号：</span>
              <span style="color: lightslategray;float: right">{{ order.orderSn }}</span>
            </div>
            <div style="margin: 10px">
              <span>地址：</span>
              <span style="color: lightslategray;float: right">{{ order.address }}</span>
            </div>
            <div style="margin: 10px">
              <span>租客姓名：</span>
              <span style="color: lightslategray;float: right">{{ order.name }}</span>
            </div>
            <div style="margin: 10px">
              <span>状态：</span>
              <span style="color: red;float: right">{{ orderStatusKeyValue[order.orderStatus] }}</span>
            </div>
            <div style="margin: 10px">
              <span>总费用：</span>
              <span style="color: lightslategray;float: right">{{ order.price }}</span>
            </div>
            <div style="margin: 10px">
              <span>支付交易号：</span>
              <span style="color: lightslategray;float: right">{{ order.payId }}</span>
            </div>
            <div style="margin: 10px">
              <span>支付时间：</span>
              <span style="color: lightslategray;float: right">{{ order.payTime }}</span>
            </div>
            <div style="margin: 10px">
              <span>创建时间：</span>
              <span style="color: lightslategray;float: right">{{ order.createTime }}</span>
            </div>
          </el-card>
          <el-input v-model="orderRefund" placeholder="退款金额（可选）" oninput="value=value.replace(/[^0-9.]/g,'')" clearable style="margin-top: 20px; width: 200px" @clear="orderRefundPrice=order.price" @input="orderRefundPrice=orderRefund" />
          <el-popover v-model="orderPopoverVisible" placement="top" width="160">
            <p>退款交易不可逆，确定吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="orderPopoverVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleOrderRefund">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-refresh-left" style="margin-left: 50px">退款</el-button>
          </el-popover>
          <div style="margin-top: 50px">
            <span>本次退款金额为：</span>
            <span style="color: orange">￥</span>
            <span style="font-size: 32px;color: orange">{{ orderRefundPrice }}</span>
          </div>
        </el-main>
      </el-container>
    </el-tab-pane>
  </el-tabs>
</template>

<script>

import { depositRefund, orderRefund } from '@/api/pay'
import { listBySn } from '@/api/deposit'
import { orderListByOrderSn } from '@/api/order'

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
    key: 0,
    label: '未推送'
  },
  {
    key: 1,
    label: '已推送'
  },
  {
    key: 2,
    label: '已支付'
  },
  {
    key: 3,
    label: '过期'
  }
]

const orderStatusKeyValue = orderStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.label
  return acc
}, {})

const depositStatusKeyValue = depositStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Refund',
  data() {
    return {
      depositStatusOptions,
      depositStatusKeyValue,
      orderStatusOptions,
      orderStatusKeyValue,
      activeName: 'depositRefund',
      depositSn: '',
      depositRefund: undefined,
      orderSn: '',
      orderRefund: undefined,
      deposit: {},
      order: {},
      depositRefundPrice: 0,
      orderRefundPrice: 0,
      depositPopoverVisible: false,
      orderPopoverVisible: false
    }
  },
  created() {
    const route = this.$route
    if (route.query.d !== undefined) {
      this.depositSn = route.query.d
      this.selectDeposit()
    } else if (route.query.r !== undefined) {
      this.orderSn = route.query.r
      this.activeName = 'rentRefund'
      this.selectRent()
    }
  },
  methods: {
    selectDeposit() {
      listBySn(this.depositSn).then(
        (response) => {
          this.deposit = response.data.list[0]
          this.depositRefundPrice = this.deposit.deposit
        }
      )
    },
    selectRent() {
      orderListByOrderSn(this.orderSn).then(
        (response) => {
          this.order = response.data.list[0]
          this.orderRefundPrice = this.order.price
        }
      )
    },
    handleDepositRefund() {
      depositRefund(this.depositRefundPrice, this.deposit.depositSn)
      this.depositPopoverVisible = false
    },
    handleOrderRefund() {
      orderRefund(this.orderRefundPrice, this.order.orderSn)
      this.orderPopoverVisible = false
    }
  }
}
</script>

<style scoped>

</style>
