const notionColorResolver = (color: string) => {
  switch (color) {
    case "grey":
      return "#BDD0DA";
    case "brown":
      return "#CEBBB4";
    case "orange":
      return "#F0C886";
    case "yellow":
      return "#F6E291";
    case "green":
      return "#B3D2B4";
    case "blue":
      return "#97C9F0";
    case "purple":
      return "#CFA2D8";
    case "pink":
      return "#EB94B2";
    case "red":
      return "#F08078";
    default:
      return "#333";
  }
}

export default notionColorResolver;