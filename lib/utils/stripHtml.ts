export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  let text = html.replace(/<[^>]*>?/gm, " ");

  const entities: { [key: string]: string } = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  text = text.replace(/&[a-zA-Z0-9#]+;/g, (match) => entities[match] || match);

  return text.replace(/\s+/g, " ").trim();
}