<template>
  <body class="body ">
  <span class="header">忘记密码?</span>
  <div class=" col-md-4">
    <div class="box-form">
      <div class="row">
        <input class="textBox col-md-10" v-model="user.id.value" :placeholder="user.id.placeholder">
      </div>
      <div class="col-md-offset-1">
      </div>
      <div class="row">
        <button class="loginBtn col-md-10" @click=findPassword()>找回密码</button>
      </div>
      <div class="row">
        <button class="loginBtn col-md-10" @click=backToLogin()>返回登录页</button>
      </div>
    </div>
  </div>
  </body>
</template>
<script>
  export default {
    data () {
      return {
        user: {
          id: {
            value: '',
            placeholder: '账号'
          }
        }
      }
    },
    mounted () {
    },
    methods: {
      backToLogin () {
        this.$router.push('/')
      },
      findPassword () {
        var id = this.user.id.value
        Ext.Ajax.request({
          url: '/sysSvc/recoverPassword',
          async: true,
          jsonData: {userId: id},
          method: 'POST',
          timeout: 60000,
          success: function (result) {
            var err = result.RecoverPasswordResult
            if (err !== '') {
              Ext.Msg.alert('提示', '提交成功!我们将新密码发送到您的邮箱。')
            }
          }
        })
      }
    }
  }
</script>
<style scoped>

  .box-form {
    display: flex;
    flex-direction: column;
    margin: 40px 0px 0px 0px;
    padding: 35px 0px 25px 0px;
  }

  .header {
    font-size: 4em;
    font-weight: bold;
  }

  .textBox {
    height: 3em;
    border-radius: 5px;
    border-style: ridge;
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

  .row {
    display: flex;
    justify-content: center;
    margin: 10px 0px 10px;
  }

  body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
