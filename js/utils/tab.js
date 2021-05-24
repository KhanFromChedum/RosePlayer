let tabheaders = document.getElementsByClassName('tabheader');
let tabs = document.getElementsByClassName('tab');


function closeAllTabs()
{
    for(var j=0;j<tabs.length;j++)
    {
        tabs[j].style.display='none';
    }  
}

for(var i =0; i < tabheaders.length;i++)
{
    let tabheader = tabheaders[i];
    tabheader.addEventListener('click',(e_)=>
    {
        /*Hide all tabs */
        closeAllTabs();
        let tab = e_.currentTarget.getAttribute('tab');
        document.getElementById(tab).style.display= 'block';
        
    })
}