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
  ["uint?","headerrows"],
  ["int?","headerfontstep"],
  ["choice","headerfontstyle"],
  ["choice","headeralign"],
  ["choice","topleft"],
  ["bool?","headershading"],
  ["color_background","headercolor"]
];

var texChoices =
{
        pos:             [ "none", "left", "center", "right", "indent" ],
        vrule:           [ "none", "first", "inner", "all" ],
        hrule:           [ "none", "first", "inner", "all" ],
        rowspacing:      [ "normal", "tight", "verytight", "loose", "veryloose", "double" ],
        style:           [ "none", "stemleaf", "dotplot", "pictograph", "quantc", "proof", "prooffill", "lftitle", "speaker", "coefficients", "correlations", "colmatch", "connect", "blanklabels" ],
        header:          [ "none", "col", "row", "both" ],
        headeralign:     [ "top", "center", "bottom" ],
        headerfontstyle: [ "normal", "bold", "italic", "bolditalic", "alternate" ],
        topleft:         [ "normal", "shade", "hide" ]
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
      "headerrows",
      "headeralign",
      "headerfontstep",
      "headerfontstyle",
      "headershading",
      "headercolor",
      "topleft"
    ]
  }
];
