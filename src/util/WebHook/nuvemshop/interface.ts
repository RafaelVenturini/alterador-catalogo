export interface Order {
	id: number;
	token: string;
	store_id: number;
	contact_email: string;
	contact_name: string;
	contact_phone: string;
	contact_identification: string;
	shipping_min_days: number;
	shipping_max_days: number;
	billing_name: string;
	billing_phone: string;
	billing_address: string;
	billing_number: string;
	billing_floor: never;
	billing_locality: string;
	billing_zipcode: string;
	billing_city: string;
	billing_province: string;
	billing_country: string;
	billing_customer_type: never;
	billing_business_name: never;
	billing_trade_name: never;
	billing_state_registration: never;
	billing_fiscal_regime: never;
	billing_business_activity: never;
	billing_invoice_use: never;
	billing_document_type: never;
	shipping_cost_owner: string;
	shipping_cost_customer: string;
	coupon: never[];
	promotional_discount: {
		id: never;
		store_id: number;
		order_id: number;
		created_at: string;
		total_discount_amount: string;
		contents: never[];
		promotions_applied: never[];
	};
	subtotal: string;
	discount: string;
	discount_coupon: never;
	discount_gateway: string;
	total: string;
	total_usd: string;
	checkout_enabled: boolean;
	weight: string;
	currency: string;
	language: string;
	gateway: string;
	gateway_id: string;
	gateway_name: string;
	shipping: string;
	shipping_option: string;
	shipping_option_code: string;
	shipping_option_reference: string;
	shipping_pickup_details: never;
	shipping_tracking_number: never;
	shipping_tracking_url: never;
	shipping_store_branch_name: never;
	shipping_store_branch_extra: never;
	shipping_pickup_type: string;
	shipping_suboption: never[];
	storefront: string;
	note: string;
	created_at: string;
	updated_at: string;
	completed_at: {
		date: string;
		timezone_type: number;
		timezone: string;
	};
	next_action: string;
	payment_details: {
		method: string;
		credit_card_company: string;
		installments: number;
	};
	attributes: never[];
	free_shipping_config: {
		min_price_free_shipping: {
			min_price: {
				value: number;
				currency: string;
			};
			enable: number;
		};
		cart_has_free_shipping: boolean;
	};
	payment_count: number;
	payment_status: string;
	order_origin: never;
	same_billing_and_shipping_address: boolean;
	total_paid: string;
	customer: Customer;
	products: OrderItem[];
	customer_visit: {
		created_at: string;
		landing_page: string;
		utm_parameters: {
			utm_campaign: never;
			utm_content: never;
			utm_medium: never;
			utm_source: never;
			utm_term: never;
		};
	};
	fulfillments: [
		{
			id: string;
			number: string;
			assigned_location: {
				location_id: string;
				name: string;
			};
			status: string;
			shipping: {
				type: string;
				extras: {
					shippable: number;
				};
				carrier: {
					name: string;
				};
				option: {
					name: string;
				};
			};
			tracking_info: {
				code: string;
			};
		}
	];
	number: number;
	cancel_reason: never;
	owner_note: never;
	cancelled_at: never;
	closed_at: never;
	read_at: never;
	status: string;
	gateway_link: never;
	has_shippable_products: boolean;
	shipping_carrier_name: string;
	shipping_address: ShippingAddress;
	shipping_status: string;
	shipped_at: never;
	paid_at: string;
	landing_url: string;
	client_details: {
		browser_ip: string;
		user_agent: string;
	};
	app_id: never;
}

export interface OrderItem {
	id: number;
	depth: string;
	height: string;
	name: string;
	name_without_variants: never;
	price: string;
	compare_at_price: string;
	product_id: number;
	image: {
		id: number;
		product_id: number;
		src: string;
		position: number;
		alt: never[];
		height: number;
		width: number;
		thumbnails_generated: number;
		created_at: string;
		updated_at: string;
	};
	quantity: number;
	free_shipping: boolean;
	weight: string;
	width: string;
	variant_id: number;
	variant_values: never[];
	properties: never[];
	sku: string;
	barcode: never;
	has_promotional_price: boolean;
	promotions: {
		percentage_off: number;
	};
	cost: never;
}

interface ShippingAddress {
	address: string;
	city: string;
	country: string;
	created_at: string;
	default: boolean;
	floor: string;
	id: number;
	locality: string;
	name: string;
	number: string;
	phone: string;
	province: string;
	updated_at: string;
	zipcode: string;
	customs: never;
}

export interface Customer {
	id: number;
	name: string;
	email: string;
	identification: string;
	phone: string;
	note: never;
	default_address: Address;
	addresses: Address[];
	billing_name: string;
	billing_phone: string;
	billing_address: string;
	billing_number: string;
	billing_floor: never;
	billing_locality: string;
	billing_zipcode: string;
	billing_city: string;
	billing_province: string;
	billing_country: string;
	total_spent: string;
	total_spent_currency: string;
	last_order_id: number;
	active: boolean;
	first_interaction: string;
	created_at: string;
	updated_at: string;
	customer_type: string;
	business_name: string;
	trade_name: string;
	state_registration: string;
	fiscal_regime: string;
	invoice_use: string;
	document_type: string;
	business_activity: string;
	accepts_marketing: boolean;
	accepts_marketing_updated_at: string;
}

export interface Address {
	address: string;
	city: string;
	country: string;
	created_at: string;
	default: boolean;
	floor: string;
	id: number;
	locality: string;
	name: string;
	number: string;
	phone: string;
	province: string;
	updated_at: string;
	zipcode: string;
}

export interface Insert {
	fieldCount: number;
	affectedRows: number;
	insertId: number;
	info: string;
	serverStatus: number;
	warningStatus: number;
	changedRows: number;
}

export interface WebhookData {
	store_id: number;
	event: string;
	id: number;
}
