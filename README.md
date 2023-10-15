# InlineCssAway

InlineCssAway is a command line tool that:

1. Takes an input html file.

2. Groups elements based on their style attribute (css rule ordering within style attribute does not matter).

3. Replaces inline styles with a generated css class for each distinct style group.

4. Outputs updated html as well as a generated style sheet for styles that were found.

# Install

```shell
npm install -g inlinecssaway@latest
```

# Arguments

1. --htmlinput /path/to/input.html

- Description: Specifies the path to the input html the program will process.

- Required: Yes

- Alias: -i


2. --htmloutput /path/to/output.html

- Description: Specifies the path to save the processed output html.

- Required: No (Defaults to `o.html`)

- Alias: -ho


3. --cssoutput /path/to/output.css

- Description: Specifies the path to save the processed output css.

- Required: No (Defaults to `o.css`)

- Alias: -co

# Usage

Process a specified input html file and output processed html and css sheet in the current working directory with default file names

```shell
$ inlinecssaway -i /path/to/input.html
o.html
o.css
```

Process a specified html input file and output processed html and css at specified locations

```shell
$ inlinecss -i /path/to/input.html -ho /path/to/output.html -co /path/to/output.css
/path/to/output.html
/path/to/output.css
```

Alternative to above using full argument names instead of aliases

```shell
$ inlinecss --htmlinput /path/to/input.html --htmloutput /path/to/output.html --cssoutput /path/to/output.css
/path/to/output.html
/path/to/output.css
```

# Example

The following input html:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test HTML</title>
</head>

<body>
    <h1 style="color: red; background-color: blue;">Header with red text and blue background!</h1>
    <p style="background-color: blue; color: red;">Paragragh with red text and blue background!</p>
    <p style="color: red; font-style: italic;">Paragraph with red italicized text.</p>
    <p style="">Paragraph with empty inline styles.</p>
</body>
</html>
```

Will have the resulting output html and css:

```html
<!DOCTYPE html>
<html lang="en"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test HTML</title>
</head>

<body>
    <h1 class="inlineAwayClass-1">Header with red text and blue background!</h1>
    <p class="inlineAwayClass-1">Paragragh with red text and blue background!</p>
    <p class="inlineAwayClass-2">Paragraph with red italicized text.</p>
    <p>Paragraph with empty inline styles.</p>

</body></html>
```

```css
.inlineAwayClass-1 { background-color: blue; color: red; }
.inlineAwayClass-2 { color: red; font-style: italic; }
```