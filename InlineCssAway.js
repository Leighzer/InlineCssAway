const fs = require('fs');
const { JSDOM } = require('jsdom');
const minimist = require('minimist');

// args
const args = minimist(process.argv.slice(2), {
    string: ['htmlinput', 'htmloutput', 'cssoutput'],
    boolean: ['it'],
    alias: {
        'htmlinput': 'i',
        'htmloutput': 'ho',
        'cssoutput': 'co',
    },
    default: {
        'htmlinput': '',
        'htmloutput': 'o.html',
        'cssoutput': 'o.css',
        'it': false
    }
});

const inputHtmlFileName = args.htmlinput;
const outputHtmlFileName = args.htmloutput;
const outputCssFileName = args.htmloutput;
const interactiveMode = false; // args.it - perhaps down the road we iterate over found style groups, and let user name them on the spot

// arg validations
if (!inputHtmlFileName) {
    console.error('Please provide the input HTML file as an argument.');
    process.exit(1);
}

// load input file
const inputHtml = fs.readFileSync(inputHtmlFileName, 'utf-8');

// parse input file into jquery
const { window } = new JSDOM(inputHtml);
const $ = require('jquery')(window);

// for every element with a style attribute
const styleAttributeGroups = {};
let classCounter = 1;
$('[style]').each(function () {
    // normalize style attribute (order rules alphabetically etc.)
    // so that style="color:red;background-color:blue;" is seen as same as style="background-color:blue;color:red;"

    const styleAttributeString = $(this).attr('style');
    if (!styleAttributeString) {
        // if element has a falsey style attr - remove styl attr immediately, we don't want to generate classes for it
        $(this).removeAttr('style');
    }
    else {
        const normalizedStyleAttributeString = normalizeStyle(styleAttributeString);

        // put the element into a group of elements that have an equivalent style
        if (normalizedStyleAttributeString in styleAttributeGroups) {
            styleAttributeGroups[normalizedStyleAttributeString].push(this);
        } else {
            styleAttributeGroups[normalizedStyleAttributeString] = [this];
        }
    }
});

const styleAttrbiuteStringToCssClass = {};
// for each style attr grouping
Object.keys(styleAttributeGroups).forEach(styleAttributeString => {
    // generate a class name for the style group
    const className = `inlineAwayClass-${classCounter}`;
    classCounter++;
    // process the elements
    styleAttributeGroups[styleAttributeString].forEach(element => {
        // give them a class name for the style group
        // remove their style attribute
        $(element).addClass(className).removeAttr('style');
    });

    // save the class name for the style block - we'll output that later
    styleAttrbiuteStringToCssClass[styleAttributeString] = className;
});

console.log('Modified HTML:');
const node = window.document.doctype;
const html = "<!DOCTYPE "
    + node.name
    + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
    + (!node.publicId && node.systemId ? ' SYSTEM' : '')
    + (node.systemId ? ' "' + node.systemId + '"' : '')
    + '>';
console.log(html);
console.log($("html").prop('outerHTML'));
console.log('\nGenerated CSS classes:');
Object.keys(styleAttrbiuteStringToCssClass).forEach(styleAttributeString => {
    console.log(`.${styleAttrbiuteStringToCssClass[styleAttributeString]} { ${styleAttributeString} }`);
});

// helper functions
function normalizeStyle(style) {
    return style.split(';')
        .map(prop => prop.trim())
        .filter(prop => prop) // Remove empty strings after trimming
        .sort()
        .join('; ') + ';';
}