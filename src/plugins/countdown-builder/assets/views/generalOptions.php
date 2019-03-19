<?php
use ycd\MultipleChoiceButton;
use ycd\AdminHelper;
$defaultData = AdminHelper::defaultData();
$dueDate = $this->getOptionValue('ycd-date-time-picker');
?>
<div class="ycd-bootstrap-wrapper">
    <div class="ycd-multichoice-wrapper">
    <?php
        $multipleChoiceButton = new MultipleChoiceButton($defaultData['countdown-date-type'], esc_attr($this->getOptionValue('ycd-countdown-date-type')));
        echo $multipleChoiceButton;
    ?>
    </div>
    <div id="ycd-countdown-due-date" class="ycd-countdown-show-text ycd-hide">
        <div class="row form-group">
            <div class="col-md-6">
                <label for="ycd-date-time-picker" class="ycd-label-of-input"></label>
            </div>
            <div class="col-md-6">
                <input type="text" id="ycd-date-time-picker" class="form-control ycd-date-time-picker" name="ycd-date-time-picker" value="<?php echo esc_attr($dueDate); ?>">
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <label for="ycd-date-time-picker" class="ycd-label-of-input"><?php _e('Time Zone', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-6">
                <div class="ycd-select-wrapper">
                <?php echo AdminHelper::selectBox($defaultData['time-zone'], esc_attr($this->getOptionValue('ycd-circle-time-zone')), array('name' => 'ycd-circle-time-zone', 'class' => 'js-ycd-select js-circle-time-zone')); ?>
                </div>
            </div>
        </div>
    </div>
    <div id="ycd-date-duration" class="ycd-countdown-show-text ycd-hide">
        <div class="row form-group">
            <div class="col-md-6">
            </div>
            <div class="col-md-2">
                <label for="ycdCountdownTimeHours"><?php _e('Hrs', YCD_TEXT_DOMAIN); ?></label>
                <input type="number" name="ycd-countdown-duration-hours" id="ycdCountdownTimeHours" min="0" max="60" class="form-control ycd-timer-time-settings" data-type="hours" value="<?php echo esc_attr($this->getOptionValue('ycd-countdown-duration-hours'))?>">
            </div>
            <div class="col-md-2">
                <label for="ycdCountdownTimeMinutes"><?php _e('Mins', YCD_TEXT_DOMAIN); ?></label>
                <input type="number" name="ycd-countdown-duration-minutes" id="ycdCountdownTimeMinutes" min="0" max="60" class="form-control ycd-timer-time-settings" data-type="minutes" value="<?php echo esc_attr($this->getOptionValue('ycd-countdown-duration-minutes'))?>">
            </div>
            <div class="col-md-2">
                <label for="ycdCountdownTimeSeconds"><?php _e('Secs', YCD_TEXT_DOMAIN); ?></label>
                <input type="number" name="ycd-countdown-duration-seconds" id="ycdCountdownTimeSeconds" min="0" max="60" class="form-control ycd-timer-time-settings" data-type="seconds" value="<?php echo esc_attr($this->getOptionValue('ycd-countdown-duration-seconds'))?>">
            </div>
        </div>
    </div>
    <div id="ycd-date-schedule" class="ycd-countdown-show-text ycd-hide">
        <div class="row form-group">
            <div class="col-md-6">
                <label for="ycd-schedule-time-picker" class="ycd-label-of-input"><?php _e('Time Zone', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-6">
                <div class="ycd-select-wrapper">
                    <?php echo AdminHelper::selectBox($defaultData['time-zone'], esc_attr($this->getOptionValue('ycd-schedule-time-zone')), array('name' => 'ycd-schedule-time-zone', 'class' => 'js-ycd-select js-ycd-schedule-time-zone')); ?>
                </div>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <label><?php _e('Start', YCD_TEXT_DOMAIN); ?></label>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <label><?php _e('Week day', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-6">
                <div class="ycd-select-wrapper">
                <?php echo AdminHelper::selectBox(
                    $defaultData['week-days'],
                    esc_attr($this->getOptionValue('ycd-schedule-start-day')),
                    array(
                        'name' => 'ycd-schedule-start-day',
                        'data-week-number-key' => 'startDayNumber',
                        'class' => 'js-ycd-select ycd-date-week-day js-ycd-schedule-start-day'
                    )); ?>
                </div>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
            </div>
            <div class="col-md-2">
                <label class="ycd-label-of-input"><?php _e('from', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-4">
            	<input type="text" name="ycd-schedule-start-from" class="form-control js-datetimepicker-seconds" value="<?php echo esc_attr($this->getOptionValue('ycd-schedule-start-from')); ?>" autocomplete="off">
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <label><?php _e('End', YCD_TEXT_DOMAIN); ?></label>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <label><?php _e('Week day', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-6">
                <div class="ycd-select-wrapper">
                <?php echo AdminHelper::selectBox($defaultData['week-days'],
                    esc_attr($this->getOptionValue('ycd-schedule-end-day')),
                    array(
                        'name' => 'ycd-schedule-end-day',
                        'data-week-number-key' => 'endDayNumber',
                        'class' => 'js-ycd-select ycd-date-week-day js-ycd-schedule-end-day'
                    )
                ); ?>
                </div>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
            </div>
            <div class="col-md-2">
                <label class="ycd-label-of-input"><?php _e('to', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-4">
            	<input type="text" name="ycd-schedule-end-to" class="form-control js-datetimepicker-seconds" value="<?php echo esc_attr($this->getOptionValue('ycd-schedule-end-to')); ?>" autocomplete="off">
            </div>
        </div>
    </div>
<div class="row">
    <div class="col-md-6">
        <label for="ycd-countdown-end-sound" class="ycd-label-of-switch"><?php _e('Timer End Sound', YCD_TEXT_DOMAIN); ?></label>
    </div>
    <div class="col-md-6">
        <label class="ycd-switch">
            <input type="checkbox" id="ycd-countdown-end-sound" name="ycd-countdown-end-sound" class="ycd-accordion-checkbox" <?php echo $this->getOptionValue('ycd-countdown-end-sound'); ?>>
            <span class="ycd-slider ycd-round"></span>
        </label>
    </div>
</div>
<div class="ycd-accordion-content ycd-hide-content">
    <div class="row form-group">
        <div class="col-md-2">
            <input id="js-upload-countdown-end-sound" class="btn btn-sm" type="button" value="<?php _e('Change sound', YCD_TEXT_DOMAIN); ?>">
        </div>
        <div class="col-md-2">
            <input type="button" data-default-song="<?= $this->getDefaultValue('ycd-countdown-end-sound-url'); ?>" id="js-reset-to-default-song" class="btn btn-sm btn-danger" value="<?php _e('Reset', YCD_TEXT_DOMAIN); ?>">
        </div>
        <div class="col-md-5">
            <input type="text" id="js-sound-open-url" readonly="" class="form-control input-sm" name="ycd-countdown-end-sound-url" value="<?= esc_attr($this->getOptionValue('ycd-countdown-end-sound-url')); ?>">
        </div>
        <div class="col-md-1">
            <span class="dashicons dashicons-controls-volumeon js-preview-sound"></span>
        </div>
    </div>
</div>
</div>