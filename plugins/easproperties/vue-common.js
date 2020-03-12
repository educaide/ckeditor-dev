var VUE_MIXIN = {
  methods: {
    saveToElement: function (element, args) {
      var that = this;
      _.each(window.SETTINGS, function(setting){
        if (that.$data[setting.easId] !== setting.default) {
          element.setAttribute(window.EAS_PREFIX + setting.easId, that.$data[setting.easId]);
        } else {
          element.removeAttribute(window.EAS_PREFIX + setting.easId);
        }
      })
    }
  },

  mounted: function () {
    var that = this;
    _.each(window.SETTINGS, function(setting){
      var value = that.element.getAttribute(window.EAS_PREFIX + setting.easId);
      that.$data[setting.easId] = that.element.getAttribute(window.EAS_PREFIX + setting.easId) || setting.default;
    })
  }
};
