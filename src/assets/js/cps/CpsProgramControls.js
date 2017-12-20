/**********************************************************************
 * CopyRight 2017 杭州集控科技有限公司 版权所有
 * 功能描述：CPS功能组件模块的主窗口
 * 创建标识：Huangwz 2017/04/28
 *
 * 修改标识：Huangwz 2017/04/28
 *
 ************************************************************************/
import {CpsCommonFunc, CpsCommonConst, CpsCommonVar} from './CpsCommon'
import {CpsMainPanel} from './CpsMainPanel'
import {CpsControlsAttr} from './CpsControlsAttr'
import {CpsEventPanel} from './CpsEventPanel'
class CpsProgramControls {
  // 当前拖拽功能组件相对于拖拽点偏X移位
  static controlOffsetX = 0
  // 当前拖拽功能组件相对于拖拽点偏Y移位
  static controlOffsetY = 0
  // 当前拖拽功能组件相对于画板元素偏X移位
  static canvasOffsetX = 0
  // 当前拖拽功能组件相对于画板元素偏Y移位
  static canvasOffsetY = 0
  // 画板中是否已存在此拖拽组件元素，false表示不存在
  static existControl = false
  // 当前所拖拽的功能组件元素
  static dragControl = null
  // 当前右键选中的功能组件元素
  static menuControl = null
  // 所选中的功能组件的ID，用于功能选择主数据
  static menuControlId = null
  // 所选中的功能组件的关联数据ID，用于功能选择主数据
  static menuControlRelId = null

  /** 通过后端方法getBillListing获得此功能组件的数据列表，并将列表数据返回
   * filterChecked： 已选择的数据块【草稿，未生效，生效，未审核，审核，作废，结案】
   * filterCbo：查询下拉框model
   * dateCbo：日期下拉框model
   * record：列表查询数据model
   * pageSize：当前页的数据量
   * callback：回调函数，将成功获取列表数据（isSuccess），功能数据列表（listData）, 当前页功能数据列表（listLoadData）,功能数据总页数（pageCount）返回过去
   * */
  static getBillDataList(filterChecked, filterCbo, dateCbo, record, pageSize, callback) {
    // 当前页功能数据列表
    let listLoadData = []
    // 功能数据总页数
    let pageCount = 0
    let filter = filterChecked()
    let fieldName = filterCbo.getValue()
    if (fieldName === 'all') {
      fieldName = ''
    }
    Ext.Ajax.request({
      url: '/billSvc/getBillListing',
      method: 'POST',
      jsonData: {
        listingQuery: {
          Handle: UserHandle,
          ProgId: record.PROGID,
          TimeFilter: dateCbo.getValue(),
          Filter: filter,
          EntryParam: record.ENTRYPARAM
        }
      },
      async: false,
      timeout: 90000000,
      success: function (response) {
        let ret = Ext.decode(response.responseText)
        // 功能数据列表
        let listData = Ext.decode(ret.GetBillListingResult)
        // listData.Columns[0]
        let filterField = Ext.decode(listData.FilterField)
        if (filterField.length > 0) {
          filterCbo.store.loadData(filterField, true)
        }
        // 功能数据数量
        let listingLength = listData.Data.length
        if (listingLength >= pageSize) {
          for (let i = 0; i < pageSize; i++) {
            listLoadData.push(listData.Data[i])
          }
        } else {
          listLoadData = listData.Data
        }
        pageCount = Math.ceil(listingLength / pageSize)
        callback(true, listData, listLoadData, pageCount)
      },
      failure: function (response) {
        Ext.Msg.alert('提示', '获取此功能数据列表失败')
        callback(false, [], [], 0)
      }
    })
  }

