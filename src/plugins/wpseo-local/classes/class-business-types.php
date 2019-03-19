<?php
/**
 * @package WPSEO_Local\Main
 * @since   7.7
 */

if ( ! class_exists( 'WPSEO_Local_Business_Types_Repository' ) ) {

	/**
	 * WPSEO_Local_Business_Types_Repository class. Handles all basic needs for the plugin, like custom post_type/taxonomy.
	 */
	class WPSEO_Local_Business_Types_Repository {

		/**
		 * An array of business types.
		 *
		 * @var array
		 */
		public $business_types = array();

		/**
		 * Constructor for the WPSEO_Local_Core class.
		 *
		 * @since 7.7
		 */
		public function __construct() {
			$this->setup();
		}

		/**
		 * Setup functionality and hooks for this class.
		 *
		 * @since 7.7
		 */
		public function setup() {
			$this->set_business_types();
		}

		/**
		 * Add predefined business types to a filterable array.
		 *
		 * @since 7.7
		 */
		private function set_business_types() {
			$business_types = array(
				'Organization'                => __( 'Organization', 'yoast-local-seo' ),
				'Corporation'                 => __( 'Corporation', 'yoast-local-seo' ),
				'GovernmentOrganization'      => __( 'Government Organization', 'yoast-local-seo' ),
				'NGO'                         => __( 'NGO', 'yoast-local-seo' ),
				'EducationalOrganization'     => array(
					__( 'Educational Organization', 'yoast-local-seo' ),
					array(
						'CollegeOrUniversity' => __( 'College or University', 'yoast-local-seo' ),
						'ElementarySchool'    => __( 'Elementary School', 'yoast-local-seo' ),
						'HighSchool'          => __( 'High School', 'yoast-local-seo' ),
						'MiddleSchool'        => __( 'Middle School', 'yoast-local-seo' ),
						'Preschool'           => __( 'Preschool', 'yoast-local-seo' ),
						'School'              => __( 'School', 'yoast-local-seo' ),
					),
				),
				'PerformingGroup'             => array(
					__( 'Performing Group', 'yoast-local-seo' ),
					array(
						'DanceGroup'   => __( 'Dance Group', 'yoast-local-seo' ),
						'MusicGroup'   => __( 'Music Group', 'yoast-local-seo' ),
						'TheaterGroup' => __( 'Theater Group', 'yoast-local-seo' ),
					),
				),
				'SportsTeam'                  => __( 'Sports Team', 'yoast-local-seo' ),
				'LocalBusiness'               => __( 'Local Business', 'yoast-local-seo' ),
				'AnimalShelter'               => __( 'Animal Shelter', 'yoast-local-seo' ),
				'AutomotiveBusiness'          => array(
					__( 'Automotive Business', 'yoast-local-seo' ),
					array(
						'AutoBodyShop'     => __( 'Auto Body Shop', 'yoast-local-seo' ),
						'AutoDealer'       => __( 'Auto Dealer', 'yoast-local-seo' ),
						'AutoPartsStore'   => __( 'Auto Parts Store', 'yoast-local-seo' ),
						'AutoRental'       => __( 'Auto Rental', 'yoast-local-seo' ),
						'AutoRepair'       => __( 'Auto Repair', 'yoast-local-seo' ),
						'AutoWash'         => __( 'Auto Wash', 'yoast-local-seo' ),
						'GasStation'       => __( 'Gas Station', 'yoast-local-seo' ),
						'MotorcycleDealer' => __( 'Motorcycle Dealer', 'yoast-local-seo' ),
						'MotorcycleRepair' => __( 'Motorcycle Repair', 'yoast-local-seo' ),
					),
				),
				'ChildCare'                   => __( 'Child Care', 'yoast-local-seo' ),
				'DryCleaningOrLaundry'        => __( 'Dry Cleaning or Laundry', 'yoast-local-seo' ),
				'EmergencyService'            => array(
					__( 'Emergency Service', 'yoast-local-seo' ),
					array(
						'FireStation'   => __( 'Fire Station', 'yoast-local-seo' ),
						'Hospital'      => __( 'Hospital', 'yoast-local-seo' ),
						'PoliceStation' => __( 'Police Station', 'yoast-local-seo' ),
					),
				),
				'EmploymentAgency'            => __( 'Employment Agency', 'yoast-local-seo' ),
				'EntertainmentBusiness'       => array(
					__( 'Entertainment Business', 'yoast-local-seo' ),
					array(
						'AdultEntertainment' => __( 'Adult Entertainment', 'yoast-local-seo' ),
						'AmusementPark'      => __( 'Amusement Park', 'yoast-local-seo' ),
						'ArtGallery'         => __( 'Art Gallery', 'yoast-local-seo' ),
						'Casino'             => __( 'Casino', 'yoast-local-seo' ),
						'ComedyClub'         => __( 'Comedy Club', 'yoast-local-seo' ),
						'MovieTheater'       => __( 'Movie Theater', 'yoast-local-seo' ),
						'NightClub'          => __( 'Night Club', 'yoast-local-seo' ),
					),
				),
				'LegalService'                => array(
					__( 'Legal Service', 'yoast-local-seo' ),
					array(
						'Notary' => __( 'Notary', 'yoast-local-seo' ),
					),
				),
				'FinancialService'            => array(
					__( 'Financial Service', 'yoast-local-seo' ),
					array(
						'AccountingService' => __( 'Accounting Service', 'yoast-local-seo' ),
						'AutomatedTeller'   => __( 'Automated Teller', 'yoast-local-seo' ),
						'BankOrCreditUnion' => __( 'Bank or Credit Union', 'yoast-local-seo' ),
						'InsuranceAgency'   => __( 'Insurance Agency', 'yoast-local-seo' ),
					),
				),
				'FoodEstablishment'           => array(
					__( 'Food Establishment', 'yoast-local-seo' ),
					array(
						'Bakery'             => __( 'Bakery', 'yoast-local-seo' ),
						'BarOrPub'           => __( 'Bar or Pub', 'yoast-local-seo' ),
						'Brewery'            => __( 'Brewery', 'yoast-local-seo' ),
						'CafeOrCoffeeShop'   => __( 'Cafe or Coffee Shop', 'yoast-local-seo' ),
						'FastFoodRestaurant' => __( 'Fast Food Restaurant', 'yoast-local-seo' ),
						'IceCreamShop'       => __( 'Ice Cream Shop', 'yoast-local-seo' ),
						'Restaurant'         => __( 'Restaurant', 'yoast-local-seo' ),
						'Winery'             => __( 'Winery', 'yoast-local-seo' ),
					),
				),
				'GovernmentOffice'            => array(
					__( 'Government Office', 'yoast-local-seo' ),
					array(
						'PostOffice' => __( 'Post Office', 'yoast-local-seo' ),
					),
				),
				'HealthAndBeautyBusiness'     => array(
					__( 'Health And Beauty Business', 'yoast-local-seo' ),
					array(
						'BeautySalon'  => __( 'Beauty Salon', 'yoast-local-seo' ),
						'DaySpa'       => __( 'Day Spa', 'yoast-local-seo' ),
						'HairSalon'    => __( 'Hair Salon', 'yoast-local-seo' ),
						'HealthClub'   => __( 'Health Club', 'yoast-local-seo' ),
						'NailSalon'    => __( 'Nail Salon', 'yoast-local-seo' ),
						'TattooParlor' => __( 'Tattoo Parlor', 'yoast-local-seo' ),
					),
				),
				'HomeAndConstructionBusiness' => array(
					__( 'Home And Construction Business', 'yoast-local-seo' ),
					array(
						'Electrician'       => __( 'Electrician', 'yoast-local-seo' ),
						'GeneralContractor' => __( 'General Contractor', 'yoast-local-seo' ),
						'HVACBusiness'      => __( 'HVAC Business', 'yoast-local-seo' ),
						'HousePainter'      => __( 'House Painter', 'yoast-local-seo' ),
						'Locksmith'         => __( 'Locksmith', 'yoast-local-seo' ),
						'MovingCompany'     => __( 'Moving Company', 'yoast-local-seo' ),
						'Plumber'           => __( 'Plumber', 'yoast-local-seo' ),
						'RoofingContractor' => __( 'Roofing Contractor', 'yoast-local-seo' ),
					),
				),
				'InternetCafe'                => __( 'Internet Cafe', 'yoast-local-seo' ),
				'Library'                     => __( 'Library', 'yoast-local-seo' ),
				'LodgingBusiness'             => array(
					__( 'Lodging Business', 'yoast-local-seo' ),
					array(
						'BedAndBreakfast'     => __( 'Bed And Breakfast', 'yoast-local-seo' ),
						'Hostel'              => __( 'Hostel', 'yoast-local-seo' ),
						'Hotel'               => __( 'Hotel', 'yoast-local-seo' ),
						'Motel'               => __( 'Motel', 'yoast-local-seo' ),
						'MedicalOrganization' => __( 'Medical Organization', 'yoast-local-seo' ),
						'Dentist'             => __( 'Dentist', 'yoast-local-seo' ),
						'DiagnosticLab'       => __( 'Diagnostic Lab', 'yoast-local-seo' ),
						'Hospital'            => __( 'Hospital', 'yoast-local-seo' ),
						'MedicalClinic'       => __( 'Medical Clinic', 'yoast-local-seo' ),
						'Optician'            => __( 'Optician', 'yoast-local-seo' ),
						'Pharmacy'            => __( 'Pharmacy', 'yoast-local-seo' ),
						'Physician'           => __( 'Physician', 'yoast-local-seo' ),
						'VeterinaryCare'      => __( 'Veterinary Care', 'yoast-local-seo' ),
					),
				),
				'RadioStation'                => __( 'Radio Station', 'yoast-local-seo' ),
				'RealEstateAgent'             => __( 'Real Estate Agent', 'yoast-local-seo' ),
				'RecyclingCenter'             => __( 'Recycling Center', 'yoast-local-seo' ),
				'SelfStorage'                 => __( 'Self Storage', 'yoast-local-seo' ),
				'ShoppingCenter'              => __( 'Shopping Center', 'yoast-local-seo' ),
				'SportsActivityLocation'      => array(
					__( 'Sports Activity Location', 'yoast-local-seo' ),
					array(
						'BowlingAlley'       => __( 'Bowling Alley', 'yoast-local-seo' ),
						'ExerciseGym'        => __( 'Exercise Gym', 'yoast-local-seo' ),
						'GolfCourse'         => __( 'Golf Course', 'yoast-local-seo' ),
						'HealthClub'         => __( 'Health Club', 'yoast-local-seo' ),
						'PublicSwimmingPool' => __( 'Public Swimming Pool', 'yoast-local-seo' ),
						'SkiResort'          => __( 'Ski Resort', 'yoast-local-seo' ),
						'SportsClub'         => __( 'Sports Club', 'yoast-local-seo' ),
						'StadiumOrArena'     => __( 'Stadium or Arena', 'yoast-local-seo' ),
						'TennisComplex'      => __( 'Tennis Complex', 'yoast-local-seo' ),
					),
				),
				'Store'                       => array(
					__( 'Store', 'yoast-local-seo' ),
					array(
						'AutoPartsStore'       => __( 'Auto Parts Store', 'yoast-local-seo' ),
						'BikeStore'            => __( 'Bike Store', 'yoast-local-seo' ),
						'BookStore'            => __( 'Book Store', 'yoast-local-seo' ),
						'ClothingStore'        => __( 'Clothing Store', 'yoast-local-seo' ),
						'ComputerStore'        => __( 'Computer Store', 'yoast-local-seo' ),
						'ConvenienceStore'     => __( 'Convenience Store', 'yoast-local-seo' ),
						'DepartmentStore'      => __( 'Department Store', 'yoast-local-seo' ),
						'ElectronicsStore'     => __( 'Electronics Store', 'yoast-local-seo' ),
						'Florist'              => __( 'Florist', 'yoast-local-seo' ),
						'FurnitureStore'       => __( 'Furniture Store', 'yoast-local-seo' ),
						'GardenStore'          => __( 'Garden Store', 'yoast-local-seo' ),
						'GroceryStore'         => __( 'Grocery Store', 'yoast-local-seo' ),
						'HardwareStore'        => __( 'Hardware Store', 'yoast-local-seo' ),
						'HobbyShop'            => __( 'Hobby Shop', 'yoast-local-seo' ),
						'HomeGoodsStore'       => __( 'HomeGoods Store', 'yoast-local-seo' ),
						'JewelryStore'         => __( 'Jewelry Store', 'yoast-local-seo' ),
						'LiquorStore'          => __( 'Liquor Store', 'yoast-local-seo' ),
						'MensClothingStore'    => __( 'Mens Clothing Store', 'yoast-local-seo' ),
						'MobilePhoneStore'     => __( 'Mobile Phone Store', 'yoast-local-seo' ),
						'MovieRentalStore'     => __( 'Movie Rental Store', 'yoast-local-seo' ),
						'MusicStore'           => __( 'Music Store', 'yoast-local-seo' ),
						'OfficeEquipmentStore' => __( 'Office Equipment Store', 'yoast-local-seo' ),
						'OutletStore'          => __( 'Outlet Store', 'yoast-local-seo' ),
						'PawnShop'             => __( 'Pawn Shop', 'yoast-local-seo' ),
						'PetStore'             => __( 'Pet Store', 'yoast-local-seo' ),
						'ShoeStore'            => __( 'Shoe Store', 'yoast-local-seo' ),
						'SportingGoodsStore'   => __( 'Sporting Goods Store', 'yoast-local-seo' ),
						'TireShop'             => __( 'Tire Shop', 'yoast-local-seo' ),
						'ToyStore'             => __( 'Toy Store', 'yoast-local-seo' ),
						'WholesaleStore'       => __( 'Wholesale Store', 'yoast-local-seo' ),
					),
				),
				'TelevisionStation'           => __( 'Television Station', 'yoast-local-seo' ),
				'TouristInformationCenter'    => __( 'Tourist Information Center', 'yoast-local-seo' ),
				'TravelAgency'                => __( 'Travel Agency', 'yoast-local-seo' ),
				'Airport'                     => __( 'Airport', 'yoast-local-seo' ),
				'Aquarium'                    => __( 'Aquarium', 'yoast-local-seo' ),
				'Beach'                       => __( 'Beach', 'yoast-local-seo' ),
				'BusStation'                  => __( 'BusStation', 'yoast-local-seo' ),
				'BusStop'                     => __( 'BusStop', 'yoast-local-seo' ),
				'Campground'                  => __( 'Campground', 'yoast-local-seo' ),
				'Cemetery'                    => __( 'Cemetery', 'yoast-local-seo' ),
				'Crematorium'                 => __( 'Crematorium', 'yoast-local-seo' ),
				'EventVenue'                  => __( 'Event Venue', 'yoast-local-seo' ),
				'FireStation'                 => __( 'Fire Station', 'yoast-local-seo' ),
				'GovernmentBuilding'          => array(
					__( 'Government Building', 'yoast-local-seo' ),
					array(
						'CityHall'             => __( 'City Hall', 'yoast-local-seo' ),
						'Courthouse'           => __( 'Courthouse', 'yoast-local-seo' ),
						'DefenceEstablishment' => __( 'Defence Establishment', 'yoast-local-seo' ),
						'Embassy'              => __( 'Embassy', 'yoast-local-seo' ),
						'LegislativeBuilding'  => __( 'Legislative Building', 'yoast-local-seo' ),
					),
				),
				'Hospital'                    => __( 'Hospital', 'yoast-local-seo' ),
				'MovieTheater'                => __( 'Movie Theater', 'yoast-local-seo' ),
				'Museum'                      => __( 'Museum', 'yoast-local-seo' ),
				'MusicVenue'                  => __( 'Music Venue', 'yoast-local-seo' ),
				'Park'                        => __( 'Park', 'yoast-local-seo' ),
				'ParkingFacility'             => __( 'Parking Facility', 'yoast-local-seo' ),
				'PerformingArtsTheater'       => __( 'Performing Arts Theater', 'yoast-local-seo' ),
				'PlaceOfWorship'              => array(
					__( 'Place Of Worship', 'yoast-local-seo' ),
					array(
						'BuddhistTemple' => __( 'Buddhist Temple', 'yoast-local-seo' ),
						'CatholicChurch' => __( 'Catholic Church', 'yoast-local-seo' ),
						'Church'         => __( 'Church', 'yoast-local-seo' ),
						'HinduTemple'    => __( 'Hindu Temple', 'yoast-local-seo' ),
						'Mosque'         => __( 'Mosque', 'yoast-local-seo' ),
						'Synagogue'      => __( 'Synagogue', 'yoast-local-seo' ),
					),
				),
				'Playground'                  => __( 'Playground', 'yoast-local-seo' ),
				'PoliceStation'               => __( 'PoliceStation', 'yoast-local-seo' ),
				'RVPark'                      => __( 'RVPark', 'yoast-local-seo' ),
				'StadiumOrArena'              => __( 'StadiumOrArena', 'yoast-local-seo' ),
				'SubwayStation'               => __( 'SubwayStation', 'yoast-local-seo' ),
				'TaxiStand'                   => __( 'TaxiStand', 'yoast-local-seo' ),
				'TrainStation'                => __( 'TrainStation', 'yoast-local-seo' ),
				'Zoo'                         => __( 'Zoo', 'yoast-local-seo' ),
				'Residence'                   => array(
					__( 'Residence', 'yoast-local-seo' ),
					array(
						'ApartmentComplex'        => __( 'Apartment Complex', 'yoast-local-seo' ),
						'GatedResidenceCommunity' => __( 'Gated Residence Community', 'yoast-local-seo' ),
						'SingleFamilyResidence'   => __( 'Single Family Residence', 'yoast-local-seo' ),
					),
				),
			);

			$this->business_types = apply_filters( 'yoast-local-seo-business-types', $business_types );
		}

		/**
		 * Return a flat array of all Business Type options.
		 *
		 * @return array $business_types A flat array of all Business Types.
		 *
		 * @since 1.0
		 */
		public function get_business_types() {
			$business_types = array();

			foreach ( $this->business_types as $key => $value ) {
				if ( is_array( $value ) ) {
					$business_types[ $key ] = $value[0];

					foreach ( $value[1] as $key_sub => $value_sub ) {
						$business_types[ $key_sub ] = '&mdash; ' . $value_sub;
					}
				}
				else {
					$business_types[ $key ] = $value;
				}
			}

			return $business_types;
		}
	}
}
