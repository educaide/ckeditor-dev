var texCommand = "parbox";

var texProperties =
[
  ["choice", "textalign"],
  ["Dimension", "aboveskip"],
  ["Dimension", "belowskip"],
  ["uint?", "abovepenalty"],
  ["uint?", "belowpenalty"],
  ["choice", "pos"],
  ["choice", "label"],
  ["choice", "labelfontstyle"],
  ["choice", "labelpos"],
  ["bool?", "show"],
  ["bool?", "unbox"],
];

var texChoices =
{
	pos:            [ "none", "left", "center", "right", "indent" ],
	textalign:      [ "none", "left", "center", "right", "full" ],
	label:          [ "none", "#", "#.", "#)", "(#)", "bullet" ],
	labelfontstyle: [ "normal", "bold", "italic", "bolditalic", "alternate" ],
	labelpos:       [ "left", "right", "alt" ]
};

var texGroups =
[
  {
    groupName: "Layout",
    props: [
      "textalign",
      "aboveskip",
      "belowskip",
      "abovepenalty",
      "belowpenalty"
    ]
  },
  {
    groupName: "label",
    props: [
      "label",
      "labelfontstyle",
      "labelpos"
    ]
  },
  {
    groupName: "Box",
    props: [
      "pos",
      "show",
      "unbox",
    ]
  }
];
