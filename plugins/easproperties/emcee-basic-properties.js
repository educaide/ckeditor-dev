(function() {
  'use strict';

  window.EAS_PREFIX = "data-eas-";
  window.SETTINGS = [
    {
      easId: "align",
      default: "top",
    },
    {
      easId: "buttons",
      default: "false",
    },
    {
      easId: "layout",
      default: "opth",
    },
    {
      easId: "hiding",
      default: "true",
    },
  ]


  function init(input, emcee) {
    var App = Vue.extend({
      mixins: [window.VUE_MIXIN],
      props: ["element", "emcee"],
      data: function () {
        return {
          buttons: "false",
          align: "top",
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
      },
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
