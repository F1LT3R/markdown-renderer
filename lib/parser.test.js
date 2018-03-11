import path from 'path'
import test from 'ava'

import parser from './parser'

test('loadFile: throws non-existent file', async t => {
	await t.throws(parser.loadFile('non-existent.md'))
})

test('loadFile: loads file contents', async t => {
	const filepath = path.join(__dirname, 'mock', 'heading-1.md')
	const contents = await parser.loadFile(filepath)
	t.is(contents, '# Heading 1')
})

test('parse: trims leading whitespace', t => {
	const html = parser.parse('   # heading 1\n   ## heading 2')
	t.is(html, '<h1>heading 1</h1>\n<h2>heading 2</h2>')
})

test('parse: should render mixed markdown and html', t => {
	const html = parser.parse('# Heading 1\n<div>This is not markdown.</div>\n## Heading 2')
	t.is(html, '<h1>Heading 1</h1>\n<div>This is not markdown.</div>\n<h2>Heading 2</h2>')
})

test('parse: lines w/o leading html or md chars are <p>\'s', t => {
	const html = parser.parse('# Heading 1\nThis is a paragraph.\n## Heading 2')
	t.is(html, '<h1>Heading 1</h1>\n<p>This is a paragraph.</p>\n<h2>Heading 2</h2>')
})

// Headings

test('syntax.h1: "# h1" to <h1>h1<h1>', t => {
	const html = parser.syntaxRenderers.h1('# h1')
	t.is(html, '<h1>h1</h1>')
})

test('syntax.h1: "#          h1" to <h1>h1<h1>', t => {
	const html = parser.syntaxRenderers.h1('#          h1')
	t.is(html, '<h1>h1</h1>')
})

test('syntax.h2: "## h2" to <h2>H2<h2>', t => {
	const html = parser.syntaxRenderers.h2('## H2')
	t.is(html, '<h2>H2</h2>')
})

test('syntax.h2: "##          h2" to <h2>h2<h2>', t => {
	const html = parser.syntaxRenderers.h2('##          h2')
	t.is(html, '<h2>h2</h2>')
})

test('syntax.h3: "### h3" to <h3>h3<h3>', t => {
	const html = parser.syntaxRenderers.h3('### h3')
	t.is(html, '<h3>h3</h3>')
})

test('syntax.h3: "###          h3" to <h3>h3<h3>', t => {
	const html = parser.syntaxRenderers.h3('###          h3')
	t.is(html, '<h3>h3</h3>')
})

test('syntax.h4: "#### h4" to <h4>h4<h4>', t => {
	const html = parser.syntaxRenderers.h4('#### h4')
	t.is(html, '<h4>h4</h4>')
})

test('syntax.h4: "####          h4" to <h4>h4<h4>', t => {
	const html = parser.syntaxRenderers.h4('####          h4')
	t.is(html, '<h4>h4</h4>')
})

test('syntax.h5: "##### h5" to <h5>h5<h5>', t => {
	const html = parser.syntaxRenderers.h5('##### h5')
	t.is(html, '<h5>h5</h5>')
})

test('syntax.h5: "#####          h5" to <h5>h5<h5>', t => {
	const html = parser.syntaxRenderers.h5('#####          h5')
	t.is(html, '<h5>h5</h5>')
})

test('syntax.h6: "###### h6" to <h6>h6<h6>', t => {
	const html = parser.syntaxRenderers.h6('###### h6')
	t.is(html, '<h6>h6</h6>')
})

test('syntax.h6: "######          h6" to <h6>h6<h6>', t => {
	const html = parser.syntaxRenderers.h6('######          h6')
	t.is(html, '<h6>h6</h6>')
})

test('syntax.h1-6 renderes all correct html headings', t => {
	const html = parser.parse('# h1\n## h2\n### h3\n#### h4\n##### h5\n###### h6')
	t.is(html, '<h1>h1</h1>\n<h2>h2</h2>\n<h3>h3</h3>\n<h4>h4</h4>\n<h5>h5</h5>\n<h6>h6</h6>')
})