  /** 以弹框的方式显示出此功能组件的数据列表，以供用户选择功能组件的关联主数据ID
   * displayText：弹框的显示标题
   * progId：功能组件的功能标识，具有唯一性
   * callback：回调函数，将关联主数据ID（relId）,关联主数据名称（relName）返回回去
   * */
  static showProgramDataListView(displayText, progId, callback) {
    $('#cpsLoading').css('display', 'block')
    if (progId) {
      if (CpsCommonFunc.canUseFunc(progId)) {
        let win = null

        let extId = 'Ext_' + CpsCommonFunc.randomString()
        let record = {
          'parentId': extId,
          'MENUITEM': displayText,
          'PROGID': progId,
          'PROGNAME': displayText,
          'BILLTYPE': 0,
          'ENTRYPARAM': '',
          'ISVISUAL': false,
          'CONDITION': '',
          'id': extId,
          'leaf': true,
          'children': null
        }
        let tabId = progId.replace('.', '') + 'panel'

        let filterCbo = CpsCommonFunc.getFilterCob()
        let compareCbo = CpsCommonFunc.getCompareCbo()
        let compareTxt = CpsCommonFunc.getCompareTxt()
        let dateCbo = CpsCommonFunc.getDateCbo()

        // 数据过滤模块（草稿,未生效,生效,失效,有效,未审核,已审核），返回[panel, buildChecked]
        let filterFun = Ax.utils.LibQuickSelectBuilder.createSelectBar(record.BILLTYPE)
        // 过滤模块组成的Panel
        let filterPanel = filterFun[0]
        let pageSize = 200
        // 当前页页数
        let pageCount = 1
        let listingData = []
        let listingLoadData = []
        let allPageCount = 0
        let toolBarAction = []

        // 获取过滤之后的数据列表
        CpsProgramControls.getBillDataList(filterFun[1], filterCbo, dateCbo, record, pageSize, function (isSuccess, listData, listLoadData, pageCount) {
          if (isSuccess) {
            listingData = listData
            listingLoadData = listLoadData
            allPageCount = pageCount
            // 功能数据model
            let listingStore = Ext.create('Ext.data.Store', {
              fields: Ext.decode(listingData.Fields),
              proxy: {
                type: 'memory',
                reader: {
                  type: 'json'
                }
              },
              data: listingLoadData
            })
            let height = $(CpsCommonVar.renderTo).height()
            // 将功能数据加载到grid中
            let gridPanel = Ext.create('Ext.grid.Panel', {
              height: height - 90,
              pageCount: 1,
              pageSize: pageSize,
              flex: 1,
              store: listingStore,
              autoScroll: true,
              Pks: listingData.Pk,
              selType: 'checkboxmodel',
              multiSelect: false,
              columns: Ext.decode(listingData.Columns),
              plugins: 'gridfilters',
              listeners: {
                itemclick: function (self, record, item, index, e, eOpts) {
                  if (document.body.clientWidth < 1210) {
                    toolBarAction[2].execute()
                  }
                },
                itemdblclick: function (self, record, item, index, e, eOpts) {
                  if (document.body.clientWidth >= 1210) {
                    toolBarAction[2].execute()
                  }
                }
              }
            })
            // 表格数据渲染
            gridPanel.columns[0].renderer = function (value, metadata, record, rowIndex) {
              return (gridPanel.pageCount - 1) * gridPanel.pageSize + rowIndex + 1
            }

            // 工具栏功能加载
            toolBarAction = Ax.utils.LibToolBarBuilder.createBillListingAction(record.PROGID, record.BILLTYPE, displayText, 0, gridPanel, filterCbo, compareCbo,
              compareTxt, dateCbo, filterFun[1], undefined, record.ENTRYPARAM, pageCount, pageSize, allPageCount, listingData)
            // 选择确认
            let selConfirm = Ext.create(Ext.Action, {
              text: '选择确认',
              iconCls: 'fa fa-check ',
              handler: function () {
                let firstRecord = gridPanel.getView().getSelectionModel().getSelection()
                if (firstRecord.length === 1) {
                  let pk = gridPanel.Pks[0]
                  let relId = firstRecord[0].get(pk)
                  let name = pk.substr(0, pk.length - 2) + 'NAME'
                  let relName = firstRecord[0].get(name)
                  if (win) {
                    win.close()
                  }
                  callback(relId, relName)
                } else {
                  Ext.Msg.alert('提示', '只能选择一行数据')
                }
              }
            })
            toolBarAction.push(selConfirm)
            // 加载功能panel
            let tab = Ext.create('Ext.panel.Panel', {
              id: tabId,
              layout: {type: 'vbox', align: 'stretch'},
              border: false,
              tbar: Ax.utils.LibToolBarBuilder.createToolBar(toolBarAction),
              toolBarAction: toolBarAction,
              items: [
                gridPanel,
                filterPanel
              ]
            })

            let maxWidth = document.body.clientWidth * 0.8
            let maxHeight = document.body.clientHeight * 0.9 - 20
            // 创建window窗口
            win = Ext.create('Ext.window.Window', {
              title: displayText,
              titleAlign: 'center',
              constrain: true,
              closable: true,
              draggable: true,
              resizable: false,
              width: maxWidth,
              height: maxHeight,
              border: false,
              layout: 'fit',
              items: tab,
              isWindow: true,
              listeners: {
                beforeshow: function (self, eOpts) {
                  gridPanel.getView().getSelectionModel().clearSelections()
                  gridPanel.getView().refresh()
                  if (CpsProgramControls.menuControlRelId) {
                    let pk = gridPanel.Pks[0]
                    let orderStore = gridPanel.getView().getStore()
                    let rowCount = orderStore.getCount()

                    for (let i = 0; i < rowCount; i++) {
                      if (orderStore.getAt(i).get(pk) === CpsProgramControls.menuControlRelId) {
                        // 选中默认行
                        gridPanel.getView().getSelectionModel().selectRange(i, i, true)
                        return
                      }
                    }
                  }
                }
              }
            })

            win.show()
          }
        })
      } else {
        Ext.Msg.alert('提示', '没有当前功能的使用权限。')
      }
    }
    $('#cpsLoading').css('display', 'none')
  }

