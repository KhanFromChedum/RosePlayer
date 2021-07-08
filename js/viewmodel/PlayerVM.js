const player = require( '../model/player');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');
const favButtonVM = require( './favbuttonVM');

var g_player = new player();

class playerVM 
{
    _htmlPlayer;
    _player;
    _station;
    _ctx;

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

        var canvas = document.getElementById("waveform");
        this._ctx = canvas.getContext("2d");

        const frequencyData = new Uint8Array(1024);
        setInterval(() => {
            g_player.getAnalyser().getByteFrequencyData(frequencyData);
            this._draw(document.getElementById("waveform"),frequencyData);
            console.log(frequencyData);
          }, 50);
    }

    /**
     * Draw a graph frame
     * @param {object} cnv the canvas element
     * @param {array} valarr FFT result
     */
    _draw(cnv,valarr)
    {
        let wdth = cnv.width/valarr.length;
        let h = cnv.height;
        this._ctx.beginPath();
        this._ctx.fillStyle = "rgba(0, 0, 0, 255)";
        this._ctx.fillRect(0, 0, cnv.width, cnv.height);    
        this._ctx.stroke();
        for(var i =0; i < valarr.length;i++)
        {
            this._ctx.fillStyle = "green";
            let barh = cnv.height*valarr[i]/255;
            let x = h-barh;
            this._ctx.fillRect(wdth*i,x, wdth, barh);
        }
    }

    /**Set the logo with the station icon */
    _setLogo()
    {
        let logo = document.getElementById('logo');
        logo.src = this._station.favicon;
    }

    /**Set the name with the station name */
    _setradioname()
    {
        let radioname = document.getElementById('radioname');
        radioname.innerText = this._station.name;
    }

    /**Bind volume input to the audio volume */
    _bindvolume()
    {
        let volume = document.getElementById('volumeinput');
        g_player.volume(volume.value/100);
        volume.addEventListener('change',(e_)=>{
            g_player.volume(e_.target.value/100);
        });
    }

    /**Bind bass input to the audio */
    _bindbass()
    {
        let bass = document.getElementById('lBand');
        g_player.bass(bass.value);
        bass.addEventListener('change',(e_)=>{
            g_player.bass(e_.target.value);
        });
    }

    /**Bind the mid input to the audio */
    _bindmid()
    {
        let mid = document.getElementById('mBand');
        g_player.mid(mid.value);
        mid.addEventListener('change',(e_)=>{
            g_player.mid(e_.target.value);
        });
    }

    /**Bind the treble input to the audio */
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



    _fav;

    play(station_)
    {
        this._station = station_;
        this._setLogo();
        this._setradioname();
        g_player.source(station_.url);
       this._playbutton();
       let songtitle = document.getElementById('songtitle');
        this._fav = new favButtonVM(station_,document.getElementById('favIcon'));
       songtitle.innerText = "";

        ipcRenderer.send('askNowPLaying', station_.url);

        ipcRenderer.send('askIfCurrentStationFav',station_);
        
    }


}

module.exports = playerVM;