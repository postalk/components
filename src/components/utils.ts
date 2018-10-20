function escapeHTML(str: string) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}
function nl2br(str: string) {
  str = str.replace(/\r\n/g, '<br />')
  str = str.replace(/(\n|\r)/g, '<br />')
  return str
}

export { escapeHTML, nl2br }
