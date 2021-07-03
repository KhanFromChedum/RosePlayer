const filterviewVM = require('./js/viewmodel/filterviewVM');
const displayResultVM = require('./js/viewmodel/displayResultVM');
const favoriteVM = require('./js/viewmodel/favoriteVM');
const searchVM = require('./js/viewmodel/searchVM');
const { ipcRenderer, ipcMain, Accelerator } = require('electron');

function defaultpic(e_)
{
    e_.src = "./img/music_note_black_48dp.svg";
}

ipcRenderer.on('replySearchTerms',(a_,b_,tab_,search_)=>{
    let search = new filterviewVM(b_,search_);
    search.create().then((e_)=>{
        document.getElementById(tab_).appendChild(e_);
    })
});

/**
 * Init all searchterm view
 * @param {string} by_ codecs/tags/countries
 * @param {string} tab_ tabtags/tabcountries
 */
 function initSearchTerm(by_,tab_)
 {
     ipcRenderer.send('askSearchTerms',by_,tab_);
 }
 
initSearchTerm('tags','tabtags');
initSearchTerm('countries','tabcountries');

let stationsResult = new displayResultVM();  
ipcRenderer.on('replyStations',(a_,stations_,filter_)=>{
    stationsResult.create(filter_,stations_).then((res_)=>{
        document.getElementById('stationsdisplay').innerHTML = "";
        document.getElementById('stationsdisplay').appendChild(res_);
        closeAllTabs();
        document.getElementById('stationsdisplay').style.display='block';
    });
});


let tabfav = document.getElementById("tabFav");
let favoritVM = new favoriteVM();

ipcRenderer.on('replyFavoritesOne',(event_,stations_)=>{
    favoritVM.create(stations_).then((res_)=>{
        document.getElementById('tabfavorite').innerHTML = "";
        document.getElementById('tabfavorite').appendChild(res_);
   
    });
});

tabfav.addEventListener('click',(e_)=>
{
    ipcRenderer.send('askFavoritesOne');

});


searchVMod = new searchVM();
function createsearch()
{
    if(!searchVMod.isready())
    {
        setTimeout(createsearch,500);
        return;
    }
    document.getElementById('tabsearch').appendChild(searchVMod.create());
}
createsearch();


function closeWindow()
{
    ipcRenderer.send('close');
}

document.getElementById('close').addEventListener('click',(e_)=>{
    ipcRenderer.send('close');
});


document.getElementById('increase').addEventListener('click',(e_)=>{
    ipcRenderer.send('increase');
});


document.getElementById('reduce').addEventListener('click',(e_)=>{
    ipcRenderer.send('reduce');
});




//document.getElementById('tabsearch').appendChild(searchVMod.create());





