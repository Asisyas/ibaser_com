<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package WordPress
 * @subpackage Twenty_Nineteen
 * @since 1.0.0
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="footer site-footer">
		<?php get_template_part( 'template-parts/footer/footer', 'widgets' ); ?>
		<div class="site-info">
			<?php $blog_info = get_bloginfo( 'name' ); ?>
			<?php if ( ! empty( $blog_info ) ) : ?>
				<a class="site-name" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
			<?php endif; ?>

			<div class="footer-navigation--block">
				<?php
				if ( function_exists( 'the_privacy_policy_link' ) ) {
					the_privacy_policy_link( '', '<span role="separator" aria-hidden="true"></span>' );
				}
				?>
				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<nav class="footer-navigation" aria-label="<?php esc_attr_e( 'Footer Menu', 'twentynineteen' ); ?>">
						<?php
						wp_nav_menu(
							array(
								'theme_location' => 'footer',
								'menu_class'     => 'footer-menu',
								'depth'          => 1,
							)
						);
						?>
					</nav><!-- .footer-navigation -->
				<?php endif; ?>
			</div>
		</div><!-- .site-info -->

		<div class="footer-content">
	    <div class="footer-content--block">
       	<div>
	       	<a class="footer-logotype" href="/"></a>
					<ul class="social">
                      
						<li class="social__link--block">
							<a class="instagram social__link is-active-opacity--block" href="https://www.instagram.com" alt="instagram ссылка" target="_blank"></a>
						</li>
						<li class="social__link--block">
							<a class="fb social__link is-active-opacity--block" href="" alt="facebook ссылка" target="_blank"></a>
						</li>
						<li class="social__link--block">
							<a class="youtube social__link is-active-opacity--block" href="" alt="youtube ссылка" target="_blank"></a>
						</li>
						<li class="social__link--block">
							<a class="vk social__link is-active-opacity--block" href="" alt="vk ссылка" target="_blank"></a>
						</li>						
            <li class="social__link--block">
              <a class="telegram social__link is-active-opacity--block" href="https://t.me/ibaser"
                 alt="iBaser.com - школа прыжков с парашютом"
                 target="_blank">
              </a>
            </li>
					</ul>
				</div>
				<div class="footer-contacts">
	        <h4 class="footer__title">Контактная информация</h4>
	        <ul class="footer-contacts--block">
	          <li class="footer-contacts-address">
	            <p>iBaser - школа бейсджампинга</p>
	            <p>Беларусь, Минская область 220047</p>
	            <p>Минск</p>
	          </li>
	          <li class="footer-contacts-phone">
	            <a href="tel:+37529-846-77-34">+375(29) 846 77 34</a>
	          </li>
	          <li class="footer-contacts-mail">
	            <p><a href="mailto:ibaser@gmail.com">ceo@vaderlab.com</a></p>
	          </li>
	        </ul>
				</div>
			</div>
		</div>
	</footer><!-- #colophon -->

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
