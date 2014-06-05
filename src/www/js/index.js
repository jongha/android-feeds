/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var loadFeeds = function() {
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
};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        parentElement.querySelector('.listening').setAttribute('style', 'display:none;');
        
        console.log('Received Event: ' + id);
        
        loadFeeds();
    }
};
