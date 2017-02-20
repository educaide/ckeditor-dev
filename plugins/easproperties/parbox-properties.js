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
  ["choice", "counter"],
  ["bool?", "show"],
  ["bool?", "unbox"],
];

var texChoices =
{
	pos:            [ "none", "left", "center", "right", "indent" ],
	textalign:      [ "none", "left", "center", "right", "full" ],
	label:          [ "none", "#", "#.", "#)", "(#)", "bullet" ],
	labelfontstyle: [ "normal", "bold", "italic", "bolditalic", "alternate" ],
	labelpos:       [ "left", "right", "alt" ],
	counter:        [ "1", "A", "a", "I", "i" ]
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
      "labelpos",
      "counter"
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

