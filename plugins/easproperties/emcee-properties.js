var texCommand = "emcee";

var texProperties =
[
  ["EmceeLayout", "layout"],
  ["EmceeOrder", "order"],
  ["Dimension", "groupskip"],
  ["Dimension", "choiceskip"],
  ["TeXAlign", "align"],
  ["bool?", "scrambling"],
  ["bool?", "hiding"],
  ["bool?", "insertright"],
  ["TeXFontCode", "fontcode"],
  ["int", "fontstep"],
  ["Dimension", "fontsize"],
  ["LayoutMode", "mode"],
  ["Dimension", "width"],
  ["Dimension", "height"],
  ["Percentage", "scale"],
  ["BorderStyle", "border"],
  ["Dimension", "margin"],
  ["Dimension", "rulewd"],
  ["Dimension", "lift"],
  ["Dimension", "spaceskip"],
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
    groupName: "Ungrouped",
    props: [
      "layout",
      "order",
      "groupskip",
      "choiceskip",
      "align",
      "scrambling",
      "hiding",
      "insertright",
      "fontcode",
      "fontstep",
      "fontsize",
      "mode",
      "width",
      "height",
      "scale",
      "border",
      "margin",
      "rulewd",
      "lift",
      "spaceskip"
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
