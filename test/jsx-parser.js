import { test } from 'tap';
import { parseJSX, jsxToText } from '../src/jsx-parser';


test('JSX Parse plain text', (t) => {
    const ast = parseJSX('This is plain text');
    t.same(ast.length, 1);
    t.same(ast[0].nodeName, '#text');
    t.same(ast[0].value, 'This is plain text');
    t.end();
});

test('JSX Transform bare javascript expression', (t) => {
    const ast = parseJSX('{{name}}');
    t.same(ast.length, 1);
    t.same(ast[0].nodeName, '#expression');
    t.same(ast[0].value, '{{name}}');
    t.end();
});

test('JSX Transform leading javascript expression', (t) => {
    const ast = parseJSX('{{name}}, you are so fine');
    t.same(ast.length, 2);
    t.same(ast[0].nodeName, '#expression');
    t.same(ast[0].value, '{{name}}');
    t.same(ast[1].nodeName, '#text');
    t.same(ast[1].value, ', you are so fine');
    t.end();
});

test('JSX Transform trailing javascript expression', (t) => {
    const ast = parseJSX('My name is {{name}}');
    t.same(ast.length, 2);
    t.same(ast[0].nodeName, '#text');
    t.same(ast[0].value, 'My name is ');
    t.same(ast[1].nodeName, '#expression');
    t.same(ast[1].value, '{{name}}');
    t.end();
});

test('JSX Transform javascript expression', (t) => {
    const ast = parseJSX('My name is {{name}}. And you?');
    t.same(ast.length, 3);
    t.same(ast[0].nodeName, '#text');
    t.same(ast[0].value, 'My name is ');
    t.same(ast[1].nodeName, '#expression');
    t.same(ast[1].value, '{{name}}');
    t.same(ast[2].nodeName, '#text');
    t.same(ast[2].value, '. And you?');
    t.end();
});

test('JSX Nested expression', (t) => {
    const ast = parseJSX('Hello, <strong>{{name}}</strong>, how are you?');
    t.same(ast.length, 3);
    t.same(ast[0].nodeName, '#text');
    t.same(ast[1].nodeName, 'strong');
    t.same(ast[1].childNodes.length, 1);
    t.same(ast[1].childNodes[0].nodeName, '#expression');
    t.same(ast[1].childNodes[0].value, '{{name}}');
    t.same(ast[2].nodeName, '#text');
    t.end();
});


test('JSX child node', (t) => {
    const ast = parseJSX('I agree to the <Link>terms</Link>.');
    t.same(ast.length, 3);
    t.same(ast[0].nodeName, '#text');
    t.same(ast[1].nodeName, 'Link');
    t.same(ast[1].childNodes.length, 1);
    t.same(ast[1].childNodes[0].nodeName, '#text');
    t.same(ast[1].childNodes[0].value, 'terms');
    t.same(ast[2].nodeName, '#text');
    t.same(ast[2].value, '.');
    t.end();
});

test('parseJSX merges text nodes', (t) => {
    const ast = parseJSX('Don&apos;t do this');
    t.same(ast.length, 1);
    t.same(ast[0].value, 'Don\'t do this');
    t.end();
});

test('JSX to i18next', (t) => {
    t.same(jsxToText('Basic text'), 'Basic text');
    t.same(jsxToText('Hello, {{name}}'), 'Hello, <1>{{name}}</1>');
    t.same(jsxToText('I agree to the <Link>terms</Link>.'), 'I agree to the <1>terms</1>.');
    t.same(jsxToText('One &amp; two'), 'One & two');
    t.end();
});

test('HTML entities', (t) => {
    t.same(jsxToText('Don&apos;t do this <strong>Dave</strong>'), 'Don\'t do this <1>Dave</1>');
    t.end();
});

