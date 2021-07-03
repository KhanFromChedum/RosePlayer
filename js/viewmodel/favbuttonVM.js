
const { ipcRenderer, ipcMain, Accelerator } = require('electron');


class favButtonVM 
{
    _isFav;

    constructor(station_, favElemen_)
    {
        
        ipcRenderer.send('askIsFavorite',station_.stationuuid);
        ipcRenderer.on(station_.stationuuid,(e_,state_)=>{
            this._isFav = state_;
            if(this._isFav == true)
            {
                favElemen_.src= "./img/favorite_black_48dp.svg";
            }
            else{
                favElemen_.src= "./img/favorite_border_black_48dp.svg";
            
            }
        });

        favElemen_.addEventListener('click',(e_)=>{
            event.stopPropagation();
            
            ipcRenderer.send('askFavorites');
            if(this._isFav == true)
            {
                ipcRenderer.send('removeFavorite',station_);
               
                
            }
            else
            {
                ipcRenderer.send('addFavorite',station_);
                
            }
        });
    }
}

module.exports = favButtonVM;