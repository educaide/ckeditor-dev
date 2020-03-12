(function() {
  'use strict';

  var EAS_PREFIX = "data-eas-";
  var SETTINGS = [
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
      props: ["element"],
      data: function () {
        return {
          answer: "",
          mode: "horiz",
          textalign: "left",
          draglabels: "true",
        }
      },
      methods: {
        saveToElement: function (element, args) {
          var that = this;
          console.log(this.$data)
          _.each(SETTINGS, function(setting){
            if (that.$data[setting.easId] !== setting.default) {
              element.setAttribute(EAS_PREFIX + setting.easId, String(that.$data[setting.easId]));
            } else {
              element.removeAttribute(EAS_PREFIX + setting.easId);
            }
          })
        }
      },

      mounted: function () {
        var that = this;
        _.each(SETTINGS, function(setting){
          var value = that.element.getAttribute(EAS_PREFIX + setting.easId);
          that.$data[setting.easId] = that.element.getAttribute(EAS_PREFIX + setting.easId) || setting.default;
        })
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
