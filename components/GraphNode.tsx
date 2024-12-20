import { type Node } from "./types";

const getNodeColor = (node: Node) => {
  switch (node.type) {
    case "指標":
      return "#60A5FA"; // Sky blue
    case "因素":
      return "#F472B6"; // Pink
    case "策略":
      return "#34D399"; // Emerald
    default:
      return "#9CA3AF"; // Gray
  }
};

export const renderNode = (
  node: Node,
  ctx: CanvasRenderingContext2D,
  globalScale: number
) => {
  const label = node.name;
  const fontSize = 12 / globalScale;
  ctx.font = `bold ${fontSize}px Sans-Serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = getNodeColor(node);
  ctx.beginPath();
  ctx.arc(node.x || 0, node.y || 0, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 0;
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fillText(label, node.x || 0, node.y || 0);
};
