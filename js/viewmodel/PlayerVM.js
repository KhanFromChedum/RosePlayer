const player = require( '../model/player');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');

var g_player = new player();

class playerVM 
{
    _htmlPlayer;
    _player;
    _station;

    /**
     * constructor
     */
    constructor()
    {
        this._player = new player();
        this._htmlPlayer = document.getElementById('player');
        let playbtn = document.getElementById('playbtn');
        let songtitle = document.getElementById('songtitle');
        playbtn.addEventListener('click',(e_)=>{
            if(g_player.isPlaying())
            {
                g_player.pause();
                playbtn.src = './img/play_arrow_black_48dp.svg';
            }
            else
            {
                g_player.play((state_)=>{
                    switch(state_)
                    {
                        case 'playing':
                            playbtn.src = './img/pause_black_48dp.svg';
                            break;
                        case 'error':
                            playbtn.src = './img/error_black_48dp.svg';
                            break;
                    }});
                playbtn.src = './img/pause_black_48dp.svg';
            }
        });
        this._bindvolume();
        this._bindbass();
        this._bindmid();
        this._bindtreble();

        ipcRenderer.on('replyNowPLaying',(event_,song_)=>{
            songtitle.innerText = song_;
        });

        ipcRenderer.on('replyIfCurrentStationFav',(event_,reply_)=>{
            let favicon = document.getElementById('favIcon');
            favicon.src= "./img/favorite_border_black_48dp.svg";
            favicon.setAttribute('isfav',false);
            if(reply_==true)
            {
                favicon.setAttribute('isfav',true);
                favicon.src="./img/favorite_black_48dp.svg";
            }
        });

        let favicon = document.getElementById('favIcon');
        favicon.addEventListener('click',(e_)=>{
alert(favicon.getAttribute('isfav'));            
            if(favicon.getAttribute('isfav')==true)
            {
               
                ipcRenderer.send('removeFavorite',this._station);
                favicon.src= "./img/favorite_border_black_48dp.svg";
                favicon.setAttribute('isfav',false);
            }
            else{
                ipcRenderer.send('addFavorite',this._station);
                favicon.src="./img/favorite_black_48dp.svg";
                favicon.setAttribute('isfav',true);
            }

        });
    }

    _setLogo()
    {
        let logo = document.getElementById('logo');
        logo.src = this._station.favicon;
    }

    _setradioname()
    {
        let radioname = document.getElementById('radioname');
        radioname.innerText = this._station.name;
    }

    _bindvolume()
    {
        let volume = document.getElementById('volumeinput');
        g_player.volume(volume.value/100);
        volume.addEventListener('change',(e_)=>{
            g_player.volume(e_.target.value/100);
        });
    }

    _bindbass()
    {
        let bass = document.getElementById('lBand');
        g_player.bass(bass.value);
        bass.addEventListener('change',(e_)=>{
            g_player.bass(e_.target.value);
        });
    }

    _bindmid()
    {
        let mid = document.getElementById('mBand');
        g_player.mid(mid.value);
        mid.addEventListener('change',(e_)=>{
            g_player.mid(e_.target.value);
        });
    }

    _bindtreble()
    {
        let treble = document.getElementById('hBand');
        g_player.treble(treble.value);
        treble.addEventListener('change',(e_)=>{
            g_player.treble(e_.target.value);
        });
    }

    _playbutton()
    {
        //playbtn
        let playbtn = document.getElementById('playbtn');
        playbtn.src = './img/pending_black_48dp.svg';
        g_player.play((state_)=>{
            switch(state_)
            {
                case 'playing':
                    playbtn.src = './img/pause_black_48dp.svg';
                    break;
                case 'error':
                    playbtn.src = './img/error_black_48dp.svg';
                    break;
            }
        });

        

    }


    play(station_)
    {
        this._station = station_;
        this._setLogo();
        this._setradioname();
        g_player.source(station_.url);
       this._playbutton();
       let songtitle = document.getElementById('songtitle');

       songtitle.innerText = "";

        ipcRenderer.send('askNowPLaying', station_.url);

        ipcRenderer.send('askIfCurrentStationFav',station_);
        
    }


}

module.exports = playerVM;