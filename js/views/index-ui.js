var mapEle = null;
var msgPanel = null;
var tabEle = null;

$(document).ready(function() {
    mapEle = $('#map');
    msgPanel = $('#allMessagesTable');
    
    $(window).on('resize', resizeDynamicElements);
    
    resizeDynamicElements();
    
    /*
    $('#tabpanel').tabs({
        create: function(event, ui) {
            $('body').css('opacity', '1'); // show body after markup has been enhanced
            tabEle = $('#mainAppTabs');
            
            resizeDynamicElements();
            
            console.log("CREATED TAB PANEL!");
        },
        beforeActivate: function(event, ui) {
            console.log(event);
            console.log(ui);
            
            console.log('UI ACTIVATE!!!');
            
            //if (ui.newTab.text() === 'Map') {
            //    mapEle._onResize(); // needed in case window is resized in other tabs
            //}
        }
    });
    */
});

function resizeDynamicElements() {
    var h = $(window).innerHeight() - 43;
    
    mapEle.height(h);
    
    h = $(window).innerHeight() - $('#messages').height() - $('mainAppTabs').height() - 74;
    
    msgPanel.height(h);
};