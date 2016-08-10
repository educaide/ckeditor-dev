var texCommand = "figure";

var texProperties =
[
  ["choice", "pos"],
  ["int?", "scale"],
  ["bool", "tracking"],
  ["choice", "align"],
  ["Dimension", "lift"],
  ["Dimension", "width"],
  ["choice", "border"],
  ["Dimension", "margin"],
  ["Dimension", "rulewd"],
  ["bool", "upcase"],
  ["int?", "gamma"],
  ["choice", "ftype"]
];

var texGroups =
[
  {
    groupName: "All",
    props: [
      "pos",
      "scale",
      "tracking",
      "align",
      "lift",
      "width",
      "border",
      "margin",
      "rulewd",
      "upcase",
      "gamma",
      "ftype"
    ]
  }
];

var texChoices =
{
  pos:    [ "none", "above", "below", "right", "manual", "optimized", "beginning", "end", "left" ],
  align:  [ "normal", "bottom", "top", "center" ],
  border: [ "none", "single", "double", "shadow", "thick" ],
  ftype:  [ "PNG", "JPG", "PDF" ]
};
