/**
 * Created by Administrator on 2017/5/2.
 */
class Golbal {
  static init () {
    window.DesktopApp = {
      ActiveWindow: null,
      JsPath: null,
      FormaterCache: new Ax.utils.LibFormaterCache()
    }
    Ax.utils.LibVclSystemUtils.loadJs()
  }

  static setRouter (router) {
    if (window.DesktopApp) {
      window.DesktopApp.router = router
    } else {
      console.error('window.DesktopApp not define')
    }
  }
}
export default Golbal
