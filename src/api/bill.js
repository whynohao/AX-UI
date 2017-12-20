/**
 * Created by a on 2016/9/22.
 */
import storage from '../module/storage'
import axios from 'axios'
import promiseFinally from 'promise.prototype.finally'
promiseFinally.shim()
var instance = axios.create({
  baseURL: '',
  timeout: 5000
  // headers: {'X-Custom-Header': 'foobar'}
})

const getUserhandle = () => {
  try {
    const user = storage.getUser()
    return user.Handle
  } catch (error) {
    console.error(error)
    return null
  }
}

export const canUseFunc = (progId) => {
  let canUse = false
  Ext.Ajax.request({
    url: 'billSvc/canUseFunc',
    method: 'POST',
    jsonData: {
      handle: getUserhandle(), progId: progId
    },
    async: false,
    timeout: 90000000,
    success: function (response) {
      const ret = Ext.decode(response.responseText)
      canUse = ret.CanUseFuncResult
    }
  })
  return canUse
}

/* 查询单据清单 */
export const getBillTreeListing = (ProgId, NodeId) => {
  const param = {
    treeListingQuery: {
      Handle: getUserhandle(),
      ProgId,
      NodeId
    }
  }
  return instance.post('billSvc/getBillTreeListing', param)
}

/* 查询单据清单 */
export const getBillListing = (progId, columnName, ContainsSub, value, timeFilter, filter, entryParam) => {
  const param = {
    listingQuery: {
      Handle: getUserhandle(),
      Condition: {
        ContainsSub: ContainsSub
      },
      ProgId: progId,
      TimeFilter: timeFilter,
      Filter: filter,
      EntryParam: entryParam
    }
  }
  console.info(value)
  if (value) {
    param.listingQuery.Condition.QueryFields = [{Name: columnName, QueryChar: 1, Value: [value]}]
  }
  return instance.post('billSvc/getBillListing', param)
}
