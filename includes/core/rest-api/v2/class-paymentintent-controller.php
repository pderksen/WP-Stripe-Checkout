<?php
/**
 * REST API: PaymentIntent Controller
 *
 * @package SimplePay\Core\REST_API\v2
 * @copyright Copyright (c) 2021, Sandhills Development, LLC
 * @license http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since 3.6.0
 */

namespace SimplePay\Core\REST_API\v2;

use SimplePay\Core\REST_API\Controller;
use SimplePay\Core\Payments;
use SimplePay\Core\Legacy;
use SimplePay\Core\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class PaymentIntent_Controller.
 */
class PaymentIntent_Controller extends Controller {

	/**
	 * Endpoint namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'wpsp/v2';

	/**
	 * Route base.
	 *
	 * @var string
	 */
	protected $rest_base = 'paymentintent';

	/**
	 * Registers the routes for PaymentIntents.
	 *
	 * @since 3.6.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			$this->rest_base . '/create',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'create_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);

		register_rest_route(
			$this->namespace,
			$this->rest_base . '/confirm',
			array(
				array(
					'methods'             => \WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'confirm_item' ),
					'permission_callback' => array( $this, 'create_item_permissions_check' ),
					'args'                => $this->get_endpoint_args_for_item_schema( \WP_REST_Server::CREATABLE ),
				),
				'schema' => array( $this, 'get_public_item_schema' ),
			)
		);
	}

	/**
	 * Allows access to the endpoint if all permission checks pass.
	 *
	 * @since 3.6.0
	 *
	 * @param \WP_REST_Request $request Incoming REST API request data.
	 * @return \WP_Error|true Error if a permission check fails.
	 */
	public function create_item_permissions_check( $request ) {
		$checks = array(
			'rate_limit',
			'form_nonce',
			'customer_nonce',
		);

		return $this->permission_checks( $checks, $request );
	}

	/**
	 * Handles an incoming request to create a PaymentIntent.
	 *
	 * @since 3.6.0
	 *
	 * @param \WP_REST_Request $request {
	 *   Incoming REST API request data.
	 *
	 *   @type int   $customer_id Customer ID previously generated with Payment Source.
	 *   @type int   $form_id Form ID used to generate PaymentIntent data.
	 *   @type array $form_data Client-generated formData information.
	 *   @type array $form_values Values of named fields in the payment form.
	 * }
	 * @throws \Exception When required data is missing or cannot be verified.
	 * @return \WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			// Payment Method type.
			$payment_method_type = isset( $request['payment_method_type'] ) ? $request['payment_method_type'] : 'card';

			// Gather customer information.
			$customer_id = isset( $request['customer_id'] ) ? $request['customer_id'] : false;

			if ( ! $customer_id ) {
				throw new \Exception( __( 'A customer must be provided.', 'stripe' ) );
			}

			// Locate form.
			if ( ! isset( $request['form_id'] ) ) {
				throw new \Exception( __( 'Unable to locate payment form.', 'stripe' ) );
			}

			// Gather <form> information.
			$form_id     = $request['form_id'];
			$form_data   = json_decode( $request['form_data'], true );
			$form_values = $request['form_values'];

			$form = simpay_get_form( $form_id );

			if ( false === $form ) {
				throw new \Exception(
					esc_html__( 'Unable to locate payment form.', 'stripe' )
				);
			}

			// Handle legacy form processing.
			Legacy\Hooks\simpay_process_form( $form, $form_data, $form_values, $customer_id );

			// Generate arguments based on form data.
			$paymentintent_args = array_merge(
				Payments\PaymentIntent\get_args_from_payment_form_request( $form, $form_data, $form_values, $customer_id ),
				array(
					'customer' => $customer_id,
					'expand'   => array(
						'customer',
					),
				)
			);

			$paymentintent_args['payment_method_types'] = array( $payment_method_type );

			// @todo Move this to more Payment Method-specific areas.
			switch ( $payment_method_type ) {
				case 'card':
					$payment_method_id = isset( $request['payment_method_id'] )
						? $request['payment_method_id']
						: false;

					if ( false === $payment_method_id ) {
						throw new \Exception( __( 'A Payment Method is required.', 'stripe' ) );
					}

					$paymentintent_args['payment_method'] = $payment_method_id;

					break;
				case 'sepa_debit':
					$paymentintent_args['setup_future_usage'] = 'off_session';
					break;
			}

			/**
			 * Allows processing before a PaymentIntent is created from a payment form request.
			 *
			 * @since 3.6.0
			 *
			 * @param array                         $paymentintent_args Arguments used to create a PaymentIntent.
			 * @param SimplePay\Core\Abstracts\Form $form Form instance.
			 * @param array                         $form_data Form data generated by the client.
			 * @param array                         $form_values Values of named fields in the payment form.
			 * @param int                           $customer_id Stripe Customer ID.
			 */
			do_action(
				'simpay_before_paymentintent_from_payment_form_request',
				$paymentintent_args,
				$form,
				$form_data,
				$form_values,
				$customer_id
			);

