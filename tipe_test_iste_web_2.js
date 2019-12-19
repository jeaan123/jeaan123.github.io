
// fonction des parametres de la page
function valeur() {
var select = document.getElementById("select");
choice = select.selectedIndex ; // Récupération de l'index du <option> choisi
return{choice};
}
//reactiver la roue de chargement
function roue(){
  document.getElementById("roue").style.display = "";
  document.getElementById("textes").style.display = "none";
}

//recuperatioin model tfjs 

async function prediction(n) {
  const DATA=  await getData(n);
  const p=DATA.periode;
  const s=DATA.WaveS;
  const h=DATA.WaveH;
  const model = await tf.loadLayersModel('https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/model.json');
  var X= tf.tensor2d([DATA.periode,DATA.WaveH]).transpose();
  //console.log(X.print());  
  //console.log(model.summary());
  //model.getWeights()[0].print();
 // X.print();
  const prediction = model.predict(X);
  const values = prediction.dataSync();
  const arr = Array.from(values);
  //console.log(arr);  
  return{p,h,s,arr};
};

//recuperation donne csv

async function getData(n) {
        const lien = ['https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/station1.csv','https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/station2p.csv','https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/station3.csv'];
        var response;
        if (n==1){
        response = await fetch(lien[valeur().choice]);}
      //console.log(valeur().choice);
        else{
         response = await fetch(lien[0]);}
        const data = await response.text();
        const periode =[];
        const WaveH =[];
        const WaveS = [];
        const rows = data.split('\n').slice(1);
        rows.forEach(row => {
          const cols = row.split(',');
          WaveS.push(parseFloat(cols[0])) ;
          WaveH.push(parseFloat(cols[1]));
          periode.push(parseFloat(cols[2]));
        });
        
        WaveS.splice(WaveS.length-1,1);
        periode.splice(periode.length-1,1);
        WaveH.splice(WaveH.length-1,1);
        //console.log(periode);
        ///console.log(WaveH);
        return {WaveS,periode,WaveH};
      }



//affichage web  et boucle principal (le n sert a indiquer le changement dans la bar select)
async function affiche(n=0){
  const DATA=  await prediction(n)
  //console.log(DATA.s);
  function ordo(){
    var a=[];
    var n=0;
    while (n<DATA.s.length) {
      a.push(n);
      n++}
     return a
  }
  
var trace1 = {
  x: ordo(),
  y: DATA.s,
  type: 'scatter',
  name:'reel'
};

var trace2 = {
  x: ordo(),
  y: DATA.arr,
  type: 'scatter',
  name:'prediction'
};
  var trace3 = {
  x: ordo(),
  y: DATA.p,
  type: 'scatter',
  line: {color:'rgb(97,255,51}'},
  name:'periode'
};
  var trace4 = {
  x: ordo(),
  y: DATA.h,
  type: 'scatter',
  line: {color:'rgb(250,74,74}'},
  name:'hauteur des vagues'
};
var layout = {
  yaxis: {range: [0, 16]}
};

var data = [trace1, trace2];
var data1 = [trace3,trace4];
Plotly.newPlot('graph2', data1,layout);
Plotly.newPlot('graph', data,layout);
document.getElementById("roue").style.display = "none";
document.getElementById("textes").style.display = "";
  };
 
 affiche();
 