  /** 为标准工艺路线功能页面附加模型数据
   * techRouteProgId：标准工艺路线功能标识
   * techRouteControlId：标准工艺路线的组件ID
   * techRouteControlName：标准工艺路线的功能名称
   * techRouteId：标准工艺路线的关联主数据ID
   * */
  static AdditionalTechRouteData(techRouteProgId, techRouteControlId, techRouteControlName, techRouteId) {
    Ext.Ajax.request({
      url: '/CpsModule/GetCurrentTechRouteInfo',
      jsonData: { techRouteId: techRouteId, techRouteControlId: techRouteControlId, info: CpsCommonVar.controlLineModels },
      method: 'POST',
      async: false,
      timeout: 90000000,
      success: function (response) {
        let result = undefined
        if(response.responseText)
          result = Ext.decode(response.responseText)
        let billAction = techRouteId ? BillActionEnum.Edit : BillActionEnum.AddNew      //Edit
        let curPks = techRouteId ? [techRouteId] : undefined
        CpsProgramControls.showProgramDataView(techRouteProgId, billAction, curPks, null, result, function (relId, relName) {
          CpsMainPanel.buildControlLayout(techRouteControlId, techRouteControlName, relId, relName, false)
        })
      },
      failure: function (response) {
        if (techRouteId) {
          Ext.Msg.alert('提示', '修改当前标准工艺路线[' + techRouteId + ']数据出现异常')
        } else {
          Ext.Msg.alert('提示', '新增当前标准工艺路线[' + techRouteId + ']数据出现异常')
        }
      }
    })
  }

  /** 弹出主数据功能框（新增，修改，显示）
   * progId：功能组件的功能标识，具有唯一性
   * billAction：表单类型，有浏览（Browse），新增（AddNew），修改（Modif），编辑（Edit）这几种类型
   * curPks：表单主键数组集合
   * entryParam：表单入口参数
   * callback：回调函数，将关联主数据ID（relId）,关联主数据名称（relName）返回回去
   * */
  static showProgramDataView(progId, billAction, curPks, entryParam, techRouteModel, callback) {
    $('#cpsLoading').css('display', 'block')
    let vcl = Ax.utils.LibVclSystemUtils.getVcl(progId, BillTypeEnum.Master)
    let view = Ax.utils.LibVclSystemUtils.getView(progId, BillTypeEnum.Master, vcl)
    vcl.entryParam = entryParam
    vcl.getTpl()
    vcl.billType = BillTypeEnum.Master
    let id = Ext.id()
    DesktopApp.ActiveWindow = id
    vcl.winId = id

    let items = view[vcl.funcView.get('default').name](billAction, curPks, true)
    if (!items) {
      return
    }

    let progName = vcl.tpl.DisplayText

    let masterRow = vcl.dataSet.getTable(0).data.items[0]
    let title = Ax.utils.LibVclSystemUtils.getCurrentStateText(masterRow.get('CURRENTSTATE'))
    let curPk = ''
    if (curPks !== undefined) {
      curPk = curPks[0]
    }
    if (vcl.tpl.ShowAuditState) {
      let auditTxt = Ax.utils.LibVclSystemUtils.getAuditStateText(masterRow.get('AUDITSTATE'), masterRow.get('FLOWLEVEL'))
      title = curPk + progName + '【' + title + '】' + '【' + auditTxt + '】'
    } else {
      title = curPk + progName + '【' + title + '】'
    }
    if (vcl.billType === BillTypeEnum.Master) {
      if (!masterRow.get('ISVALIDITY')) {
        title += '【已失效】'
      }
    }

    let win = Ext.create('Ext.window.Window', {
      id: id,
      title: title,
      progName: progName,
      autoScroll: true,
      width: document.body.clientWidth * 0.8,
      height: document.body.clientHeight * 0.9,
      constrainHeader: true,
      minimizable: true,
      maximizable: true,
      items: items,
      vcl: vcl,
      listeners: {
        close: function (self, eOpts) {
          this.vcl.vclHandler(self, {libEventType: LibEventTypeEnum.FormClosed})
          // "生效"状态且非“编辑”状态
          if (self.vcl.dataSet.getTable(0).data.items[0].get('CURRENTSTATE') === 2 && !self.vcl.isEdit) {
            let pk = self.vcl.dataSet.getTable(0).data.items[0].store.Pks[0]
            let relId = self.vcl.dataSet.getTable(0).data.items[0].get(pk)
            let name = pk.substr(0, pk.length - 2) + 'NAME'
            let relName = self.vcl.dataSet.getTable(0).data.items[0].get(name)
            callback(relId, relName)
          }
        },
        beforeclose: function (self, eOpts) {
          this.vcl.vclHandler(self, {libEventType: LibEventTypeEnum.FormClosing})
          // 非"生效"数据，关闭之后提示警告信息
          if (self.vcl.dataSet.getTable(0).data.items[0].get('CURRENTSTATE') !== 2) {
            if (billAction === BillActionEnum.AddNew) {
              Ext.Msg.alert('提示', '单据未生效，此时新增的数据无效')
            }
            if (billAction === BillActionEnum.Modif) {
              Ext.Msg.alert('提示', '单据未生效，此时修改的数据无效')
            }
          }
        },
        beforeshow: function (self, eOpts) {
          if (progId === 'com.TechRoute' && techRouteModel) {
            CpsMainPanel.FillTechRouteGridData(self.vcl, techRouteModel)
          }
        }
      }
    })
    vcl.win = win
    win.show()
    $('#cpsLoading').css('display', 'none')
  }

