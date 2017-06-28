var texCommand = "parbox";

var texProperties =
[
  ["choice", "textalign"],
  ["Dimension", "aboveskip"],
  ["Dimension", "belowskip"],
  ["Dimension", "itemsep"],
  ["uint?", "abovepenalty"],
  ["uint?", "belowpenalty"],
  ["choice", "pos"],
  ["choice", "label"],
  ["choice", "labelfontstyle"],
  ["choice", "labelpos"],
  ["choice", "counter"],
  ["bool?", "show"],
  ["bool?", "unbox"],
  ["bool?", "xfig"]
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
      "belowpenalty",
      "xfig"
    ]
  },
  {
    groupName: "label",
    props: [
      "label",
      "labelfontstyle",
      "labelpos",
      "itemsep",
      "counter"
    ]
  },
  {
    groupName: "Box",
    props: [
      "pos",
      "show",
      "unbox"
    ]
  }
];

