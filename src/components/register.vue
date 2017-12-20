<template>
  <body class="body bgimage">
  <span class="header">创建账号</span>
  <div class="col-xs-8 col-md-6">
    <div class="box-form">
      <div class="form-group col-md-offset-2 col-md-8">
        <label>账号</label>
        <label class="error-info" v-if=data.account.isshow>{{data.account.info}}</label>
        <input type="text" class="form-control" v-model="data.account.value" :placeholder="data.account.placeholder"
               @blur=check(data.account)>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>密码</label>
        <label class="error-info" v-if=data.pwd1.isshow>{{data.pwd1.info}}</label>
        <input type="password" class="form-control " v-model="data.pwd1.value" :placeholder="data.pwd1.placeholder"
               @blur=check(data.pwd1)>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>确认密码</label>
        <label class="error-info" v-if=data.pwd2.isshow>{{data.pwd2.info}}</label>
        <input type="password" class="form-control" v-model="data.pwd2.value" :placeholder="data.pwd2.placeholder"
               @blur=check(data.pwd2)>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>姓名</label>
        <label class="error-info" v-if=data.username.isshow>{{data.username.info}}</label>
        <input type="text" class="form-control" v-model="data.username.value" :placeholder="data.username.placeholder"
               @blur=check(data.username)>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>性别</label>
        <label>
          <input type="radio" name="optionsRadios" value="0" v-model="data.gender.value">
          男
        </label>
        <label>
          <input type="radio" name="optionsRadios" value="1" v-model="data.gender.value">
          女
        </label>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>部门</label>
        <label class="error-info" v-if=data.dept.isshow>{{data.dept.info}}</label>
        <select class="form-control" v-model="data.dept.value" :placeholder="data.dept.placeholder"
                @blur=check(data.dept)>
          <option v-for="dept in depts" :value=dept.DeptId>{{dept.DeptName}}</option>
        </select>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>邮箱</label>
        <label class="error-info" v-if=data.email.isshow>{{data.email.info}}</label>
        <input type="email" class="form-control" v-model="data.email.value" :placeholder="data.email.placeholder"
               @blur=check(data.email)>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <label>手机</label>
        <label class="error-info" v-if=data.phone.isshow>{{data.phone.info}}</label>
        <input type="tel" class="form-control" v-model="data.phone.value" :placeholder="data.phone.placeholder"
               @blur=check(data.phone)>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <button type="submit" class="loginBtn col-md-12" @click=postData()>提交</button>
      </div>
      <div class="form-group col-md-offset-2 col-md-8">
        <button type="submit" class="loginBtn col-md-12" @click=backToLogin()>返回登录页</button>
      </div>
    </div>
  </div>
  </body>

</template>
<script>
  export default {
    data () {
      return {
        data: {
          account: {
            id: 'inputId',
            value: '',
            placeholder: '账户',
            isshow: false,
            info: ''
          },
          pwd1: {
            id: 'inputPassword1',
            value: '',
            placeholder: '密码',
            isshow: false,
            info: ''
          },
          pwd2: {
            id: 'inputPassword2',
            value: '',
            placeholder: '确认密码',
            isshow: false,
            info: ''
          },
          username: {
            id: 'inputName',
            value: '',
            placeholder: '姓名',
            isshow: false,
            info: ''
          },
          gender: {
            id: '',
            value: 0,
            placeholder: '性别'
          },
          dept: {
            id: 'inputDept',
            value: '',
            placeholder: '部门',
            isshow: false,
            info: ''
          },
          email: {
            id: 'inputEmail',
            value: '',
            placeholder: '邮箱',
            isshow: false,
            info: ''
          },
          phone: {
            id: 'inputPhone',
            value: '',
            placeholder: '手机',
            isshow: false,
            info: ''
          }
        },
        depts: []
      }
    },
    computed: {},
    mounted () {
      this.getDept()
    },
    methods: {
      getDept () {
        this.depts.splice(0, this.depts.length)
        Ext.Ajax.request({
          url: '/sysSvc/getDept',
          async: true,
          method: 'GET',
          timeout: 60000,
          success: (result) => {
            var ret = Ext.decode(result.responseText)
            var depts = ret.GetDeptResult
            for (var item of depts) {
              this.depts.push(item)
            }
          }
        })
      },
      backToLogin () {
        this.$router.push('/')
      },
      checkData (data, list, pass) {
        var val = this.check(data)
        if (val === '' && pass) {
          pass = false
        }
        if (data.id !== 'inputPassword2') {
          list[data.id] = val
        }
      },
      postData () {
        var pass = true
        var list = {}
        this.checkData(this.data.account, list, pass)
        this.checkData(this.data.pwd1, list, pass)
        this.checkData(this.data.pwd2, list, pass)
        this.checkData(this.data.username, list, pass)
        this.checkData(this.data.gender, list, pass)
        this.checkData(this.data.dept, list, pass)
        this.checkData(this.data.email, list, pass)
        this.checkData(this.data.phone, list, pass)
        if (pass) {
          Ext.Ajax.request({
            url: '/sysSvc/register',
            async: true,
            jsonData: {info: list},
            method: 'POST',
            timeout: 60000,
            success: function (result) {
              var ret = Ext.decode(result.responseText)
              var err = ret.RegisterResult
              if (err !== '') {
                Ext.Msg.alert('提示', err)
              } else {
                Ext.Msg.alert('提示', '提交成功!')
              }
            }
          })
        }
      },
      check (data) {
        var id = data.id
        var val = data.value
        if (val === '') {
          this.setError(data, '必填')
          return ''
        } else {
          data.isshow = false
        }
        switch (id) {
          case 'inputId':
            if (/^[a-zA-Z]{1}[0-9a-zA-Z_]{1,}$/.test(val)) {
              data.isshow = false
            } else {
              this.setError(data, '只允许使用大小写字母、数字、下划线。并且只能以字母开头')
              return ''
            }
            break
          case 'inputPassword2':
            if (this.data.pwd1.value !== val) {
              this.setError(data, '2次密码输入需一致')
              return ''
            } else {
              data.isshow = false
            }
            break
          case 'inputEmail':
            if (/^([a-zA-Z0-9]|[._])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(val)) {
              data.isshow = false
            } else {
              this.setError(data, '邮箱格式不正确')
              return ''
            }
            break
          case 'inputPhone':
            if (/^((\+?86)|(\(\+86\)))?1\d{10}$/.test(val)) {
              data.isshow = false
            } else {
              this.setError(data, '手机格式不正确')
              return ''
            }
            break
        }
        return val
      },
      setError (data, error) {
        data.isshow = true
        data.info = error
      }
    }
  }
</script>
<style scoped>
  .error-info {
    color: #f14747;
  }

  .box-form {
    display: flex;
    flex-direction: column;
    border-style: none;
    padding: 35px 0px 25px 0px;
  }

  .header {
    font-size: 3em;
    font-weight: bold;
  }

  .loginBtn:hover {
    background: #0046b5;
  }

  .loginBtn {
    height: 2em;
    border-radius: 5px;
    background: #2e66bf;
    text-align: center;
    color: white;
    border-style: hidden;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /*.bgimage {*/
  /*background-image: url(/Scripts/img/loginbg.jpg);*/
  /*background-size: 100% 100%*/
  /*}*/
</style>
