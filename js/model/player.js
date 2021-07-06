class player
{
    _audio;
    _isPlaying;
    _context;
    _analyser;

    _lband;
    _hband;
    _peaking;

    _source;

    /**
     * Default constructor
     */
    constructor()
    {
        this._audio = new Audio();
        this._audio.crossOrigin = 'anonymous';
        this._isPlaying = false;

        this._context = new AudioContext();
        

        this._source = this._context.createMediaElementSource(this._audio);
        this._analyser = this._context.createAnalyser();
this._source.connect(this._analyser);

        this._lband = this._context.createBiquadFilter();
        this._lband.type = "lowshelf";
        this._lband.frequency.value = 360;
        this._lband.gain.value = 1.0;
        this._source.connect(this._lband);

        this._hband = this._context.createBiquadFilter();
        this._hband.type = "highshelf";
        this._hband.frequency.value = 3000;
        this._hband.gain.value = 1.0;
        this._lband.connect(this._hband);

        this._peaking = this._context.createBiquadFilter();
        this._peaking.type = "peaking";
        this._peaking.frequency.value = 1680;
        this._peaking.gain.value=1;
        this._peaking.Q.value = 1000;
        this._hband.connect(this._peaking);

        this._peaking.connect(this._context.destination);
    }

    /**
     * Gete the analyser for the audio context.
     * @returns Analyser for the audio context
     */
    getAnalyser()
    {
        return this._analyser;
    }

    /**
     * Set the audio source for the player
     * @param {string} src_ source url
     */
    source(src_)
    {
        this._audio.src = src_;
    }

    /**
     * Set gain for bass
     * @param {numeric} gain_ gain value for the bass
     */
    bass(gain_)
    {
        this._lband.gain.value = gain_;
    }

    /**
     * Set gain for mid
     * @param {numeric} gain_ gain value for mid
     */
    mid(gain_)
    {
        this._peaking.gain.value = gain_;
    }

    /**
     * Set gain for treble
     * @param {numeric} gain_ gain value for treble
     */
    treble(gain_)
    {
        this._hband.gain.value = gain_;
    }

    /**
     * Play music
     * @param {callback} callback_ on success, receive a 'playing'. On fail, receive a 'error'
     */
    play(callback_)
    {
        this._audio.play().then((e)=>
                                    {
                                        this._isPlaying = true;
                                        callback_('playing');
                                    }).catch(
                                (e)=>
                                    {
                                        this._isPlaying = false;
                                        callback_('error');
                                    });
    }

    /**
     * pause music
     */
    pause()
    {
        this._audio.pause();
        this._isPlaying = false;
    }

    /**
     * set the audio volume
     * @param {numeric} value_ value from 0 to 1 
     */
    volume(value_)
    {
        this._audio.volume = value_;
    }

    /**
     * get playing state
     * @returns true if playing music. false otherwise
     */
    isPlaying()
    {
        return this._isPlaying;
    }
}

module.exports = player;