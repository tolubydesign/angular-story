import * as fs from "fs";
import * as path from "path";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const developmentEnvironmentName = 'development';
const productionEnvironmentName = 'production';
dotenv.config({ path: path.join(__dirname, `.env.${developmentEnvironmentName}`) });

const rootDir = path.join(__dirname, '../../');
const developmentFile = path.join(__dirname, `../../.env.${developmentEnvironmentName}`);
const productionFile = path.join(__dirname, `../../.env.${productionEnvironmentName}`)
const developmentEnvironmentPath = path.join(__dirname, 'environment.development.ts');
const productionEnvironmentPath = path.join(__dirname, 'environment.prod.ts');

fs.readFile(developmentFile, 'utf8', (error, data) => {
  if (error) return console.log(error);
  const env = SplitKeyValues(data)
  CreateEnvironmentFile(env, 'development');
})

fs.readFile(productionFile, 'utf8', (error, data) => {
  if (error) return console.log(error);
  const env = SplitKeyValues(data)
  CreateEnvironmentFile(env, 'production');
})

/**
 * Take String data and split values to return an object containing all valid values found in the buffer/string
 * @param {Buffer} buffer UTF8 string data, representing the content of the file searched.
 * @return {Object} environment object.
 */
function SplitKeyValues(buffer) {
  const obj = {};
  const envKeyValues = buffer.split('\n');
  envKeyValues.forEach((keyValue, index) => {
    const keyVal = keyValue.split('=');
    const key = keyVal[0];
    const val = keyVal[1];
    if (key && !key.startsWith('#')) {
      obj[key] = val?.replace(/"/g, '');
    }
  })
  return obj
}

/**
 * Create a environment.*.ts file for Angular to inject into project.
 * @param {Object} content Data Object containing key-values environment information
 * @param {'development' | 'production'} type the environment the content needs to be created for.
 */
function CreateEnvironmentFile(content, type = 'production') {
  const fileName = (type === 'production') ? productionEnvironmentPath : developmentEnvironmentPath;
  const isProduction = (type === 'production') ? 'production: true' : 'production: false';

  var data = '';
  Object.keys(content).forEach(key => {
    const value = content[key];
    data += `\n\t${key}: "${value}",`
  })

  const fileContent = `import { Environment } from "./environment.model";

export const environment: Environment = {
  ${isProduction},${data}
};
`

  fs.writeFile(fileName, fileContent, function (err) {
    if (err) return console.log(err); ''
    console.log(type, " environment file has been created.");
  });
}
