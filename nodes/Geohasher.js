const path = require('path');
//const MathHelper = require(path.join(__dirname, '/lib/math.js'));

module.exports = function(RED)
{
    function Geohasher(config)
    {
        RED.nodes.createNode(this,config);
        this.latitude = config.latitude;
        this.longitude = config.longitude;
        this.precision = config.precision;
        let node = this;
        this.status({fill:"red",shape:"ring",text:"No data received yet"});
        node.on('input', function(msg)
        {
            hashBase = '0123456789bcdefghjkmnpqrstuvwxyz'; //its the rules
            var lat_interval = [-90, 90];
            var lon_interval = [-180, 180];
            const bits = [16, 8, 4, 2, 1];
            var bit = 0;
            var char = 0;
            var geohash = [];
            var cycle = "longitude";
            
            //engage loop while hash length is less than the precision
            while (geohash.length < this.precision)
            {
                switch(cycle)
                {
                    case "longitude":
                        var mid_interval = (lon_interval[0] + lon_interval[1]) / 2;
                        if (this.longitude > mid_interval)
                        {
                            char |= bits[bit];
                            lon_interval[0] = mid_interval;
                        }
                        else
                        {
                            lon_interval[1] = mid_interval;
                        }
                        cycle = "latitude";
                    break;

                    case "latitude":
                        var mid_interval = (lat_interval[0] + lat_interval[1]) / 2;
                        if (this.latitude > mid_interval)
                        {
                            char |= bits[bit];
                            lat_interval[0] = mid_interval;
                        }
                        else
                        {
                            lat_interval[1] = mid_interval;
                        }
                        cycle = "longitude"
                    break;
                }
                if (bit < 4)
                {
                    bit++;
                }
                else
                {
                    geohash += hashBase[char];
                    bit = 0;
                    char = 0;
                    this.status({fill:"yellow",shape:"ring",text:"Generating..."});
                }
            }
            msg.payload = geohash;
            msg.input =
            {
                "Latitude" : this.latitude,
                "Longitude" : this.longitude,
                "Precision" : this.precision
            }
            this.status({fill:"green",shape:"ring",text:geohash});
            node.send(msg);
        });
    }
    RED.nodes.registerType("Geohasher",Geohasher);
}
