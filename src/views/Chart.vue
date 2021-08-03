<template>
<v-container style="width: 100%" class="d-flex w-md-100">
    <trading-vue
        :data="chart"
        :width="this.width"
        :height="this.height"
        :overlays="overlays"
        :color-back="colors.colorBack"
        :color-grid="colors.colorGrid"
        :color-text="colors.colorText"
        :legend-buttons="['display','down']"
        v-on:legend-button-click="onLegendClick"
    ></trading-vue>
    <!-- <v-btn color="primary" elevation="3" raised rounded text v-on:click="subscribe()">subscribe</v-btn> -->
    <!-- <v-btn color="primary" elevation="3" raised rounded text v-on:click="unSubscribeMessage()">Send UnSubscribe Message</v-btn> -->
</v-container>
</template>

<script>
import TradingVue from 'trading-vue-js';
import axios from 'axios';
export default {
    name: 'chart',
    components: { TradingVue },
    methods: {
        onLegendClick(event) {
        // ...
        console.log("onLegendClick:  ", event);
        },
        onResize() {
            this.width = window.innerWidth-window.innerWidth/8;
            this.height = window.innerHeight - 100;
        },
        updateData(event) {
            var data = JSON.parse(event.data);
            
            // update ticker data
            if (data.channel == "ticker" && this.lastTimestamp > 0) {
                if ((this.lastTimestamp + this.timeframe * 1000) > (data.data.time * 1000)) {
                    var lastCandleData = this.candleData.pop();
                    if (lastCandleData[2] < data.data.last) lastCandleData[2] = data.data.last;
                    if (lastCandleData[3] > data.data.last) lastCandleData[3] = data.data.last;
                    lastCandleData[4] = data.data.last;
                    this.candleData.push(lastCandleData);
                }else {
                    this.lastTimestamp = parseInt(this.lastTimestamp + this.timeframe * 1000);
                    this.candleData.push([this.lastTimestamp, data.data.last, data.data.last, data.data.last, data.data.last]);
                }
            }
        },
        unSubscribeMessage: function() {
            // unsubscribe ticker
            var com = {'channel': 'ticker', 'market': 'BTC/USD', 'op': 'unsubscribe'};
            console.log(this.connection);
            this.connection.send(JSON.stringify(com));
        },
        subscribe: function() {
            
        },
                
        onopen: function(event) {
            console.log("Successfully connected to the echo websocket server...")

            var timestamp = (new Date().getTime() / 1000) - this.timeframe * 50;
            // initialize history candle data
            axios.get("/api/markets/BTC/USD/candles?resolution=" + this.timeframe + "&start_time=" + timestamp, {
            }).then(res => {
                if (res.data.success) {
                    var result = res.data.result;
                    for (var i = 0; i < result.length; i++) {
                        this.candleData.push([result[i].time, result[i].open, result[i].high, result[i].low, result[i].close]);
                    }

                    if (result.length > 0)
                        this.lastTimestamp = result[result.length - 1].time;
                }
            });

            // request tick data for realtime update
            var com = {'channel': 'ticker', 'market': 'BTC/USD', 'op': 'subscribe'};
            if (event.isTrusted) {
                this.connection.send(JSON.stringify(com));
            }
        }
    },
    mounted() {
        window.addEventListener("resize", this.onResize);
    },
    beforeDestroy() {
        window.removeEventListener("resize", this.onResize);
    },
    data() {
        return {
            sliderValue: 50,
            candleData: [],
            chart: {
                "chart": {
                        "type": "Candles",
                        "data": []
                    }
            },
            width: window.innerWidth-window.innerWidth/8,
            height: window.innerHeight-100,
            colors: {
                colorBack: "#fff",
                colorGrid: "#eee",
                colorText: "#333"
            },
            overlays: [],
            timeframe: 300,
            lastTimestamp: 0
        };
    },
    watch: {
        candleData: function () {
            this.chart = {
                "chart": {
                    "type": "Candles",
                    "data": this.candleData
                }
            }
        }
    },
    created: function() {
        console.log("Starting connection to WebSocket Server")
        this.connection = new WebSocket("wss://ftx.com/ws/")

        this.connection.onmessage = this.updateData;

        this.connection.onopen = this.onopen;
    },
}

</script>