  /** 粘贴已经复制的CPS功能组件到画板中并绑定相关事件
   * cpsControl：已复制的CPS功能组件元素
   * */
  static copyCpsControl(cpsControl) {
    let name = cpsControl.find('div.cps-controls-span').text().split('[')[0]
    let progId = cpsControl.attr('data-progid').replace('.', '')
    let left = Math.round(cpsControl.css('left').replace('px', '')) + 10
    let top = Math.round(cpsControl.css('top').replace('px', '')) + 10

    let controlId = progId + '_' + parseInt(Math.random() * 1000)
    while ($(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']').length > 0) {
      controlId = progId + '_' + parseInt(Math.random() * 1000)
    }
    let elDrag = cpsControl.clone().attr({'id': controlId, 'data-relid': ''}).css({
      'left': left + 'px',
      'top': top + 'px'
    })
    elDrag.find('div.cps-controls-span').text(name)
    elDrag.find('div.cps-controls-region').css({
      'background-color': '#eceff4',
      'border': '1px solid #bbcfde '
    })
    $(CpsCommonConst.canvasId).append(elDrag)
    CpsControlsAttr.updateControlByControlId(false, controlId)
    CpsProgramControls.initSvgControlEvent()
    CpsEventPanel.copyCpsControl = elDrag
  }

  /** 创建鼠标右键快捷菜单【选择，复制，删除】
   * 【选择：弹出此功能组件的数据列表，选择一条数据，点击“选择确认”按钮，将数据【主表ID和NAME值】返回并给组件的关联主数据ID和组件别名赋值】
   * 【复制：将此功能组件进行复制，修改它的ID值和位置（left+10，top+10）并将其复制的组件附加到画板中】
   * 【删除：将此功能组件从画板中删除并删除其相关联的矢量线，清理产线模型中的组件配置明细中的相关组件数据和矢量线配置明细数据相关矢量线数据】
   * */
  static createControlMenu() {
    CpsCommonVar.munePanel = Ext.create('Ext.menu.Menu', {
      width: 100,
      margin: '0 0 10 0',
      floating: true, // 通常你想设置这个为真 (默认的)
      shadow: 'drop',
      items: [
        {
          text: '选择',
          iconCls: 'fa fa-eye',
          handler: function () {
            this.up('menu').hide()
            CpsProgramControls.menuControlId = CpsProgramControls.menuControl.attr('id')
            CpsProgramControls.menuControlRelId = CpsProgramControls.menuControl.attr('data-relid')
            let displayText = CpsProgramControls.menuControl.find('div.cps-controls-span').text()
            let progId = CpsProgramControls.menuControl.attr('data-progid')

            if (progId === 'com.TechRoute' && CpsCommonVar.controlLineModels.FactoryModuleType === 2) {
              toastr.info('选择标准工艺路线主数据ID之前，要为其组件右方或下方的组件布局留出足够的空白区域以便加载其数据模型覆盖当前数据模型！', '系统提示')
              CpsProgramControls.showProgramDataListView(displayText, progId, function (relId, relName) {
                Ext.Msg.confirm("系统提示", "是否进行标准工艺路线的数据模型复制操作？", function (btn) {
                  let isCopy = btn === "yes" ? true : false
                  CpsMainPanel.buildControlLayout(CpsProgramControls.menuControlId, displayText, relId, relName, isCopy)
                })
              })
            } else {
              CpsProgramControls.showProgramDataListView(displayText, progId, function (relId, relName) {
                CpsControlsAttr.setControlRelIdName(CpsProgramControls.menuControlId, displayText, relId, relName)
              })
            }
          }
        },
        {
          text: '复制',
          iconCls: 'fa fa-plus',
          handler: function () {
            this.up('menu').hide()
            CpsProgramControls.copyCpsControl(CpsProgramControls.menuControl)
          }
        },
        {
          text: '删除',
          iconCls: 'fa fa-trash',
          handler: function () {
            this.up('menu').hide()
            let controlId = CpsProgramControls.menuControl.attr('id')
            CpsControlsAttr.deleteControlByControlId(controlId)
          }
        }
      ],
      renderTo: CpsCommonVar.renderTo  // 通常由它的包含容器呈现
    })
    return CpsCommonVar.munePanel
  }

