(function() {
  'use strict';

  var EAS_PREFIX = "data-eas-";
  var EAS_ALIGN = "align";
  var EAS_BUTTONS = "buttons";
  var EAS_LAYOUT = "layout";
  var EAS_HIDING = "hiding";

  function init(input, emcee) {
    var App = Vue.extend({
      props: ["element", "emcee"],
      data: function () {
        return {
          buttons: "false",
          alignment: "top",
          layout: "opth",
          hiding: true,
        }
      },
      methods: {
        setNormal: function () {
          this.buttons = "false";
        },
        setButtons: function () {
          this.buttons = "true";
        },
        saveToElement: function (element, args) {
          element.setAttribute(EAS_PREFIX + EAS_BUTTONS, this.buttons);
          element.setAttribute(EAS_PREFIX + EAS_ALIGN, this.alignment);
          element.setAttribute(EAS_PREFIX + EAS_LAYOUT, this.layout);
          element.setAttribute(EAS_PREFIX + EAS_HIDING, String(this.hiding));
        }
      },

      mounted: function () {
        this.buttons = this.element.getAttribute(EAS_PREFIX + EAS_BUTTONS) || "false";
        this.layout = this.element.getAttribute(EAS_PREFIX + EAS_LAYOUT) || "opth";
        this.alignment = this.element.getAttribute(EAS_PREFIX + EAS_ALIGN) || "top";
        if (this.element.getAttribute(EAS_PREFIX + EAS_HIDING === "false")) {
          this.hiding = false;
        } else {
          this.hiding = true;
        }
      }
    })

    var app = new App({
      el: '#app',
      template: '#emcee-basic-dialog',
      propsData: {
        element: input,
        emcee: emcee
      }
    })

    window.savePropertiesToElement = app.saveToElement;
  }

  window.initializeApp = init;
})();
