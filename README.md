# Markplus

> Partial GFM Markdown renderer with built-in syntax highlighting

## Installation

```shell
npm install markplus
```

## Render

Renders a string of Markdown content.

```javascript
const markplus = require('markplus')
const html = markplus.render('# Heading 1')
// html = '<h1>Heading 1</h1>'
```

## Settings

Settings is the second argument passed to the Markdown renderer.

Settings is a JavaScript object.

```javascript
const content = '## Heading 1'

const settings = {
	// Your settings here
}

const html = markplus(content, settings)
```


## Render From

Start the rendering from a specific from-point.

The from-point is defined by markdown syntax, eg: `## Heading 2`.

The start-point is located via a regex string search. Thefore only part of Markdown content is processed internally. This is to increase performance.

```javascript
const html = markplus.render(content, {
	from: '## Heading 2'
})
```

Example:

```javascript
const markplus = require('markplus')

const content = '
	# Heading 1
	> Block quote
	## Heading 2
	This is a paragraph.
'

const html = markplus.render('## Heading 2', {
	from: '## Heading 2'
})
```

Output:

```html
<h2>Heading 2</h1>
<p>This is a paragraph.</p>
```

## Render To

End the rendering before a specific to-point.

The to-point is defined by markdown syntax, eg: `## Heading 2`.

Important: The renderer outputs content **before** the to-point, but does not include the to-point itself.

The to-point is located via a regex string search. Thefore only part of Markdown content is processed internally. This is to increase performance.

```javascript
const html = markplus.render(content, {
	to: '## Heading 2'
})
```

Example:

```javascript
const markplus = require('markplus')

const content = '
	# Heading 1
	> Block quote
	## Heading 2
	This is a paragraph.
'

const html = markplus.render('## Heading 2', {
	to: '## Heading 2'
})
```

Output:

```html
<h1>Heading 2</h1>
<p>This is a paragraph.</p>
```