  /** 创建功能组件的描述框，用于将组件描述的内容以提示框的形式显示出来
   * controlId：功能组件的组件ID，功能组件的唯一标识
   * isShow：是否显示描述框，true表示显示，false表示隐藏
   * */
  static createControlToolTip(controlId, isShow) {
    // 使用变量descToolTip来表示组件描述框，若未创建则先创建一个
    if (!CpsCommonVar.descToolTip) {
      CpsCommonVar.descToolTip = Ext.create('Ext.tip.ToolTip', {
        html: '跟随鼠标移动',
        trackMouse: true,            //  跟随鼠标移动
        dismissDelay: 8000,         // 15秒后自动隐藏
        border: '1 1 1 1',
        anchorOffset: 10,           // 指定箭头的位置
        cls: 'cps-x-tip-top-default',
        anchor: 'top',           // 指定箭头的指向 top,left,right
        maxWidth: 250,
        Width: 250
      })
    }
    if (isShow) {
      let svgOffset = $(CpsCommonConst.canvasId).offset()
      let left = 0
      let top = 0
      let html = '<b>未知数据</b><br>'
      for (let i = 0; i < CpsCommonVar.controlLineModels.ControlDetail.length; i++) {
        let model = CpsCommonVar.controlLineModels.ControlDetail[i]
        if (model.ControlId === controlId) {
          left = model.XCoordinate + model.ControlWidth / 2 + svgOffset.left - $(CpsCommonConst.canvasId).scrollLeft() - 5
          top = model.YCoordinate + model.ControlHeight + svgOffset.top - $(CpsCommonConst.canvasId).scrollTop()
          html = '<b>' + model.ControlDescription + '</b><br>'
          break
        }
      }
      CpsCommonVar.descToolTip.update(html)
      CpsCommonVar.descToolTip.showAt(left, top)
    } else {
      CpsCommonVar.descToolTip.setVisible(false)
    }
  }

  /** 当CPS功能组件拖拽入画板中时，根据不同的功能标识显示成不同的样子【宽高】
   * elDrag：当前要拖拽的CPS功能组件元素
   * */
  static getPersonalControl(elDrag) {
    let progId = elDrag.attr('data-progid')
    if(CpsCommonVar.controlLineModels.FactoryModuleType === 1){
      switch (progId) {
        case 'com.ProduceLine':
          elDrag.css({'width': '600px', 'height': '60px'})
          elDrag.find('img').css({'width': '30px', 'height': '30px'})
          break
        case 'com.WorkshopSection':
          elDrag.css({'width': '280px', 'height': '55px'})
          elDrag.find('img').css({'width': '25px', 'height': '25px'})
          break
        case 'com.WorkProcess':
          elDrag.css({'width': '150px', 'height': '50px'})
          elDrag.find('img').css({'width': '20px', 'height': '20px'})
          break
        case 'com.Workstation':
          elDrag.css({'width': '80px', 'height': '50px'})
          elDrag.find('img').css({'width': '20px', 'height': '20px'})
          break
      }
    }
    if(CpsCommonVar.controlLineModels.FactoryModuleType === 2){
      switch (progId) {
        case 'com.TechRoute':
          elDrag.css({'width': '70px', 'height': '600px'})
          elDrag.find('img').css({'width': '40px', 'height': '40px'})
          break
        case 'com.TechRouteType':
          elDrag.css({'width': '50px', 'height': '280px'})
          elDrag.find('img').css({'width': '20px', 'height': '20px'})
          break
        case 'com.WorkshopSection':
          elDrag.css({'width': '60px', 'height': '300px'})
          elDrag.find('img').css({'width': '30px', 'height': '30px'})
          break
        case 'com.WorkProcess':
          elDrag.css({'width': '160px', 'height': '60px'})
          elDrag.find('img').css({'width': '30px', 'height': '30px'})
          break
        case 'com.WorkstationConfig':
        case 'com.Material':
        case 'com.MaterialType':
          elDrag.css({'width': '160px', 'height': '50px'})
          elDrag.find('img').css({'width': '20px', 'height': '20px'})
          break
      }
    }
    return elDrag
  }

