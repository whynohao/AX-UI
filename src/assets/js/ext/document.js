import storage from '../../../module/storage'
import * as types from '../../../store/mutation-types'
import {NavHeaderItems} from '../../../components/items/nav-header-items'
class Document {
  /*
  在系统初始时需要做的工作
   */
  static onInit(gotoMenu) {
    try {
        if(Document.Instance==null){
        Ext.Loader.setPath('DocumentManage', '/Scripts/ax/dm'); //定义文档管理模块类的引用路径
        Document.Instance = Ext.create('DocumentManage.DocumentMain', {});
      }
      Document.gotoMenu=gotoMenu
      // 查找得到顶部菜单中的文档管理Item
      let filterList = NavHeaderItems.filter(item => {
        if (item && item.text === '文档管理') return true
        return false
      })
      if(filterList&&filterList.length>0)
        Document.DocumentItem=filterList[0]
      else{
        Document.DocumentItem= {
          key: EnumNavHeader.document,
          text: '文档管理',
          contrainer: 'document'
        }
      }

      DocumentManage.DocumentMain.JumpTo=Document.JumpTo; // 定义回调函数，跳转到文档管理页面
      DocumentManage.DocumentMain.JumpBack=Document.JumpBack; // 定义回调函数，从文档管理页面跳回原先页面
    }
    catch (err)
    {
      console.log(err)
    }
  };
  /*
  显示文档管理界面并跳转到跳转到指定文档
   */
  static JumpTo(dirId, dirType, docId){
    // 通过设置storage中的主菜单共享数据，切换主页面
    Document.LastItem= storage.getHeaderItem()  // 保存之前的页面Item
    var selectedItem=  Document.DocumentItem
    storage.setHeaderItem(selectedItem)
    //Document.store.dispatch(types.MAIN_HEADER_SELECTED_ITEM, {selectedItem}) // 跳转当前页面到文档管理页面
    Document.gotoMenu(selectedItem)

    var delay = new Ext.util.DelayedTask(function () {
      if( !Document.Instance.dirDocViewTab){
        //尚未展示出来过
        Document.Instance.autoExpandFirstNode();
      }
      Document.Instance.dirDocViewTab.jumpTo(dirId, dirType, docId);
    });
    delay.delay(1000);//延迟一定时间再定位到文档
  };
  /*
  从文档管理页面返回之前的页面
   */
  static JumpBack(){
    if(Document.LastItem&&Document.LastItem!=Document.DocumentItem){
      // 如果有之前的页面，则调回原先的页面
      var item=Document.LastItem
      storage.setHeaderItem(item)
      Document.gotoMenu(item) // 跳转回之前的页面
    }
  };
  /*
  在主界面上第一次点击相应的主菜单时需要执行的方法
   */
  static onSetMenu (el) {
    const id = 'DocumentMainPanel_FixId';
    DesktopApp.ActiveWindow = id;
    if(Document.Instance==null){
      Ext.Loader.setPath('DocumentManage', '/Scripts/ax/dm'); // 定义文档管理模块类的引用路径
      Document.Instance = Ext.create('DocumentManage.DocumentMain', {});
    }
    var panel=Document.Instance.createMainPanel(el,id);
    Document.Instance.autoExpandFirstNode(); // 自动显示第一个节点下的子目录信息
    return panel;
    }
  };
export {Document}
