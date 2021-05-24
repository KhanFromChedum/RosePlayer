const templateLoader = require( './templateLoader');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');
const stationVM = require( './stationVM');


/**
 * Favorite view class
 */
class favoriteVM extends templateLoader
{
    _ul;
    _stationVM;
    
    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._stations = new Array();
        this._stationVM = new stationVM();
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

        this._ul.innerHTML= "";


        for(var i =0; i < stations_.length;i++)
        {

            let li = this._stationVM.create(stations_[i]);
            this._ul.appendChild(li);
        }

        return this._ul;
    }
}

module.exports = favoriteVM;