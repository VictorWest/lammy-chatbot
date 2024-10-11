export function formatBoldText(input) {
    // Regular expression to match text between hashes
    return input.replace(/#(.*?)#/g, '<strong>$1</strong>');
}

export function escapeHtml(input) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

export function formatParagraphs(input) {
    // Replace double newlines with <p> tags (new paragraph)
    let formatted = input.replace(/\n\n+/g, '</p><p>');
  
    // Replace single newlines with <br> tags (line breaks within a paragraph)
    formatted = formatted.replace(/\n/g, '<br>');
  
    // Wrap the entire content in <p> tags
    return `<p>${formatted}</p>`;
}
