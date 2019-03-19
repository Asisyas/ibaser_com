<?php
use ycd\AdminHelper;
$defaultData = AdminHelper::defaultData();
$type = $this->getCurrentTypeFromOptions();
?>
<div class="ycd-bootstrap-wrapper">
	<div class="row form-group">
		<div class="col-md-6">
			<label class="ycd-label-of-input"><?php _e('Time zone', YCD_TEXT_DOMAIN); ?></label>
		</div>
		<div class="col-md-5">
			<?php echo AdminHelper::selectBox($defaultData['clock-time-zone'], esc_attr($this->getOptionValue('ycd-clock3-time-zone')), array('name' => 'ycd-clock3-time-zone','data-target-index' => '3', 'class' => 'js-ycd-select js-circle-time-zone')); ?>
		</div>
	</div>
	<div class="row form-group">
		<div class="col-md-6">
			<label for="ycd-clock3-width" class="ycd-label-of-input"><?php _e('Dimension', YCD_TEXT_DOMAIN); ?></label>
		</div>
		<div class="col-md-5">
			<input type="number" name="ycd-clock3-width" data-target-index="3" class="form-control ycd-clock-width" id="ycd-clock3-width" value="<?php echo esc_attr($this->getOptionValue('ycd-clock3-width')); ?>">
		</div>
		<div class="col-md-1 ycd-label-of-input">
			<?php _e('px', YCD_TEXT_DOMAIN); ?>
		</div>
	</div>
	<div class="row">
		<div class="col-md-6">
			<label class="ycd-label-of-input"><?php _e('Alignment', YCD_TEXT_DOMAIN); ?></label>
		</div>
		<div class="col-md-5">
			<?php echo AdminHelper::selectBox($defaultData['horizontal-alignment'], esc_attr($this->getOptionValue('ycd-clock3-alignment')), array('name' => 'ycd-clock3-alignment', 'class' => 'js-ycd-select ycd-clock3-alignment ycd-clock-alignment')); ?>
		</div>
	</div>
</div>
<?php
require_once YCD_VIEWS_PATH.'preview.php';
?>
<input type="hidden" name="ycd-type" value="<?php echo esc_attr($type); ?>">