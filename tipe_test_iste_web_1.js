
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
  const model = await tf.loadLayersModel(  'https://raw.githubusercontent.com/jeaan123/wind-wave-tipe/master/model.json');
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
var trace2 = {
  x: [],
  y: [],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'lines',
  line: {color: '#DF56F1'}
};
var trace3 = {
  x: [],
  y: [],
  xaxis: 'x2',
  yaxis: 'y2',
  mode: 'lines',
  line: {color: '#f17856'}
};
var layout = {
  xaxis2: {
    type: 'date', 
    anchor: 'y2', 
    domain: [0, 1]
  },
  yaxis2: {
    anchor: 'x2', 
    domain: [0, 1]},  
};
var data = [trace2,trace3]; 
var cnt = 0;

Plotly.plot('graph', data, layout);  

function rand() {
  return Math.random();
}
var interval = setInterval(function() {

var time = new Date();
  
  var update = {
    x: [[time], [time]],
    y: [DATA.s, DATA.arr]
  }
  
  Plotly.extendTraces('graph', update, [0,1],100)
   
}, 70);
  
  })();