  /** SVG组件共有事件【SVG组件拖拽事件，SVG组件其他事件】
   * 【SVG组件拖拽事件：SVG组件开始拖拽，SVG组件结束拖拽。对产线模型中的组件配置明细中的组件数据进行增删改】
   * 【SVG组件其他事件：SVG组件鼠标右键事件，SVG组件鼠标左键事件，SVG组件双击事件, SVG组件鼠标进入事件，SVG组件鼠标移开事件】
   * */
  static initSvgControlEvent() {
    CpsProgramControls.setControlDragEvent()
    CpsProgramControls.setSvgControlOtherEvent()
  }

  /** CPS功能组件的初始化事件【组件拖拽事件，组件拖放事件，组件其他事件】
   * 【组件拖拽事件：组件开始拖拽，组件结束拖拽。对产线模型中的组件配置明细中的组件数据进行增删改】
   * 【SVG组件共有事件：SVG组件拖拽事件，SVG组件其他事件。】
   * */
  static initProgramControlEvent() {
    CpsProgramControls.initSvgControlEvent()
    CpsProgramControls.setControlMoveEvent()
  }

  /** CPS功能组件拖拽事件【组件开始拖拽，组件结束拖拽】
   * 【组件开始拖拽：通过变量existControl定义内部或外部元素拖拽，变量dragControl判定拖拽元素，并计算拖拽元素的偏移位】
   * 【组件结束拖拽：根据拖拽元素的位置判定是否需要删除组件，根据变量existControl确认新增或修改组件配置明细中的组件数据】
   * */
  static setControlDragEvent() {
    /** 重新绑定拖拽元素的开始事件，用于被拖拽的元素表示可以拖动
     * 拖拽的元素有两种：一是CPS动态组件中的组件元素，二是画板中的组件元素
     * */
    $(CpsCommonConst.mainPanelId).find('div[name=\'cpsIcon\']').unbind('dragstart').bind('dragstart', function (event) {
      if (!CpsCommonVar.useVectorLine && !CpsCommonVar.redrawCpsControl) {
        // 定义一个变量controlId用于表示当前拖拽组件的ID
        let controlId = $(this).attr('id')
        // 在画板中是否存在组件ID为controlId的组件，若存在则是画板中的组件元素拖拽，否则是CPS动态组件中的组件元素拖拽
        let cpsControl = $(CpsCommonConst.canvasId).find('div[id=\'' + controlId + '\']')
        // 画板中的组件元素进行拖拽，重新计算拖拽元素相对于画板的偏移位并隐藏缩放圆点
        if (cpsControl.length > 0) {
          CpsProgramControls.existControl = true
          CpsProgramControls.canvasOffsetX = $(CpsCommonConst.canvasId).offset().left - $(CpsCommonConst.canvasId).scrollLeft()
          CpsProgramControls.canvasOffsetY = $(CpsCommonConst.canvasId).offset().top - $(CpsCommonConst.canvasId).scrollTop()
          $(CpsCommonConst.drawSVGId).find('circle[name=\'zoomCircle\']').css({'display': 'none'})
          CpsCommonVar.selControlId = null
          $(CpsCommonConst.drawSVGId).find('circle[name=\'drawCircle\']').css({'display': 'none'})
          CpsCommonVar.selVectorLineId = null
          CpsCommonVar.polylineAttrPanel.getForm().reset()
        } else {
          // CPS动态组件中的组件元素进行拖拽，重新计算拖拽元素相对于画板的偏移位
          CpsProgramControls.existControl = false
          CpsProgramControls.canvasOffsetX = $(CpsCommonConst.canvasId).offset().left - $(this).offset().left - $(CpsCommonConst.canvasId).scrollLeft()
          CpsProgramControls.canvasOffsetY = $(CpsCommonConst.canvasId).offset().top - $(this).offset().top - $(CpsCommonConst.canvasId).scrollTop()
          // 构建组件ID值【通过下划线‘_’连接功能标识和三位随机数而组成】，使之在画板中具有唯一性
          let id = controlId + '_' + parseInt(Math.random() * 1000)
          while ($(CpsCommonConst.canvasId).find('div[id=\'' + id + '\']').length > 0) {
            id = controlId + '_' + parseInt(Math.random() * 1000)
          }
          // 并将此组件元素复制并修改其组件ID属性值赋值给变量existControl
          cpsControl = $(this).clone()
          cpsControl = cpsControl.attr('id', id)
          cpsControl = CpsProgramControls.getPersonalControl(cpsControl)
        }
        // 重新计算当前拖拽元素的相对于拖拽点的偏移位
        CpsProgramControls.controlOffsetX = parseInt(event.clientX - cpsControl.offset().left)
        CpsProgramControls.controlOffsetY = parseInt(event.clientY - cpsControl.offset().top)
        cpsControl.css({'position': 'absolute', 'margin': '0'})
        CpsProgramControls.dragControl = cpsControl
      }
    })

    /** 重新绑定拖拽结束事件，用于被拖曳的元素表示结束拖动
     * 拖拽结束有两种情况：一是拖拽元素从画板中移除【内部元素移除和外部元素移除】，二是拖拽元素在画板中修正【内部元素修改和外部元素新增】
     * */
    $(CpsCommonConst.mainPanelId).find('div[name=\'cpsIcon\']').unbind('dragend').bind('dragend', function (event) {
      if (!CpsCommonVar.useVectorLine && !CpsCommonVar.redrawCpsControl) {
        let left = Math.round(CpsProgramControls.dragControl.css('left').replace('px', ''))
        let top = Math.round(CpsProgramControls.dragControl.css('top').replace('px', ''))
        let controlId = CpsProgramControls.dragControl.attr('id')
        if (left < 0 || top < 0) {
          CpsControlsAttr.deleteControlByControlId(controlId)
        } else {
          CpsControlsAttr.updateControlByControlId(CpsProgramControls.existControl, controlId)
          if (!CpsProgramControls.existControl) {
            CpsProgramControls.initSvgControlEvent()
          }
        }
      }

      CpsProgramControls.existControl = false
      CpsProgramControls.dragControl = null
      event.originalEvent.preventDefault()
    })
  }

