const templates = require( './templates');
const playerVM = require( './PlayerVM');
const favButtonVM = require( './favbuttonVM');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');

var g_player = new playerVM();

class stationVM
{
    _li;
    _favorites;
    _station;
    _fabBtn;

    /**
     * Default constructor
     */
    constructor()
    {
         templates.getStationTemplate().then((li_)=>{
            this._li = li_;
        });
        
    }



    _fillStation(li_,station_)
    {
        this._fabBtn = new favButtonVM(station_, li_.getElementsByTagName('img')[1] );
        this._station = station_;
        let img = li_.getElementsByTagName('img');
        let uuid= station_.stationuuid;
        img[0].src= station_.favicon;
        let spans = li_.getElementsByTagName('span');
        spans[0].innerText = station_.name;
        spans[1].innerText = station_.tags.replace(',',', ');
        

        img[2].addEventListener('click',(e_)=>{
            event.stopPropagation();
            if(station_.homepage!="")
            {
                ipcRenderer.send('openurl',station_.homepage);
            }
            else
            {
                alert('no home page');
            }
        });
        


        li_.addEventListener('click',(e_)=>{
            g_player.play(this._station);
        })

    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getValue()
    {
        while(this._li == undefined)
        {
            await this.sleep(100);
        }
        return this._li;
    }

    async create(station_)
    {
        let li = await this.getValue();
        let liclone = li.cloneNode(true);
        this._fillStation(liclone,station_);
        return liclone;
    }

}

module.exports = stationVM;