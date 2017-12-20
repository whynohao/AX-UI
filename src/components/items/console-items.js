/**
 * Created by Administrator on 2017/6/22.
 */
const ConsoleItemKey = {
  'OA_HOME': 'OA_HOME',
  'MESSAGES': 'MESSAGES',
  'SUPPLATFORM': 'SUPPLATFORM',
  'PUBLISH': 'PUBLISH'
}
const ConsoleItems = [
  {
    PROGID: ConsoleItemKey.OA_HOME,
    MENUITEM: 'OA首页',
    enabled: false,
    index: 0
  }, {
    PROGID: ConsoleItemKey.MESSAGES,
    MENUITEM: '我的消息',
    enabled: true,
    index: 1
  }, {
    PROGID: ConsoleItemKey.SUPPLATFORM,
    MENUITEM: '供应商平台',
    enabled: false,
    index: 2
  }, {
    PROGID: ConsoleItemKey.PUBLISH,
    MENUITEM: '新功能发布',
    enabled: true,
    index: 3
  }
]
export {ConsoleItems, ConsoleItemKey}
