<template>
  <body class="bgimage" @keydown="eventKeydown">
  <span class="header" style="color:white"></span>
  <div class="col-xs-8 col-md-4">
    <div class="box-form">
      <div class="row">
        <input class="textBox col-xs-8 col-md-10" v-model="user.name.value" :placeholder="user.name.placeholder">
      </div>
      <div class="row">
        <input class="textBox col-xs-8 col-md-10" type="password" v-model="user.pwd.value"
               :placeholder="user.pwd.placeholder">
      </div>
      <!--<div class="col-md-offset-1">-->
      <!--<input type="checkbox" v-model="user.isRemember">-->
      <!--<label style="color:white">记住密码</label>-->
      <!--</div>-->
      <div class="row">
        <button class="loginBtn col-xs-8 col-md-10" @click=login()>登录</button>
      </div>
      <div class="row">
        <button class="recoverPasswordBtn" @click=register()>注册账号</button>
        <button class="recoverPasswordBtn col-xs-offset-4 col-md-offset-4" @click=recoverpassword()>忘记密码了?</button>
      </div>
    </div>
  </div>
  </body>
</template>
<script>
  //  import * as api from '../module/api'
  import storage from 'src/module/storage'
  import system from 'src/service/system'
  export default {
    data () {
      return {
        user: {
          name: {
            value: storage.getUserId(true),
            placeholder: '用户名'
          },
          pwd: {
            value: '',
            placeholder: '密码'
          },
          isRemember: false,
          rememberText: '记住密码'
        }
      }
    },
    mounted () {
    },
    methods: {
      eventKeydown: function (event) {
        var theEvent = event || window.event
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode
        if (code === 13) {
          this.login()
        }
      },
      login (quitOther) {
        const user = {}
        user.userId = this.user.name.value
        user.password = this.user.pwd.value
        user.autuLogin = this.user.isRemember
        system.login(user, quitOther, () => {
          window.UserId = user.userId
          this.$router.push('/layout/content')
        })
      },
      recoverpassword () {
        this.$router.push('/recoverpassword')
      },
      register () {
        this.$router.push('/register')
      }
    }
  }
</script>
<style scoped>

  .box-form {
    display: flex;
    flex-direction: column;
    border-style: none;
    margin: 40px 0px 0px 0px;
    padding: 35px 0px 10px 0px;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .header {
    font-size: 4em;
    font-weight: bold;
  }

  .textBox {
    height: 3em;
    border-radius: 5px;
    border-style: hidden;
  }

  .loginBtn:hover {
    background: #0046b5;
  }

  .loginBtn {
    height: 3em;
    border-radius: 5px;
    background: #2e66bf;
    text-align: center;
    color: white;
    border-style: hidden;
  }

  .recoverPasswordBtn {
    height: 2em;
    border-radius: 5px;
    background: rgba(0, 0, 0, 0);
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

  .bgimage {
    background-image: url(/Scripts/img/loginbg.jpg);
    background-size: 100% 100%
  }

</style>
