(function() {
  'use strict';

  var EAS_CORRECT = "correct"

  function init(input, emcee) {
    var App = Vue.extend({
      props: ["element", "emcee"],
      data () {
        return {
          mode: "normal",
          alignment: "top",
          layout: "horz",
          hidechoices: true,
        }
      },
      methods: {
        setNormal () {
          this.mode = "normal";
        },
        setButtons () {
          this.mode = "buttons";
        },
        saveToElement (element, args) {
        }
      },

      mounted () {
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
