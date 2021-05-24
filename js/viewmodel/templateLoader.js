class templateLoader
{
    /**
     * load a dom from an html file
     * @param {string} filepath path to the template file
     * @returns dom object
     */
    async _getTemplate(filepath_,id_) {

        let response = await fetch(filepath_);
        let txt = await response.text();

         let html =  new DOMParser().parseFromString(txt, 'text/html');
       
         return html.getElementById(id_);

        
    }


}
//let tpl = await getTemplate('path/to/template.html');

module.exports = templateLoader;