// Generated by CoffeeScript 1.4.0

/*
 * jQuery.navTracker
 * v0.25
 * last updated 2013-01-21
 *
 * A simple plugin to track changes in navigation and update location.hash
 *
 * Author: Ben Saufley
 *     http://bensaufley.com
 *
 * Based on jQuery plugin boilerplate by Jonathan Nicol @f6design
*/


(function() {

  (function($) {
    var Plugin, pluginName;
    pluginName = 'navTracker';
    Plugin = function(element, options) {
      var $el, checkTimer, current, destroy, el, hook, init, option, refreshTops, scrollChecker, scrollPos, tops, updateHash;
      el = element;
      $el = $(element);
      scrollPos = null;
      checkTimer = null;
      current = null;
      tops = {
        offsets: [0],
        elems: {}
      };
      options = $.extend({}, $.fn[pluginName].defaults, options);
      init = function() {
        if (document.location.hash) {
          if ($(location.hash)) {
            $('html,body').scrollTop($(document.location.hash).offset().top);
          }
        }
        refreshTops();
        $(window).on('resize', refreshTops);
        scrollChecker();
        return hook('onInit');
      };
      destroy = function() {
        clearTimeout(checkTimer);
        $el.find("." + options.selectedClass).removeClass(options.selectedClass);
        $(window).off('resize', refreshTops);
        return hook('onDestroy');
      };
      scrollChecker = function() {
        var $e, result, scrolledTo, st, x, _i, _len, _ref;
        if ($(window).scrollTop() !== scrollPos) {
          scrollPos = $(window).scrollTop();
          st = scrollPos + options.offset;
          result = 0;
          _ref = tops.offsets;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            if (x <= st) {
              result = x;
              break;
            }
          }
          scrolledTo = tops.elems[result] || options.top;
          if (scrolledTo !== current) {
            $e = $el.find("a[href=\"#" + scrolledTo + "\"]");
            $el.find("." + options.selectedClass).removeClass(options.selectedClass);
            $e.addClass(options.selectedClass);
            updateHash(scrolledTo);
            current = scrolledTo;
            hook('onChange');
          }
        }
        return checkTimer = setTimeout(scrollChecker, options.refreshRate);
      };
      updateHash = function(hash) {
        var fx, node;
        node = $("#" + hash);
        if (node.length) {
          node.attr('id', '');
          if (options.legacy) {
            fx = $('<div />').css({
              position: 'absolute',
              visibility: 'hidden',
              top: $(document).scrollTop() + 'px',
              html: '&nbsp;'
            }).attr('id', hash).appendTo(document.body);
          }
        }
        document.location.hash = hash;
        if (node.length) {
          if (options.legacy || (fx !== void 0 && fx.length)) {
            fx.remove();
          }
          return node.attr('id', hash);
        }
      };
      refreshTops = function() {
        tops.offsets = [0];
        tops.elems = {
          0: options.top
        };
        $el.find('a[href^="#"]').each(function(i) {
          var $e, $loc, hrf, offset;
          $e = $(this);
          hrf = $e.attr('href').replace(/^#/, '');
          if (/^\s*$/.test(hrf) !== true) {
            $loc = $('#' + hrf);
            offset = $loc.offset();
            tops.offsets[i] = offset.top;
            return tops.elems[offset.top] = hrf;
          }
        });
        return tops.offsets.sort(function(a, b) {
          return b - a;
        });
      };
      option = function(key, val) {
        if (val) {
          return options[key] = val;
        } else {
          return options[key];
        }
      };
      hook = function(hookName) {
        if (options[hookName] !== void 0) {
          return options[hookName].call(el, current);
        }
      };
      init();
      return {
        tops: tops,
        current: current,
        option: option,
        destroy: destroy,
        refreshTops: refreshTops
      };
    };
    $.fn[pluginName] = function(options) {
      var args, methodName, returnVal;
      if (typeof arguments[0] === 'string') {
        methodName = arguments[0];
        args = Array.prototype.slice.call(arguments, 1);
        returnVal = null;
        this.each(function() {
          if ($.data(this, "plugin_" + pluginName) && typeof $.data(this, "plugin_" + pluginName)[methodName] === 'function') {
            return (returnVal = $.data(this, "plugin_" + pluginName)[methodName].apply(this, args));
          } else {
            throw new Error("Method " + methodName + " does not exist on jQuery." + pluginName);
          }
        });
        if (returnVal !== void 0) {
          return returnVal;
        } else {
          return this;
        }
      } else if (typeof options === "object" || !options) {
        return this.each(function() {
          if (!$.data(this, 'plugin_' + pluginName)) {
            return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
          }
        });
      }
    };
    return $.fn[pluginName].defaults = {
      selectedClass: 'selected',
      refreshRate: 100,
      offset: 0,
      top: 'top',
      legacy: false,
      onInit: function() {},
      onChange: function() {},
      onDestroy: function() {}
    };
  })(jQuery);

}).call(this);
