var loadFeeds = function() {
    Ext.setup({
        onReady: function() {
            var store = null;
            
            var loadFeed = function(url) {
                var loadingMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
                loadingMask.show();            
                
                Ext.data.JsonP.request({
                    url: 'http://apps.mrlatte.net/api/feeds.json',
                    callbackKey: 'callback',
                    method: 'GET',
                    params: {
                        url: url
                    },
                    callback: function(successful, data) {
                        console.log(data);

                        store = new Ext.data.JsonStore({
                                    fields: ['title', 'link', 'author', 'publishedDate'],
                                    data: data.output.responseData.feed.entries,
                                    getGroupString: function(record) {
                                        return prettyDate(record.get('publishedDate'));
                                    }
                                });

                        for(var i=pnl.getItems().length-1; i>1; --i) {
                            pnl.removeAt(i);
                        }
                        
                        pnl.add([
                            //{ xtype: 'popupbox' },
                            {
                                xtype : 'list',
                                itemId : 'feedList',
                                id: 'itemList',

                                autoDestroy: true,
                                selectedCls: 'x-item',
                                scrollable: 'vertical',
                                height : '100%',

                                grouped: true,
                                modal: true,
                                hideOnMaskTag: false,
                                indexBar: true,

                                defaults: {
                                    styleHtmlContent: true
                                },  
                                
                                store: store,

                                itemTpl: '<tpl for="."><h1>{title}</h1><h2>{author}</h2><small>{publishedDate}</small></tpl>',

                                listeners: {
                                    itemtap: function (list, index, item, record, senchaEvent) {
                                        navigator.app.loadUrl(record.get('link'), { openExternal: true });
                                    }
                                },

                                plugins: [
                                    /*{
                                        ptype: 'listpaging',
                                        autoPaging: false,  
                                    },
                                    {
                                        ptype: 'pullrefresh',
                                        refreshFn: function(callback, plugin) {
                                            console.log( 'me1' );
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(function(position) {
                                                    console.log( 'me2' );
                                                    Rad.stores.games.getProxy().extraParams.lat  = position.coords.latitude;
                                                    Rad.stores.games.getProxy().extraParams.long  = position.coords.longitude;  
                                                    var store = plugin.list.getStore();
                                                    store.load(function(records, operation, success) {
                                                        callback.call(plugin);
                                                        console.log( 'me3' );
                                                    });
                                                }); 
                                            }
                                        }
                                    }*/
                                ],
                             }
                        ]);

                        loadingMask.hide();

                        //store.add(data.output.responseData.feed.entries);
                    }
                });
            }
                    
            var pnl = new Ext.Panel({
            
                fullscreen: true,
                default: {
                    border: false
                },
                items: [],
                dockedItems: [
                    /*{
                        xtype: 'toolbar',
                        docked: 'top',
                        title: 'Feeds for Software Engineers',
                    },*/
                    {
                        xtype: 'tabpanel',
                        docked: 'top',
                        activeItem: 0,
                        
                        defaults: {
                            styleHtmlContent: true
                        }, 
                        items: [
                            {
                                title: 'Hacker News',
                                url: 'https://news.ycombinator.com/rss'
                            },
                            {
                                title: '마이크로소프트웨어',
                                url: 'http://feeds.feedburner.com/co/rAXs'
                            },
                            {
                                title: '씨넷코리아',
                                url: 'http://feeds.feedburner.com/CNETKorea'
                            },
                            {
                                title: 'ZDNet Korea',
                                url: 'http://zdnetkorea.feedsportal.com/c/34249/f/622755/index.rss'
                            },                                                                            
                            {
                                title: 'Blog by Jong-Ha Ahn',
                                url: 'http://blog.mrlatte.net/feeds/posts/default',
                            },                            
                        ],
                        
                        listeners: {
                            activeitemchange: function(tabPanel, value, oldValue, eOpts) {
                                //tabPanel.setSize(200, 400);
                                console.log(tabPanel, value, oldValue, eOpts);

                                loadFeed(value.url);
                            },
                            initialize: function(tabPanel, eOpts) {
                            
                                loadFeed(this.items.items[0].url);
                            },  
                        },
                        
                    },                    
                ]
            });

/*
            Ext.define('Feeds.PopupMenu',{
                extend: 'Ext.Container',
                xtype: 'popupbox',
                config:{
                    itemId: 'popupMenu',
                    bottom: 0,
                    height: '10%',
                    width: '30%',
                    cls: 'removeBorder',
                    showAnimation: {
                        type: 'slide',
                        easing: 'ease-out',
                        direction: 'up',
                        duration: 300
                    },
                    hideAnimation: {
                        type: 'slideOut',
                        easing: 'ease-out',
                        direction: 'down',
                        duration: 400
                    },
                    layout: 'vbox',
                    defaults:{
                        flex: 1,
                    },
                    items:[
                        {
                            xtype: 'panel',
                            layout:'hbox',
                            style: 'border-top:1px solid',
                            defaults:{
                                flex: 1,
                            },
                            items: [
                                {
                                    xtype: 'panel',
                                    cls: 'segment',
                                    items:[{
                                        xtype: 'button',
                                        iconCls: 'settings',
                                        iconmask: true,
                                        text: 'Settings',
                                        cls: 'menuButtons',
                                        handler: function(){
                                            Ext.ComponentQuery.query('#popupMenu')[0].hide();
                                        }
                                    }]
                                },
                            ],
                        }
                    ]
                }
            });
*/

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

