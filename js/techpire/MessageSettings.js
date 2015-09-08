function MessageSettings(appSettingsDB) {
    var self = this;
    
    self.db = appSettingsDB;
    
    self.isDisplayMessageNotifications = ko.observable(true);
    
    self.LoadSettings = function() {
        self.db.findOne({ settingsName: 'MESSAGE_SETTINGS' }, function (err, messageSettings) {
            if(err) {
                console.log('Failed to load message settings.');
                console.log(err);
            } else {
                // settings found from database
                if(messageSettings) {
                    self.isDisplayMessageNotifications(messageSettings.isDisplayMessageNotifications);
                }
            }
        });
    };
    
    self.ToggleDisplayMessageNotifications = function() {
        var newVal = self.isDisplayMessageNotifications() == true ? false : true;
        
        try {
            self.UpdateDisplayMessageNotifications(newVal);
            self.isDisplayMessageNotifications(newVal);
            
            return true;
        } catch(e) {
            console.log(e);
            return false;
        }
    };
    
    self.UpdateDisplayMessageNotifications = function(value) {
        self.db.update(
            { settingsName: 'MESSAGE_SETTINGS' }
            , {
                $set: { 
                    isDisplayMessageNotifications: value 
                }
            }
            , { upsert: true }
            , function(err, numReplaced) {
                if(err) {
                    console.log(err);
                    throw err;
                }
            }
        );
    };
}