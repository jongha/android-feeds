var loadFeeds = function() {
    Ext.setup({
        onReady: function() {
            var store = new Ext.data.JsonStore({
                fields: ['title', 'link', 'author', 'publishedDate'],
                data: [],
                grouper: {
                    groupFn: function(record) {
                        return prettyDate(record.get('publishedDate'));
                    }
                }
            });

            Ext.create('Ext.dataview.List', {
                fullscreen: true,
                grouped: true,

                store: store,

                itemTpl: '<tpl for="."><h1>{title}</h1><h2>{author}</h2><small>{publishedDate}</small></tpl>',

                listeners: {
                    itemtap: function (list, index, item, record, senchaEvent) {
                        navigator.app.loadUrl(record.get('link'), { openExternal: true });
                    }
                },

                plugins: [
                    /*{
                        xclass: 'pullrefreshoverride',
                        pullText: 'Pull down for more new Feeds!',
                    }*/
                ],
            });

            
            var loadFeed = function(url) {
                Ext.Viewport.setMasked(
                    {
                        xtype: 'loadmask',
                        message: 'Please wait...'
                    }
                );
                
                Ext.data.JsonP.request({
                    url: 'http://apps.mrlatte.net/api/feeds.json',
                    callbackKey: 'callback',
                    method: 'GET',
                    params: {
                        url: url
                    },
                    
                    callback: function(successful, data) {
                        store.add(data.output.responseData.feed.entries);

                        //for(var i=pnl.getItems().length-1; i>1; --i) {
                        //    pnl.removeAt(i);
                        //}

                        Ext.Viewport.setMasked(false);
                    }
                });
            };
       
            loadFeed('http://blog.mrlatte.net/feeds/posts/default');
        }
    });
};


var app = {
    initialize: function() {
        this.bindEvents();

        loadFeeds();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("menubutton", this.onMenuButton, false);
        document.addEventListener("backbutton", this.onBackButton, false);
        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("online", this.onOnline, false);
    },
    onOffline: function() {
        console.log('offline');
    },
    onOnline: function() {
        console.log('online');
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    onBackButton: function() {
        app.receivedEvent('backbutton');

        navigator.app.exitApp();
    },
    onMenuButton: function() {
        console.log('onmenubutton');
    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        /*
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        parentElement.setAttribute('style', 'display:none;');

        console.log('    Event: ' + id);
        */
    }
};

