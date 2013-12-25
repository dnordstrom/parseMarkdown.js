/**
 * Tiny Markdown parser based on Mathieu Henri's mmd.js,
 * with clarified code, and added syntax (such as underbar emphasis)
 * and features (such asescapable characters).
 *
 * @see https://github.com/p01/mmd.js
 * @param {String} source - Markdown source to parse into HTML
 * @returns {String} HTML output
 */
!function parseMarkdown(source) {
  var output = ''

  /**
   * Escape HTML using option element.
   *
   * @param {String} source - HTML to escape
   * @returns {String} Escaped HTML
   */
  function escape(source) {
    return new Option(source).innerHTML
  }
  
  /**
   * Parsing of inline elements.
   *
   * @param {String} source - String to parse
   * @returns {String} HTML output
   */
  function inlineEscape(source) {
    return escape(source)
      .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">')
      .replace(/\[([^\]]+)]\(([^(]+)\)/g, '$1'.link('$2'))
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/__([^*]+)__/g, '<strong>$1</strong>')
      .replace(/_([^*]+)_/g, '<em>$1</em>')
      .replace(/---/g, '&mdash;')
      .replace(/--/g, '&ndash;')
  }

  /** Characters escapable with backslash, and replacement values */
  var escapableCharacters = {
    '*': 'ASTERISK',
    '_': 'UNDERBAR'
  }

  /**
   * Substitute escaped characters with string to prevent them from * being parsed.
   *
   * @param {String} source - String with escaped characters
   * @returns {String} String with substituted characters
   */
  function replaceEscapableCharacters(source) {
    for (var key in escapableCharacters) {
      if (escapableCharacters.hasOwnProperty(key)) {
        source = source.replace(
          new RegExp('\\\\\\' + key, 'g'),
          '{' + escapableCharacters[key] + '}'
        )
      }
    }

    return source
  }

  /**
   * Place escaped characters back after parsing.
   *
   * @param {String} source - String with substituted characters
   * @returns {String} String with escaped characters
   */
  function unreplaceEscapableCharacters(source) {
    for (var key in escapableCharacters) {
      if (escapableCharacters.hasOwnProperty(key)) {
        source = source.replace(
          new RegExp('{' + escapableCharacters[key] + '}', 'g'),
          key
        )
      }
    }

    return source
  }

  /* Parse */
  replaceEscapableCharacters(source)
    .replace(/^\s+|\r|\s+$/g, '')
    .replace(/\t/g, '    ')
    .split(/\n\n+/)
    .forEach(function(b, f, R) {
      f = b[0]
      R = {
        '*': [/\n\* /, '<ul><li>', '</li></ul>'],
        '1': [/\n[1-9]\d*\.? /, '<ol><li>', '</li></ol>'],
        ' ': [/\n    /, '<pre><code>', '</pre></code>', '\n'],
        '>': [/\n> /, '<blockquote>', '</blockquote>', '\n']
      }[f]
      output += R ? R[1] + ('\n' + b)
        .split(R[0])
        .slice(1)
        .map(R[3] ? escape : inlineEscape)
        .join(R[3] || '</li>\n<li>') + R[2] :
        f == '#' ? '<h' + (f = b.indexOf(' ')) + '>' + inlineEscape(b.slice(f + 1)) + '</h' + f + '>' :
        f == '<' ? b : '<p>' + inlineEscape(b) + '</p>'
    })

  return unreplaceEscapableCharacters(output)
}