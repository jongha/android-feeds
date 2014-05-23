var appIndex = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        appIndex.receivedEvent("deviceready");
    },
    receivedEvent: function(id) {
        $(".listening").hide();
        $(".received").show();
        
        location.href = "list.html";
    }
};

var appList = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener("deviceready", this.onDeviceReady, false);
    },
    onDeviceReady: function() {
    }
};
