const lr = require('line-reader');

var end = "";

lr.eachLine('./Loopbits.svb', (line, last) => {
    if(line.startsWith("REQUEST ")) {
        end += "BLOCK:HttpRequest\n";
        let type = line.split("REQUEST ")[1].split(" ")[0];
        let url = line.split("REQUEST ")[1].split(" ")[1].split("\"")[1].split("\"")[0];
        end += `  url = "${url}"\n  method = ${type}\n  TYPE:STANDARD\n`;

        console.log(type, url, '\n', end);
    } else if(line.startsWith("  CONTENT ")) {
        end += `  $"${line.split("  CONTENT ")[1].split("\"")[1].split("\"")}"`;
        console.log("===========")
        console.log(end)
    }
})