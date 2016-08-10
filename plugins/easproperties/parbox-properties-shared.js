texProperties.push(
["choice", "mode"],
["bool?", "autosize"],
["Dimension", "width"],
["Dimension", "height"],
["int?", "scale"],
["Dimension", "lift"],
["choice", "align"],
["choice", "border"],
["Dimension", "margin"],
["Dimension", "rulewd"],
["color", "fontcolor"],
["color", "background"],
["color", "rulecolor"],
["string", "vendorstyle"]);

texGroups.push({
  groupName: "Parbox shared",
  props: [
    "mode",
    "autosize",
    "width",
    "height",
    "scale",
    "lift",
    "align",
    "border",
    "margin",
    "rulewd",
    "fontcolor",
    "background",
    "rulecolor",
    "vendorstyle"
  ]
});

texChoices["mode"]   = [ "horiz", "vert", "wrap" ];
texChoices["align"]  = [ "none", "bottom", "top", "center" ];
texChoices["border"] = [ "none", "single", "double", "shadow", "thick" ];
