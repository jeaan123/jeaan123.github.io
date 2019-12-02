
const periode =[];
const WaveH =[];
const WaveS = [];
//const DATA=  await getData()
//recuperatioin model tfjs
 
async function prediction() {
  const DATA=  await getData();
  const p=DATA.periode;
  const s=DATA.WaveS;
  const h=DATA.WaveH;
  const model = await tf.loadLayersModel('https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/model.json');
  var X= tf.tensor2d([DATA.periode,DATA.WaveH]).transpose();
  //console.log(X.print());  
  //console.log(model.summary());
  const prediction = model.predict(X);
  const values = prediction.dataSync();
  const arr = Array.from(values);
  //console.log(arr);  
  return{p,h,s,arr};
};

//recuperation donne csv

async function getData() {
        const response = await fetch('https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/201851000.csv');
        const data = await response.text();
        
        const years = [];

        const rows = data.split('\n').slice(1);
        rows.forEach(row => {
          const cols = row.split(' ');
          years.push(cols[0]);
          if(cols[8]!=""){
          WaveS.push(parseFloat(cols[8]));}
          else{ WaveS.push(parseFloat(cols[9]));}
          if(cols[12]!=""){            
          WaveH.push(parseFloat(cols[12]));}
          else{WaveH.push(parseFloat(cols[11]));}
          if(cols[13]!=""){
          periode.push(parseFloat(cols[13]));}
          else{periode.push(parseFloat(cols[12]));}
        });
        WaveS.splice(8712,1);
        periode.splice(8712,1);
        WaveH.splice(8712,1);
        //console.log(periode);
        return {WaveS,periode,WaveH};
      }



//affichage web
(async() => {
  const DATA=  await prediction()
  
  function ordo(){
    var a=[];
    var n=0;
    while (n<8712) {
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
var layout = {
  yaxis: {range: [0, 16]}
};

var data = [trace1, trace2];

Plotly.newPlot('graph', data,layout);
  
  })();