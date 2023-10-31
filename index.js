const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgval) => {
    let temperature = tempVal.replace("{%tempval%}", (orgval.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}", (orgval.main.temp_min - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}", (orgval.main.temp_max - 273.15).toFixed(2));
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=pune&appid=c9e4bedbe96edeb4fd8e8d2ad5eaef74")
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const modifiedData = replaceVal(homeFile, objData);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(modifiedData);
                res.end();
            })
            .on("end", (err) => {
                if (err) {
                    console.error("Error occurred during API request:", err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.write("Internal Server Error");
                    res.end();
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(modifiedData);
                    res.end();
                    console.log("Response sent successfully.");
                }
            });            
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is running on port 8000');
});
