var pageLoad = function() {
    Ext.setup({

        onReady: function() {
            var tags = 'software,rss';
            
            var store = Ext.create('Ext.data.Store', {
                fields: ['title', 'link', 'author', 'publishedDate'],
                data: [],
                grouper: {
                    groupFn: function(record) {
                        return prettyDate(record.get('publishedDate'));
                    }
                }
            });

            Ext.define('Feeds.plugin.PullRefresh', {
                extend: 'Ext.plugin.PullRefresh',
                fetchLatest: function() {
                    var that = this;
                    loadFeed(
                        tags,
                        {
                            masked: false,
                            callback: function(data) {
                                var store = that.getList().getStore(),
                                    proxy = store.getProxy(),
                                    operation;

                                store.loadData([],false);
                                for(var i=0; i<data.output.length; ++i) {
                                    store.add(data.output[i].responseData.feed.entries);
                                }

                                operation = Ext.create('Ext.data.Operation', {
                                    page: 1,
                                    start: 0,
                                    model: store.getModel(),
                                    limit: store.getPageSize(),
                                    action: 'read',
                                    sorters: store.getSorters(),
                                    filters: store.getRemoteFilter() ? store.getFilters() : []
                                });

                                proxy.read(operation, that.onLatestFetched, that);
                            }
                        }
                    );
                },
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
                    {
                        xclass: 'Feeds.plugin.PullRefresh',
                    }
                ],
            });


            var loadFeed = function(tags, config) {
                config = config || { masked: true, callback: null };

                if(config.masked) {
                    Ext.Viewport.setMasked(
                        {
                            xtype: 'loadmask',
                            message: 'Please wait...'
                        }
                    );
                }

                Ext.data.JsonP.request({
                    url: 'http://apps.mrlatte.net/api/feeds.json',
                    callbackKey: 'callback',
                    method: 'GET',
                    params: {
                        tags: tags
                    },

                    callback: function(successful, data) {
                        if(config && config.callback) {
                            config.callback(data);
                        }

                        //for(var i=pnl.getItems().length-1; i>1; --i) {
                        //    pnl.removeAt(i);
                        //}

                        if(config.masked) {
                            Ext.Viewport.setMasked(false);
                        }
                    }
                });
            };

            loadFeed(
                tags,
                {
                    masked: true,
                    callback: function(data) {
                        for(var i=0; i<data.output.length; ++i) {
                            store.add(data.output[i].responseData.feed.entries);
                        }
                    }
                }
            );
        }
    });
};


var app = {
    initialize: function() {
        this.bindEvents();

        pageLoad();
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

