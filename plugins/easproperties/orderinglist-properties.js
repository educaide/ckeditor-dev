var texProperties =
[
  ["choice", "layout"],
  ["choice", "order"],
  ["Dimension", "groupskip"],
  ["Dimension", "choiceskip"],
  ["bool?", "scrambling"],
  ["bool?", "hiding"],
  ["bool?", "insertright"],
  ["bool?", "draglabels"],
  ["uint?", "draglimit"]
];

var texChoices =
{
  layout: [ "hidden", "cond", "vert", "opth", "optv", "below", "frame" ],
  order:  [ "orig", "scramble", "reverse", "scrambleNone", "addNone", "makeNone" ],
  mode:  [ "horiz", "vert" ]
};

var texGroups =
[
  {
    groupName: "Emcee",
    props: [
      "layout",
      "order",
      "groupskip",
      "choiceskip",
      "scrambling",
      "hiding",
      "insertright",
      "draglabels",
      "draglimit",
    ]
  }
];

