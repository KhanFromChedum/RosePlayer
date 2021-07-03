const templateLoader = require( './templateLoader');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');
const stationVM = require( './stationVM');


/**
 * Favorite view class
 */
class favoriteVM extends templateLoader
{
    _ul;
    _stationVMs;
    _stations;
    
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._stations = new Array();
        //this._stationVM = new stationVM();
        this._getTemplate('./html/displayResult.html','displayResult').then((res_)=>
        {
            this._ul = res_;
        });

    }

    /**
     * Create an html list of stations
     * @param {array} stations_ an array of station
     * @returns return a list of HTML element 
     */
    async create(stations_)
    {
console.log(stations_);
        this._ul.innerHTML= "";
        this._stationVMs = new Array();

        for(var i =0; i < stations_.length;i++)
        {
            let station = new stationVM();
            this._stationVMs.push(station);
            station.create(stations_[i]).then((li_)=>{
                this._ul.appendChild(li_);
            });
            
        }

        return this._ul;
    }
}

module.exports = favoriteVM;