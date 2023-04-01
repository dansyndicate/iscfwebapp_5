import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from "chart.js";
import {Line} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
//import options from '../../components/linechart';

import Layout from '../../components/layout';

import firebase from '../../firebase/firebase';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useEffect, useState, useRef } from 'react';
import { resolve } from 'styled-jsx/css';





Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Title, ChartDataLabels );
console.log(Chart.version);
const optionsX = {
  plugins: {
    datalabels: { // This code is used to display data values
      display: false,
      color: 'grey',
      formatter: function(value,context){
        return value.toFixed(2)
      }
    },

    title: {
      display: true,
      text: 'Aceleração em X',
      font: {size: 20}
    },

    tooltip: {
      callbacks: {
        title: function(){}
      }

    }
  },
};

const optionsY = {
  plugins: {
    datalabels: { // This code is used to display data values
      display: false,
      color: 'grey',
      formatter: function(value,context){
        return value.toFixed(2)
      }
    },

    title: {
      display: true,
      text: 'Aceleração em Y',
      font: {size: 20}
    },

    tooltip: {
      callbacks: {
        title: function(){}
      }

    }
  },
};

const optionsZ = {
  plugins: {
    datalabels: { // This code is used to display data values
      display: false,
      color: 'grey',
      formatter: function(value,context){
        return value.toFixed(2)
      }
    },

    title: {
      display: true,
      text: 'Aceleração em Z',
      font: {size: 20}
    },

    tooltip: {
      callbacks: {
        title: function(){}
      }

    }
  },
};



export default function FirstPost() {

  const [intervalTimer, setTimer] = useState(1);
  const [amostrasNum, setAmostras] = useState(15);
  

  let dataTest = null;
  const [times, setTimes] = useState(null);
  const [x, setX] = useState(null);
  const [y, setY] = useState(null);
  const [z, setZ] = useState(null);
   
  const dataX = {
    labels: times,
    datasets: [
      {
        label: 'X value',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(200,50,0,1)',
        borderCapStyle: 'round',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: x
      }
    ]
  };
  
  const dataY = {
    labels: times,
    datasets: [
      {
        label: 'Y value',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(0,200,50,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: y
      }
    ]
  };
  const dataZ = {
    labels: times,
    datasets: [
      {
        label: 'Z value',
        fill: false,
        lineTension: 0,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(50,0,200,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: z
      }
    ]
  };

  const timer = useRef();
  const db = getDatabase();
  const refValues = ref(db,'/accel');

  onValue(refValues, (snapshot) => {
    dataTest = snapshot.val();   
  });

  useEffect(() => {
      timer.current = setInterval(() => {

        const timeVect = [];
        const xVect = [];
        const yVect = [];
        const zVect = [];

        for(var ID in dataTest){
          timeVect.push(dataTest[ID].timestamp);
          xVect.push(dataTest[ID].x);
          yVect.push(dataTest[ID].y);
          zVect.push(dataTest[ID].z);

        }

        for(var i in timeVect){
          const aux = new Date(0,0,0,0,0,Math.round(timeVect[i]));
          const dateString = aux.getHours()+1 + "h:" + 
                            aux.getMinutes() + "m:" + 
                            (aux.getSeconds()).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + "s";
          timeVect[i] = dateString; // convert to Date + Time
        }

        setTimes(timeVect.slice(timeVect.length-amostrasNum, timeVect.length));
        setX(xVect.slice(xVect.length-amostrasNum, xVect.length));
        setY(yVect.slice(yVect.length-amostrasNum, yVect.length));
        setZ(zVect.slice(zVect.length-amostrasNum, zVect.length));
    }, intervalTimer*1000);
    return () => clearInterval(timer.current);
    
  },[intervalTimer, amostrasNum]);

  const onClickTime = () => {
    setTimer(document.getElementById("intervalo").value);
    console.log(`changed timer to ${intervalTimer}`);
  }

  const onClickAmostras = () => {
    setAmostras(document.getElementById("amostras").value);
    console.log(`changed timer to ${amostrasNum}`);
  }

    return (
        <Layout>
            <h1>Gráficos de aceleração</h1>
            
            <label for="intervalo">Intervalo de atualização (segundos): </label>
            <input type="text" id="intervalo" name="intervalo"/>
            <button type="button" onClick={onClickTime}> Atualizar </button>
            <p>{"Intervalo atual: " + intervalTimer + "s"}</p>

            <div/>

            <label for="amostras">Número de amostras: </label>
            <input type="text" id="amostras" name="amostras"/>
            <button type="button" onClick={onClickAmostras}> Atualizar </button>
            <p>{"Número de amostras atual: " + amostrasNum}</p>
            
            {/* <h2><center>Eixo X</center></h2> */}
            <Line options= {optionsX} data= {dataX} width={400} height={150} />
            {/* <h2><center>Eixo Y</center></h2> */}
            <Line options={optionsY} data={dataY} width={400} height={150} />
            {/* <h2><center>Eixo Z</center></h2> */}
            <Line options={optionsZ} data={dataZ} width={400} height={150} />
            
        </Layout>

    );
}