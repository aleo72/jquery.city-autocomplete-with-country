(function ( $ ) {
    $.fn.cityAutocomplete = function(options) {
        var autocompleteService = new google.maps.places.AutocompleteService();
        var predictionsDropDown = $('<div class="city-autocomplete"></div>').appendTo('body');
        var input = this;

        input.keyup(function() {
            var searchStr = $(this).val();

            if (searchStr.length > 0) {
                var params = {
                    input: searchStr,
                    types: ['(cities)']
                };
                if(input.data('country')) {
                    if (input.data('country').length > 0) {
                        params.componentRestrictions = {country: input.data('country')}
                    }
                }

                autocompleteService.getPlacePredictions(params, updatePredictions);
            } else {
                predictionsDropDown.hide();
            }
        });

        predictionsDropDown.delegate('div', 'click', function() {
            input.val($(this).data('value'));
            predictionsDropDown.hide();
        });

        $(document).mouseup(function (e) {
            if (!predictionsDropDown.is(e.target) && predictionsDropDown.has(e.target).length === 0) {
                predictionsDropDown.hide();
            }
        });

        $(window).resize(function() {
            updatePredictionsDropDownDisplay(predictionsDropDown, input);
        });

        updatePredictionsDropDownDisplay(predictionsDropDown, input);

        function updatePredictions(predictions, status) {
            if (google.maps.places.PlacesServiceStatus.OK != status) {
                predictionsDropDown.hide();
                return;
            }

            predictionsDropDown.empty();
            $.each(predictions, function(i, prediction) {
                predictionsDropDown.append('<div data-value="'+ prediction.terms[0].value + '">' + prediction.description + '</div');
            });

            predictionsDropDown.show();
        }

        return input;
    };

    function updatePredictionsDropDownDisplay(dropDown, input) {
        dropDown.css({
            'width': input.outerWidth(),
            'left': input.offset().left,
            'top': input.offset().top + input.outerHeight()
        });
    }

}( jQuery ));