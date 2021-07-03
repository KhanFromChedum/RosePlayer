const templateLoader = require( './templateLoader');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');
const stationVM = require('./stationVM');
const { stat } = require('original-fs');

class displayResultVM extends templateLoader
{
    _filter;
    _stations;
    _ul;
    _stationVM;
    
    /**
     * Default constructor
     */
    constructor()
    {
        super();
        this._stations = new Array();

        this._getTemplate('./html/displayResult.html','displayResult').then((res_)=>
        {
            this._ul = res_;
        });
    }

    async create(filter_,stations_)
    {
        this._ul.innerHTML = "";
        if(filter_.newsearch == false)
        {
            this._stations = this._stations.concat(stations_);
        }
        else
        {
            this._stations = stations_;
            
        }

        this._filter = filter_;

        for(var i =0; i < this._stations.length;i++)
        {
            this._stationVM = new stationVM();
            this._stationVM.create(this._stations[i]).then((li_)=>
            {
                this._ul.appendChild(li_);
            })
            
        }
        return this._ul;
    }
}

module.exports = displayResultVM;