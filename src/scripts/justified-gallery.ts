import { Lightbox } from "lightbox3";

const sheet = new CSSStyleSheet();
sheet.replaceSync(/* css */ `
  justified-gallery {
    display: flex;
    flex-wrap: wrap;
    list-style: none;
    padding: 0;
    margin: 0;

    > li {
      flex: none;
      overflow: hidden;

      a {
        display: block;
        height: 100%;
      }

      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
    }
  }
`);

class JustifiedGallery extends HTMLElement {
  #observer: ResizeObserver | null = null;

  connectedCallback() {
    if (!document.adoptedStyleSheets.includes(sheet)) {
      document.adoptedStyleSheets.push(sheet);
    }
    this.#observer = new ResizeObserver(() => this.#justify());
    this.#observer.observe(this);
    Lightbox.init();
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
  }

  #justify() {
    const items = Array.from(
      this.querySelectorAll<HTMLElement>(":scope > li[data-ratio]")
    );
    if (!items.length) return;

    const style = getComputedStyle(this);
    const containerWidth = this.getBoundingClientRect().width;
    const gap = parseFloat(style.columnGap) || 0;
    const targetHeight =
      parseFloat(style.getPropertyValue("--gallery-row-height")) || 350;

    // Group items into rows greedily
    const rows: HTMLElement[][] = [];
    let row: HTMLElement[] = [];
    let rowRatioSum = 0;

    for (const item of items) {
      const ratio = parseFloat(item.dataset.ratio!);
      const projectedHeight =
        (containerWidth - gap * row.length) / (rowRatioSum + ratio);

      if (row.length > 0 && projectedHeight < targetHeight * 0.75) {
        rows.push(row);
        row = [];
        rowRatioSum = 0;
      }

      row.push(item);
      rowRatioSum += ratio;
    }
    if (row.length) rows.push(row);

    // Size each row to fill the container width exactly
    for (const rowItems of rows) {
      const ratioSum = rowItems.reduce(
        (s, el) => s + parseFloat(el.dataset.ratio!),
        0
      );
      const availableWidth = containerWidth - gap * (rowItems.length - 1);
      const rowHeight = availableWidth / ratioSum;
      let distributed = 0;

      rowItems.forEach((item, j) => {
        const ratio = parseFloat(item.dataset.ratio!);
        const isLast = j === rowItems.length - 1;
        const w = isLast
          ? availableWidth - distributed
          : Math.floor(ratio * rowHeight);
        distributed += w;
        item.style.width = `${w}px`;
        item.style.height = `${rowHeight}px`;
      });
    }
  }
}

customElements.define("justified-gallery", JustifiedGallery);
