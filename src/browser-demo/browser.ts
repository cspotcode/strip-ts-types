// Browser entry-point

/// <reference types="monaco-editor" />
import monacoPromise from './monaco-editor-shim';

import * as $ from 'jquery';
import { debounce } from "lodash";
import { stripTypes } from '../core/index';

$(document).ready(async () => {
    await monacoPromise;
    const inputEditor = monaco.editor.create($('.editor.input')[0], {
        value: require('!text!../../example/input.ts'),
        language: 'typescript'
    });
    const outputEditor = monaco.editor.create($('.editor.output')[0], {
        readOnly: true,
        value: require('!text!../../example/output.js'),
        language: 'javascript'
    });

    inputEditor.onDidChangeModelContent((e) => {
        throttledUpdateOutput();
    });
    const throttledUpdateOutput = debounce(updateOutput, 400);

    function updateOutput() {
        outputEditor.setValue(stripTypes(inputEditor.getValue()));
    }
});
