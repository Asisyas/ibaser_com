(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

jQuery(document).ready(function ($) {
    $('#use_multiple_locations').click(function () {
        if ($(this).is(':checked')) {
            $('#use_multiple_locations').attr('disabled', true);
            $('#single-location-settings').slideUp(function () {
                $('#multiple-locations-settings').slideDown();
                $('#sl-settings').slideDown();
                $('#opening-hours-hours').slideUp(function () {
                    $('#use_multiple_locations').removeAttr('disabled');
                });
            });
            $('.open_247_wrapper').slideUp();
        } else {
            $('#use_multiple_locations').attr('disabled', true);
            $('#multiple-locations-settings').slideUp(function () {
                $('#single-location-settings').slideDown();
                if (!$('#hide_opening_hours').is(':checked')) {
                    $('#opening-hours-hours').slideDown();
                }
                $('#sl-settings').slideUp();
                $('#use_multiple_locations').removeAttr('disabled');
            });
            $('.open_247_wrapper').slideDown();
        }
    });

    $('#hide_opening_hours').click(function () {
        if ($(this).is(':checked')) {
            $('#opening-hours-hours, #opening-hours-settings').slideUp();
        } else {
            $('#opening-hours-settings').slideDown();
            if (!$('#use_multiple_locations').is(':checked')) {
                $('#opening-hours-hours').slideDown();
            }
        }
    });
    $('#multiple_opening_hours, #wpseo_multiple_opening_hours').click(function () {
        if ($(this).is(':checked')) {
            $('.opening-hours .opening-hours-second').slideDown();
        } else {
            $('.opening-hours .opening-hours-second').slideUp();
        }
    });
    $('#opening_hours_24h').click(function () {
        $('#opening-hours-container select').each(function () {
            $(this).find('option').each(function () {
                if ($('#opening_hours_24h').is(':checked')) {
                    // Use 24 hour
                    if ($(this).val() != 'closed') {
                        $(this).text($(this).val());
                    }
                } else {
                    // Use 12 hour
                    if ($(this).val() != 'closed') {
                        // Split the string between hours and minutes
                        var time = $(this).val().split(':');

                        // use parseInt to remove leading zeroes.
                        var hour = parseInt(time[0]);
                        var minutes = time[1];
                        var suffix = 'AM';
                        // if the hours number is greater than 12, subtract 12.
                        if (hour >= 12) {
                            if (hour > 12) {
                                hour = hour - 12;
                            }
                            suffix = 'PM';
                        }
                        if (hour == 0) {
                            hour = 12;
                        }

                        $(this).text(hour + ':' + minutes + ' ' + suffix);
                    }
                }
            });
        });
    });

    // General Settings: Enable/disable Open 24/7 on click
    $('#open_247').on('click', function () {
        if (!$('#use_multiple_locations').is(":checked")) {
            maybeCloseOpeningHours(this);
            $('.open_247_wrapper').show();
        }
    });

    // Single Location: Enable/disable Open 24/7 on click
    $('#wpseo_open_247').on('click', function () {
        maybeCloseOpeningHours(this);
    });

    // Disable hours 24/7 on click
    $('.wpseo_open_24h input').on('click', function (e) {
        if ($(this).is(":checked")) {
            $('select', $('.openinghours-wrapper', $(this).closest('.opening-hours'))).attr('disabled', true);
        } else {
            $('select', $('.openinghours-wrapper', $(this).closest('.opening-hours'))).attr('disabled', false);
        }
    });

    function maybeCloseOpeningHours(elem) {
        if ($(elem).is(':checked')) {
            $('#opening-hours-rows, .opening-hours-wrap').slideUp();
        } else {
            $('#opening-hours-rows, .opening-hours-wrap').slideDown();
        }
    }

    $('.widget-content').on('click', '#wpseo-checkbox-multiple-locations-wrapper input[type=checkbox]', function () {
        wpseo_show_all_locations_selectbox($(this));
    });

    // Show locations metabox before WP SEO metabox
    if ($('#wpseo_locations').length > 0 && $('#wpseo_meta').length > 0) {
        $('#wpseo_locations').insertBefore($('#wpseo_meta'));
    }

    $('.openinghours_from').change(function () {
        var to_id = $(this).attr('id').replace('_from', '_to_wrapper');
        var second_id = $(this).attr('id').replace('_from', '_second');

        if ($(this).val() == 'closed') {
            $('#' + to_id).css('display', 'none');
            $('#' + second_id).css('display', 'none');
        } else {
            $('#' + to_id).css('display', 'inline');
            $('#' + second_id).css('display', 'block');
        }
    }).change();
    $('.openinghours_from_second').change(function () {
        var to_id = $(this).attr('id').replace('_from', '_to_wrapper');

        if ($(this).val() == 'closed') {
            $('#' + to_id).css('display', 'none');
        } else {
            $('#' + to_id).css('display', 'inline');
        }
    }).change();
    $('.openinghours_to').change(function () {
        var from_id = $(this).attr('id').replace('_to', '_from');
        var to_id = $(this).attr('id').replace('_to', '_to_wrapper');
        if ($(this).val() == 'closed') {
            $('#' + to_id).css('display', 'none');
            $('#' + from_id).val('closed');
        }
    });
    $('.openinghours_to_second').change(function () {
        var from_id = $(this).attr('id').replace('_to', '_from');
        var to_id = $(this).attr('id').replace('_to', '_to_wrapper');
        if ($(this).val() == 'closed') {
            $('#' + to_id).css('display', 'none');
            $('#' + from_id).val('closed');
        }
    });

    if ($('.set_custom_images').length > 0) {
        if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
            $('.wrap').on('click', '.set_custom_images', function (e) {
                e.preventDefault();
                var button = $(this);
                var id = button.attr('data-id');
                wp.media.editor.send.attachment = function (props, attachment) {
                    if (attachment.hasOwnProperty('sizes')) {
                        var url = attachment.sizes[props.size].url;
                    } else {
                        var url = attachment.url;
                    }

                    $('#' + id + '_image_container').attr('src', url);
                    $('.wpseo-local-' + id + '-wrapper .wpseo-local-hide-button').show();
                    $('#hidden_' + id).attr('value', attachment.id);
                };
                wp.media.editor.open(button);
                return false;
            });
        }
    }

    $('.remove_custom_image').on('click', function (e) {
        e.preventDefault();

        var id = $(this).attr('data-id');
        $('#' + id).attr('src', '').hide();
        $('#hidden_' + id).attr('value', '');
        $('.wpseo-local-' + id + '-wrapper .wpseo-local-hide-button').hide();
    });

    // Copy location data
    $('#wpseo_copy_from_location').change(function () {
        var location_id = $(this).val();

        if (location_id == '') return;

        $.post(wpseo_local_data.ajaxurl, {
            location_id: location_id,
            security: wpseo_local_data.sec_nonce,
            action: 'wpseo_copy_location'
        }, function (result) {
            if (result.charAt(result.length - 1) == 0) {
                result = result.slice(0, -1);
            } else if (result.substring(result.length - 2) == "-1") {
                result = result.slice(0, -2);
            }

            var data = $.parseJSON(result);
            if (data.success == 'true' || data.success == true) {

                for (var i in data.location) {
                    var value = data.location[i];

                    if (value != null && value != '' && typeof value != 'undefined') {
                        if (i == 'is_postal_address' || i == 'multiple_opening_hours') {
                            if (value == '1') {
                                $('#wpseo_' + i).attr('checked', 'checked');
                                $('.opening-hours .opening-hour-second').slideDown();
                            }
                        } else if (i.indexOf('opening_hours') > -1) {
                            $('#' + i).val(value);
                        } else {
                            $('#wpseo_' + i).val(value);
                        }
                    }
                }
            }
        });
    });
});

