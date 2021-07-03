const templates = require( './templates');
const playerVM = require( './PlayerVM');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');

var g_player = new playerVM();

class stationVM //extends templateLoader
{
    _li;
    _favorites;

    constructor()
    {
         templates.getStationTemplate().then((li_)=>{
            this._li = li_;
        });
        ipcRenderer.on('replyFavorites',(event_,favorites_)=>
        {
            this._favorites = favorites_;
        });
        ipcRenderer.send('askFavorites');
    }

    _isFavorite(li_,isfav)
    {
        
        let img = li_.getElementsByTagName('img');
        if(isfav==true)
        {
            img[1].src = "./img/favorite_black_48dp.svg";
            li_.setAttribute('isFav',true);
        }
        else
        {
            img[1].src = "./img/favorite_border_black_48dp.svg";
            li_.setAttribute('isFav',false);
        }
    }

    _fillStation(li_,station_)
    {
        let img = li_.getElementsByTagName('img');
        let uuid= station_.stationuuid;
        img[0].src= station_.favicon;
        let spans = li_.getElementsByTagName('span');
        spans[0].innerText = station_.name;
        spans[1].innerText = station_.tags.replace(',',', ');

        if(station_.stationuuid == undefined)
        {
            uuid = station_.uuid;
        }
        
        this._isFavorite(li_,false);
        if(this._favorites  != undefined)
        {
            for(let i =0;i< this._favorites.length;i++)
            {
                if(uuid == this._favorites[i].stationuuid)
                {
                    this._isFavorite(li_,true);
                    break;
                }
            }
        }
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
        
        img[1].addEventListener('click',(e_)=>{
            event.stopPropagation();
            let isFav = li_.getAttribute('isFav');
            ipcRenderer.send('askFavorites');
            if(isFav == "true")
            {
                ipcRenderer.send('removeFavorite',station_);
                this._isFavorite(li_,false);
                
            }
            else
            {
                ipcRenderer.send('addFavorite',station_);
                this._isFavorite(li_,true);
            }
        });

        li_.addEventListener('click',(e_)=>{
            g_player.play(station_);
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