  /** CPS功能组件拖放事件【进入目标元素，在目标元素中移动】
   * 【组件进入目标元素：未选中的拖拽元素的属性在组件属性模块中显示】
   * 【组件在目标元素中移动：更新拖拽元素在画板中的位置以及在组件属性模块中的XY坐标值】
   * */
  static setControlMoveEvent() {
    /** 重新绑定拖拽元素进入目标元素事件，用于被拖曳的元素进入目标元素时显示出此组件的属性
     * 进入画板的拖拽元素：一是选中元素的拖拽，此不进行任何操作；二是未选中元素的拖拽，这将在组件属性模块中显示此组件的属性
     * */
    $(CpsCommonConst.canvasId).unbind('dragenter').bind('dragenter', function (event) {
      if (!CpsCommonVar.useVectorLine && CpsProgramControls.dragControl && !CpsCommonVar.redrawCpsControl) {
        let controlId = CpsProgramControls.dragControl.attr('id')
        if (CpsCommonVar.controlsAttrPanel.getForm().findField('ControlId').getValue() !== controlId) {
          CpsControlsAttr.setControlAttrFormValues(CpsProgramControls.dragControl)
        }
        if (!CpsProgramControls.existControl && $(CpsCommonConst.drawSVGId).find('svg[id=\'' + controlId + '\']').length <= 0) {
          let left = event.clientX - CpsProgramControls.controlOffsetX - CpsProgramControls.canvasOffsetX
          let top = event.clientY - CpsProgramControls.controlOffsetY - CpsProgramControls.canvasOffsetY
          CpsProgramControls.dragControl.css('left', left)
          CpsProgramControls.dragControl.css('top', top)
          $(CpsCommonConst.canvasId).append(CpsProgramControls.dragControl)
        }
      }

      event.originalEvent.preventDefault()
    })

    /** 重新绑定拖拽元素在目标元素中移动事件，用于被拖拽的元素在目标元素上移动时，修改拖拽元素的坐标和组件属性模块中的坐标值
     * 拖拽元素移动：计算出鼠标相对于组件的偏移位、画板的偏移位的位置作为组件的移动的坐标，为其元素的left或top赋值和组件属性模块中的XY坐标赋值
     * */
    $(CpsCommonConst.canvasId).unbind('dragover').bind('dragover', function (event) {
      if (!CpsCommonVar.useVectorLine && CpsProgramControls.dragControl && !CpsCommonVar.redrawCpsControl) {
        let left = event.clientX - CpsProgramControls.controlOffsetX - CpsProgramControls.canvasOffsetX
        let top = event.clientY - CpsProgramControls.controlOffsetY - CpsProgramControls.canvasOffsetY
        CpsProgramControls.dragControl.css('left', left)
        CpsProgramControls.dragControl.css('top', top)
        CpsCommonVar.controlsAttrPanel.getForm().findField('XCoordinate').setValue(left)
        CpsCommonVar.controlsAttrPanel.getForm().findField('YCoordinate').setValue(top)
        CpsMainPanel.resizeDrawSvg(CpsProgramControls.dragControl)    //CPS组件移动中拓展
      }

      event.originalEvent.preventDefault()
    })
  }

