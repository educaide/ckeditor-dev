function setupPalette() {
  var paletteTitles = $('palette-titles');
  paletteTitles.update();

  var orderedList = new Element('ol');
  paletteTitles.insert(orderedList);

  var length = palettes.length;
  var dat = null;
  for (var i = 0; i < length; i++) {
    dat = palettes[i];

    var id = 'palette-title-' + i.toString();
    //var elem = new Element('input', {id: id, type: 'button', value: dat.title}).update(dat.title);
    //var elem = new Element('span', {id: id, className: 'button', value: dat.title}).update(dat.title);
    var update = dat.hasOwnProperty("title") != null ? dat.title : '';
    var elem = new Element('li', {id: id, className: 'button'}).update(update);
    elem.on('click', function(e) {
      var el = Event.element(e);
      if (el.hasClassName('selected'))
        return;
      var numStr = el.id.gsub("palette-title-","");
      showPalettePage(Number(numStr));
      Event.stop(e);
    });

    //paletteTitles.insert(elem);
    orderedList.insert(elem);
  }

  if (length) {
    showPalettePage(0);
  }

  //$('palette-page-wrapper');
}

function showPalettePage(page_id) {
  var dat = palettes[page_id]
  if (dat == null)
    return;

  var selected = $('palette-titles').down("li.selected");
  if (selected)
    selected.removeClassName('selected');
  $('palette-title-' + page_id.toString()).addClassName('selected');

  var palettePage = $('palette-page');
  palettePage.update();

  var orderedList = new Element('ol');
  palettePage.insert(orderedList);
   
  palettePage.className = '';
  var cls = dat.className;
  if (cls == null || cls == "default")
    cls = "five_per_line";
  palettePage.addClassName(cls);

  var length = dat.buttons.length;
  for (var i = 0; i < length; i++) {
    var butt = dat.buttons[i]
    var tex = butt[0];
    var icon = butt[1];
    var title = butt[2];
    var cls = butt[4];
    var id = 'palette-button-' + i.toString();
 
    var iconPath = icon;
    var styleStr = "background-image: url(" + iconPath + ");"

    //var elem = new Element('input', {id: id, type: 'button', value: tex}).update(tex);
    var elem = new Element('li', {id: id, className: 'tile', title: title, style: styleStr})//.update(tex);

    if (cls)
      elem.addClassName(cls);
   
    elem.on('click', function(e) {
      var el = Event.element(e);
      insertTex(' ' + el.title + ' ');
      //updatePreview();
      Event.stop(e);
    });

    orderedList.insert(elem);
  }
}
var palettes =
[
  {
    title: "Symbols1",
    className: "four_per_line shorter",
    buttons: [
      ["\\aleph", "Symbols1/1.png", "\\aleph", "-1.0"],
      ["\\hbar", "Symbols1/2.png", "\\hbar", "-1.0"],
      ["\\ell", "Symbols1/3.png", "\\ell", "-1.0"],
      ["\\wp", "Symbols1/4.png", "\\wp", "-3.33"],
      ["\\Re", "Symbols1/5.png", "\\Re", "-1.0"],
      ["\\Im", "Symbols1/6.png", "\\Im", "-1.0"],
      ["\\infty", "Symbols1/7.png", "\\infty", "-1.0"],
      ["\\es", "Symbols1/8.png", "\\es", "-1.58"],
      ["\\rn", "Symbols1/9.png", "\\rn", "-1.0"],
      ["\\nabla", "Symbols1/10.png", "\\nabla", "-1.0"],
      ["\\forall", "Symbols1/11.png", "\\forall", "-1.0"],
      ["\\exists", "Symbols1/12.png", "\\exists", "-1.0"],
      ["\\partial", "Symbols1/13.png", "\\partial", "-1.0"],
      ["\\QED", "Symbols1/14.png", "\\QED", "-1.0"],
      ["\\angle", "Symbols1/15.png", "\\angle", "-1.0"],
      ["\\triangle", "Symbols1/16.png", "\\triangle", "-1.0"],
      ["\\circle", "Symbols1/17.png", "\\circle", "-1.58"],
      ["\\quadr", "Symbols1/18.png", "\\quadr", "-1.0"],
      ["\\llgram", "Symbols1/19.png", "\\llgram", "-1.0"],
      ["\\ldots", "Symbols1/20.png", "\\ldots", "-1.0"],
      ["\\cdots", "Symbols1/21.png", "\\cdots", "-1.0"],
      ["\\vdots", "Symbols1/22.png", "\\vdots", "-1.74"],
      ["\\ddots", "Symbols1/23.png", "\\ddots", "-1.0"],
      ["\\top", "Symbols1/24.png", "\\top", "-1.0"],
      ["\\bot", "Symbols1/25.png", "\\bot", "-1.0"],
      ["\\surd", "Symbols1/26.png", "\\surd", "-4.0"]
    ]
  },
  {
    title: "Symbols2",
    className: "three_per_line",
    buttons: [
      ["x^{n}", "Symbols2/1.png", "x^{n}", "-1.0"],
      ["\\frac{x}{y}", "Symbols2/2.png", "\\frac{x}{y}", "-6.88"],
      ["\\df{x+y}{z}", "Symbols2/3.png", "\\df{x+y}{z}", "-9.23"],
      ["\\pf{x}{y}", "Symbols2/4.png", "\\pf{x}{y}", "-12.4"],
      ["\\xf{x}{1+\\frac{1}{x}}", "Symbols2/5.png", "\\xf{x}{1+\\frac{1}{x}}", "-16.15"],
      ["\\sqrt{x}", "Symbols2/6.png", "\\sqrt{x}", "-3.87"],
      ["\\sqrt[n]{x}", "Symbols2/7.png", "\\sqrt[n]{x}", "-3.87"],
      ["a\\ldiv{xyz}", "Symbols2/8.png", "a\\ldiv{xyz}", "-3.33"],
      ["\\vec{x}", "Symbols2/9.png", "\\vec{x}", "-1.0"],
      ["\\Vec{x}", "Symbols2/10.png", "\\Vec{x}", "-1.0"],
      ["x\\degrees", "Symbols2/11.png", "x\\degrees", "-1.0"],
      ["x'", "Symbols2/12.png", "x'", "-1.0"],
      ["x''", "Symbols2/13.png", "x''", "-1.0"]
    ]
  },
  {
    title: "Symbols3",
    className: "four_per_line",
    buttons: [
      ["\\{", "Symbols3/1.png", "\\{", "-4.0"],
      ["\\}", "Symbols3/2.png", "\\}", "-4.0"],
      ["\\&", "Symbols3/3.png", "\\&", "-1.0"],
      ["\\#", "Symbols3/4.png", "\\#", "-3.33"],
      ["\\%", "Symbols3/5.png", "\\%", "-1.66"],
      ["\\$", "Symbols3/6.png", "\\$", "-1.66"],
      ["\\cents", "Symbols3/7.png", "\\cents", "-4.0"],
      ["\\ddagger", "Symbols3/8.png", "\\ddagger", "-3.33"],
      ["\\dagger", "Symbols3/9.png", "\\dagger", "-3.33"],
      ["\\flat", "Symbols3/10.png", "\\flat", "-1.0"],
      ["\\natural", "Symbols3/11.png", "\\natural", "-3.33"],
      ["\\sharp", "Symbols3/12.png", "\\sharp", "-3.33"],
      ["\\clubsuit", "Symbols3/13.png", "\\clubsuit", "-2.55"],
      ["\\diamondsuit", "Symbols3/14.png", "\\diamondsuit", "-2.55"],
      ["\\heartsuit", "Symbols3/15.png", "\\heartsuit", "-2.55"],
      ["\\spadesuit", "Symbols3/16.png", "\\spadesuit", "-2.55"]
    ]
  },
  {
    title: "Arrows",
    className: "four_per_line shorter",
    buttons: [
      ["\\leftarrow", "Arrows/1.png", "\\leftarrow", "-1.0"],
      ["\\Leftarrow", "Arrows/2.png", "\\Leftarrow", "-1.0"],
      ["\\rightarrow", "Arrows/3.png", "\\rightarrow", "-1.0"],
      ["\\Rightarrow", "Arrows/4.png", "\\Rightarrow", "-1.0"],
      ["\\leftrightarrow", "Arrows/5.png", "\\leftrightarrow", "-1.0"],
      ["\\Leftrightarrow", "Arrows/6.png", "\\Leftrightarrow", "-1.0"],
      ["\\mapsto", "Arrows/7.png", "\\mapsto", "-1.0"],
      ["\\hookleftarrow", "Arrows/8.png", "\\hookleftarrow", "-1.0"],
      ["\\hookrightarrow", "Arrows/9.png", "\\hookrightarrow", "-1.0"],
      ["\\leftharpoonup", "Arrows/10.png", "\\leftharpoonup", "-1.0"],
      ["\\leftharpoondown", "Arrows/11.png", "\\leftharpoondown", "-1.0"],
      ["\\rightharpoonup", "Arrows/12.png", "\\rightharpoonup", "-1.0"],
      ["\\rightharpoondown", "Arrows/13.png", "\\rightharpoondown", "-1.0"],
      ["\\rightleftharpoons", "Arrows/14.png", "\\rightleftharpoons", "-1.0"],
      ["\\longrightarrow", "Arrows/15.png", "\\longrightarrow", "-1.0"],
      ["\\Longrightarrow", "Arrows/16.png", "\\Longrightarrow", "-1.0"],
      ["\\longleftarrow", "Arrows/17.png", "\\longleftarrow", "-1.0"],
      ["\\Longleftarrow", "Arrows/18.png", "\\Longleftarrow", "-1.0"],
      ["\\longmapsto", "Arrows/19.png", "\\longmapsto", "-1.0"],
      ["\\longleftrightarrow", "Arrows/20.png", "\\longleftrightarrow", "-1.0"],
      ["\\Longleftrightarrow", "Arrows/21.png", "\\Longleftrightarrow", "-1.0"],
      ["\\nearrow", "Arrows/22.png", "\\nearrow", "-3.33"],
      ["\\searrow", "Arrows/23.png", "\\searrow", "-3.33"],
      ["\\nwarrow", "Arrows/24.png", "\\nwarrow", "-3.33"],
      ["\\swarrow", "Arrows/25.png", "\\swarrow", "-3.33"]
    ]
  },
  {
    title: "Unary",
    className: "three_per_line",
    buttons: [
      ["\\int", "UnaryOps/1.png", "\\int", "-4.66"],
      ["\\oint", "UnaryOps/2.png", "\\oint", "-4.66"],
      ["\\Int_{a}^{b}", "UnaryOps/3.png", "\\Int_{a}^{b}", "-11.78"],
      ["\\sum", "UnaryOps/4.png", "\\sum", "-4.0"],
      ["\\Sum_{x=0}^{n}", "UnaryOps/5.png", "\\Sum_{x=0}^{n}", "-16.59"],
      ["\\prod", "UnaryOps/6.png", "\\prod", "-4.0"],
      ["\\coprod", "UnaryOps/7.png", "\\coprod", "-4.0"],
      ["\\bigvee", "UnaryOps/8.png", "\\bigvee", "-4.0"],
      ["\\bigwedge", "UnaryOps/9.png", "\\bigwedge", "-4.0"],
      ["\\bigcap", "UnaryOps/10.png", "\\bigcap", "-4.0"],
      ["\\bigcup", "UnaryOps/11.png", "\\bigcup", "-4.0"],
      ["\\bigotimes", "UnaryOps/12.png", "\\bigotimes", "-4.0"],
      ["\\bigoplus", "UnaryOps/13.png", "\\bigoplus", "-4.0"],
      ["\\bigodot", "UnaryOps/14.png", "\\bigodot", "-4.0"],
      ["\\biguplus", "UnaryOps/15.png", "\\biguplus", "-4.0"],
      ["\\bigsqcup", "UnaryOps/16.png", "\\bigsqcup", "-4.0"]
    ]
  },
  {
    title: "Binary",
    className: "four_per_line shorter",
    buttons: [
      ["\\pm", "BinaryOps/1.png", "\\pm", "-2.0"],
      ["\\mp", "BinaryOps/2.png", "\\mp", "-2.0"],
      ["\\cdot", "BinaryOps/3.png", "\\cdot", "-1.0"],
      ["\\times", "BinaryOps/4.png", "\\times", "-2.0"],
      ["\\div", "BinaryOps/5.png", "\\div", "-2.0"],
      ["\\setminus", "BinaryOps/6.png", "\\setminus", "-4.0"],
      ["\\ast", "BinaryOps/7.png", "\\ast", "-1.0"],
      ["\\star", "BinaryOps/8.png", "\\star", "-1.0"],
      ["\\diamond", "BinaryOps/9.png", "\\diamond", "-1.0"],
      ["\\bullet", "BinaryOps/10.png", "\\bullet", "-1.0"],
      ["\\circ", "BinaryOps/11.png", "\\circ", "-1.0"],
      ["\\bigcirc", "BinaryOps/12.png", "\\bigcirc", "-3.33"],
      ["\\lor", "BinaryOps/13.png", "\\lor", "-1.0"],
      ["\\land", "BinaryOps/14.png", "\\land", "-1.0"],
      ["\\lnot", "BinaryOps/15.png", "\\lnot", "-1.0"],
      ["\\Lnot", "BinaryOps/16.png", "\\Lnot", "-1.0"],
      ["\\intersect", "BinaryOps/17.png", "\\intersect", "-1.0"],
      ["\\union", "BinaryOps/18.png", "\\union", "-1.0"],
      ["\\uplus", "BinaryOps/19.png", "\\uplus", "-1.0"],
      ["\\sqcap", "BinaryOps/20.png", "\\sqcap", "-1.0"],
      ["\\sqcup", "BinaryOps/21.png", "\\sqcup", "-1.0"],
      ["\\odot", "BinaryOps/22.png", "\\odot", "-2.0"],
      ["\\oslash", "BinaryOps/23.png", "\\oslash", "-2.0"],
      ["\\otimes", "BinaryOps/24.png", "\\otimes", "-2.0"],
      ["\\ominus", "BinaryOps/25.png", "\\ominus", "-2.0"],
      ["\\oplus", "BinaryOps/26.png", "\\oplus", "-2.0"],
      ["\\triangleleft", "BinaryOps/27.png", "\\triangleleft", "-1.0"],
      ["\\triangleright", "BinaryOps/28.png", "\\triangleright", "-1.0"],
      ["\\bigtriangleup", "BinaryOps/29.png", "\\bigtriangleup", "-3.33"],
      ["\\bigtriangledown", "BinaryOps/30.png", "\\bigtriangledown", "-3.33"],
      ["\\amalg", "BinaryOps/31.png", "\\amalg", "-1.0"],
      ["\\wr", "BinaryOps/32.png", "\\wr", "-3.33"]
    ]
  },
  {
    title: "Delimiters",
    className: "four_per_line",
    buttons: [
      ["\\verts{a^b}", "Delimiters/1.png", "\\verts{a^b}", "-5.2"],
      ["\\Verts{a^b}", "Delimiters/2.png", "\\Verts{a^b}", "-5.2"],
      ["\\bracks{a^b}", "Delimiters/3.png", "\\bracks{a^b}", "-5.2"],
      ["\\braces{a^b}", "Delimiters/4.png", "\\braces{a^b}", "-5.2"],
      ["\\parens{a^b}", "Delimiters/5.png", "\\parens{a^b}", "-5.2"],
      ["\\langle x \\rangle", "Delimiters/6.png", "\\langle x \\rangle", "-4.0"],
      ["\\lceil x \\rceil", "Delimiters/7.png", "\\lceil x \\rceil", "-4.0"],
      ["\\lfloor x \\rfloor", "Delimiters/8.png", "\\lfloor x \\rfloor", "-4.0"],
      ["x\\backslash y", "Delimiters/9.png", "x\\backslash y", "-4.0"],
      ["\\Vert", "Delimiters/10.png", "\\Vert", "-4.0"],
      ["\\vert", "Delimiters/11.png", "\\vert", "-4.0"],
      ["\\uparrow", "Delimiters/12.png", "\\uparrow", "-3.33"],
      ["\\downarrow", "Delimiters/13.png", "\\downarrow", "-3.33"],
      ["\\updownarrow", "Delimiters/14.png", "\\updownarrow", "-4.0"],
      ["\\Uparrow", "Delimiters/15.png", "\\Uparrow", "-3.33"],
      ["\\Downarrow", "Delimiters/16.png", "\\Downarrow", "-3.33"],
      ["\\Updownarrow", "Delimiters/17.png", "\\Updownarrow", "-4.0"]
    ]
  },
  {
    title: "Relations",
    className: "four_per_line shorter",
    buttons: [
      ["\\ne", "Relations/1.png", "\\ne", "-3.33"],
      ["\\le", "Relations/2.png", "\\le", "-2.63"],
      ["\\ge", "Relations/3.png", "\\ge", "-2.63"],
      ["\\gg", "Relations/4.png", "\\gg", "-1.46"],
      ["\\ll", "Relations/5.png", "\\ll", "-1.46"],
      ["\\approx", "Relations/6.png", "\\approx", "-1.0"],
      ["\\equiv", "Relations/7.png", "\\equiv", "-1.0"],
      ["\\propto", "Relations/8.png", "\\propto", "-1.0"],
      ["\\doteq", "Relations/9.png", "\\doteq", "-1.0"],
      ["\\qeq", "Relations/10.png", "\\qeq", "-1.0"],
      ["\\sim", "Relations/11.png", "\\sim", "-1.0"],
      ["\\simeq", "Relations/12.png", "\\simeq", "-1.0"],
      ["\\cong", "Relations/13.png", "\\cong", "-1.5"],
      ["\\perp", "Relations/14.png", "\\perp", "-1.0"],
      ["\\para", "Relations/15.png", "\\para", "-4.0"],
      ["\\mid", "Relations/16.png", "\\mid", "-4.0"],
      ["\\succ", "Relations/17.png", "\\succ", "-1.46"],
      ["\\prec", "Relations/18.png", "\\prec", "-1.46"],
      ["\\succeq", "Relations/19.png", "\\succeq", "-2.63"],
      ["\\preceq", "Relations/20.png", "\\preceq", "-2.63"],
      ["\\in", "Relations/21.png", "\\in", "-1.46"],
      ["\\owns", "Relations/22.png", "\\owns", "-1.46"],
      ["\\notin", "Relations/23.png", "\\notin", "-3.33"],
      ["\\supset", "Relations/24.png", "\\supset", "-1.46"],
      ["\\subset", "Relations/25.png", "\\subset", "-1.46"],
      ["\\supseteq", "Relations/26.png", "\\supseteq", "-2.63"],
      ["\\subseteq", "Relations/27.png", "\\subseteq", "-2.63"],
      ["\\sqsubseteq", "Relations/28.png", "\\sqsubseteq", "-2.63"],
      ["\\sqsupseteq", "Relations/29.png", "\\sqsupseteq", "-2.63"],
      ["\\dashv", "Relations/30.png", "\\dashv", "-1.0"],
      ["\\vdash", "Relations/31.png", "\\vdash", "-1.0"],
      ["\\asymp", "Relations/32.png", "\\asymp", "-1.0"],
      ["\\smile", "Relations/33.png", "\\smile", "-1.0"],
      ["\\frown", "Relations/34.png", "\\frown", "-1.0"],
      ["\\bowtie", "Relations/35.png", "\\bowtie", "-1.0"],
      ["\\models", "Relations/36.png", "\\models", "-4.0"]
    ]
  },
  {
    title: "Functions",
    className: "three_per_line shorter",
    buttons: [
      ["\\log", "Functions/1.png", "\\log", "-3.33"],
      ["\\lg", "Functions/2.png", "\\lg", "-3.33"],
      ["\\ln", "Functions/3.png", "\\ln", "-1.0"],
      ["\\exp", "Functions/4.png", "\\exp", "-3.33"],
      ["\\antilog", "Functions/5.png", "\\antilog", "-3.33"],
      ["\\sin", "Functions/6.png", "\\sin", "-1.0"],
      ["\\cos", "Functions/7.png", "\\cos", "-1.0"],
      ["\\tan", "Functions/8.png", "\\tan", "-1.0"],
      ["\\csc", "Functions/9.png", "\\csc", "-1.0"],
      ["\\sec", "Functions/10.png", "\\sec", "-1.0"],
      ["\\cot", "Functions/11.png", "\\cot", "-1.0"],
      ["\\arcsin", "Functions/12.png", "\\arcsin", "-1.0"],
      ["\\arccos", "Functions/13.png", "\\arccos", "-1.0"],
      ["\\arctan", "Functions/14.png", "\\arctan", "-1.0"],
      ["\\sinh", "Functions/15.png", "\\sinh", "-1.0"],
      ["\\cosh", "Functions/16.png", "\\cosh", "-1.0"],
      ["\\tanh", "Functions/17.png", "\\tanh", "-1.0"],
      ["\\max", "Functions/18.png", "\\max", "-1.0"],
      ["\\min", "Functions/19.png", "\\min", "-1.0"],
      ["\\lim", "Functions/20.png", "\\lim", "-1.0"],
      ["\\limsup", "Functions/21.png", "\\limsup", "-3.33"],
      ["\\liminf", "Functions/22.png", "\\liminf", "-1.0"],
      ["\\sup", "Functions/23.png", "\\sup", "-3.33"],
      ["\\inf", "Functions/24.png", "\\inf", "-1.0"],
      ["\\ker", "Functions/25.png", "\\ker", "-1.0"],
      ["\\hom", "Functions/26.png", "\\hom", "-1.0"],
      ["\\arg", "Functions/27.png", "\\arg", "-3.33"],
      ["\\dim", "Functions/28.png", "\\dim", "-1.0"],
      ["\\det", "Functions/29.png", "\\det", "-1.0"],
      ["\\gcd", "Functions/30.png", "\\gcd", "-3.33"],
      ["\\deg", "Functions/31.png", "\\deg", "-3.33"],
      ["\\bmod", "Functions/32.png", "\\bmod", "-1.0"],
      ["\\Pr", "Functions/33.png", "\\Pr", "-1.0"],
      ["\\coth", "Functions/34.png", "\\coth", "-1.0"]
    ]
  },
  {
    title: "Greek",
    className: "five_per_line shorter",
    buttons: [
      ["\\alpha", "Greek/1.png", "\\alpha", "-1.0"],
      ["\\beta", "Greek/2.png", "\\beta", "-3.33"],
      ["\\gamma", "Greek/3.png", "\\gamma", "-3.33"],
      ["\\delta", "Greek/4.png", "\\delta", "-1.0"],
      ["\\epsilon", "Greek/5.png", "\\epsilon", "-1.0"],
      ["\\zeta", "Greek/6.png", "\\zeta", "-3.33"],
      ["\\eta", "Greek/7.png", "\\eta", "-3.33"],
      ["\\theta", "Greek/8.png", "\\theta", "-1.0"],
      ["\\iota", "Greek/9.png", "\\iota", "-1.0"],
      ["\\kappa", "Greek/10.png", "\\kappa", "-1.0"],
      ["\\lambda", "Greek/11.png", "\\lambda", "-1.0"],
      ["\\mu", "Greek/12.png", "\\mu", "-3.33"],
      ["\\nu", "Greek/13.png", "\\nu", "-1.0"],
      ["\\xi", "Greek/14.png", "\\xi", "-3.33"],
      ["\\pi", "Greek/15.png", "\\pi", "-1.0"],
      ["\\rho", "Greek/16.png", "\\rho", "-3.33"],
      ["\\sigma", "Greek/17.png", "\\sigma", "-1.0"],
      ["\\tau", "Greek/18.png", "\\tau", "-1.0"],
      ["\\upsilon", "Greek/19.png", "\\upsilon", "-1.0"],
      ["\\phi", "Greek/20.png", "\\phi", "-3.33"],
      ["\\chi", "Greek/21.png", "\\chi", "-3.33"],
      ["\\psi", "Greek/22.png", "\\psi", "-3.33"],
      ["\\omega", "Greek/23.png", "\\omega", "-1.0"],
      ["\\varepsilon", "Greek/24.png", "\\varepsilon", "-1.0"],
      ["\\vartheta", "Greek/25.png", "\\vartheta", "-1.0"],
      ["\\varpi", "Greek/26.png", "\\varpi", "-1.0"],
      ["\\varrho", "Greek/27.png", "\\varrho", "-3.33"],
      ["\\varsigma", "Greek/28.png", "\\varsigma", "-2.16"],
      ["\\varphi", "Greek/29.png", "\\varphi", "-3.33"],
      ["\\Gamma", "Greek/30.png", "\\Gamma", "-1.0"],
      ["\\Delta", "Greek/31.png", "\\Delta", "-1.0"],
      ["\\Theta", "Greek/32.png", "\\Theta", "-1.0"],
      ["\\Lambda", "Greek/33.png", "\\Lambda", "-1.0"],
      ["\\Xi", "Greek/34.png", "\\Xi", "-1.0"],
      ["\\Pi", "Greek/35.png", "\\Pi", "-1.0"],
      ["\\Sigma", "Greek/36.png", "\\Sigma", "-1.0"],
      ["\\Upsilon", "Greek/37.png", "\\Upsilon", "-1.0"],
      ["\\Phi", "Greek/38.png", "\\Phi", "-1.0"],
      ["\\Psi", "Greek/39.png", "\\Psi", "-1.0"],
      ["\\Omega", "Greek/40.png", "\\Omega", "-1.0"]
    ]
  },
  {
    title: "Align",
    className: "two_per_line",
    buttons: [
      ["\\matrix{a & b \\cr c & d \\cr}", "Alignments/1.png", "\\matrix{a & b \\cr c & d \\cr}", "-11.19"],
      ["\\pmatrix{a & b \\cr c & d \\cr}", "Alignments/2.png", "\\pmatrix{a & b \\cr c & d \\cr}", "-12.4"],
      ["\\vmatrix{a & b \\cr c & d \\cr}", "Alignments/3.png", "\\vmatrix{a & b \\cr c & d \\cr}", "-12.4"],
      ["\\Vmatrix{a & b \\cr c & d \\cr}", "Alignments/4.png", "\\Vmatrix{a & b \\cr c & d \\cr}", "-12.4"],
      ["\\bmatrix{a & b \\cr c & d \\cr}", "Alignments/5.png", "\\bmatrix{a & b \\cr c & d \\cr}", "-12.4"],
      ["\\lbraceeq{x=a \\cr y=b \\cr}", "Alignments/6.png", "\\lbraceeq{x=a \\cr y=b \\cr}", "-8.94"],
      ["\\rbraceeq{x=a \\cr y=b \\cr}", "Alignments/7.png", "\\rbraceeq{x=a \\cr y=b \\cr}", "-8.94"],
      ["\\simuleq{x+y&=a \\cr x-y&=b \\cr}", "Alignments/9.png", "\\simuleq{x+y&=a \\cr x-y&=b \\cr}", "-17.72"],
      ["y=\\cases{1 & for $x<0$ \\cr -1 & for $x\\ge0$ \\cr}", "Alignments/8.png", "y=\\cases{1 & for $x<0$ \\cr -1 & for $x\\ge0$ \\cr}", "-12.4", "full_line"]

    ]
  },
]
