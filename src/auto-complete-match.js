'use strict';

/**
 * @ngdoc directive
 * @name tiAutocompleteMatch
 * @module ngTagsInput
 *
 * @description
 * Represents an autocomplete match. Used internally by the autoComplete directive.
 */
tagsInput.directive('tiAutocompleteMatch', function($sce, tiUtil) {
    return {
        restrict: 'E',
        require: '^autoComplete',
        template: '<ng-include src="$$template"></ng-include>',
        scope: { data: '=' },
        link: function(scope, element, attrs, autoCompleteCtrl) {
            var autoComplete = autoCompleteCtrl.registerAutocompleteMatch(),
                options = autoComplete.getOptions();

            scope.$$template = options.template;
            scope.$index = scope.$parent.$index;

            scope.$highlight = function(text) {

                var getTrustAsHtmlList = function(text, highlight) {
                    if(angular.isArray(text)) {
                        var trustAsHtmlList = [];
                        var _i, _textLength;
                        for(_i = 0, _textLength = text.length; _i < _textLength; _i++) {
                            if( highlight ) {
                                text[_i] = tiUtil.safeHighlight(text[_i], autoComplete.getQuery());
                            }
                            trustAsHtmlList.push($sce.trustAsHtml(text[_i]));
                        }
                        return trustAsHtmlList;
                    } else {
                        if( highlight ) {
                            text = tiUtil.safeHighlight(text, autoComplete.getQuery());
                        }
                        return $sce.trustAsHtml(text);
                    }
                };

                if (options.highlightMatchedText) {
                    return getTrustAsHtmlList(text, true);
                } else {
                    return getTrustAsHtmlList(text, false);
                }
            };
            scope.$getDisplayText =  function() {

                var displayProperty = tiUtil.safeToString(options.displayProperty || options.tagsInput.displayProperty);
                var displayPropertyList = displayProperty.split(' ');
                if(displayPropertyList.length > 1) {
                    var displayTextList = [];
                    for(var property in displayPropertyList) {
                        displayTextList.push(tiUtil.safeToString(scope.data[displayPropertyList[property]]));
                    }
                    return displayTextList;
                } else {
                    return tiUtil.safeToString(scope.data[displayProperty]);
                }

            };
        }
    };
});
