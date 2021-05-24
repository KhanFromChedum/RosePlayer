const templateLoader = require( './templateLoader');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');
const stationVM = require('./stationVM');

class searchVM extends templateLoader
{
    _div;
    _stationVM;
    _ul;
    _ready;

    /**
     * Constructor
     */
    constructor()
    {
        super();
        this._ready = false;
        this._stationVM = new stationVM();
        this._getTemplate('./html/search.html','search').then((div_)=>{
            this._div=div_;
            let input = this._div.getElementsByTagName('input')[0];
            input.addEventListener('change',(e_)=>{
                this._ul.innerHTML="";
                ipcRenderer.send('AskAdvancedStations',e_.target.value);
            });
            this._ul  = this._div.getElementsByTagName('ul')[0];
        });

        ipcRenderer.on('replayAdvancedStations',(event_,stations_)=>{
            for(var i =0; i < stations_.length;i++)
            {
                let li = this._stationVM.create(stations_[i]);
                this._ul.appendChild(li);
            }
            if(stations_.length == 0)
            {
                this._ul.innerText= 'No stations found...';
            }
            this._ready = true;

        })
    }

    /**
     * return true if html element is loaded
     * @returns true if ready
     */
    isready()
    {
        return this._div != undefined;
    }

    /**
     * return the div
     */
    create()
    {
        return this._div;
    }
}

module.exports = searchVM;