			// Generate a PaymentIntent.
			$paymentintent = Payments\PaymentIntent\create(
				$paymentintent_args,
				$form->get_api_request_args()
			);

			/**
			 * Allows further processing after a PaymentIntent is created from a payment form request.
			 *
			 * @since 3.6.0
			 *
			 * @param \SimplePay\Vendor\Stripe\PaymentIntent         $paymentintent Stripe PaymentIntent.
			 * @param SimplePay\Core\Abstracts\Form $form Form instance.
			 * @param array                         $form_data Form data generated by the client.
			 * @param array                         $form_values Values of named fields in the payment form.
			 * @param int                           $customer_id Stripe Customer ID.
			 */
			do_action(
				'simpay_after_paymentintent_from_payment_form_request',
				$paymentintent,
				$form,
				$form_data,
				$form_values,
				$customer_id
			);

			return $this->generate_payment_response( $paymentintent, $form, $form_data, $form_values, $customer_id );
		} catch ( \Exception $e ) {
			return new \WP_REST_Response(
				array(
					'message' => Utils\handle_exception_message( $e ),
				),
				400
			);
		}
	}

	/**
	 * Confirms a PaymentIntent.
	 *
	 * @since 3.6.0
	 *
	 * @param \WP_REST_Request $request {
	 *   Incoming REST API request data.
	 *
	 *   @type string $payment_intent_id PaymentIntent ID.
	 *   @type string $customer_id Customer ID.
	 *   @type int    $form_id Form ID used to generate PaymentIntent data.
	 *   @type array  $form_data Client-generated formData information.
	 *   @type array  $form_values Values of named fields in the payment form.
	 * }
	 * @throws \Exception When required data is missing or cannot be verified.
	 * @return \WP_REST_Response
	 */
	public function confirm_item( $request ) {
		try {
			// Gather PaymentIntent information.
			$paymentintent_id = isset( $request['payment_intent_id'] ) ? $request['payment_intent_id'] : false;

			if ( ! $paymentintent_id ) {
				throw new \Exception( __( 'Unable to locate PaymentIntent', 'stripe' ) );
			}

			// Gather customer information.
			$customer_id = isset( $request['customer_id'] ) ? $request['customer_id'] : false;

			if ( ! $customer_id ) {
				throw new \Exception( __( 'A customer must be provided.', 'stripe' ) );
			}

			// Gather <form> information.
			$form_id     = $request['form_id'];
			$form_data   = $request['form_data'];
			$form_values = $request['form_values'];

			$form = simpay_get_form( $form_id );

			if ( false === $form ) {
				throw new \Exception(
					__( 'Unable to locate payment form.', 'stripe' )
				);
			}

			$paymentintent = Payments\PaymentIntent\confirm(
				$paymentintent_id,
				$form->get_api_request_args()
			);

			return $this->generate_payment_response( $paymentintent, $form, $form_data, $form_values, $customer_id );
		} catch ( \Exception $e ) {
			return new \WP_REST_Response(
				array(
					'message' => Utils\handle_exception_message( $e ),
				),
				400
			);
		}
	}

	/**
	 * Generates a payment response based on the PaymentIntent status.
	 *
	 * @since 3.6.0
	 *
	 * @param \SimplePay\Vendor\Stripe\PaymentIntent $paymentintent Stripe PaymentIntent.
	 * @param \SimplePay\Core\Abstracts\Form         $form Form instance.
	 * @param array                                  $form_data Form data generated by the client.
	 * @param array                                  $form_values Values of named fields in the payment form.
	 * @param int                                    $customer_id Stripe Customer ID.
	 * @return \WP_REST_Response
	 */
	private function generate_payment_response( $paymentintent, $form, $form_data, $form_values, $customer_id ) {
		$response = new \WP_REST_Response( $paymentintent );

		/**
		 * Allows further processing based on a PaymentIntent's status change.
		 *
		 * @since 3.6.0
		 *
		 * @param \SimplePay\Vendor\Stripe\PaymentIntent          $paymentintent Stripe PaymentIntent.
		 * @param \SimplePay\Core\Abstracts\Form $form Form instance.
		 * @param array                          $form_data Form data generated by the client.
		 * @param array                          $form_values Values of named fields in the payment form.
		 * @param int                            $customer_id Stripe Customer ID.
		 */
		do_action(
			'simpay_after_paymentintent_response_from_payment_form_request',
			$paymentintent,
			$form,
			$form_data,
			$form_values,
			$customer_id
		);

		return $response;
	}
}
