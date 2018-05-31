"use strict";
// uuid: edfbcfb5-a4a1-443c-905a-3cf73352fa0e

// ------------------------------------------------------------------------
// Copyright (c) 2018 Alexandre Bento Freire. All rights reserved.
// Licensed under the MIT License+uuid License. See License.txt for details
// ------------------------------------------------------------------------



import { Exact } from "../exact.js";
import { assert } from "chai";

namespace Tests {

  const jsMacros = [] as [string, string][];

  type ExpectFunction = (actual: string) => string;
  const tests: {
    index: uint,
    label: string,
    name: string,
    expr: string,
    expected: string | ExpectFunction,
  }[] = [];


  function add(expr: string, label?: string, expected?: string | ExpectFunction) {
    // if (tests.length > 0) { return; }
    const i = tests.length;
    tests.push({
      index: tests.length,
      name: expr,
      label: label ? label + ':  ' : '',
      expr,
      expected: (expected ? (typeof expected === 'function'
        ? expected : expected.toString()) : undefined)
        // tslint:disable-next-line:no-eval
        || (eval(expr.substr(1))).toString(),
    });
    jsMacros.push(
      [`"f${i}"`,
      `function (t) {
          if (t === 0) {
            var actual = ABeamer.calcExpr("${expr}", story._args);
          }
      return t;
    }`]);
  }


  add('=  -5', 'simple value');
  add('= 4 -5', 'number sign');
  add('=  12 + 24', 'simple binary op');
  add('=  12 + 24 + 8', 'multiple binary op');
  add('=  12 + 24 + 8 * 2', 'priorities');
  add('=  12 + 24 +    8 * 2 * -4');
  add('=  12 + 24 +    8 * 2 * 4 + 7');
  add('=  12 / 24 +    8 * 2 / 4 + 7');

  // test string variables
  add("=  'abeamer'", 'string values', 'abeamer');
  add("=  'travel ' + 'around ' + 'world' ", 'string concatenation', 'travel around world');
  // @TODO: add a test new line meta chars. Requires some changes in the code.
  add("='abeamer \\\\'animation\\\\' '", 'string meta chars', "abeamer 'animation' ");


  // test parenthesis
  add('=  (5) ', 'simple parenthesis');
  add('=  (5 + 3) ');

  // test priorities
  add('=  (5 + 3) * 4 ');
  add('=  ((15 + 33.5) * 4)');
  add('=  34.4 - ((15 + 33.5) * 4)');
  add('=  (34.4 - ((15 + 33.5) * 4) - 7) ');

  // test vars
  add('= e + pi', 'variables', (Math.E + Math.PI).toString());
  add('= e * (23.56 + pi)', 'variables ops', (Math.E * (23.56 + Math.PI)).toString());

  // test functions
  add('=random()', 'zero param func', (actual: string) => {
    const v = parseFloat(actual);
    return (v < 0 || v > 1) ? 'Invalid Random' : actual;
  });
  add('=round(14.4)', 'one param func', Math.round(14.4).toString());
  add('=round(14.4 + 34.2 * e)', 'one param func with bin op', Math.round(14.4 + 34.2 * Math.E).toString());

  add("='#' + rgb(2 + 3 * 8, 12 - 6, 50 - 30)", 'multi param function', '#1a0614');

  // test errors
  add('= (5', 'tests end parenthesis error', '<error>');

  add('=  55 <= 55.4', 'comparison', '1');
  add('=  55.4 == 55.6', 'inequality', '0');
  add('=  55.4 == 55.4', 'equality', '1');


  const outputMap: { [expr: string]: string } = {};

  const func = (rd: Exact.ExactResult, done, index) => {

    const test = tests[index];
    const filteredExpr = test.expr.replace(/\\\\/g, '\\');
    let actual: string;

    if (test.expected !== '<error>') {
      actual = outputMap[filteredExpr];
    } else {
      actual = rd.exceptions[test.index] ? '<error>' : 'NO ERROR';
    }

    const expected = typeof test.expected !== 'function' ? test.expected
      : test.expected(actual);

    assert.isTrue(expected === actual,
      `Expected: [${expected}], Actual: [${actual}]`);
    done();
  };

  const testParams = {};
  tests.forEach((test, index) => {
    testParams[`${test.label}"${test.name}" ~> "${test.expected}"`] = func;
  });


  Exact.runTestSuite(__filename, {
    fps: 2,
    css: '',

    animes:
      tests.map((test, index) => {
        return {
          selector: `#t${index}`,
          props: [{
            prop: 'left',
            duration: '2f',
            easing: `f${index}`,
            value: 5,
          }],
        };
      }),
    html: Exact.genTestHtml(tests.length),
  },
    {
      jsMacros,
      plugins: ['color-functions'],
      tests: testParams,
      // toLogStdOut: true,
      onParseOutputLine: (line: string) => {
        Exact.getResTagParams(line, 'expression', (exprData) => {
          const filteredExpr = exprData[0].replace(/\\n/g, '(newline)');
          outputMap[filteredExpr] = exprData[1];
        });
      },
    },
  );
}
