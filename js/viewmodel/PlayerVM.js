const player = require( '../model/player');

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

    play(station_)
    {
        this._station = station_;
        this._setLogo();
        this._setradioname();
        g_player.source(station_.url);
        g_player.play(()=>{});
    }


}

module.exports = playerVM;