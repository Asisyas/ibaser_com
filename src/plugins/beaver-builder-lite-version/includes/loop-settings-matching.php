<select name="<?php echo $name; ?>_matching">
	<option value="1" <?php selected( $settings->{ $name . '_matching' }, '1' ); ?>><?php printf( _x( 'Match these %s...', '%s is an object like posts or taxonomies.', 'fl-builder' ), $label ); ?></option>
	<option value="0" <?php selected( $settings->{ $name . '_matching' }, '0' ); ?>><?php printf( _x( 'Match all %s except...', '%s is an object like posts or taxonomies.', 'fl-builder' ), $label ); ?></option>
	<?php if ( 'fl_as_terms' === $field['action'] ) : ?>
	<option value="related" <?php selected( $settings->{ $name . '_matching' }, 'related' ); ?>><?php printf( _x( 'Match all related %s except...', '%s is an object like posts or taxonomies.', 'fl-builder' ), $label ); ?></option>
	<?php endif; ?>
</select>
