var texCommand = "wall";

var texProperties = 
[
// commented here are supported in the gui.
  ["Percentage", "scale"],
//  ["BorderStyle", "border"],
  ["Dimension", "margin"],
  ["Dimension", "rulewd"],
  ["Dimension", "lift"],
  ["TeXAlign", "align"],
  ["Dimension", "spaceskip"],
  ["bool?", "firstindent"],
  ["Dimension", "parindent"],
  ["Dimension", "parskip"],
//  ["HorizontalPosition", "pos"],
  ["uint?", "abovepenalty"],
  ["uint?", "belowpenalty"],
  ["Dimension", "aboveskip"],
  ["Dimension", "belowskip"],
  ["Dimension", "colsep"],
  ["Dimension", "rowsep"],
  ["Dimension", "rowht"],
  ["Dimension", "colwd"],
//  ["TableBorder", "vrule"],
//  ["TableBorder", "hrule"],
  ["TableColAlign", "colalign"],
  ["LineSpacing", "rowspacing"],
  ["Text", "style"],
//  ["TableHeader", "header"],
//  ["int?", "headerfontstep"],
//  ["TeXFontStyle", "headerfontstyle"]
//  ["bool?", "headershading"]
  ["Dimension", "fontsize"],
  ["TeXFontCode", "fontcode"],
  ["int?", "fontstep"],
  ["TeXFontStyle", "fontstyle"],
  ["LineSpacing", "linespacing"],
  ["Dimension", "baselineskip"],
  ["Dimension", "lineskip"],
  ["Dimension", "openup"]
];

var texGroups =
[
  {
    groupName: "Ungrouped",
    props: [
      "scale",
//      "border",
      "margin",
      "rulewd",
      "lift",
      "align",
      "spaceskip",
      "firstindent",
      "parindent",
      "parskip",
//      "pos",
      "abovepenalty",
      "belowpenalty",
      "aboveskip",
      "belowskip",
      "colsep",
      "rowsep",
      "rowht",
      "colwd",
//      "vrule",
//      "hrule",
      "colalign",
      "rowspacing",
      "style"
//      "header",
//      "headerfontstep",
//      "headerfontstyle",
//      "headershading",
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
