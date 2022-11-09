<?php
/**
 * REST API: Customer Controller
 *
 * @package SimplePay\Core\REST_API\v2
 * @copyright Copyright (c) 2022, Sandhills Development, LLC
 * @license http://opensource.org/licenses/gpl-2.0.php GNU Public License
 * @since 3.6.0
 */

namespace SimplePay\Core\REST_API\v2;

use SimplePay\Core\Forms\Default_Form;
use SimplePay\Core\REST_API\Controller;
use SimplePay\Core\API;
use SimplePay\Core\Payments;
use SimplePay\Core\Legacy;
use SimplePay\Core\Utils;

use function SimplePay\Core\SimplePay;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Customer_Controller class.
 *
 * @since 3.6.0
 */
class Customer_Controller extends Controller {

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
	protected $rest_base = 'customer';

	/**
	 * Register the routes for Checkout Session.
	 *
	 * @since 3.6.0
	 */
	public function register_routes() {
		register_rest_route(
			$this->namespace,
			$this->rest_base,
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
	}

	/**
	 * Allow POST requests originating from a payment form.
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
			'required_fields',
		);

		return $this->permission_checks( $checks, $request );
	}

	/**
	 * Handle an incoming request to create a Customer.
	 *
	 * @since 3.6.0
	 *
	 * @param \WP_REST_Request $request {
	 *   Incoming REST API request data.
	 *
	 *   @type int   $form_id Form ID used to generate PaymentIntent data.
	 *   @type array $form_data Client-generated formData information.
	 *   @type array $form_values Values of named fields in the payment form.
	 * }
	 * @throws \Exception When required data is missing or cannot be verified.
	 * @return \WP_REST_Response
	 */
	public function create_item( $request ) {
		try {
			// Do not proceed if attempting to set the PaymentMethod or Source (legacy flow).
			if ( isset( $request['payment_method_id'], $request['source_id'] ) ) {
				throw new \Exception(
					__( 'Unable to complete payment.', 'stripe' )
				);
			}

			// Locate form.
			if ( ! isset( $request['form_id'] ) ) {
				throw new \Exception(
					__( 'Unable to locate payment form.', 'stripe' )
				);
			}

			// Gather <form> information.
			$form_id     = $request['form_id'];
			$form_data   = json_decode( $request['form_data'], true );
			$form_values = $request['form_values'];

			$form = simpay_get_form( $form_id );

			if ( false === $form ) {
				throw new \Exception(
					__( 'Unable to locate payment form.', 'stripe' )
				);
			}

			// Handle legacy hook.
			Legacy\Hooks\simpay_pre_process_form( $form, $form_data, $form_values );

			$customer_args = Payments\Customer\get_args_from_payment_form_request(
				$form,
				$form_data,
				$form_values
			);

			// Add separately to avoid overwriting existing metadata.
			if ( ! isset( $customer_args['metadata'] ) || ! is_array( $customer_args['metadata'] ) ) {
				$customer_args['metadata'] = array();
			}

			$customer_args['metadata']['simpay_form_id'] = $form_id;

			/**
			 * Allow further processing before a Customer is created from a posted form.
			 *
			 * @since 3.6.0
			 *
			 * @param array                         $customer_args Arguments used to create a PaymentIntent.
			 * @param SimplePay\Core\Abstracts\Form $form Form instance.
			 * @param array                         $form_data Form data generated by the client.
			 * @param array                         $form_values Values of named fields in the payment form.
			 */
			do_action(
				'simpay_before_customer_from_payment_form_request',
				$customer_args,
				$form,
				$form_data,
				$form_values
			);

			$object_id = ! empty( $request['object_id'] )
				? sanitize_text_field( $request['object_id'] )
				: false;

			if ( false === $object_id ) {
				$customer = API\Customers\create(
					$customer_args,
					$form->get_api_request_args()
				);

				add_filter( 'nonce_life', 'simpay_nonce_life_2_min' );

				$nonce = wp_create_nonce(
					'simpay_payment_form_customer_' . $customer->id
				);

				remove_filter( 'nonce_life', 'simpay_nonce_life_2_min' );
			} else {
				$customer = API\Customers\update(
					$object_id,
					$customer_args,
					$form->get_api_request_args()
				);

				$nonce = '';
			}

			/**
			 * Allow further processing after a Customer is created from a posted form.
			 *
			 * @since 3.6.0
			 *
			 * @param \SimplePay\Vendor\Stripe\Customer              $customer Stripe Customer.
			 * @param SimplePay\Core\Abstracts\Form $form Form instance.
			 * @param array                         $form_data Form data generated by the client.
			 * @param array                         $form_values Values of named fields in the payment form.
			 */
			do_action(
				'simpay_after_customer_from_payment_form_request',
				$customer,
				$form,
				$form_data,
				$form_values
			);

			return new \WP_REST_Response(
				array(
					'customer' => $customer,
					'nonce'    => $nonce,
				)
			);
		} catch ( \Exception $e ) {
			return new \WP_REST_Response(
				array(
					'message' => Utils\handle_exception_message( $e ),
				),
				400
			);
		}
	}
}
