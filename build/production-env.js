let fs = require('fs');
let package = JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf-8'));

let GlobalEnv = {
    GA_TRACKING_ID: process.env.P_GA_TRACKING_ID ? process.env.P_GA_TRACKING_ID : "",
    VERSION: package.version,
}

let environmentPath = __dirname + '/../app/environments/environment.ts';
let fileContent = `export const GlobalEnv = ${JSON.stringify(GlobalEnv)};`;

fs.writeFileSync(environmentPath, fileContent);
