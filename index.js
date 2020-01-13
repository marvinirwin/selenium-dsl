const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const nearley = require("nearley");
const grammar = require("./grammar.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

parser.feed("username is an element with id username.");
parser.feed("login is an element with id btn_login.");
parser.feed("password is an element with id btn_password.");
parser.feed("Click username");
parser.feed("Type dogsarecute");
parser.feed("Click password");
parser.feed("Type dogsarecute");
parser.feed("Click login");
parser.feed("Wait 2000 for login to disappear");
// TODO see if all these grammars parse correctly.
const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();


