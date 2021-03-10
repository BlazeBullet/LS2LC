const lr = require('line-reader');

var end = "";



// BLOCK:Keycheck
//   KEYCHAIN SUCCESS OR
//     STRINGKEY @data.SOURCE DoesNotContain "Password must be at least 6 characters long!"
//     STRINGKEY @data.SOURCE DoesNotContain "Invalid username or password."
// ENDBLOCK

// BLOCK:Piston
//   lang = "node"
//   code = "console.log(\"cool\")"
//   => VAR @uwu
// ENDBLOCK

// BLOCK:HttpRequest
//   url = "https://lootbits.io/login.php"
//   method = POST
//   TYPE:STANDARD
//   $"username=<input.USERNAME>&password=<input.PASSWORD>&action=login"
//   "application/x-www-form-urlencoded"
// ENDBLOCK
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