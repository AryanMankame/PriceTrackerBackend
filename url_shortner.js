const Nightmare = require('nightmare')
function shorten(url){
    var shortenedurl = '';
    for(let i=0;i<url.length;i++){
        if(url[i] === '&') break;
        shortenedurl += url[i];
    }
    return shortenedurl;
}
function whichWebsite(url){
    url = url.substr(12, url.length);
    return url.substr(0,url.indexOf('.'));
}
// console.log(url);
// url = shorten(url);
// console.log(url);
function fetchFunction(url){
  const nightmare = Nightmare({ show: true })
nightmare
  .goto(url)
  .wait('#price')
  .evaluate(() => {
    return [document.getElementById('price').innerText,document.getElementById('imgBlkFront').src,document.getElementById('productTitle').innerText];
  })
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })
}
// fetchFunction('https://www.amazon.in/Artificial-Intelligence-3e-Modern-Approach/dp/9332543518/?_encoding=UTF8&pd_rd_w=Yy61r&pf_rd_p=ee853eb9-cee5-4961-910b-2f169311a086&pf_rd_r=QJZKRMH0V0056VR8N1B5&pd_rd_r=51417bbe-dc05-4252-825e-7acb158f4a53&pd_rd_wg=nHld5&ref_=pd_gw_ci_mcx_mr_hp_atf_m');
// whichWebsite("https://www.amazon.in/dp/B07PFFMP9P?ref_=nav_em_in_pc_sbc_dot_0_2_2_3");
module.exports  = {shorten,whichWebsite,fetchFunction};