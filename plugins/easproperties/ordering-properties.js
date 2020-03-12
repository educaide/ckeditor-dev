(function() {
  'use strict';

  window.EAS_PREFIX = "data-eas-";
  window.SETTINGS = [
    {
      easId: "answer",
      default: "",
    },
    {
      easId: "mode",
      default: "horiz",
    },
    {
      easId: "textalign",
      default: "left",
    },
    {
      easId: "draglabels",
      default: "false",
    },
  ]

  function init(input) {
    var App = Vue.extend({
      mixins: [window.VUE_MIXIN],
      props: ["element"],
      data: function () {
        return {
          answer: "",
          mode: "horiz",
          textalign: "left",
          draglabels: "true",
        }
      },
      watch: {
        "answer": function (value) {
          if (value) {
            this.answer = value.replace(/[^A-Z0-9a-z, ]/, '');
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