  /** CPS功能组件其他事件【组件鼠标右键事件，组件鼠标左键事件，组件双击事件, 组件鼠标进入事件，组件鼠标移开事件】
   * 【组件鼠标右键事件：用于显示快捷菜单】
   * 【组件鼠标左键事件：用于显示组件属性form】
   * 【组件双击事件：用于显示功能组件功能数据列表界面】
   * 【组件鼠标进入事件：显示其位置方点，当使用描述框功能时，显示其功能描述提示框】
   * 【组件鼠标移开事件：隐藏其位置方点，当禁用描述框功能时，隐藏其功能描述提示框】
   * */
  static setSvgControlOtherEvent() {
    /** 重新绑定功能组件鼠标右键事件（event.button为2是鼠标右键），用于显示快捷菜单
     * 使用变量munePanel来表示快捷菜单，将其显示位置放在当前鼠标位置，并使用变量menuControl来代表当前功能组件
     * */
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('mouseup').bind('mouseup', function (event) {
      if (!CpsCommonVar.useVectorLine) {
        if (event.button === 2) {
          if (!CpsCommonVar.munePanel) {
            CpsProgramControls.createControlMenu()
          }
          CpsProgramControls.menuControl = $(this)
          CpsCommonVar.munePanel.showAt(event.clientX, event.clientY, false)
          event.preventDefault()
        }
      }
    })

    /** 重新绑定功能组件鼠标左键事件（event.button为1或0是鼠标左键），用于显示组件属性form
     * 在组件属性模块中显示此组件的属性以及显示此组件的缩放原点，设置选中状态，并使用变量selControlId来代表选中功能组件的组件ID
     * */
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('click').bind('click', function (event) {
      if (!CpsCommonVar.useVectorLine) {
        CpsCommonVar.selCpsControl = $(this)
        CpsCommonVar.isSelCpsControl = true
        CpsControlsAttr.setControlAttrFormValues(CpsCommonVar.selCpsControl)
        CpsCommonFunc.showElementPoints(CpsCommonVar.selCpsControl, 'zoomCircle')
        CpsCommonVar.selControlId = CpsCommonVar.selCpsControl.attr('id')
      }
    })

    /** 重新绑定功能组件双击事件，用于显示组件的功能数据列表视图
     * 通过变量relId确认显示功能组件的浏览还是新增数据列表视图，关闭弹窗后将有效的功能主数据ID和名称重新给组件的关联主数据ID和组件别名赋值
     * */
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('dblclick').bind('dblclick', function (event) {
      if (!CpsCommonVar.useVectorLine) {
        let controlId = $(this).attr('id')
        let progId = $(this).attr('data-progid')
        let relId = $(this).attr('data-relid')
        let controlName = $(this).find('div.cps-controls-span').text()
        if (progId === 'com.TechRoute' && CpsCommonVar.controlLineModels.FactoryModuleType === 2) {
          toastr.info('新增或修改标准工艺路线之前，要为其组件右方或下方的组件布局留出足够的空白区域以便加载其数据模型覆盖当前数据模型！', '系统提示')
          CpsProgramControls.AdditionalTechRouteData(progId, controlId, controlName, relId)
        } else {
          let billAction = relId ? BillActionEnum.Browse : BillActionEnum.AddNew
          let curPks = relId ? [relId] : undefined
          CpsProgramControls.showProgramDataView(progId, billAction, curPks, null, null, function (relId, relName) {
            CpsControlsAttr.setControlRelIdName(controlId, controlName, relId, relName)
          })
        }
      }
    })

    /** 重新绑定功能组件鼠标进入事件，用于显示功能组件上的位置连接点，组件描述提示框
     * 通过变量useVectorLine确认是否显示功能组件上的位置连接点，通过变量useVectorLine和useToolTip确认是否显示组件描述提示框
     * */
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('mouseenter').bind('mouseenter', function (event) {
      if (CpsCommonVar.useVectorLine || CpsCommonVar.redrawVectorLine) {
        CpsCommonFunc.showElementPoints($(this), 'controlRect')
      }
      if (!CpsCommonVar.useVectorLine && CpsCommonVar.useToolTip) {
        let controlId = $(this).attr('id')
        CpsProgramControls.createControlToolTip(controlId, true)
      }
    })

    /** 重新绑定功能组件鼠标移开事件，用于隐藏功能组件上的位置连接点，组件描述提示框
     * 通过变量useVectorLine确认是否隐藏功能组件上的位置连接点，通过变量useVectorLine和useToolTip确认是否隐藏组件描述提示框
     * */
    $(CpsCommonConst.canvasId).find('div[name=\'cpsIcon\']').unbind('mouseleave').bind('mouseleave', function (event) {
      if (CpsCommonVar.useVectorLine || CpsCommonVar.redrawVectorLine) {
        $(CpsCommonConst.drawSVGId).find('rect[name=\'controlRect\']').css({'display': 'none'})
        CpsCommonVar.positionRectPoints = null
      }
      if (!CpsCommonVar.useVectorLine && CpsCommonVar.useToolTip) {
        CpsProgramControls.createControlToolTip(null, false)
      }
    })
  }
}
export {CpsProgramControls}
