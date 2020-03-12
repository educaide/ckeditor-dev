(function() {
  'use strict';

  var EAS_PREFIX = "data-eas-";
  var EAS_ANSWER = "answer";
  var EAS_MODE = "mode";
  var EAS_TEXT_ALIGN = "textalign";
  var EAS_DRAGLABELS = "draglabels";

  function init(input) {
    var App = Vue.extend({
      props: ["element"],
      data: function () {
        return {
          correctAnswer: "",
          mode: "horiz",
          textAlign: "left",
          draglabels: true,
        }
      },
      methods: {
        saveToElement: function (element, args) {
          element.setAttribute(EAS_PREFIX + EAS_ANSWER, this.correctAnswer);

          if (this.mode !== "horiz") {
            element.setAttribute(EAS_PREFIX + EAS_MODE, this.mode);
          } else {
            element.removeAttribute(EAS_PREFIX + EAS_MODE);
          }
          if (this.textAlign !== "left") {
            element.setAttribute(EAS_PREFIX + EAS_TEXT_ALIGN, this.textAlign);
          } else {
            element.removeAttribute(EAS_PREFIX + EAS_TEXT_ALIGN);
          }
          if (this.draglabels === false) {
            element.removeAttribute(EAS_PREFIX + EAS_DRAGLABELS);
          } else {
            element.setAttribute(EAS_PREFIX + EAS_DRAGLABELS, "true");
          }
        }
      },

      mounted: function () {
        this.correctAnswer = this.element.getAttribute(EAS_PREFIX + EAS_ANSWER);
        this.mode = this.element.getAttribute(EAS_PREFIX + EAS_MODE) || "horiz";
        this.textAlign = this.element.getAttribute(EAS_PREFIX + EAS_TEXT_ALIGN) || "left";
        if (this.element.getAttribute(EAS_PREFIX + EAS_DRAGLABELS) === "true") {
          this.draglabels = true;
        } else {
          this.draglabels = false;
        }
      },

      watch: {
        "correctAnswer": function (value) {
          if (value) {
            this.correctAnswer = value.replace(/[^A-Z0-9a-z, ]/, '');
          }
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
