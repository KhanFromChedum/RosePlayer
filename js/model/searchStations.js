const RadioBrowser  = require('radio-browser');

class searchStations
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
        this._isStationReady = false;
        this._filter = new Object();
        this._filter.by = filter_.by;
        this._filter.searchterm = filter_.searchterm;
        this._filter.limit = 200;
        this._filter.newsearch = filter_.newsearch;
        if(filter_.offset != undefined)
        {
            this._filter.offset = filter_.offset + filter_.limit;;
        }
        else
        {
            this._filter.offset = 0;
        }
        

        RadioBrowser.getStations(this._filter).then((stations_)=>{
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

module.exports = searchStations;