﻿
Ext.define('Ax.ux.form.LibTextField', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.libTextField',
    mixins: { eventHelper: 'Ax.ux.LibEventHelper' },
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
        me.setValue(trim(me.value));
        if (!me.readOnly) {
            if (me.up('form')) {
                if (!me.validating(me)) {
                    me.focus(false, true);
                    return;
                }
            }
        }
        me.callParent([e]);
    }
});

function trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g,"");
}