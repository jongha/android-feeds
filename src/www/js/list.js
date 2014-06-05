Ext.setup({
    onReady: function() {
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
        myMask.show();

        var setList = function(data) {
            Ext.create('Ext.List', {
                fullscreen: true,

                store: {
                    fields: ['title', 'link'],
                    data: data
                },

                itemTpl: '{title}',

                listeners: {
                    select: function(view, record) {
                        navigator.app.loadUrl(record.get('link'), {openExternal: true});
                        //Ext.Msg.alert('Selected!', 'You selected ' + record.get('link'));
                    }
                }
            });
        };
        
        Ext.data.JsonP.request({
            url: 'http://apps.mrlatte.net/api/feeds.json',
            callbackKey: 'callback',
            method: 'GET',
            params: {
                url: 'http://blog.mrlatte.net/feeds/posts/default'
            },
            callback: function(successful, data) {
                setList(data.output.responseData.feed.entries);
                myMask.hide();
            }
        });
    }
});
