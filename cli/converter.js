module.exports = class Converter {

    constructor() {

    }

    start(file) {
        const lr = require('line-reader');
        const fs = require('fs');
        const archiver = require('archiver');
        archiver.a
        if(!fs.existsSync('./out')) {
            fs.mkdir("out", (err) => {
                if(err) {
                    throw new Error()
                }
            })    
        }
        var end = [];
        var meta = [];
        var headers = [];
        var cookies = [];
        var ended = end.join("BUFFER").split("BUFFER");
        var vars = {
            end
        };

        String.prototype.dictionary = (thiss) => {
            return thiss.valueOf().replace("<SOURCE>", "<data.SOURCE>").replace("<USER>", "<input.USERNAME>").replace("<PASS>", "<input.PASSWORD>")
        }
        this._execute("METADATA")
        lr.eachLine(`${file}`, (line, last) => {
            meta.push(line)

            if (last) {
                this._done("METADATA")
                meta = JSON.parse("{" + meta.join("\n").split("{")[1].split("}")[0] + "}")
            }

            fs.writeFileSync('out/manifest.json', JSON.stringify(meta, null, 4), (err) => {
                if (err) return console.log("Failed to save Manifest")
            })
        })

        lr.eachLine(`${file}`, (line, last) => {
            //console.log(end)
            //console.log(end.join("").trim())
            // HTTPRequest 
            if(line.startsWith("#") && line.includes("REQUEST")) {
                this._execute("HTTPRequest")
                end.push("BLOCK:HttpRequest\n");
                end.push(`LABEL:${line.split("#")[1].split(" ")[0]}\n`)
                let type = line.split("REQUEST ")[1].split(" ")[0];
                let url = line.split("REQUEST ")[1].split(" ")[1].split("\"")[1].split("\"")[0];
                end.push(`  url = "${url}"\n  method = ${type}\n  TYPE:STANDARD\n`);

            } else if (line.startsWith("REQUEST ")) {
                this._execute("HTTPRequest")
                end.push("BLOCK:HttpRequest\n");
                let type = line.split("REQUEST ")[1].split(" ")[0];
                let url = line.split("REQUEST ")[1].split(" ")[1].split("\"")[1].split("\"")[0];
                end.push(`  url = "${url}"\n  method = ${type}\n  TYPE:STANDARD\n`);

                //console.log(type, url, '\n', end);
            } else if (line.startsWith("  CONTENT ")) {
                end.push(`  $"${line.split("  CONTENT ")[1].split("\"")[1].split("\"")[0].replace("<USER>", "<input.USERNAME>").replace("<PASS>", "<input.PASSWORD>")}"\n`);
                //console.log("===========")
                //console.log(end.join(""))
            } else if (line.startsWith("  CONTENTTYPE ")) {
                let ct = line.split("  CONTENTTYPE \"")[1].split("\"")[0];
                vars.ct = ct
                end.push(`  "${ct}"\n`)
                //console.log("===========")
                //console.log(end.join(""))

            } else if (line.startsWith("  HEADER")) {
                let header = line.split(" HEADER ")[1].trim();

                headers.push(header)
                //console.log("===========")
                //console.log(end.join(""))
                //console.log("===========")
                //console.log(end.join(""))
            } else if (line.startsWith("  COOKIE ")) {
                let cookie = line.split(" COOKIE ")[1].trim();

                cookies.push(cookie)
                //console.log("===========")
                //console.log(end.join(""))
                //console.log("===========")
                //console.log(end.join(""))
            } else if (end.join("").includes(vars.ct) && !end.join("").includes("customCookies")) {

                let index = end.findIndex(e => e == "BLOCK:HttpRequest")
                end.splice(index + 2, 0, '  customCookies = {(' + cookies.join(",") + ')}\n');
                //console.log("===========")
                //console.log(end.join(""))
            } else if (end.join("").includes(vars.ct) && !end.join("").includes("customHeaders")) {

                let index = end.findIndex(e => e == "BLOCK:HttpRequest")
                end.splice(index + 2, 0, '  customHeaders = {(' + headers.join(",") + ')}\n');
                //console.log("===========")
                //console.log(end.join(""))
            } else if (end.join("").trim().endsWith(vars.ct + '"')) {
                this._done("HTTPRequest")
                end.push("ENDBLOCK\n")
                //console.log("===========")
                //console.log(end.join(""))
            }

            // KeyChain 
            if (line.startsWith("KEYCHECK")) {
                this._execute("KeyChain")
                end.push("\nBLOCK:Keycheck\n")
                //console.log("===========")
                return //console.log(end.join(""))
            } else if (line.startsWith("  KEYCHAIN")) {
                let type = line.split("  KEYCHAIN ")[1].toUpperCase()

                end.push('  KEYCHAIN ' + type + '\n');
                //console.log("===========")
                return //console.log(end.join(""))
            } else if (line.startsWith("    KEY") && !line.includes("KEYCHAIN")) {
                let lines = `${line.dictionary(line).replace("KEY \"", "KEY $\"").replace(" \"", " $\"")}`;


                end.push(`    STRING${lines.trimStart()}\n`)
                //console.log("===========")
                //console.log(end.join(""))

            } else if (String(end[end.length - 1]).includes("KEY")) {
                this._done("KeyChain")
                end.push("ENDBLOCK\n")
                //console.log("=========== ", line.trim())
                //console.log(end.join("").toString())
            }
 
            if(last) {
                fs.writeFile(`out/script.loli`, end.join(""), (err) => {
                    if(err) {
                        console.log(err)
                    } else {
                        console.log("Done!")
                    }
                })
            }
        })
    }

    _execute(blockname) {
        console.log(`[CONVERTING] ${blockname}`)
    }    

    _done(blockname) {
        console.log(`[DONE] ${blockname}`)
    } 
}