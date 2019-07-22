/**
 * @fileoverview DOM Util spec
 * @author NHN. FE Development Lab <dl_javascript@nhn.com>
 */

'use strict';

var domutil = require('../../src/utils/domutil');

describe('removeElement()', function() {
    it('remove element from the parentNode.', function() {
        var parent = document.createElement('div');
        var child = document.createElement('p');
        parent.appendChild(child);

        domutil.removeElement(child);
        expect(child.parentElement).toBeNull();
        expect(parent.children.length).toBe(0);
    });
});

describe('addClass()', function() {
    it('add the class to the element.', function() {
        var element = document.createElement('div');
        var addedClass = 'class-name';

        domutil.addClass(element, addedClass);
        expect(element.className).toBe(addedClass);
    });
});

describe('removeClass()', function() {
    it('remove the class from the element.', function() {
        var parent = document.createElement('div');
        var removedClass = 'class-name';
        var element;
        parent.innerHTML = '<p class="' + removedClass + '"></p>';
        element = parent.firstChild;

        domutil.removeClass(element, removedClass);
        expect(element.className).toBe('');
    });
});
