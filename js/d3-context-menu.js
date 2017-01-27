(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = function (d3) {
      d3.contextMenu = factory(d3);
      return d3.contextMenu;
    };
  } else if (typeof define === 'function' && define.amd) {
    try {
      var d3 = require('d3');
    } catch (e) {
      d3 = root.d3;
    }

    d3.contextMenu = factory(d3);
    define([], function () {
      return d3.contextMenu;
    });
  } else if (root.d3) {
    root.d3.contextMenu = factory(root.d3);
  }
}(this,
  function (d3) {
      // create the div element that will hold the context menu
      d3.selectAll('.d3-context-menu').data([1])
      	.enter()
      	.append('div')
      	.attr('class', 'd3-context-menu');

      // close menu
      d3.select('body').on('click.d3-context-menu', function () {
        d3.select('.d3-context-menu').style('display', 'none');
        if (closeCallback) {
          closeCallback();
        }
      });

    // this gets executed when a contextmenu event occurs
    return function (menu, data) {
      var elm = this;
      var data = data;
      d3.selectAll('.d3-context-menu').html('');
      var list = d3.selectAll('.d3-context-menu')
        .on('contextmenu', function (d) {
          d3.select('.d3-context-menu').style('display', 'none');
          d3.event.preventDefault();
          d3.event.stopPropagation();
        })
        .append('ul');
      list.selectAll('li').data(typeof menu === 'function' ? menu(data) : menu).enter()
        .append('li')
        .attr('class', function (d) {
          var ret = '';
          if (d.divider) {
            ret += ' is-divider';
          }
          if (d.disabled) {
            ret += ' is-disabled';
          }
          if (!d.action) {
            ret += ' is-header';
          }
          return ret;
        })
        .html(function (d) {
          if (d.divider) {
            return '<hr>';
          }
          if (!d.title) {
            console.error('No title attribute set. Check the spelling of your options.');
          }
          return (typeof d.title === 'string') ? d.title : d.title(data);
        })
          .on('click', function (d, i, elm, n) {
          if (d.disabled) return; // do nothing if disabled
          if (!d.action) return; // headers have no "action"
          d.action(data);
          d3.select('.d3-context-menu').style('display', 'none');
        });

      // display context menu
      d3.select('.d3-context-menu')
        .style('left', (d3.event.pageX - 2) + 'px')
        .style('top', (d3.event.pageY - 2) + 'px')
        .style('display', 'block');

      d3.event.preventDefault();
      d3.event.stopPropagation();
    };
  }
));
