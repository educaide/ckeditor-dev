(function() {
  'use strict';

  var EAS_CORRECT = "correct"

  function init(input, emcee) {
    var App = Vue.extend({
      props: ["element", "emcee"],
      data: function () {
        return {
          mode: "normal",
          alignment: "top",
          layout: "horz",
          hidechoices: true,
        }
      },
      methods: {
        setNormal: function () {
          this.mode = "normal";
        },
        setButtons: function () {
          this.mode = "buttons";
        },
        saveToElement: function (element, args) {
        }
      },

      mounted: function () {
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
