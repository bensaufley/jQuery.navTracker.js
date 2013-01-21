###
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
###

(($) ->
  pluginName = 'navTracker'

  # If you want to use console, this is just
  # to make sure it works in IE, and that it's
  # defined for code linters:
  #
  # console = window.console || log: ->

  Plugin = (element, options) ->
    el         = element
    $el        = $(element)
    scrollPos  = null
    checkTimer = null
    current    = null
    tops       =
      offsets    : [0]
      elems      : {}

    # Implements defaults where the user hasn't defined explicit
    # values for options.
    options = $.extend({}, $.fn[pluginName].defaults, options)

    init = ->
      if document.location.hash
        if $(location.hash)
          $('html,body').scrollTop($(document.location.hash).offset().top)
      refreshTops()
      $(window).on('resize',refreshTops)
      scrollChecker()
      hook('onInit')

    destroy = ->
      clearTimeout(checkTimer)
      $el.find(".#{options.selectedClass}").removeClass(options.selectedClass)
      $(window).off('resize',refreshTops)
      hook('onDestroy')
    
    scrollChecker = ->
      if ($(window).scrollTop()!=scrollPos)
        scrollPos = $(window).scrollTop()
        st  = scrollPos + options.offset
        result = 0
        for x in tops.offsets
          if x <= st
            result = x
            break
        scrolledTo = tops.elems[result] || options.top
        if scrolledTo != current
          $e = $el.find("a[href=\"##{scrolledTo}\"]")
          $el.find(".#{options.selectedClass}").removeClass(options.selectedClass)
          $e.addClass(options.selectedClass)
          updateHash(scrolledTo)
          current = scrolledTo
          hook('onChange')
      checkTimer = setTimeout(scrollChecker, options.refreshRate)
      
    updateHash = (hash) ->
      node = $("##{hash}")
      if (node.length)
        node.attr( 'id', '' )
        if options.legacy
          fx = $( '<div />' )
            .css(
              position   :'absolute'
              visibility :'hidden'
              top        : $(document).scrollTop() + 'px'
              html       : '&nbsp;'
            )
            .attr( 'id', hash )
            .appendTo( document.body )
      document.location.hash = hash
      if (node.length)
        if options.legacy || fx.length
          fx.remove()
        node.attr( 'id', hash )
        
    refreshTops = ->
      tops.offsets = [0]
      tops.elems   = 0 : options.top
      $el.find('a[href^="#"]').each (i) ->
        $e     = $(this)
        hrf    = $e.attr('href').replace(/^#/,'')
        if ((/^\s*$/).test(hrf)!=true)
          $loc   = $('#' + hrf)
          offset = $loc.offset()
          tops.offsets[i] = offset.top
          tops.elems[offset.top] = hrf
      tops.offsets.sort((a,b) -> b-a)
      console.log tops
      

    option = (key, val) ->
      if (val)
        options[key] = val
      else
        return options[key]

    hook = (hookName) ->
      if (options[hookName] != undefined)
        options[hookName].call(el,current)

    init()

    # Public Plugin methods
    return {
      tops        : tops
      current     : current
      option      : option
      destroy     : destroy
      refreshTops : refreshTops
    }

  $.fn[pluginName] = (options) ->
    if (typeof arguments[0] is 'string')
      methodName = arguments[0]
      args = Array.prototype.slice.call(arguments, 1)
      returnVal = null
      this.each ->
        if ($.data(this, "plugin_#{pluginName}") && typeof $.data(this, "plugin_#{pluginName}")[methodName] is 'function')
          return (returnVal = $.data(this, "plugin_#{pluginName}")[methodName].apply(this, args))
        else
          throw new Error("Method #{methodName} does not exist on jQuery.#{pluginName}")
      if (returnVal != undefined)
        return returnVal
      else
        return this
    else if (typeof options is "object" || !options)
      return this.each ->
        if (!$.data(this, 'plugin_' + pluginName))
          $.data(this, "plugin_#{pluginName}", new Plugin(this, options))

  # Default plugin options.
  $.fn[pluginName].defaults =
    selectedClass : 'selected'
    refreshRate   : 100
    offset        : 0
    top           : 'top'
    legacy        : false
    onInit        : ->
    onChange      : ->
    onDestroy     : ->

)(jQuery)