const lr = require('line-reader');
const colors = require('colors')

var end = [];
var headers = [];
var cookies = []; 
var ended = end.join("BUFFER").split("BUFFER");
var vars = {
    end
};

String.prototype.dictionary = (thiss) => {
    return thiss.valueOf().replace("<SOURCE>", "<data.SOURCE>").replace("<USER>", "<input.USERNAME>").replace("<PASS>", "<input.PASSWORD>")
}

lr.eachLine('./Loopbits.svb', (line, last) => {
    console.log(end)
    console.log(end.join("").trim())
    // HTTPRequest 
    if(line.startsWith("REQUEST ")) {
        end.push("BLOCK:HttpRequest\n");
        let type = line.split("REQUEST ")[1].split(" ")[0];
        let url = line.split("REQUEST ")[1].split(" ")[1].split("\"")[1].split("\"")[0];
        end.push(`  url = "${url}"\n  method = ${type}\n  TYPE:STANDARD\n`);

        console.log(type, url, '\n', end);
    } else if(line.startsWith("  CONTENT ")) {
        end.push(`  $"${line.split("  CONTENT ")[1].split("\"")[1].split("\"")[0].replace("<USER>", "<input.USERNAME>").replace("<PASS>", "<input.PASSWORD>")}"\n`);
        console.log("===========")
        console.log(end.join(""))
    } else if(line.startsWith("  CONTENTTYPE ")) {
        let ct = line.split("  CONTENTTYPE \"")[1].split("\"")[0];
        vars.ct = ct
        end.push(`  "${ct}"\n`)
        console.log("===========")
        console.log(end.join(""))

    } else if(line.startsWith("  HEADER")) {
        let header = line.split(" HEADER ")[1].trim();

        headers.push(header)
        console.log("===========")
        console.log(end.join(""))
        console.log("===========")
        console.log(end.join(""))
    } else if(line.startsWith("  COOKIE ")) {
        let cookie = line.split(" COOKIE ")[1].trim();

        cookies.push(cookie)
        console.log("===========")
        console.log(end.join(""))
        console.log("===========")
        console.log(end.join(""))
    } else if(end.join("").includes(vars.ct) && !end.join("").includes("customCookies")) {

        let index = end.findIndex(e => e == "BLOCK:HttpRequest")
        end.splice(index + 2, 0, '  customCookies = {(' + cookies.join(",") + ')}\n');
        console.log("===========")
        console.log(end.join(""))
    } else if(end.join("").includes(vars.ct) && !end.join("").includes("customHeaders")) {

        let index = end.findIndex(e => e == "BLOCK:HttpRequest")
        end.splice(index + 2, 0, '  customHeaders = {(' + headers.join(",") + ')}\n');
        console.log("===========")
        console.log(end.join(""))
    } else if(end.join("").trim().endsWith(vars.ct + '"')) {
        end.push("ENDBLOCK\n")
        console.log("===========")
        console.log(end.join(""))
    }

    // KeyChain 
    if(line.startsWith("KEYCHECK")) {
        end.push("\nBLOCK:Keycheck\n")
        console.log("===========")
        return console.log(end.join(""))
    } else if(line.startsWith("  KEYCHAIN")) {
        let type = line.split("  KEYCHAIN ")[1].toUpperCase()

        end.push('  KEYCHAIN ' + type + '\n');
        console.log("===========")
        return console.log(end.join(""))
    } else if(line.startsWith("    KEY") && !line.includes("KEYCHAIN")) {
        let lines = `${line.dictionary(line).replace("KEY \"", "KEY $\"").replace(" \"", " $\"")}`;


        end.push(`    STRING${lines.trimStart()}\n`)
        console.log("===========")
        return console.log(end.join(""))
    
    } else if(line.startsWith("   ") && end.join("").trimStart().endsWith("")) {
        //end.push("ENDBLOCK\n")
        console.log("=========== ", line.trim())
        console.log(end.join("").toString())
    }

    
})