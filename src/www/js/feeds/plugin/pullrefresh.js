Ext.define('js.feeds.plugin.pullrefresh', {
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
