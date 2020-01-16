const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const nearley = require("nearley");
const grammar = require("./lang/grammar.js");

const sentences = [
    'usernameInput is #fakelogin.',
    'passwordInput is #fakepassword.',
    'ecrSelect is #application_id.',
    'pcsOption is #application_id > option:nth-child(13).', // this one is only for ongwanada
    'goButton is .disciplinetext > table:nth-child(7) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > button:nth-child(1).',
    'Click the usernameInput.',
    `Type this ${process.env.DEV_USERNAME}.`,
    'Click the passwordInput.',
    `Type this ${process.env.DEV_PASSWORD}.`,
    'Click the ecrSelect.',
    'Click the pcsOption.',
    'Click the goButton.'
];

const parsed = [];

function extracted(sentence) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(sentence);
    let value = parser.results;
    if (!value.length) {
        console.info(sentence)
    }
    const t = value[0][0];
    Object.keys(t).forEach(k => {
        // This is a weird hack because sometimes elements are arrays which should not be
        if (Array.isArray(t[k])) {
            t[k] = t[k][0];
        }
    });
    // console.log(JSON.stringify(value, null, /**/'\t'));
    parsed.push(t);
}

sentences.forEach(s => extracted(s));

function sleep(n) {
    return new Promise(resolve => {
        setTimeout(resolve, n);
    })
}

const driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();


(async () => {
    try {

        await driver.get('http://ongwanada.dev11/');

        const scope = {};
        let scopeElement;
        for (let i = 0; i < parsed.length; i++) {
            const p = parsed[i];
            switch (p.type) {
                case "definition":
                    const {varName, selector} = p;
                    scope[varName] = selector;
                    break;
                case "action":
                    const {verb, article, noun} = p;
                    switch (verb) {
                        case "Click":
                            // For now you can only reference nouns by their variable names, not raw selectors
                            scopeElement = scope[noun];
                            if (!scopeElement) {
                                throw new Error(`Unknown variable ${noun}`);
                            }
                            // Tell selenium to click something, maybe do some mousing over
                            // TODO figure out if I can just put a selector in here
                            driver.actions().mouseMove(scopeElement).click().perform();
                        // await driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack\n');
                        case "Type":
                            // Send selenium something
                            for (let j = 0; j < noun.length; j++) {
                                const nounElement = noun[j];
                                await new webdriver.ActionSequence(driver)
                                    .keyDown(nounElement);
                                await new webdriver.ActionSequence(driver)
                                    .keyUp(nounElement);
                            }
                        // TODO see if the above works, I shoud be able to get to the pcs with selenium
                    }
                    break;
            }
            await sleep(1000);
        }
    } catch (e) {
        console.error(e)
        await sleep(10000)
    } finally {
        driver.close()
    }
})();
/*
parser.feed();
extracted(parser);
parser.feed("");
extracted(parser);
*/


/*
assert(value.length === 1);
*/
/*parser.feed("password is #password.");
parser.feed("password is #btn_password.");
parser.feed("Click username");
parser.feed("Click password");*/

// Now we must evaluate the AST, however everything is an Array which is unpleasent
// Nearly must have a thing for this