window.wpseo_show_all_locations_selectbox = function (obj) {
    $ = jQuery;

    $obj = $(obj);
    var parent = $obj.parents('.widget-inside');
    var $locationsWrapper = $('#wpseo-locations-wrapper', parent);

    if ($obj.is(':checked')) {
        $locationsWrapper.slideUp();
    } else {
        $locationsWrapper.slideDown();
    }
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWxvY2FsLWdsb2JhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsT0FBTyxRQUFQLEVBQWlCLEtBQWpCLENBQXVCLFVBQVUsQ0FBVixFQUFhO0FBQ2hDLE1BQUUseUJBQUYsRUFBNkIsS0FBN0IsQ0FBbUMsWUFBWTtBQUMzQyxZQUFJLEVBQUUsSUFBRixFQUFRLEVBQVIsQ0FBVyxVQUFYLENBQUosRUFBNEI7QUFDeEIsY0FBRSx5QkFBRixFQUE2QixJQUE3QixDQUFrQyxVQUFsQyxFQUE4QyxJQUE5QztBQUNBLGNBQUUsMkJBQUYsRUFBK0IsT0FBL0IsQ0FBdUMsWUFBWTtBQUMvQyxrQkFBRSw4QkFBRixFQUFrQyxTQUFsQztBQUNBLGtCQUFFLGNBQUYsRUFBa0IsU0FBbEI7QUFDQSxrQkFBRSxzQkFBRixFQUEwQixPQUExQixDQUFrQyxZQUFZO0FBQzFDLHNCQUFFLHlCQUFGLEVBQTZCLFVBQTdCLENBQXdDLFVBQXhDO0FBQ0gsaUJBRkQ7QUFHSCxhQU5EO0FBT0EsY0FBRSxtQkFBRixFQUF1QixPQUF2QjtBQUNILFNBVkQsTUFXSztBQUNELGNBQUUseUJBQUYsRUFBNkIsSUFBN0IsQ0FBa0MsVUFBbEMsRUFBOEMsSUFBOUM7QUFDQSxjQUFFLDhCQUFGLEVBQWtDLE9BQWxDLENBQTBDLFlBQVk7QUFDbEQsa0JBQUUsMkJBQUYsRUFBK0IsU0FBL0I7QUFDQSxvQkFBSSxDQUFDLEVBQUUscUJBQUYsRUFBeUIsRUFBekIsQ0FBNEIsVUFBNUIsQ0FBTCxFQUE4QztBQUMxQyxzQkFBRSxzQkFBRixFQUEwQixTQUExQjtBQUNIO0FBQ0Qsa0JBQUUsY0FBRixFQUFrQixPQUFsQjtBQUNBLGtCQUFFLHlCQUFGLEVBQTZCLFVBQTdCLENBQXdDLFVBQXhDO0FBQ0gsYUFQRDtBQVFBLGNBQUUsbUJBQUYsRUFBdUIsU0FBdkI7QUFFSDtBQUNKLEtBekJEOztBQTJCQSxNQUFFLHFCQUFGLEVBQXlCLEtBQXpCLENBQStCLFlBQVk7QUFDdkMsWUFBSSxFQUFFLElBQUYsRUFBUSxFQUFSLENBQVcsVUFBWCxDQUFKLEVBQTRCO0FBQ3hCLGNBQUUsK0NBQUYsRUFBbUQsT0FBbkQ7QUFDSCxTQUZELE1BR0s7QUFDRCxjQUFFLHlCQUFGLEVBQTZCLFNBQTdCO0FBQ0EsZ0JBQUksQ0FBQyxFQUFFLHlCQUFGLEVBQTZCLEVBQTdCLENBQWdDLFVBQWhDLENBQUwsRUFBa0Q7QUFDOUMsa0JBQUUsc0JBQUYsRUFBMEIsU0FBMUI7QUFDSDtBQUNKO0FBQ0osS0FWRDtBQVdBLE1BQUUsd0RBQUYsRUFBNEQsS0FBNUQsQ0FBa0UsWUFBWTtBQUMxRSxZQUFJLEVBQUUsSUFBRixFQUFRLEVBQVIsQ0FBVyxVQUFYLENBQUosRUFBNEI7QUFDeEIsY0FBRSxzQ0FBRixFQUEwQyxTQUExQztBQUNILFNBRkQsTUFHSztBQUNELGNBQUUsc0NBQUYsRUFBMEMsT0FBMUM7QUFDSDtBQUNKLEtBUEQ7QUFRQSxNQUFFLG9CQUFGLEVBQXdCLEtBQXhCLENBQThCLFlBQVk7QUFDdEMsVUFBRSxpQ0FBRixFQUFxQyxJQUFyQyxDQUEwQyxZQUFZO0FBQ2xELGNBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLENBQTRCLFlBQVk7QUFDcEMsb0JBQUksRUFBRSxvQkFBRixFQUF3QixFQUF4QixDQUEyQixVQUEzQixDQUFKLEVBQTRDO0FBQ3hDO0FBQ0Esd0JBQUksRUFBRSxJQUFGLEVBQVEsR0FBUixNQUFpQixRQUFyQixFQUErQjtBQUMzQiwwQkFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLEVBQUUsSUFBRixFQUFRLEdBQVIsRUFBYjtBQUNIO0FBQ0osaUJBTEQsTUFLTztBQUNIO0FBQ0Esd0JBQUksRUFBRSxJQUFGLEVBQVEsR0FBUixNQUFpQixRQUFyQixFQUErQjtBQUMzQjtBQUNBLDRCQUFJLE9BQU8sRUFBRSxJQUFGLEVBQVEsR0FBUixHQUFjLEtBQWQsQ0FBb0IsR0FBcEIsQ0FBWDs7QUFFQTtBQUNBLDRCQUFJLE9BQU8sU0FBUyxLQUFLLENBQUwsQ0FBVCxDQUFYO0FBQ0EsNEJBQUksVUFBVSxLQUFLLENBQUwsQ0FBZDtBQUNBLDRCQUFJLFNBQVMsSUFBYjtBQUNBO0FBQ0EsNEJBQUksUUFBUSxFQUFaLEVBQWdCO0FBQ1osZ0NBQUksT0FBTyxFQUFYLEVBQWU7QUFDWCx1Q0FBTyxPQUFPLEVBQWQ7QUFDSDtBQUNELHFDQUFTLElBQVQ7QUFDSDtBQUNELDRCQUFJLFFBQVEsQ0FBWixFQUFlO0FBQ1gsbUNBQU8sRUFBUDtBQUNIOztBQUVELDBCQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsT0FBTyxHQUFQLEdBQWEsT0FBYixHQUF1QixHQUF2QixHQUE2QixNQUExQztBQUNIO0FBQ0o7QUFDSixhQTlCRDtBQStCSCxTQWhDRDtBQWlDSCxLQWxDRDs7QUFvQ0E7QUFDQSxNQUFFLFdBQUYsRUFBZSxFQUFmLENBQWtCLE9BQWxCLEVBQTJCLFlBQVk7QUFDbkMsWUFBSSxDQUFDLEVBQUUseUJBQUYsRUFBNkIsRUFBN0IsQ0FBZ0MsVUFBaEMsQ0FBTCxFQUFrRDtBQUM5QyxtQ0FBdUIsSUFBdkI7QUFDQSxjQUFFLG1CQUFGLEVBQXVCLElBQXZCO0FBQ0g7QUFDSixLQUxEOztBQU9BO0FBQ0EsTUFBRSxpQkFBRixFQUFxQixFQUFyQixDQUF3QixPQUF4QixFQUFpQyxZQUFZO0FBQ3pDLCtCQUF1QixJQUF2QjtBQUNILEtBRkQ7O0FBSUE7QUFDQSxNQUFFLHVCQUFGLEVBQTJCLEVBQTNCLENBQThCLE9BQTlCLEVBQXVDLFVBQVUsQ0FBVixFQUFhO0FBQ2hELFlBQUksRUFBRSxJQUFGLEVBQVEsRUFBUixDQUFXLFVBQVgsQ0FBSixFQUE0QjtBQUN4QixjQUFFLFFBQUYsRUFBWSxFQUFFLHVCQUFGLEVBQTJCLEVBQUUsSUFBRixFQUFRLE9BQVIsQ0FBZ0IsZ0JBQWhCLENBQTNCLENBQVosRUFBMkUsSUFBM0UsQ0FBZ0YsVUFBaEYsRUFBNEYsSUFBNUY7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFFLFFBQUYsRUFBWSxFQUFFLHVCQUFGLEVBQTJCLEVBQUUsSUFBRixFQUFRLE9BQVIsQ0FBZ0IsZ0JBQWhCLENBQTNCLENBQVosRUFBMkUsSUFBM0UsQ0FBZ0YsVUFBaEYsRUFBNEYsS0FBNUY7QUFDSDtBQUNKLEtBTkQ7O0FBUUEsYUFBUyxzQkFBVCxDQUFnQyxJQUFoQyxFQUFzQztBQUNsQyxZQUFJLEVBQUUsSUFBRixFQUFRLEVBQVIsQ0FBVyxVQUFYLENBQUosRUFBNEI7QUFDeEIsY0FBRSwwQ0FBRixFQUE4QyxPQUE5QztBQUNILFNBRkQsTUFFTztBQUNILGNBQUUsMENBQUYsRUFBOEMsU0FBOUM7QUFDSDtBQUNKOztBQUVELE1BQUUsaUJBQUYsRUFBcUIsRUFBckIsQ0FBd0IsT0FBeEIsRUFBaUMsaUVBQWpDLEVBQW9HLFlBQVk7QUFDNUcsMkNBQW1DLEVBQUUsSUFBRixDQUFuQztBQUNILEtBRkQ7O0FBSUE7QUFDQSxRQUFJLEVBQUUsa0JBQUYsRUFBc0IsTUFBdEIsR0FBK0IsQ0FBL0IsSUFBb0MsRUFBRSxhQUFGLEVBQWlCLE1BQWpCLEdBQTBCLENBQWxFLEVBQXFFO0FBQ2pFLFVBQUUsa0JBQUYsRUFBc0IsWUFBdEIsQ0FBbUMsRUFBRSxhQUFGLENBQW5DO0FBQ0g7O0FBRUQsTUFBRSxvQkFBRixFQUF3QixNQUF4QixDQUErQixZQUFZO0FBQ3ZDLFlBQUksUUFBUSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsSUFBYixFQUFtQixPQUFuQixDQUEyQixPQUEzQixFQUFvQyxhQUFwQyxDQUFaO0FBQ0EsWUFBSSxZQUFZLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CLENBQTJCLE9BQTNCLEVBQW9DLFNBQXBDLENBQWhCOztBQUVBLFlBQUksRUFBRSxJQUFGLEVBQVEsR0FBUixNQUFpQixRQUFyQixFQUErQjtBQUMzQixjQUFFLE1BQU0sS0FBUixFQUFlLEdBQWYsQ0FBbUIsU0FBbkIsRUFBOEIsTUFBOUI7QUFDQSxjQUFFLE1BQU0sU0FBUixFQUFtQixHQUFuQixDQUF1QixTQUF2QixFQUFrQyxNQUFsQztBQUNILFNBSEQsTUFJSztBQUNELGNBQUUsTUFBTSxLQUFSLEVBQWUsR0FBZixDQUFtQixTQUFuQixFQUE4QixRQUE5QjtBQUNBLGNBQUUsTUFBTSxTQUFSLEVBQW1CLEdBQW5CLENBQXVCLFNBQXZCLEVBQWtDLE9BQWxDO0FBQ0g7QUFDSixLQVpELEVBWUcsTUFaSDtBQWFBLE1BQUUsMkJBQUYsRUFBK0IsTUFBL0IsQ0FBc0MsWUFBWTtBQUM5QyxZQUFJLFFBQVEsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLElBQWIsRUFBbUIsT0FBbkIsQ0FBMkIsT0FBM0IsRUFBb0MsYUFBcEMsQ0FBWjs7QUFFQSxZQUFJLEVBQUUsSUFBRixFQUFRLEdBQVIsTUFBaUIsUUFBckIsRUFBK0I7QUFDM0IsY0FBRSxNQUFNLEtBQVIsRUFBZSxHQUFmLENBQW1CLFNBQW5CLEVBQThCLE1BQTlCO0FBQ0gsU0FGRCxNQUdLO0FBQ0QsY0FBRSxNQUFNLEtBQVIsRUFBZSxHQUFmLENBQW1CLFNBQW5CLEVBQThCLFFBQTlCO0FBQ0g7QUFDSixLQVRELEVBU0csTUFUSDtBQVVBLE1BQUUsa0JBQUYsRUFBc0IsTUFBdEIsQ0FBNkIsWUFBWTtBQUNyQyxZQUFJLFVBQVUsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLElBQWIsRUFBbUIsT0FBbkIsQ0FBMkIsS0FBM0IsRUFBa0MsT0FBbEMsQ0FBZDtBQUNBLFlBQUksUUFBUSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsSUFBYixFQUFtQixPQUFuQixDQUEyQixLQUEzQixFQUFrQyxhQUFsQyxDQUFaO0FBQ0EsWUFBSSxFQUFFLElBQUYsRUFBUSxHQUFSLE1BQWlCLFFBQXJCLEVBQStCO0FBQzNCLGNBQUUsTUFBTSxLQUFSLEVBQWUsR0FBZixDQUFtQixTQUFuQixFQUE4QixNQUE5QjtBQUNBLGNBQUUsTUFBTSxPQUFSLEVBQWlCLEdBQWpCLENBQXFCLFFBQXJCO0FBQ0g7QUFDSixLQVBEO0FBUUEsTUFBRSx5QkFBRixFQUE2QixNQUE3QixDQUFvQyxZQUFZO0FBQzVDLFlBQUksVUFBVSxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsSUFBYixFQUFtQixPQUFuQixDQUEyQixLQUEzQixFQUFrQyxPQUFsQyxDQUFkO0FBQ0EsWUFBSSxRQUFRLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CLENBQTJCLEtBQTNCLEVBQWtDLGFBQWxDLENBQVo7QUFDQSxZQUFJLEVBQUUsSUFBRixFQUFRLEdBQVIsTUFBaUIsUUFBckIsRUFBK0I7QUFDM0IsY0FBRSxNQUFNLEtBQVIsRUFBZSxHQUFmLENBQW1CLFNBQW5CLEVBQThCLE1BQTlCO0FBQ0EsY0FBRSxNQUFNLE9BQVIsRUFBaUIsR0FBakIsQ0FBcUIsUUFBckI7QUFDSDtBQUNKLEtBUEQ7O0FBU0EsUUFBSSxFQUFFLG9CQUFGLEVBQXdCLE1BQXhCLEdBQWlDLENBQXJDLEVBQXdDO0FBQ3BDLFlBQUksT0FBTyxFQUFQLEtBQWMsV0FBZCxJQUE2QixHQUFHLEtBQWhDLElBQXlDLEdBQUcsS0FBSCxDQUFTLE1BQXRELEVBQThEO0FBQzFELGNBQUUsT0FBRixFQUFXLEVBQVgsQ0FBYyxPQUFkLEVBQXVCLG9CQUF2QixFQUE2QyxVQUFVLENBQVYsRUFBYTtBQUN0RCxrQkFBRSxjQUFGO0FBQ0Esb0JBQUksU0FBUyxFQUFFLElBQUYsQ0FBYjtBQUNBLG9CQUFJLEtBQUssT0FBTyxJQUFQLENBQVksU0FBWixDQUFUO0FBQ0EsbUJBQUcsS0FBSCxDQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsQ0FBcUIsVUFBckIsR0FBa0MsVUFBVSxLQUFWLEVBQWlCLFVBQWpCLEVBQTZCO0FBQzNELHdCQUFJLFdBQVcsY0FBWCxDQUEwQixPQUExQixDQUFKLEVBQXdDO0FBQ3BDLDRCQUFJLE1BQU0sV0FBVyxLQUFYLENBQWlCLE1BQU0sSUFBdkIsRUFBNkIsR0FBdkM7QUFDSCxxQkFGRCxNQUVPO0FBQ0gsNEJBQUksTUFBTSxXQUFXLEdBQXJCO0FBQ0g7O0FBRUQsc0JBQUUsTUFBTSxFQUFOLEdBQVcsa0JBQWIsRUFBaUMsSUFBakMsQ0FBc0MsS0FBdEMsRUFBNkMsR0FBN0M7QUFDQSxzQkFBRSxrQkFBa0IsRUFBbEIsR0FBdUIsbUNBQXpCLEVBQThELElBQTlEO0FBQ0Esc0JBQUUsYUFBYSxFQUFmLEVBQW1CLElBQW5CLENBQXdCLE9BQXhCLEVBQWlDLFdBQVcsRUFBNUM7QUFDSCxpQkFWRDtBQVdBLG1CQUFHLEtBQUgsQ0FBUyxNQUFULENBQWdCLElBQWhCLENBQXFCLE1BQXJCO0FBQ0EsdUJBQU8sS0FBUDtBQUNILGFBakJEO0FBa0JIO0FBQ0o7O0FBRUQsTUFBRSxzQkFBRixFQUEwQixFQUExQixDQUE2QixPQUE3QixFQUFzQyxVQUFVLENBQVYsRUFBYTtBQUMvQyxVQUFFLGNBQUY7O0FBRUEsWUFBSSxLQUFLLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxTQUFiLENBQVQ7QUFDQSxVQUFFLE1BQU0sRUFBUixFQUFZLElBQVosQ0FBaUIsS0FBakIsRUFBd0IsRUFBeEIsRUFBNEIsSUFBNUI7QUFDQSxVQUFFLGFBQWEsRUFBZixFQUFtQixJQUFuQixDQUF3QixPQUF4QixFQUFpQyxFQUFqQztBQUNBLFVBQUUsa0JBQWtCLEVBQWxCLEdBQXVCLG1DQUF6QixFQUE4RCxJQUE5RDtBQUNILEtBUEQ7O0FBU0E7QUFDQSxNQUFFLDJCQUFGLEVBQStCLE1BQS9CLENBQXNDLFlBQVk7QUFDOUMsWUFBSSxjQUFjLEVBQUUsSUFBRixFQUFRLEdBQVIsRUFBbEI7O0FBRUEsWUFBSSxlQUFlLEVBQW5CLEVBQ0k7O0FBRUosVUFBRSxJQUFGLENBQU8saUJBQWlCLE9BQXhCLEVBQWlDO0FBQzdCLHlCQUFhLFdBRGdCO0FBRTdCLHNCQUFVLGlCQUFpQixTQUZFO0FBRzdCLG9CQUFRO0FBSHFCLFNBQWpDLEVBSUcsVUFBVSxNQUFWLEVBQWtCO0FBQ2pCLGdCQUFJLE9BQU8sTUFBUCxDQUFjLE9BQU8sTUFBUCxHQUFnQixDQUE5QixLQUFvQyxDQUF4QyxFQUEyQztBQUN2Qyx5QkFBUyxPQUFPLEtBQVAsQ0FBYSxDQUFiLEVBQWdCLENBQUMsQ0FBakIsQ0FBVDtBQUNILGFBRkQsTUFHSyxJQUFJLE9BQU8sU0FBUCxDQUFpQixPQUFPLE1BQVAsR0FBZ0IsQ0FBakMsS0FBdUMsSUFBM0MsRUFBaUQ7QUFDbEQseUJBQVMsT0FBTyxLQUFQLENBQWEsQ0FBYixFQUFnQixDQUFDLENBQWpCLENBQVQ7QUFDSDs7QUFFRCxnQkFBSSxPQUFPLEVBQUUsU0FBRixDQUFZLE1BQVosQ0FBWDtBQUNBLGdCQUFJLEtBQUssT0FBTCxJQUFnQixNQUFoQixJQUEwQixLQUFLLE9BQUwsSUFBZ0IsSUFBOUMsRUFBb0Q7O0FBRWhELHFCQUFLLElBQUksQ0FBVCxJQUFjLEtBQUssUUFBbkIsRUFBNkI7QUFDekIsd0JBQUksUUFBUSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQVo7O0FBRUEsd0JBQUksU0FBUyxJQUFULElBQWlCLFNBQVMsRUFBMUIsSUFBZ0MsT0FBTyxLQUFQLElBQWdCLFdBQXBELEVBQWlFO0FBQzdELDRCQUFJLEtBQUssbUJBQUwsSUFBNEIsS0FBSyx3QkFBckMsRUFBK0Q7QUFDM0QsZ0NBQUksU0FBUyxHQUFiLEVBQWtCO0FBQ2Qsa0NBQUUsWUFBWSxDQUFkLEVBQWlCLElBQWpCLENBQXNCLFNBQXRCLEVBQWlDLFNBQWpDO0FBQ0Esa0NBQUUscUNBQUYsRUFBeUMsU0FBekM7QUFDSDtBQUNKLHlCQUxELE1BTUssSUFBSSxFQUFFLE9BQUYsQ0FBVSxlQUFWLElBQTZCLENBQUMsQ0FBbEMsRUFBcUM7QUFDdEMsOEJBQUUsTUFBTSxDQUFSLEVBQVcsR0FBWCxDQUFlLEtBQWY7QUFDSCx5QkFGSSxNQUdBO0FBQ0QsOEJBQUUsWUFBWSxDQUFkLEVBQWlCLEdBQWpCLENBQXFCLEtBQXJCO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSixTQWxDRDtBQW1DSCxLQXpDRDtBQTBDSCxDQTdPRDs7QUErT0EsT0FBTyxrQ0FBUCxHQUE0QyxVQUFVLEdBQVYsRUFBZTtBQUN2RCxRQUFJLE1BQUo7O0FBRUEsV0FBTyxFQUFFLEdBQUYsQ0FBUDtBQUNBLFFBQUksU0FBUyxLQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUFiO0FBQ0EsUUFBSSxvQkFBb0IsRUFBRSwwQkFBRixFQUE4QixNQUE5QixDQUF4Qjs7QUFFQSxRQUFJLEtBQUssRUFBTCxDQUFRLFVBQVIsQ0FBSixFQUF5QjtBQUNyQiwwQkFBa0IsT0FBbEI7QUFDSCxLQUZELE1BR0s7QUFDRCwwQkFBa0IsU0FBbEI7QUFDSDtBQUNKLENBYkQiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwialF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoJCkge1xuICAgICQoJyN1c2VfbXVsdGlwbGVfbG9jYXRpb25zJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgJCgnI3VzZV9tdWx0aXBsZV9sb2NhdGlvbnMnKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgJCgnI3NpbmdsZS1sb2NhdGlvbi1zZXR0aW5ncycpLnNsaWRlVXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJyNtdWx0aXBsZS1sb2NhdGlvbnMtc2V0dGluZ3MnKS5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICAgICAkKCcjc2wtc2V0dGluZ3MnKS5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICAgICAkKCcjb3BlbmluZy1ob3Vycy1ob3VycycpLnNsaWRlVXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjdXNlX211bHRpcGxlX2xvY2F0aW9ucycpLnJlbW92ZUF0dHIoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5vcGVuXzI0N193cmFwcGVyJykuc2xpZGVVcCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCgnI3VzZV9tdWx0aXBsZV9sb2NhdGlvbnMnKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgJCgnI211bHRpcGxlLWxvY2F0aW9ucy1zZXR0aW5ncycpLnNsaWRlVXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICQoJyNzaW5nbGUtbG9jYXRpb24tc2V0dGluZ3MnKS5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICAgICBpZiAoISQoJyNoaWRlX29wZW5pbmdfaG91cnMnKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjb3BlbmluZy1ob3Vycy1ob3VycycpLnNsaWRlRG93bigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkKCcjc2wtc2V0dGluZ3MnKS5zbGlkZVVwKCk7XG4gICAgICAgICAgICAgICAgJCgnI3VzZV9tdWx0aXBsZV9sb2NhdGlvbnMnKS5yZW1vdmVBdHRyKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcub3Blbl8yNDdfd3JhcHBlcicpLnNsaWRlRG93bigpO1xuXG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJyNoaWRlX29wZW5pbmdfaG91cnMnKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAkKCcjb3BlbmluZy1ob3Vycy1ob3VycywgI29wZW5pbmctaG91cnMtc2V0dGluZ3MnKS5zbGlkZVVwKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAkKCcjb3BlbmluZy1ob3Vycy1zZXR0aW5ncycpLnNsaWRlRG93bigpO1xuICAgICAgICAgICAgaWYgKCEkKCcjdXNlX211bHRpcGxlX2xvY2F0aW9ucycpLmlzKCc6Y2hlY2tlZCcpKSB7XG4gICAgICAgICAgICAgICAgJCgnI29wZW5pbmctaG91cnMtaG91cnMnKS5zbGlkZURvd24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJyNtdWx0aXBsZV9vcGVuaW5nX2hvdXJzLCAjd3BzZW9fbXVsdGlwbGVfb3BlbmluZ19ob3VycycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICQoJy5vcGVuaW5nLWhvdXJzIC5vcGVuaW5nLWhvdXJzLXNlY29uZCcpLnNsaWRlRG93bigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgJCgnLm9wZW5pbmctaG91cnMgLm9wZW5pbmctaG91cnMtc2Vjb25kJykuc2xpZGVVcCgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnI29wZW5pbmdfaG91cnNfMjRoJykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKCcjb3BlbmluZy1ob3Vycy1jb250YWluZXIgc2VsZWN0JykuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKHRoaXMpLmZpbmQoJ29wdGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICgkKCcjb3BlbmluZ19ob3Vyc18yNGgnKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBVc2UgMjQgaG91clxuICAgICAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSAhPSAnY2xvc2VkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50ZXh0KCQodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNlIDEyIGhvdXJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgIT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNwbGl0IHRoZSBzdHJpbmcgYmV0d2VlbiBob3VycyBhbmQgbWludXRlc1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWUgPSAkKHRoaXMpLnZhbCgpLnNwbGl0KCc6Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZSBwYXJzZUludCB0byByZW1vdmUgbGVhZGluZyB6ZXJvZXMuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG91ciA9IHBhcnNlSW50KHRpbWVbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1pbnV0ZXMgPSB0aW1lWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN1ZmZpeCA9ICdBTSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgaG91cnMgbnVtYmVyIGlzIGdyZWF0ZXIgdGhhbiAxMiwgc3VidHJhY3QgMTIuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaG91ciA+PSAxMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob3VyID4gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaG91ciA9IGhvdXIgLSAxMjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VmZml4ID0gJ1BNJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob3VyID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob3VyID0gMTI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudGV4dChob3VyICsgJzonICsgbWludXRlcyArICcgJyArIHN1ZmZpeCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBHZW5lcmFsIFNldHRpbmdzOiBFbmFibGUvZGlzYWJsZSBPcGVuIDI0Lzcgb24gY2xpY2tcbiAgICAkKCcjb3Blbl8yNDcnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghJCgnI3VzZV9tdWx0aXBsZV9sb2NhdGlvbnMnKS5pcyhcIjpjaGVja2VkXCIpKSB7XG4gICAgICAgICAgICBtYXliZUNsb3NlT3BlbmluZ0hvdXJzKHRoaXMpO1xuICAgICAgICAgICAgJCgnLm9wZW5fMjQ3X3dyYXBwZXInKS5zaG93KClcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU2luZ2xlIExvY2F0aW9uOiBFbmFibGUvZGlzYWJsZSBPcGVuIDI0Lzcgb24gY2xpY2tcbiAgICAkKCcjd3BzZW9fb3Blbl8yNDcnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG1heWJlQ2xvc2VPcGVuaW5nSG91cnModGhpcyk7XG4gICAgfSk7XG5cbiAgICAvLyBEaXNhYmxlIGhvdXJzIDI0Lzcgb24gY2xpY2tcbiAgICAkKCcud3BzZW9fb3Blbl8yNGggaW5wdXQnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoJCh0aGlzKS5pcyhcIjpjaGVja2VkXCIpKSB7XG4gICAgICAgICAgICAkKCdzZWxlY3QnLCAkKCcub3BlbmluZ2hvdXJzLXdyYXBwZXInLCAkKHRoaXMpLmNsb3Nlc3QoJy5vcGVuaW5nLWhvdXJzJykpKS5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnc2VsZWN0JywgJCgnLm9wZW5pbmdob3Vycy13cmFwcGVyJywgJCh0aGlzKS5jbG9zZXN0KCcub3BlbmluZy1ob3VycycpKSkuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIG1heWJlQ2xvc2VPcGVuaW5nSG91cnMoZWxlbSkge1xuICAgICAgICBpZiAoJChlbGVtKS5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgJCgnI29wZW5pbmctaG91cnMtcm93cywgLm9wZW5pbmctaG91cnMtd3JhcCcpLnNsaWRlVXAoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJyNvcGVuaW5nLWhvdXJzLXJvd3MsIC5vcGVuaW5nLWhvdXJzLXdyYXAnKS5zbGlkZURvd24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoJy53aWRnZXQtY29udGVudCcpLm9uKCdjbGljaycsICcjd3BzZW8tY2hlY2tib3gtbXVsdGlwbGUtbG9jYXRpb25zLXdyYXBwZXIgaW5wdXRbdHlwZT1jaGVja2JveF0nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHdwc2VvX3Nob3dfYWxsX2xvY2F0aW9uc19zZWxlY3Rib3goJCh0aGlzKSk7XG4gICAgfSk7XG5cbiAgICAvLyBTaG93IGxvY2F0aW9ucyBtZXRhYm94IGJlZm9yZSBXUCBTRU8gbWV0YWJveFxuICAgIGlmICgkKCcjd3BzZW9fbG9jYXRpb25zJykubGVuZ3RoID4gMCAmJiAkKCcjd3BzZW9fbWV0YScpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCgnI3dwc2VvX2xvY2F0aW9ucycpLmluc2VydEJlZm9yZSgkKCcjd3BzZW9fbWV0YScpKTtcbiAgICB9XG5cbiAgICAkKCcub3BlbmluZ2hvdXJzX2Zyb20nKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9faWQgPSAkKHRoaXMpLmF0dHIoJ2lkJykucmVwbGFjZSgnX2Zyb20nLCAnX3RvX3dyYXBwZXInKTtcbiAgICAgICAgdmFyIHNlY29uZF9pZCA9ICQodGhpcykuYXR0cignaWQnKS5yZXBsYWNlKCdfZnJvbScsICdfc2Vjb25kJyk7XG5cbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgICAgICQoJyMnICsgdG9faWQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAkKCcjJyArIHNlY29uZF9pZCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJyMnICsgdG9faWQpLmNzcygnZGlzcGxheScsICdpbmxpbmUnKTtcbiAgICAgICAgICAgICQoJyMnICsgc2Vjb25kX2lkKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgfVxuICAgIH0pLmNoYW5nZSgpO1xuICAgICQoJy5vcGVuaW5naG91cnNfZnJvbV9zZWNvbmQnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9faWQgPSAkKHRoaXMpLmF0dHIoJ2lkJykucmVwbGFjZSgnX2Zyb20nLCAnX3RvX3dyYXBwZXInKTtcblxuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnY2xvc2VkJykge1xuICAgICAgICAgICAgJCgnIycgKyB0b19pZCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICQoJyMnICsgdG9faWQpLmNzcygnZGlzcGxheScsICdpbmxpbmUnKTtcbiAgICAgICAgfVxuICAgIH0pLmNoYW5nZSgpO1xuICAgICQoJy5vcGVuaW5naG91cnNfdG8nKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZnJvbV9pZCA9ICQodGhpcykuYXR0cignaWQnKS5yZXBsYWNlKCdfdG8nLCAnX2Zyb20nKTtcbiAgICAgICAgdmFyIHRvX2lkID0gJCh0aGlzKS5hdHRyKCdpZCcpLnJlcGxhY2UoJ190bycsICdfdG9fd3JhcHBlcicpO1xuICAgICAgICBpZiAoJCh0aGlzKS52YWwoKSA9PSAnY2xvc2VkJykge1xuICAgICAgICAgICAgJCgnIycgKyB0b19pZCkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICQoJyMnICsgZnJvbV9pZCkudmFsKCdjbG9zZWQnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJy5vcGVuaW5naG91cnNfdG9fc2Vjb25kJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGZyb21faWQgPSAkKHRoaXMpLmF0dHIoJ2lkJykucmVwbGFjZSgnX3RvJywgJ19mcm9tJyk7XG4gICAgICAgIHZhciB0b19pZCA9ICQodGhpcykuYXR0cignaWQnKS5yZXBsYWNlKCdfdG8nLCAnX3RvX3dyYXBwZXInKTtcbiAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT0gJ2Nsb3NlZCcpIHtcbiAgICAgICAgICAgICQoJyMnICsgdG9faWQpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAkKCcjJyArIGZyb21faWQpLnZhbCgnY2xvc2VkJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgkKCcuc2V0X2N1c3RvbV9pbWFnZXMnKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd3AgIT09ICd1bmRlZmluZWQnICYmIHdwLm1lZGlhICYmIHdwLm1lZGlhLmVkaXRvcikge1xuICAgICAgICAgICAgJCgnLndyYXAnKS5vbignY2xpY2snLCAnLnNldF9jdXN0b21faW1hZ2VzJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIGJ1dHRvbiA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIGlkID0gYnV0dG9uLmF0dHIoJ2RhdGEtaWQnKTtcbiAgICAgICAgICAgICAgICB3cC5tZWRpYS5lZGl0b3Iuc2VuZC5hdHRhY2htZW50ID0gZnVuY3Rpb24gKHByb3BzLCBhdHRhY2htZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhdHRhY2htZW50Lmhhc093blByb3BlcnR5KCdzaXplcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gYXR0YWNobWVudC5zaXplc1twcm9wcy5zaXplXS51cmw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gYXR0YWNobWVudC51cmw7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAkKCcjJyArIGlkICsgJ19pbWFnZV9jb250YWluZXInKS5hdHRyKCdzcmMnLCB1cmwpO1xuICAgICAgICAgICAgICAgICAgICAkKCcud3BzZW8tbG9jYWwtJyArIGlkICsgJy13cmFwcGVyIC53cHNlby1sb2NhbC1oaWRlLWJ1dHRvbicpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2hpZGRlbl8nICsgaWQpLmF0dHIoJ3ZhbHVlJywgYXR0YWNobWVudC5pZCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB3cC5tZWRpYS5lZGl0b3Iub3BlbihidXR0b24pO1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgJCgnLnJlbW92ZV9jdXN0b21faW1hZ2UnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWlkJyk7XG4gICAgICAgICQoJyMnICsgaWQpLmF0dHIoJ3NyYycsICcnKS5oaWRlKCk7XG4gICAgICAgICQoJyNoaWRkZW5fJyArIGlkKS5hdHRyKCd2YWx1ZScsICcnKTtcbiAgICAgICAgJCgnLndwc2VvLWxvY2FsLScgKyBpZCArICctd3JhcHBlciAud3BzZW8tbG9jYWwtaGlkZS1idXR0b24nKS5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICAvLyBDb3B5IGxvY2F0aW9uIGRhdGFcbiAgICAkKCcjd3BzZW9fY29weV9mcm9tX2xvY2F0aW9uJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxvY2F0aW9uX2lkID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgICBpZiAobG9jYXRpb25faWQgPT0gJycpXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgJC5wb3N0KHdwc2VvX2xvY2FsX2RhdGEuYWpheHVybCwge1xuICAgICAgICAgICAgbG9jYXRpb25faWQ6IGxvY2F0aW9uX2lkLFxuICAgICAgICAgICAgc2VjdXJpdHk6IHdwc2VvX2xvY2FsX2RhdGEuc2VjX25vbmNlLFxuICAgICAgICAgICAgYWN0aW9uOiAnd3BzZW9fY29weV9sb2NhdGlvbidcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKHJlc3VsdC5jaGFyQXQocmVzdWx0Lmxlbmd0aCAtIDEpID09IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQuc2xpY2UoMCwgLTEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0LnN1YnN0cmluZyhyZXN1bHQubGVuZ3RoIC0gMikgPT0gXCItMVwiKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gcmVzdWx0LnNsaWNlKDAsIC0yKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGRhdGEgPSAkLnBhcnNlSlNPTihyZXN1bHQpO1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAndHJ1ZScgfHwgZGF0YS5zdWNjZXNzID09IHRydWUpIHtcblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gZGF0YS5sb2NhdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkYXRhLmxvY2F0aW9uW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZhbHVlICE9ICcnICYmIHR5cGVvZiB2YWx1ZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT0gJ2lzX3Bvc3RhbF9hZGRyZXNzJyB8fCBpID09ICdtdWx0aXBsZV9vcGVuaW5nX2hvdXJzJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PSAnMScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3dwc2VvXycgKyBpKS5hdHRyKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm9wZW5pbmctaG91cnMgLm9wZW5pbmctaG91ci1zZWNvbmQnKS5zbGlkZURvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChpLmluZGV4T2YoJ29wZW5pbmdfaG91cnMnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnIycgKyBpKS52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3dwc2VvXycgKyBpKS52YWwodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbn0pO1xuXG53aW5kb3cud3BzZW9fc2hvd19hbGxfbG9jYXRpb25zX3NlbGVjdGJveCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAkID0galF1ZXJ5O1xuXG4gICAgJG9iaiA9ICQob2JqKTtcbiAgICB2YXIgcGFyZW50ID0gJG9iai5wYXJlbnRzKCcud2lkZ2V0LWluc2lkZScpO1xuICAgIHZhciAkbG9jYXRpb25zV3JhcHBlciA9ICQoJyN3cHNlby1sb2NhdGlvbnMtd3JhcHBlcicsIHBhcmVudCk7XG5cbiAgICBpZiAoJG9iai5pcygnOmNoZWNrZWQnKSkge1xuICAgICAgICAkbG9jYXRpb25zV3JhcHBlci5zbGlkZVVwKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAkbG9jYXRpb25zV3JhcHBlci5zbGlkZURvd24oKTtcbiAgICB9XG59XG4iXX0=
