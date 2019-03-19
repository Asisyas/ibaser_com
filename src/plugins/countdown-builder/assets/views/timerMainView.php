<?php
use ycd\AdminHelper;
$proSpan = '';
$isPro = '';
if(YCD_PKG_VERSION == YCD_FREE_VERSION) {
	$isPro = '-pro';
	$proSpan = '<span class="ycd-pro-span">'.__('pro', YCD_TEXT_DOMAIN).'</span>';
}
$defaultData = AdminHelper::defaultData();
$textFontFamily = $this->getOptionValue('ycd-text-font-family');
?>
<div class="ycd-bootstrap-wrapper">
	<div class="row form-group">
		<div class="col-md-6">
			<label class="ycd-label-of-input"><?php _e('Time Settings', YCD_TEXT_DOMAIN); ?></label>
		</div>
		<div class="col-md-2">
			<label for="ycdTimeHours"><?php _e('Hrs', YCD_TEXT_DOMAIN); ?></label>
			<input type="number" name="ycd-timer-hours" id="ycdTimeHours" min="0" max="60" class="form-control ycd-timer-time-settings" data-type="hours" value="<?php echo esc_attr($this->getOptionValue('ycd-timer-hours'))?>">
		</div>
		<div class="col-md-2">
			<label for="ycdTimeMinutes"><?php _e('Mins', YCD_TEXT_DOMAIN); ?></label>
			<input type="number" name="ycd-timer-minutes" id="ycdTimeMinutes" min="0" max="60" class="form-control ycd-timer-time-settings" data-type="minutes" value="<?php echo esc_attr($this->getOptionValue('ycd-timer-minutes'))?>">
		</div>
		<div class="col-md-2">
			<label for="ycdTimeSeconds"><?php _e('Secs', YCD_TEXT_DOMAIN); ?></label>
			<input type="number" name="ycd-timer-seconds" id="ycdTimeSeconds" min="0" max="60" class="form-control ycd-timer-time-settings" data-type="seconds" value="<?php echo esc_attr($this->getOptionValue('ycd-timer-seconds'))?>">
		</div>
	</div>
    <div class="row form-group">
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
    <!-- Timer end sound sub options -->
    <div class="ycd-accordion-content ycd-hide-content">
        <div class="row form-group">
            <div class="col-md-2">
                <input id="js-upload-countdown-end-sound" class="btn btn-sm" type="button" value="<?php _e('Change sound', YCD_TEXT_DOMAIN); ?>">
            </div>
            <div class="col-md-4">
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
    <!-- Timer end sound sub options end -->
    <div class="row form-group">
        <div class="col-md-6">
            <label for="ycd-countdown-text-size" class="ycd-label-of-select"><?php _e('Font Family', YCD_TEXT_DOMAIN); echo $proSpan; ?></label>
        </div>
        <div class="col-md-4 ycd-option-wrapper<?php echo $isPro; ?>">
			<?php echo AdminHelper::selectBox($defaultData['font-family'], esc_attr($textFontFamily), array('name' => 'ycd-text-font-family', 'class' => 'js-ycd-select js-countdown-font-family')); ?>
        </div>
    </div>
    <div class="row form-group">
        <div class="col-md-6">
            <label for="ycd-timer-font-size" ><?php _e('Font Size', YCD_TEXT_DOMAIN); ?></label>
        </div>
        <div class="col-md-4 ycd-timer-font-size">
            <input id="ycd-js-digital-font-size" type="text" name="ycd-timer-font-size" value="<?php echo esc_attr($this->getOptionValue('ycd-timer-font-size')); ?>">
        </div>
    </div>
    <div class="row form-group">
        <div class="col-md-6">
            <label for="ycd-timer-content-padding" ><?php _e('Content Padding', YCD_TEXT_DOMAIN); ?></label>
        </div>
        <div class="col-md-4 ycd-timer-font-size">
            <input id="ycd-timer-content-padding" class="form-control" type="text" name="ycd-timer-content-padding" value="<?php echo esc_attr($this->getOptionValue('ycd-timer-content-padding')); ?>">
        </div>
        <div class="col-md-1">
            <label><?php _e('px', YCD_TEXT_DOMAIN); ?></label>
        </div>
    </div>
    <div class="row form-group">
        <div class="col-md-6">
            <label for="ycd-timer-content-alignment" ><?php _e('Alignment', YCD_TEXT_DOMAIN); ?></label>
        </div>
        <div class="col-md-4 ycd-timer-font-size">
	        <?php echo AdminHelper::selectBox($defaultData['horizontal-alignment'], esc_attr($this->getOptionValue('ycd-timer-content-alignment')), array('name' => 'ycd-timer-content-alignment', 'class' => 'js-ycd-select ycd-timer-content-alignment')); ?>
        </div>
    </div>
    <div class="row form-group">
        <div class="col-md-6">
            <label for="ycd-timer-color" ><?php _e('Numbers Color', YCD_TEXT_DOMAIN); echo $proSpan; ?> </label>
        </div>
        <div class="col-md-4 ycd-timer-font-size ycd-option-wrapper<?php echo $isPro; ?>">
            <div class="minicolors minicolors-theme-default minicolors-position-bottom minicolors-position-left">
                <input type="text" id="ycd-timer-color" placeholder="<?php _e('Select color', YCD_TEXT_DOMAIN)?>" name="ycd-timer-color" class="minicolors-input form-control js-ycd-timer-color" value="<?php echo esc_attr($this->getOptionValue('ycd-timer-color')); ?>">
            </div>
        </div>
    </div>
    <div class="row form-group">
        <div class="col-md-6">
            <label for="ycd-timer-bg-image" class="ycd-label-of-switch"><?php _e('Background Image', YCD_TEXT_DOMAIN); echo $proSpan; ?></label>
        </div>
        <div class="col-md-6 ycd-circles-width-wrapper ycd-option-wrapper<?php echo $isPro; ?>">
            <label class="ycd-switch">
                <input type="checkbox" id="ycd-timer-bg-image" name="ycd-timer-bg-image" class="ycd-accordion-checkbox js-ycd-bg-image" <?php echo $this->getOptionValue('ycd-timer-bg-image'); ?>>
                <span class="ycd-slider ycd-round"></span>
            </label>
        </div>
    </div>
    <div class="ycd-accordion-content ycd-hide-content">
        <div class="row form-group">
            <div class="col-md-6">
                <label for="" class="ycd-label-of-select"><?php _e('Background Size', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-6 ycd-circles-width-wrapper">
				<?php echo AdminHelper::selectBox($defaultData['bg-image-size'], esc_attr($this->getOptionValue('ycd-bg-image-size')), array('name' => 'ycd-bg-image-size', 'class' => 'js-ycd-select js-ycd-bg-size')); ?>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <label for="" class="ycd-label-of-select"><?php _e('Background Repeat', YCD_TEXT_DOMAIN); ?></label>
            </div>
            <div class="col-md-6 ycd-circles-width-wrapper">
				<?php echo AdminHelper::selectBox($defaultData['bg-image-repeat'], esc_attr($this->getOptionValue('ycd-bg-image-repeat')), array('name' => 'ycd-bg-image-repeat', 'class' => 'js-ycd-select js-bg-image-repeat')); ?>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-md-6">
                <input id="js-upload-image-button" class="button js-countdown-image-btn" type="button" value="<?php _e('Select Image', YCD_TEXT_DOMAIN)?>">
            </div>
            <div class="col-md-6 ycd-circles-width-wrapper">
                <input type="url" name="ycd-bg-image-url" id="ycd-bg-image-url" class="form-control" value="<?php echo esc_attr($this->getOptionValue('ycd-bg-image-url')); ?>">
            </div>
        </div>
    </div>
    <?php
        require_once YCD_VIEWS_PATH.'preview.php';
    ?>
</div>

<?php
$type = $this->getCurrentTypeFromOptions();
?>
<input type="hidden" name="ycd-type" value="<?= esc_attr($type); ?>">