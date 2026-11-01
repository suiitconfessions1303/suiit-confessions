/* Draws confession cards on a canvas and downloads them as HD PNGs.
   Layout, colors and font match the Confession Card Maker. */

const W = 1084;
const H = 656;
const PAD = 72;
const SCALE = 3; // 3x = 3252 x 1968 px (HD). Use 2 for smaller files.
const FONT =
  'Roboto,"Segoe UI","Noto Color Emoji","Segoe UI Emoji","Apple Color Emoji",system-ui,Arial,sans-serif';
const BODY = 42;
const LINE_HEIGHT = 64;
const HEAD = 26;
const HEAD_Y = 94;
const BODY_Y = 180;
const HEADER_NAME = "Anonymous";

const pad = (n) => String(n).padStart(2, "0");

/* "2026-10-18 14:32:09" from the confession's submitted time */
function formatStamp(value) {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) return "Date unavailable";
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  text.split(/\r?\n/).forEach((paragraph) => {
    if (!paragraph.trim()) {
      lines.push("");
      return;
    }
    let line = "";
    paragraph
      .split(/\s+/)
      .filter(Boolean)
      .forEach((word) => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width <= maxWidth) {
          line = test;
          return;
        }
        if (line) lines.push(line);
        // Break very long words that don't fit on one line
        while (ctx.measureText(word).width > maxWidth) {
          let i = word.length;
          while (i > 1 && ctx.measureText(word.slice(0, i)).width > maxWidth) i--;
          lines.push(word.slice(0, i));
          word = word.slice(i);
        }
        line = word;
      });
    lines.push(line);
  });
  return lines;
}

/* Splits the message into pages that fit one card each */
function paginate(message) {
  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `700 ${BODY}px ${FONT}`;

  const lines = wrapText(measure, (message || "").trim(), W - PAD * 2);
  const perCard = Math.max(1, Math.floor((H - PAD - BODY_Y) / LINE_HEIGHT) + 1);

  const pages = [];
  for (let i = 0; i < lines.length; i += perCard) {
    const chunk = lines.slice(i, i + perCard);
    while (chunk.length && chunk[0] === "") chunk.shift();
    while (chunk.length && chunk[chunk.length - 1] === "") chunk.pop();
    if (chunk.length) pages.push(chunk);
  }
  return pages.length ? pages : [[""]];
}

function paintCard(lines, stamp, index, total) {
  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;

  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);
  ctx.imageSmoothingQuality = "high";

  // Background
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgb(62,29,79)");
  g.addColorStop(0.27, "rgb(33,18,45)");
  g.addColorStop(0.5, "rgb(27,15,40)");
  g.addColorStop(0.73, "rgb(14,10,22)");
  g.addColorStop(1, "rgb(8,7,12)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Header
  ctx.textBaseline = "alphabetic";
  ctx.font = `700 ${HEAD}px ${FONT}`;
  ctx.fillStyle = "#a08fb0";
  ctx.fillText(`${HEADER_NAME} \u00B7 ${stamp}`, PAD, HEAD_Y);
  if (total > 1) {
    ctx.textAlign = "right";
    ctx.fillText(`${index + 1} / ${total}`, W - PAD, HEAD_Y);
    ctx.textAlign = "left";
  }

  // Message
  ctx.font = `700 ${BODY}px ${FONT}`;
  ctx.fillStyle = "#ffffff";
  lines.forEach((line, i) => ctx.fillText(line, PAD, BODY_Y + i * LINE_HEIGHT));

  return canvas;
}

const toBlob = (canvas) =>
  new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export failed"))), "image/png"),
  );

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* Downloads one PNG per card. Returns the number of cards created. */
export async function downloadConfessionCards(item) {
  // Make sure Roboto Bold is ready before drawing, or the canvas falls back to another font
  try {
    await document.fonts.load(`700 ${BODY}px Roboto`);
  } catch {
    /* continue with fallback fonts */
  }

  const stamp = formatStamp(item.submittedAt);
  const pages = paginate(item.message);
  const base = `confession-${stamp.replace(/[: ]/g, "-")}`;

  for (let i = 0; i < pages.length; i++) {
    const canvas = paintCard(pages[i], stamp, i, pages.length);
    const blob = await toBlob(canvas);
    saveBlob(blob, pages.length > 1 ? `${base}-${i + 1}.png` : `${base}.png`);
    if (i < pages.length - 1) await wait(400); // lets the browser accept multiple downloads
  }
  return pages.length;
}