var app = angular.module('timer');

app.factory('I18nService', function() {

    var I18nService = function() {};

    I18nService.prototype.language = 'en';
    I18nService.prototype.timeHumanizer = {};

    I18nService.prototype.init = function init(lang){
        this.language = lang;
        //moment init
        moment.locale(this.language); //@TODO maybe to remove, it should be handle by the user's application itself, and not inside the directive

        //human duration init, using it because momentjs does not allow accurate time (
        // momentJS: a few moment ago, human duration : 4 seconds ago
        this.timeHumanizer = humanizeDuration.humanizer({
            language: this.language,
            halfUnit:false
        });
    };

    /**
     * get time with units from momentJS i18n
     * @param {int} millis
     * @returns {{millis: string, seconds: string, minutes: string, hours: string, days: string, months: string, years: string}}
     */
    I18nService.prototype.getTimeUnits = function getTimeUnits(millis) {
        var diffFromAlarm = Math.round(millis/1000) * 1000; //time in milliseconds, get rid of the last 3 ms value to avoid 2.12 seconds display

        var time = {};

        if (typeof this.timeHumanizer != 'undefined'){
            time = {
                'millis' : this.timeHumanizer(diffFromAlarm, { units: ["milliseconds"] }),
                'seconds' : this.timeHumanizer(diffFromAlarm, { units: ["seconds"] }),
                'minutes' : this.timeHumanizer(diffFromAlarm, { units: ["minutes", "seconds"] }) ,
                'hours' : this.timeHumanizer(diffFromAlarm, { units: ["hours", "minutes", "seconds"] }) ,
                'days' : this.timeHumanizer(diffFromAlarm, { units: ["days", "hours", "minutes", "seconds"] }) ,
                'months' : this.timeHumanizer(diffFromAlarm, { units: ["months", "days", "hours", "minutes", "seconds"] }) ,
                'years' : this.timeHumanizer(diffFromAlarm, { units: ["years", "months", "days", "hours", "minutes", "seconds"] })
            };
        }
        else {
            console.error('i18nService has not been initialized. You must call i18nService.init("en") for example');
        }

        return time;
    };

    return I18nService;
});
