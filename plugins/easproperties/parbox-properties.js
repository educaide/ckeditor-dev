var texCommand = "parbox";

var texProperties =
[
  ["TextAlign", "textalign"],
  ["bool", "firstindent"],
  ["Dimension", "parindent"],
  ["Dimension", "parskip"],
  ["Dimension", "spaceskip"],
  ["Dimension", "aboveskip"],
  ["Dimension", "belowskip"],
  ["uint", "abovepenalty"],
  ["uint", "belowpenalty"],
  ["LayoutMode", "mode"],
  ["HorizontalPosition", "pos"],
  ["bool?", "show"],
  ["Dimension", "height"],
  ["Dimension", "width"],
  ["Percentage", "scale"],
  ["Dimension", "lift"],
  ["BorderStyle", "border"],
  ["Dimension", "margin"],
  ["Dimension", "rulewd"],
  ["bool?", "unbox"],
  ["TeXAlign", "align"],
  ["Dimension", "fontsize"],
  ["TeXFontCode", "fontcode"],
  ["int?", "fontstep"],
  ["TeXFontStyle", "fontstyle"],
  ["LineSpacing", "linespacing"],
  ["Dimension", "baselineskip"],
  ["Dimension", "lineskip"],
  ["Dimension", "openup"],
];

var texGroups =
[
  {
    groupName: "Layout",
    props: [
      "textalign",
      "firstindent",
      "parindent",
      "parskip",
      "spaceskip",
      "aboveskip",
      "belowskip",
      "abovepenalty",
      "belowpenalty"
    ]
  },
  {
    groupName: "Box",
    props: [
      "mode",
      "pos",
      "show",
      "height",
      "width",
      "scale",
      "lift",
      "border",
      "margin",
      "rulewd",
      "unbox",
      "align"
    ]
  },
  {
    groupName: "Text",
    props: [
      "fontsize",
      "fontcode",
      "fontstep",
      "fontstyle",
      "linespacing",
      "baselineskip",
      "lineskip",
      "openup"
    ]
  }
];
