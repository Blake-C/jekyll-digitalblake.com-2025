#!/usr/bin/env python3
"""
Convert _posts/*.html bodies to Markdown.

Rules:
- Front matter (---) is preserved unchanged.
- <pre><code> blocks are kept as raw HTML.
- h1-h6, p, ul/ol/li, a, img, strong/em/b/i, inline <code> are converted.
- render_with_liquid: false is added automatically for posts that keep it.
"""

import os
import re
import html
from bs4 import BeautifulSoup, NavigableString, Tag

POSTS_DIR = os.path.join(os.path.dirname(__file__), "..", "_posts")

# ── HTML entity map ────────────────────────────────────────────────────────────
ENTITIES = {
    "&#8220;": "\u201c",
    "&#8221;": "\u201d",
    "&#8216;": "\u2018",
    "&#8217;": "\u2019",
    "&#8212;": "\u2014",
    "&#8211;": "\u2013",
    "&#8230;": "\u2026",
}


def decode_entities(text):
    for entity, char in ENTITIES.items():
        text = text.replace(entity, char)
    return html.unescape(text)


# ── Inline conversion ──────────────────────────────────────────────────────────


def inline(node):
    """Recursively convert a node's children to inline Markdown."""
    out = ""
    for child in node.children:
        if isinstance(child, NavigableString):
            out += str(child)
        elif isinstance(child, Tag):
            name = child.name
            inner = inline(child)
            if name == "a":
                href = child.get("href", "")
                out += f"[{inner.strip()}]({href})"
            elif name in ("strong", "b"):
                out += f"**{inner}**"
            elif name in ("em", "i"):
                out += f"*{inner}*"
            elif name == "code":
                out += f"`{inner}`"
            elif name == "br":
                out += "  \n"
            else:
                out += inner
    return out


# ── Block conversion ───────────────────────────────────────────────────────────


def convert_node(node):
    """Convert a single top-level node to a Markdown string."""
    if isinstance(node, NavigableString):
        text = str(node).strip()
        return (text + "\n\n") if text else ""

    if not isinstance(node, Tag):
        return ""

    name = node.name

    # Keep <pre><code> blocks verbatim as HTML
    if name == "pre":
        return str(node) + "\n\n"

    if name in ("h1", "h2", "h3", "h4", "h5", "h6"):
        level = int(name[1])
        text = inline(node).strip()
        return "#" * level + " " + text + "\n\n"

    if name == "p":
        # A <p> that only contains an <img> → bare image markdown
        children = [c for c in node.children if not (isinstance(c, NavigableString) and not c.strip())]
        if len(children) == 1 and isinstance(children[0], Tag) and children[0].name == "img":
            return convert_node(children[0])
        text = inline(node).strip()
        return (text + "\n\n") if text else ""

    if name == "img":
        src = node.get("src", "")
        alt = node.get("alt", "")
        return f"![{alt}]({src})\n\n"

    if name in ("ul", "ol"):
        items = []
        for i, li in enumerate(node.find_all("li", recursive=False)):
            text = inline(li).strip()
            prefix = "-" if name == "ul" else f"{i + 1}."
            # Handle nested lists inside li
            nested = li.find(["ul", "ol"])
            if nested:
                # Get li text without the nested list
                nested.extract()
                text = inline(li).strip()
                nested_md = convert_node(nested).rstrip()
                nested_indented = "\n".join("    " + l for l in nested_md.splitlines())
                items.append(f"{prefix} {text}\n{nested_indented}")
            else:
                items.append(f"{prefix} {text}")
        return "\n".join(items) + "\n\n"

    if name == "blockquote":
        inner = convert_children(node).strip()
        quoted = "\n".join("> " + l for l in inner.splitlines())
        return quoted + "\n\n"

    if name == "hr":
        return "---\n\n"

    # Transparent containers — just recurse
    if name in ("div", "section", "article", "figure", "figcaption", "span"):
        return convert_children(node)

    # Fallback: recurse into unknown elements
    return convert_children(node)


def convert_children(node):
    out = ""
    for child in node.children:
        out += convert_node(child)
    return out


# ── Front matter helpers ───────────────────────────────────────────────────────


def split_front_matter(text):
    """Return (front_matter_str, body_str) or ('', text) if no front matter."""
    if not text.startswith("---"):
        return "", text
    end = text.find("---", 3)
    if end == -1:
        return "", text
    fm = text[: end + 3]
    body = text[end + 3 :]
    return fm, body


def needs_liquid_false(front_matter):
    return "render_with_liquid: false" in front_matter


# ── Per-file conversion ────────────────────────────────────────────────────────


def convert_file(path):
    with open(path, encoding="utf-8") as f:
        raw = f.read()

    fm, body = split_front_matter(raw)

    soup = BeautifulSoup(body, "html.parser")
    md_parts = []
    for child in soup.children:
        md_parts.append(convert_node(child))

    md_body = "".join(md_parts)
    # Collapse 3+ consecutive blank lines to 2
    md_body = re.sub(r"\n{3,}", "\n\n", md_body).strip()
    md_body = decode_entities(md_body)

    result = fm + "\n\n" + md_body + "\n"

    new_path = path.replace(".html", ".md")
    with open(new_path, "w", encoding="utf-8") as f:
        f.write(result)

    os.remove(path)
    return new_path


# ── Main ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    posts = sorted(f for f in os.listdir(POSTS_DIR) if f.endswith(".html"))
    print(f"Converting {len(posts)} posts...")
    for filename in posts:
        path = os.path.join(POSTS_DIR, filename)
        new_path = convert_file(path)
        print(f"  {filename} → {os.path.basename(new_path)}")
    print("Done.")
