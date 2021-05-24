const RadioBrowser  = require('radio-browser');

class advancedSearchStation
{
    _filter;
    _stations;
    _isStationReady;

    getfilter()
    {
        return this._filter;
        
    }

    constructor(filter_)
    {
        this._filter = filter_;
        this._isStationReady = false;
        RadioBrowser.searchStations(this._filter).then((stations_)=>{
            this._isStationReady = true;
            this._stations = stations_;
        });
    }

    isReady()
    {
        return this._isStationReady;
    }

    getStations()
    {
        return this._stations;
    }
}

module.exports = advancedSearchStation;