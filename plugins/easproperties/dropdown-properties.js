var texProperties =
[
  ["choice", "style"],
  ["choice", "align"],
  ["Dimension", "lift"],
  ["Dimension", "rulewd"],
  ["Dimension", "width"],
  ["Dimension", "xmargin"],
  ["Dimension", "ymargin"],
  ["Dimension", "aboveskip"],
  ["Dimension", "belowskip"],
  ["color", "rulecolor"],
  ["color", "fontcolor"],
  ["color_background", "background"],
  ["choice", "linespacing"],
  ["Dimension", "baselineskip"],
  ["Dimension", "lineskip"],
  ["Dimension", "openup"],
  ["choice", "fontcode"],
  ["Dimension", "fontsize"],
  ["int?", "fontstep"],
  ["choice", "fontstyle"],
  ["Dimension", "maxfont"],
];

var texChoices =
{
  style: [ "menu", "belowline", "belowbox", "line", "box"],
  align: [ "left", "center", "right"],
  linespacing: [ "normal", "tight", "verytight", "loose", "veryloose", "double" ],
  fontcode: [ "cm", "tm", "hv", "cn", "ch", "ft" ],
  fontstyle: [ "normal", "bold", "italic", "bolditalic", "alternate" ],
};

var texGroups =
[
  {
    groupName: "dropdown",
    props: [
      "style",
      "align",
      "lift",
      "rulewd",
      "width",
      "xmargin",
      "ymargin",
      "aboveskip",
      "belowskip",
      "rulecolor",
      "fontcolor",
      "background",
      "linespacing",
      "baselineskip",
      "lineskip",
      "openup",
      "fontcode",
      "fontsize",
      "fontstep",
      "fontstyle",
      "maxfont",
    ]
  }
];
