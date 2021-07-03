const templateLoader = require( './templateLoader');



class templates extends templateLoader
{
    _stationTemplate;
    constructor()
    {
        super();
        this._getTemplate('./html/station.html','station').then((stationTemplate_)=>{
            this._stationTemplate=stationTemplate_;
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    async getValue()
    {
        if(this._stationTemplate == undefined)
        {
            await this.sleep(1000);
        }
    }

    /**
     * Get the station template
     * @returns the loaded station template
     */
    async getStationTemplate()
    {
        await this.getValue();

        return this._stationTemplate;
    }
}

module.exports = new templates;