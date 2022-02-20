import fs from 'fs';

const readme = fs.readFileSync('./README.md','utf8');
fs.writeFileSync('./README.md',readme.replace(/\.\[Symbol\-iterator\]/g,"\\\[Symbol\\\.iterator\\\]"))