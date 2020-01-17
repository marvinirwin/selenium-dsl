const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


const nearley = require("nearley");
const grammar = require("./lang/grammar.js");


// Let's assume the
const sentences = [
    '',
    'neuroIncidentTab is div.skinny-tabs-subheader > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(19) > td:nth-child(2) > a:nth-child(1).',
    'monitoringTab is tr.list-status-1\;:nth-child(9) > td:nth-child(1) > a:nth-child(1).',
    'featureInstallTab is .pbtab-active > a:nth-child(1).',
    'ecrConfigButton is #cr-app-menu > li:nth-child(6) > a:nth-child(1).',
    'pancakeMenu is #cr-nav-button.',
    'usernameInput is #fakelogin.',
    'passwordInput is #fakepassword.',
    'enterPortalButton is #login-button.',
    'ecrSelect is #application_id.',
    'pcsOption is #application_id > option:nth-child(13).', // this one is only for ongwanada
    'goButton is .disciplinetext > table:nth-child(7) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > button:nth-child(1).',
    'Click the usernameInput.',
    `Type this ${process.env.DEV_USERNAME}.`,
    'Click the passwordInput.',
    `Type this ${process.env.DEV_PASSWORD}.`,
    `Click the enterPortalButton.`,
    'Click the ecrSelect.',
    'Click the pcsOption.',
    'Click the goButton.',
    'Click the pancakeMenu.',
    'Click the ecrConfigButton',
    'Click the featureInstallTab',
    'Click the monitoringTab',
    'Click the neuroIncidentTab',
    // State Assumptions: Assuming monitoring is already installed
    // State Assumptions: io does not have the requisite monitors for NI
    // Attempt to add io, make sure it fails
    // State Assumptions: res does have the requisite monitors for NI
    // Attempt to add res, make sure it succeeds
    // Then head off to res go to the monitoring tab of the first client we see
    // State assumption: This client does not have any unfinished Neuro Series' at the time we choose
    // Go back one year, exactly and pick that date for the neuro incident, make it not a start, Fill in the rest of the fields
    // It should error because there is no incident in progress
    // Do the same as above, except click it to be a new incident
    // It should work



    // TODO add io and then it tells me
    // TODO add res

    // Now we're in the pcs what now?
    // We assume the state is that nobody has neurological incidents?
    // No, we'll assume a specific ecr does not have it, and then just go with another ECR

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
    parsed.push({...t, sentence});
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
            console.info(p.sentence);
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
                            const e = await driver.findElement(webdriver.By.css(scopeElement));
                            e.click();
                            break;
                        case "Type":
                            // TODO this is a terrible hack, but it will work for now
                            const el = await driver.findElement(webdriver.By.css(scopeElement));
                            await el.sendKeys(noun);
                            break;
                            // Send selenium something
/*
                            for (let j = 0; j < noun.length; j++) {
                                const nounElement = noun[j];
                                await new webdriver.ActionSequence(driver)
                                    .keyDown(nounElement);
                                await new webdriver.ActionSequence(driver)
                                    .keyUp(nounElement);
                            }
*/
                        // TODO see if the above works, I shoud be able to get to the pcs with selenium
                    }
                    await sleep(2000);
                    break;
            }
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




