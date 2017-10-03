import * as ts from 'typescript';
import {Node, SyntaxKind} from 'typescript';
import { sortBy, filter, map, flatten, each, includes } from 'lodash';
import * as assert from 'assert';
import { SyntaxKind2 } from './sk';

const preserveLineAndColNumbers = true;

/*
 * TODOs
 * Understand that keywords force whitespace to one or both sides.  Remove that whitespace.
 * Understand that certain type syntax "attaches" to the left or right; remove whitespace on that side.
 * (e.g. `as Node` type assertion attaches to whatever's on its left;
 *    the colon preceding a type annotation attaches left;
 *    a C-style type assertion attaches right)
 */

type TODO = any;

interface Span {start: number; end: number}
const omittedSpans: Array<Span> = [];

export function stripTypes(src: string): string {
    const srcFile = ts.createSourceFile('example.ts', src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    ts.transform(srcFile, [transformerFactory], {
        // compiler options
    });

    const _s = sortBy(omittedSpans, span => span.start);
    let last = _s[0];
    const sortedOmittedSpans = filter(map(_s, (b, i, l) => {
        if(i === 0) return b;
        const a = last;
        if(b.start >= a.start && b.end <= a.end) {
            console.log('omitting: ', json(a), json(b), i - 1);
            return null;
        }
        last = b;
        return b;
    })) as Array<Span>;
    console.log(json(sortedOmittedSpans));
    for(
        let i = 1,
            l = sortedOmittedSpans.length,
            a = sortedOmittedSpans[0],
            b = sortedOmittedSpans[1];
        i < l;
        i++, a = b, b = sortedOmittedSpans[i]
    ) {
        assert(a.end <= b.start, json([a, b, `${ src.substring(a.start, a.end) }`]));
    }

    let acc = '';
    let from = 0;
    for(let span of sortedOmittedSpans) {
        acc += src.substring(from, span.start);
        if(preserveLineAndColNumbers) {
            // TODO if span is immediately followed by newline, 
            if('\r\n'.indexOf(src[span.end]) >= 0) {
                acc += src.substring(span.start, span.end).replace(/[^\r\n]*(\r\n|\n|\r)/g, '$1').replace(/[^\r\n]/g, '');
            } else {
                acc += src.substring(span.start, span.end).replace(/[^\r\n]*(\r\n|\n|\r)/g, '$1').replace(/[^\r\n]/g, ' ');
            }
        }
        console.dir(src.substring(span.start, span.end));
        from = span.end;
    }
    acc += src.substring(from);
    return acc;
}

function transformerFactory(ctx: ts.TransformationContext) {
    return transformer;

    function transformer(root: ts.SourceFile) {
        const nodePath: Array<Node> = [];
        visitor(root);
        return root;

        function visitor(node: Node): ts.VisitResult<ts.Node> {
            // 158 - 173
            switch(node.kind) {
                case SyntaxKind.InterfaceDeclaration:
                case SyntaxKind.TypeAliasDeclaration:
                case SyntaxKind.TypeParameter:
                    markForOmission(node);
                    return node;
                case SyntaxKind.Parameter:
                case SyntaxKind.PropertyDeclaration:
                    // (node as ts.FunctionDeclaration).parameters[0].
                    node.getChildren().filter(v => v.kind === SyntaxKind.ColonToken).forEach(markForOmission);
                    break;
                case SyntaxKind.TypeAssertionExpression:
                    node.getChildren().filter(v => includes([SyntaxKind.LessThanToken, SyntaxKind.GreaterThanToken], v.kind)).forEach(markForOmission);
                    break;
                case SyntaxKind.FunctionDeclaration:
                    if(!(node as ts.FunctionDeclaration).body) {
                        markForOmission(node);
                        return node;
                    }
                    node.getChildren().filter(v => includes([SyntaxKind.LessThanToken, SyntaxKind.GreaterThanToken, SyntaxKind.ColonToken], v.kind)).forEach(markForOmission);
                    break;
                case SyntaxKind.AsExpression:
                    node.getChildren().filter(v => v.kind === SyntaxKind.AsKeyword).forEach(markForOmission);
                    break;
            }

            for(let prop in node) {
                const val = (node as TODO)[prop];
                if(Array.isArray(val)) {
                    val.forEach(v => checkIfType(v, prop));
                } else {
                    checkIfType(val, prop);
                }
            }
            function checkIfType(val: any, prop: string) {
                if(val != null && typeof val.kind ===  'number') {
                    if(prop === 'type') {
                        markForOmission(val as Node);
                        return;
                    }
                    if(val.kind >= ts.SyntaxKind.FirstTypeNode && val.kind <= ts.SyntaxKind.LastTypeNode) {
                        markForOmission(val as Node);
                        return;
                    }
                    if(val.kind === SyntaxKind.HeritageClause && (val as ts.HeritageClause).token === ts.SyntaxKind.ImplementsKeyword) {
                        markForOmission(val as Node);
                        return;
                    }
                    (val as ts.ClassDeclaration).heritageClauses;
                    (val as ts.ClassDeclaration).typeParameters;
                    (val as ts.ClassDeclaration).decorators;
                    (val as ts.ClassDeclaration).modifiers;
                    switch(val.kind) {
                    }
                }
            }

            const children = flatten(node.getChildren(srcFile).map(v =>
                (v.kind === SyntaxKind.SyntaxList) ? v.getChildren() : [v]
            ));
            // const children2 = sortBy(children, v => v.getStart(srcFile, false));
            // each(children, (child, i) => {
            //     assert(child === children2[i]);
            // })
            const visitedChildren = [];
            let lastVisitedChildIndex = -1;
            ts.visitEachChild(node, (n) => {
                const newIndexOf = children.indexOf(n);

                console.log('---');
                console.log(path([...nodePath, n]));
                console.log(`${ lastVisitedChildIndex } ${ newIndexOf }`);
                console.log('---');

                lastVisitedChildIndex = newIndexOf;

                visitedChildren.push(n);
                nodePath.push(n);
                const ret = visitor(n);
                nodePath.pop();
                return ret;
            }, ctx);
            const nums = {
                '-1': '   ',
                0:    '0  ',
                1:    '1  ',
                2:    '2  ',
                3:    '3  ',
                4:    '4  ',
                5:    '5  ',
                6:    '6  ',
                7:    '7  ',
                8:    '8  ',
                9:    '9  ',
            }
            console.log('===');
            const p = path(nodePath);
            console.log(`   ${ p }>`);
            const prefix = p.replace(/./g, ' ');
            children.forEach(v => {
                // return `${ visitedChildren.indexOf(v) >= 0 ? 'Y' : 'N' }:${ kind(v) }`
                console.log(`${ (nums[visitedChildren.indexOf(v)]/* >= 0 ? '* ' : '  '*/) }${ prefix }>${ kind(v) }`);
                if(includes([
                    SyntaxKind.AbstractKeyword,
                    SyntaxKind.ReadonlyKeyword
                ], v.kind)) {
                    markForOmission(v);
                }
            });
            console.log('===');

            return node;
        }
    }
}

function markForOmission(node: Node) {
    // const start = node.getFullStart();
    const start = node.getStart(srcFile, false);
    const end = node.getEnd();
    omittedSpans.push({start, end});
}

function json(v: any): string {
    return JSON.stringify(v);
}
function jsonPretty(v: any): string {
    return JSON.stringify(v, null, '    ');
}

function kind(node: Node) {
    return SyntaxKind2[node.kind];
}

function path(a: Array<Node>): string {
    return a.map(v => kind(v)).join('>');
}