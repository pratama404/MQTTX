const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
const host = 'ws://test.mosquitto.org:8080';

const options = {
    keepalive: 30,
    clientId: clientId,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    rejectUnauthorized: false
  }

  console.log('menghubungkan ke broker');
  const client = mqtt.connect(host, options);

  client.on('connect', function(){
    console.log('terhubung, clientId: ' + clientId);
    client.subscribe('nusabot/#', { qos: 1 })
    document.getElementById("status").innerHTML="Terhubung";  
 })

  client.on('error', function(err){
    console.log(err);
    client.end();
  })

client.on('message', function(topic, payload){
    if(topic == "nusabot/hujan"){
        document.getElementById("hujan").innerHTML = payload;
        addData(chartHujan, payload.toString());
    }
    if(topic == "nusabot/suhu"){
        document.getElementById("suhu").innerHTML = payload;
        addData(chartSuhu, payload.toString());
    }
    if(topic == "nusabot/kelembaban"){
        document.getElementById("kelembaban").innerHTML = payload;
        addData(chartKelembaban, payload.toString());
    }
})

function publish(){
    data = document.getElementById("publish").value;
    client.publish('nusabot/data', data.toString(),{qos: 1, retain:true});
}

const cth = document.getElementById('chartHujan');
const cts = document.getElementById('chartSuhu');
const ctk = document.getElementById('chartKelembaban');

const chartHujan = new Chart(cth, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Hujan',
            data: [],
            backgroundColor: 'rgba(200, 150, 70, 1)',
            borderWidth: 1
        }]
    },
});

const chartSuhu = new Chart(cts, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          label: 'Suhu',
          data: [],
          backgroundColor: 'rgba(0, 0, 255, 1)',
          borderWidth: 1
      }]
  },
});

const chartKelembaban = new Chart(ctk, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          label: 'Kelembaban',
          data: [],
          backgroundColor: 'rgba(0, 255, 0, 1)',
          borderWidth: 1
      }]
  },
});


function addData(chart, data) {
  let currentDate = new Date();
  let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();

  chart.data.labels.push(time);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
  });
  chart.update();
}
