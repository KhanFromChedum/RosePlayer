const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
var radiosData = require('./js/model/radiosdata');
var searchStations = require('./js/model/searchStations');
var advancedSearchStation = require('./js/model/advancedSearchStation');
const { shell } = require('electron');
const sqlite3= require('sqlite3');
const fs = require("fs");
var internetradio = require('node-internet-radio');

var radios = new radiosData();

var existDb = fs.existsSync('./favorites.db');

var db = new sqlite3.Database('./favorites.db');

if(!existDb)
{
  CreateTable();
}

let win;

function createWindow () {
   win = new BrowserWindow({
    width: 800,
    height: 700,
    icon:"./img/outline_filter_vintage_black_48dp.png",
    webPreferences: {
      nodeIntegration: true,     //In order to get access to ipc renderer 
      contextIsolation: false
    }
    ,frame:false
  })

  win.loadFile('index.html')
}

/**
 * Create table for favorite database
 */
function CreateTable()
{
    let query = "create table Favorites (stationuuid VARCHAR(100) PRIMARY KEY, name VARCHAR(100), favicon VARCHAR(1000), url VARCHAR(1000),homepage VARCHAR(1000) ,tags VARCHAR(1000) )";
   
    db.run(query, [], function(err) {
        if (err) {
            return console.log(err.message);
        }
        
        console.log(`success`);
    });
}
//CreateTable();



app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    db.close();
    app.quit()
  }
})



ipcMain.on('close', () => {
  db.close();
    app.quit()
 
})

ipcMain.on('increase',(event, arg)=> {
  if(win.isMaximized())
  {
    win.restore();
  }
  else
  {
    win.maximize();
  }
})

ipcMain.on('reduce',(event, arg)=> {
  if(win.isMinimized())
  {
    win.restore();
  }
  else
  {
    win.minimize();
  }
})

/**
 * Ask for datas. Reply when ready
 * @param {object} event_ event object
 * @param {string} tag_ searchterm
 * @param {string} tab_ tab name
 * @returns 
 */
function ask(event_,tag_,tab_)
{
  let data;
  if(radios.isReady() == false)
  {
    setTimeout(()=>{ask(event_,tag_,tab_)},500);
    return;
  }

  let search;
  switch(tag_)
  {
    case 'countries':   
      search = 'country'; 
      data = radios.getCountries();
      break;
    case 'tags':
      search = 'tag';
      data= radios.getTags();
      break;
    case 'codecs':
      search = 'codec';
      data = radios.getCodecs();
      break;
    case 'languages':
      search = 'language';
      data = radios.getLanguages();
      break;
    case 'states':
      search = 'state';
      data = radios.getStates();
      break;
    default:
  }
  event_.reply('replySearchTerms',data,tab_,search);
}

ipcMain.on('askSearchTerms',(event_, tag_,tab_)=> {
  ask(event_, tag_,tab_);
})

/**
 * Ask for an array of radio stations
 * @param {object} event_ An event object
 * @param {object} searchStations_ a class to get stations
 * @param {object} filter_ a filter object for radio-browser
 * @returns 
 */
function askRadios(event_, searchStations_,filter_)
{

  if(searchStations_.isReady()==false)
  {
    setTimeout(()=>{askRadios(event_,searchStations_,filter_);},500);
    return;
  }

  event_.reply('replyStations',searchStations_.getStations(),searchStations_.getfilter());
}

ipcMain.on('askRadios',(event_,filter_)=>{

  askRadios(event_,new searchStations(filter_),filter_);
});

ipcMain.on('openurl',(event_,url_)=>{
  console.log(url_);
  shell.openExternal(url_);
});

ipcMain.on('askFavorites',(event_)=>{
  getAllFavorites((rows_)=>{
    event_.reply('replyFavorites',rows_);
  });
});

ipcMain.on('askFavoritesOne',(event_)=>{
  getAllFavorites((rows_)=>{
    event_.reply('replyFavoritesOne',rows_);
  });
});

ipcMain.on('askIsFavorite',(event_,uuid_)=>{
  isCurrentStationFav(event_,uuid_);
});

/**
 * Ask if the asked station is fav or not.
* @param {object} event_ the event
 * @param {objet} station_ an object station
 */
function isCurrentStationFav(event_,uuid_)
{
  let query = "select * from favorites where stationuuid='" + uuid_ + "'" ;


  db.all(query, [], function(err,rows) {
      if (err) {
          return console.log(err.message);
      }
      if(rows.length == 0)
      {
        event_.reply(uuid_,false);
      }
      else{
        event_.reply(uuid_,true);
      }
      return console.log(rows);
  });
}

ipcMain.on('addFavorite',(event_,station_)=>{
  AddToFavorites(event_,station_);
});

ipcMain.on('removeFavorite',(event_,station_)=>{
  console.log('remove');
  RemoveFromFavorites(event_,station_);
 });

 function askAdvancedStations(event_,advSearch_)
 {
    if(advSearch_.isReady() == false)
    {
      setTimeout(() => {
        askAdvancedStations(event_,advSearch_);
      }, (500));
      return;
    }
    event_.reply('replayAdvancedStations',advSearch_.getStations());
 }

 ipcMain.on('AskAdvancedStations',(event_,stationName_)=>
 { 
    let filter = new Object();
    filter.name = stationName_;
    let advSearch = new advancedSearchStation(filter);
    askAdvancedStations(event_,advSearch);
 })

/**
 * Ask for all favorites
 * @param {object} callback_ function callback, get favorites row as parameter
 */
function getAllFavorites(callback_)
{
    let query = "select * from favorites";
    //console.log(query);
    db.all(query, [], function(err,rows) {
        if (err) {
            return console.log(err.message);
        }

        callback_(rows);
    });
}

/**
 * Add a station to the favorite
 * @param {object} station_ a station objet
 */
function AddToFavorites(event_,station_)
{
    let query = "insert into favorites(stationuuid,name,url,homepage,favicon,tags) values('" + station_.stationuuid + "','" + station_.name + "','" + station_.url + "','" + station_.homepage +"','" + station_.favicon +  "','" +station_.tags + "')";
    console.log(query);
    db.run(query, [], function(err) {
        if (err) {
            return console.log(err.message);
        }
        event_.reply(station_.stationuuid,true);
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

}

/**
 * remove a station object from the favorite database
 * @param {object} station a station object
 */
 function RemoveFromFavorites(event_,station_)
 { 
      let uuid = station_.stationuuid;

     let query = "delete from favorites where stationuuid = '" +uuid  + "'";
     console.log(query);
     db.run(query, [], function(err) {
         if (err) {
             return console.log(err.message);
         }
         event_.reply(station_.stationuuid,false);
         console.log(`A row has been removed with rowid ${this.lastID}`);
     });   
     
 }

let interval = undefined;
 ipcMain.on('askNowPLaying',(event_,stationurl_)=>{
  
  internetradio.getStationInfo(stationurl_, function(error, song) {
    if(interval != undefined)
    {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      if(song != undefined)
      {
        event_.reply('replyNowPLaying',song.title);
      }
      else
      {
        event_.reply('replyNowPLaying',"");
      }
    }, 5000);    //Ask for song every 5 seconds
    }, internetradio.StreamSource.STREAM);

 })

 