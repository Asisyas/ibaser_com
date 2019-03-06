<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="profile" href="https://gmpg.org/xfn/11" />
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'twentynineteen' ); ?></a>

		<header id="masthead" class="header <?php echo is_singular() && twentynineteen_can_show_post_thumbnail() ? 'site-header featured-image' : 'site-header'; ?>">

<div class="header-position">
			<div class="site-branding-container">
				<?php get_template_part( 'template-parts/header/site', 'branding' ); ?>
			</div><!-- .layout-wrap -->

			<div class="header__contacts">
				<ul class="social">
					<li class="social__link--block">
						<a class="instagram social__link" href="https://www.instagram.com" alt="instagram ссылка" target="_blank"></a>
					</li>
					<li class="social__link--block">
						<a class="facebook social__link" href="" alt="facebook ссылка" target="_blank"></a>
					</li>
					<li class="social__link--block">
						<a class="youtube social__link" href="" alt="youtube ссылка" target="_blank"></a>
					</li>
					<li class="social__link--block">
						<a class="vk social__link" href="" alt="vk ссылка" target="_blank"></a>
					</li>
				</ul>
				<ul class="header__phone--block">
					<li class="header__phone">
						<a href="tel:+37529-123-14-25">+37529-123-14-25</a>
					</li>
					<li class="header__phone">
						<a href="tel:+37529-123-14-25">+37529-123-14-25</a>
					</li>
				</ul>
			</div>
</div>

			<?php if ( is_singular() && twentynineteen_can_show_post_thumbnail() ) : ?>
				<div class="site-featured-image">
					<?php
						twentynineteen_post_thumbnail();
						the_post();
						$discussion = ! is_page() && twentynineteen_can_show_post_thumbnail() ? twentynineteen_get_discussion_data() : null;

						$classes = 'entry-header';
					if ( ! empty( $discussion ) && absint( $discussion->responses ) > 0 ) {
						$classes = 'entry-header has-discussion';
					}
					?>
                    
					<div class="<?php echo $classes; ?>">
						<?php get_template_part( 'template-parts/header/entry', 'header' ); ?>
					</div>
                    
					<?php rewind_posts(); ?>
				</div>
			<?php endif; ?>


		</header><!-- #masthead -->

	<div id="content" class="site-content">