import { visit } from "unist-util-visit";

const YOUTUBE_REGEX =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})(?:[?&].*)?$/;

function extractVideoId(url) {
  const match = url.trim().match(YOUTUBE_REGEX);
  return match ? match[1] : null;
}

export default function rehypeYoutubePlyr() {
  return function (tree) {
    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "p" || !parent) return;

      let videoId = null;

      // Bare URL as plain text: <p>https://youtu.be/...</p>
      if (node.children.length === 1 && node.children[0].type === "text") {
        videoId = extractVideoId(node.children[0].value);
      }

      // Auto-linked URL (remark auto-link): <p><a href="...">...</a></p>
      if (
        !videoId &&
        node.children.length === 1 &&
        node.children[0].type === "element" &&
        node.children[0].tagName === "a"
      ) {
        const href = node.children[0].properties?.href ?? "";
        videoId = extractVideoId(href);
      }

      if (!videoId) return;

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          "data-plyr-provider": "youtube",
          "data-plyr-embed-id": videoId,
        },
        children: [],
      };
    });
  };
}
