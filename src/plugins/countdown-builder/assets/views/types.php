<?php
use ycd\Countdown;
use ycd\AdminHelper;
$types = Countdown::getCountdownTypes();
?>
<div class="ycd-bootstrap-wrapper">
	<div class="row">
		<div class="col-md-12">
			<h3><?php _e('Add New Countdown', YCD_TEXT_DOMAIN); ?></h3>
		</div>
	</div>
	<?php foreach ($types as $type): ?>
        <?php if(YCD_PKG_VERSION > YCD_FREE_VERSION && !$type->isAvailable()): ?>
            <?php continue; ?>
        <?php endif; ?>
		<a class="create-countdown-link" <?php echo AdminHelper::buildCreateCountdownAttrs($type); ?> href="<?php echo AdminHelper::buildCreateCountdownUrl($type); ?>">
            <div class="countdowns-div">
                <div class="ycd-type-div <?php echo AdminHelper::getCountdownThumbClass($type); ?>"></div>
                <?php echo AdminHelper::getCountdownThumbText($type); ?>
                <div class="ycd-type-view-footer">
                    <span class="ycd-promotion-video"><?php echo AdminHelper::getCountdownDisplayName($type); ?></span>
                    <?php if(!$type->isAvailable()): ?>
                        <span class="ycd-play-promotion-video" data-href="<?php echo AdminHelper::getCountdownYoutubeUrl($type); ?>"></span>
                    <?php endif; ?>
                </div> 
            </div>
        </a>
	<?php endforeach; ?>
</div>