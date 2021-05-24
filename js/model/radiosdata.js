const RadioBrowser  = require('radio-browser');

class radiosData
{
  _tags;
  _tagsReady;

  _countries;
  _countriesReady;

  _states;
  _statesReady;

  _languages;
  _languagesReady;

  _codecs;
  _codecsReady;

  constructor()
  {
      this._tagsReady = false;

    RadioBrowser.getCategory('tags').then((tags_)=>{
      this._tags = tags_;
      this._tagsReady = true;
    });

    this._countriesReady = false;

    RadioBrowser.getCategory('countries').then((countries_)=>{
      this._countries = countries_;
      this._countriesReady = true;
    });

    this._statesReady = false;

    RadioBrowser.getCategory('states').then((states_)=>{
        this._states = states_;
        this._statesReady = true;
      });

      this._languagesReady=false;

    RadioBrowser.getCategory('languages').then((languages_)=>{
        this._languages = languages_;
        this._languagesReady = true;
    });

    this._codecsReady = false;

    RadioBrowser.getCategory('codecs').then((codecs_)=>{
        this._codecs = codecs_;
        this._codecsReady = true;
    });
  }

  isReady()
  {
      return this._tagsReady && this._countriesReady && this._statesReady && this._languagesReady && this._codecsReady;
  }

  getTags()
  {
      return this._tags;
  }

  getCountries()
  {
      return this._countries;
  }

  getStates()
  {
      return this._states;
  }

  getCodecs()
  {
      return this._codecs;
  }

  getLanguages()
  {
      return this._languages;
  }
}

module.exports = radiosData;