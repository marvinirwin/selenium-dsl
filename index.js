const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const nearley = require("nearley");
const grammar = require("./lang/grammar.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed("username is body > #username.");
console.log(JSON.stringify(parser.results, null, /**/'\t'));
/*parser.feed("password is #password.");
parser.feed("password is #btn_password.");
parser.feed("Click username");
parser.feed("Click password");*/

// Now we must evaluate the AST, however everything is an Array which is unpleasent
// Nearly must have a thing for this



/*const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();*/


