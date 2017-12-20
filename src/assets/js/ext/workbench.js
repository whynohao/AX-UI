/**
 * Created by Administrator on 2017/3/17.
 */
import {OaHomeControl} from './oa-home-control'
import {MessageControl} from './message-control'
import {ConsoleItemKey} from '../../../components/items/console-items'
const controlItems = [MessageControl, OaHomeControl]
class Workbench {
  static getControl (el) {
    const panel = Ext.create('Ext.tab.Panel', {
      containerpanel: true,
      renderTo: el,
      height: '100%',
      width: '100%',
      itemClick: function (record) {
        var me = this;
        var tabId = record["PROGID"];//是否要考虑入口参数
        var displayText = record["MENUITEM"];
        if (tabId === ConsoleItemKey.SUPPLATFORM) {
          const userId = Ext.util.Cookies.get('loginUserId')
          const password = Ext.util.Cookies.get('loginPassword')
          Ext.Ajax.request({
            url: '/sysSvc/vendorLogin',
            async: false,
            method: 'POST',
            jsonData: {userId: userId, password: password},
            timeout: 60000,
            success: (response) => {
              var ret = Ext.decode(response.responseText)
              var params = Ext.encode(ret.VendorLoginResult)
              if (true) {
                window.open("http://192.168.1.17:9996?params=" + params)
              }
              console.log(params)
            }
          })
        } else {
          var tab = me.items.get(tabId);
          if (tab) {
            tab.show();
          } else {
            var tab = null
            for (var item of controlItems) {
              if (item.id === tabId) {
                tab = item.getControl()
              }
            }
            if (tab) {
              tab.title = displayText;
              tab.id = tabId;
              tab.create();
              var addTab = function () {
                me.add(tab).show();
              }();
            }
          }
        }
      }
    });
    return panel
  }
}
export {Workbench}
