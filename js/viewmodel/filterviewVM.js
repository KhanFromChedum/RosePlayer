const templateLoader = require( './templateLoader');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');

class filterviewVM extends templateLoader
{
    _datas;
    _search;
    _ul;
    _input;

    /**
     * constructor
     * @param {array} datas_ array of json {name,stationcount}
     */
    constructor(datas_,search_)
    {
        super();
        this._datas= datas_;
        this._search = search_;
    }

    /**
     * filter data list
     */
    _filter()
    {
        let li = this._ul.getElementsByTagName('li');
        for (var i = 0; i < li.length; i++) {
            let a = li[i];
            let txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(this._input.value.toUpperCase()) > -1) {
              li[i].style.display = "";
            } else {
              li[i].style.display = "none";
            }
          }
    }


    /**
     * Create view of unordered elements.
     * @returns html element
     */
    async create()
    {
        let html = await this._getTemplate('./html/filterview.html','filterview');

        this._input = html.getElementsByTagName('input')[0];
        this._input.addEventListener('change',(e_)=>{
            this._filter();
        });


        let li = await this._getTemplate('./html/filterview.html','searchterm');

        this._ul = html.getElementsByTagName('ul')[0];

        for(var i = 0; i < this._datas.length;i++)
        {
            let liclone = li.cloneNode(true);
            liclone.setAttribute('index',i);
            liclone.id='';
            liclone.addEventListener('click',(e_)=>{
                let index = e_.currentTarget.getAttribute('index');
                let filter = new Object();
                filter.by = this._search;
                filter.searchterm = this._datas[index].name;
                filter.newsearch = true;
                ipcRenderer.send('askRadios',filter);
            })

            let spans = liclone.getElementsByTagName('span');
            spans[0].innerText = this._datas[i].name;
            spans[1].innerText = this._datas[i].stationcount;
            this._ul.appendChild(liclone);
        }

        return html;
    }
}

module.exports = filterviewVM;