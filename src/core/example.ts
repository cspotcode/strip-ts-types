import * as fs from 'fs';
import { readFileSync as readFile, writeFileSync as writeFile } from 'fs';
import {stripTypes} from './index';

const inputPath = 'example/input.ts';
const outputPath = 'example/output.js';

const src = readFile(inputPath, 'utf8');

const acc = stripTypes(src);

writeFile(outputPath, acc);
