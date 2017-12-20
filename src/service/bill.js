/**
 * Created by Administrator on 2017/6/27.
 */
class Bill {
  static openBill (parms) {
    switch (parms.BillType) {
      case 0:
      case 1:
        var curPks = parms.CurPks
        if (curPks && curPks.length > 0) {
          var entryParam = parms.EntryParam
          if (entryParam !== null && entryParam !== '') {
            entryParam = Ext.decode(entryParam)
          }
          console.info(1)
          Ax.utils.BillManager.openBillByF4(parms.ProgId, BillActionEnum.Browse, curPks, entryParam)
        }
        break
      case 4:
        Ax.utils.BillManager.openRpt(parms.ProgId, parms.DisplayText, parms.InfoId)
        break
      case 5:
        Ax.utils.BillManager.openRpt(parms.ProgId, parms.DisplayText, parms.InfoId)
        break
    }
  }
}
export default Bill
