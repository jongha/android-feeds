var tags = 'software';
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

var pageLoad = function() {
    Ext.setup({

        onReady: function() {
            var store = Ext.create('Ext.data.Store', {
                fields: ['title', 'link', 'author', 'publishedDate'],
                data: [],
                grouper: {
                    groupFn: function(record) {
                        return (new Date(record.get('publishedDate'))).toDateString();//prettyDate(record.get('publishedDate'));
                    }
                },
                sort: [
                    { property: 'publishedDate', direction: 'DESC' },
                    { property: 'title', direction: 'ASC' },
                ],
            });

            Ext.create('Ext.dataview.List', {            
                fullscreen: true,
                grouped: true,

                store: store,

                itemTpl: new Ext.XTemplate(
                    '<tpl for=".">',
                    '<h1>{title}</h1>',
                    '<tpl if="author && publishedDate"><span><small>{author}</small>, <small>{publishedDate}</small></span></tpl>',
                    '</tpl>',
                    {
                    }
                ),

                /*
                //set the function when a user taps on a disclsoure icon
                onItemDisclosure: function(record, item, index, e) {
                    //show a messagebox alert which shows the persons firstName
                    e.stopEvent();
                    //Ext.Msg.alert('Disclose', 'Disclose more info for ' + record.get('firstName'));
                },
                */

                items: [{
                    xtype: 'titlebar',
                    docked: 'top',
                    title: 'Feeds',
                    items: [
                        /*{
                            iconCls: 'more',
                            align: 'left',
                            handler: function() {
                                refresh(true);
                            },
                        },*/
                        {
                            iconCls: 'refresh',
                            align: 'right',
                            handler: function() {
                                refresh(true);
                            },
                        }                        
                    ]
                }],

                listeners: {
                    itemtap: function (list, index, item, record, senchaEvent) {
                        navigator.app.loadUrl(record.get('link'), { openExternal: true });
                    }
                },

                plugins: [
                    {
                        xclass: 'js.feeds.plugin.pullrefresh',
                    }
                ],
            });


            var refresh = function(removeAll) {
                loadFeed(
                    tags,
                    {
                        masked: true,
                        callback: function(data) {
                            if(removeAll) {
                                store.loadData([],false);
                            }

                            for(var i=0; i<data.output.length; ++i) {
                                store.add(data.output[i].responseData.feed.entries);
                            }
                        }
                    }
                );
            };

            refresh();
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

