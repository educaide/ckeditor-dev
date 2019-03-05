texProperties.push(
["Dimension", "parindent"],
["Dimension", "leftskip"],
["Dimension", "rightskip"],
["bool?", "firstindent"],
["Dimension", "parskip"],
["Dimension", "spaceskip"],
["choice", "linespacing"],
["Dimension", "baselineskip"],
["Dimension", "lineskip"],
["Dimension", "openup"],
["choice", "fontcode"],
["Dimension", "maxfont"],
["Dimension", "fontsize"],
["int?", "fontstep"],
["choice", "fontstyle"]);

texGroups.push({
  groupName: "Font",
  props: [
    "parindent",
    "leftskip",
    "rightskip",
    "firstindent",
    "parskip",
    "spaceskip",
    "linespacing",
    "baselineskip",
    "lineskip",
    "openup",
    "fontcode",
    "maxfont",
    "fontsize",
    "fontstep",
    "fontstyle"
  ]
});

texChoices["linespacing"] = [ "normal", "tight", "verytight", "loose", "veryloose", "double" ];
texChoices["fontcode"]    = [ "cm", "tm", "hv", "cn", "ch", "ft" ];
texChoices["fontstyle"]   = [ "normal", "bold", "italic", "bolditalic", "alternate" ];
