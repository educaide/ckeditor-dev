texProperties.push(
["choice", "mode"],
["bool?", "autosize"],
["Dimension", "width"],
["Dimension", "height"],
["uint?", "scale"],
["Dimension", "lift"],
["choice", "align"],
["choice", "border"],
["Dimension", "margin"],
["Dimension", "rulewd"],
["color", "fontcolor"],
["color", "rulecolor"],
["color_background", "background"],
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
    "rulecolor",
    "background",
    "vendorstyle"
  ]
});

texChoices["mode"]   = [ "horiz", "vert", "wrap" ];
texChoices["align"]  = [ "none", "bottom", "top", "center" ];
texChoices["border"] = [ "none", "single", "double", "shadow", "thick" ];
