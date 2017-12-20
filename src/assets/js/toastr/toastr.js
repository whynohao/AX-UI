/**
 * Created by Administrator on 2017-05-02.
 */
class Toastr {
  static  toastrInit()
  {
    //设置显示配置
    var messageOpts = {
      "closeButton": true,//是否显示关闭按钮
      "debug": false,//是否使用debug模式
      "positionClass": "toast-bottom-right",//弹出窗的位置
      "onclick": null,
      "showDuration": "300",//显示的动画时间
      "hideDuration": "1000",//消失的动画时间
      "timeOut": "5000",//展现时间
      "extendedTimeOut": "1000",//加长展示时间
      "showEasing": "swing",//显示时的动画缓冲方式
      "hideEasing": "linear",//消失时的动画缓冲方式
      "showMethod": "fadeIn",//显示时的动画方式
      "hideMethod": "fadeOut" //消失时的动画方式
    };
    toastr.options = messageOpts;
  }
  //提示
  //调用方法1
  //toastr.info('提示','有单据待审核');

  //调用方法2
  //toastr.info('内容2', '标题2');

  //调用方法3
  //toastr['info']('内容3', '标题3');

  //调用方法4
  //toastr.info('内容4', '标题4',messageOpts);

  //$('#showtoastsuccess').click(function () {
  //    //成功
  //    toastr.success('内容success', '标题success');
  //    //错误
  //    toastr.error('内容error', '标题error');
  //    //警告
  //    toastr.warning('内容warning', '标题warning');
  //    //清除
  //    toastr.clear();
  //    //移除
  //    toastr.remove();
  //});
}
export default Toastr
