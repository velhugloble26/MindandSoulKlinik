import sanitizeHtml from "sanitize-html";

const blogContentOptions = {
  allowedTags: [
    "a",
    "blockquote",
    "br",
    "h1",
    "h2",
    "h3",
    "h4",
    "li",
    "ol",
    "p",
    "pre",
    "s",
    "strong",
    "em",
    "u",
    "ul",
  ],
  allowedAttributes: {
    a: ["href", "name", "target", "rel"],
    li: ["data-list"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      target: "_blank",
      rel: "noopener noreferrer",
    }),
  },
};

export default function sanitizeBlogContent(content) {
  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return sanitizeHtml(content).replace(/\r?\n/g, "<br>");
  }
  return sanitizeHtml(content, blogContentOptions);
}
