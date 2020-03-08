(function() {
  'use strict';

  var EAS_PREFIX = "data-eas-"
  var EAS_CORRECT = "correct"
  var EAS_MODE = "mode"
  var EAS_ALIGN = "align"
  var EAS_DRAGLABELS = "draglabels"

  function init(input) {
    var App = Vue.extend({
      props: ["element"],
      data () {
        return {
          correctOrder: "",
          mode: "horz",
          align: "left",
          draglabels: true,
        }
      },
      methods: {
        saveToElement (element, args) {
          // element.setAttribute(EAS_PREFIX + "mode", value);
          element.setAttribute(EAS_PREFIX + EAS_CORRECT, this.correctOrder);
          element.setAttribute(EAS_PREFIX + EAS_MODE, this.mode);
          element.setAttribute(EAS_PREFIX + EAS_ALIGN, this.align);
          element.setAttribute(EAS_PREFIX + EAS_DRAGLABELS, String(this.draglabels))
        }
      },

      mounted () {
        this.correctOrder = this.element.getAttribute(EAS_PREFIX + EAS_CORRECT);
        this.mode = this.element.getAttribute(EAS_PREFIX + EAS_MODE) || "horz";
        this.align = this.element.getAttribute(EAS_PREFIX + EAS_ALIGN) || "left";
        if (this.element.getAttribute(EAS_PREFIX + EAS_DRAGLABELS) === "true") {
          this.draglabels = true;
        } else {
          this.draglabels = false;
        }
      }
    })

    var app = new App({
      el: '#app',
      template: '#ordering-dialog',
      propsData: {
        element: input
      }
    })

    window.savePropertiesToElement = app.saveToElement;
  }

  window.initializeApp = init;
})();
