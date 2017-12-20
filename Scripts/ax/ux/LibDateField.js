﻿
Ext.define('Ax.ux.form.LibDateField', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.libDateField',
    mixins: { eventHelper: 'Ax.ux.LibEventHelper' },
    format: 'Y-m-d',
    altFormats: 'Ymd',
    enableKeyEvents: true,
    initComponent: function () {
        this.id = this.name + this.tableIndex + '_' + DesktopApp.ActiveWindow;
        this.callParent();
    },
    listeners: {
        keydown: function (self, e, eOpts) {
            this.keydown(self, e, eOpts)
        }
    },
    onBlur: function (e) {
        var me = this;
        if (!me.readOnly) {
            if (me.up('form')) {
                if (!me.validating(me)) {
                    me.focus(false, true);
                    return;
                }
            }
        }
        me.callParent([e]);
    },
    createPicker: function () {
        var win = this.up('window');
        if (win === undefined)
            win = this.up('[isVcl=true]');
        if (win && (!win.vcl || win.vcl.isEdit === true || win.vcl.isEdit == undefined)) {
            return this.callParent(arguments);
        }
    },
    setValue: function (v) {
        if (v != undefined && typeof v !== 'number'&&v!='') {
            arguments[0] = v.getFullYear() * 10000 + (v.getMonth() + 1) * 100 + v.getDate();
        };
        if (v === 0)
            arguments[0] = undefined;
        return this.callParent(arguments);
    },
    getValue: function () {
        if (this.getRawValue() == '')
            this.value = 0;
        return this.value;
    },
    //老方法
    //getValue: function () {
    //    if (this.rawValue == '')
    //        this.value = 0;
    //    return this.value;
    //}
});
