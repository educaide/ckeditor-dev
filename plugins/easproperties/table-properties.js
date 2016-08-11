var texCommand = "wall";

var texProperties =
[
  ["choice","pos"],
  ["string","cols"],
  ["choice","vrule"],
  ["choice","hrule"],
  ["Dimension","colsep"],
  ["Dimension","rowsep"],
  ["Dimension","rowht"],
  ["choice","rowspacing"],
  ["string","colwd"],
  ["string","colalign"],
  ["choice","style"],
  ["bool?","xfig"],
  ["choice","header"],
  ["int?","headerfontstep"],
  ["choice","headerfontstyle"],
  ["bool?","headershading"],
  ["color","headercolor"]
];

var texChoices =
{
        pos:             [ "none", "left", "center", "right", "indent" ],
        vrule:           [ "none", "first", "inner", "all" ],
        hrule:           [ "none", "first", "inner", "all" ],
        rowspacing:      [ "normal", "tight", "verytight", "loose", "veryloose", "double" ],
        style:           [ "none", "stemleaf", "dotplot", "pictograph", "quantc", "proof", "prooffill", "lftitle", "speaker" ],
        header:          [ "none", "col", "row", "both" ],
        headerfontstyle: [ "normal", "bold", "italic", "bolditalic", "alternate" ]
};

var texGroups =
[
  {
    groupName: "Table",
    props: [
      "pos",
      "cols",
      "vrule",
      "hrule",
      "colsep",
      "rowsep",
      "rowht",
      "rowspacing",
      "colwd",
      "colalign",
      "style",
      "xfig",
      "header",
      "headerfontstep",
      "headerfontstyle",
      "headershading",
      "headercolor"
    ]
  }
];

