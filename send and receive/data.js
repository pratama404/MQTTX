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
    }
    if(topic == "nusabot/suhu"){
        document.getElementById("suhu").innerHTML = payload;
    }
    if(topic == "nusabot/kelembaban"){
        document.getElementById("kelembaban").innerHTML = payload;
    }
})

function publish(){
    data = document.getElementById("publish").value;
    client.publish('nusabot/data', data.toString(),{qos: 1, retain:true});
}