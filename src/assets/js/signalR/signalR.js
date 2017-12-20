/**
 * Created by Administrator on 2017-05-02.
 */
class SignalR {
  static Singleton=null;
  static connectionInit() {
    SignalR.Singleton = $.connection("/ChatConnection")
    console.log(SignalR.Singleton)
    SignalR.Singleton.received(function (data) {
      if (data == "") {
        // toastr.success('登录成功')
      }
      else if (Ext.util.Cookies.get('loginPersonId') == data.PersonId) {
        toastr.info(data.Message)
      }
    });
    SignalR.Singleton.start().done(function () {
      // connection.send('')
      // $("#broadcast").click(function () {
      //   connection.send($('#displayname').val() + '：' + $('#msg').val());
      // });
    });
  }
    static destory() {
      if(SignalR.Singleton){
        SignalR.Singleton.stop();
      }
    }
}
export default SignalR
