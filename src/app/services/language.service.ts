import {
  Injectable,
  signal
} from '@angular/core';


export type AppLanguage =
  'en' | 'bn';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  private readonly currentLanguage =
    signal<AppLanguage>(
      this.getSavedLanguage()
    );


  readonly language =
    this.currentLanguage.asReadonly();


  private readonly translations:
    Record<
      string,
      Record<AppLanguage, string>
    > = {


    /* =========================
       COMMON
    ========================= */

    home: {
      en: 'Home',
      bn: 'হোম'
    },

    login: {
      en: 'Login',
      bn: 'লগইন'
    },

    loggingIn: {
      en: 'Logging in...',
      bn: 'লগইন হচ্ছে...'
    },

    password: {
      en: 'Password',
      bn: 'পাসওয়ার্ড'
    },

    dontHaveAccount: {
      en: "Don't have an account?",
      bn: 'আপনার কোনো অ্যাকাউন্ট নেই?'
    },

    createAccount: {
      en: 'Create Account',
      bn: 'অ্যাকাউন্ট তৈরি করুন'
    },

    enterEmailPassword: {
      en: 'Enter email & password',
      bn: 'ইমেইল ও পাসওয়ার্ড দিন'
    },

    noAccountFoundRegisterFirst: {
      en: 'No account found. Please register first.',
      bn: 'কোনো অ্যাকাউন্ট পাওয়া যায়নি। প্রথমে রেজিস্টার করুন।'
    },

    incorrectPassword: {
      en: 'Incorrect password.',
      bn: 'ভুল পাসওয়ার্ড।'
    },

    noResponseFromServer: {
      en: 'No response from server',
      bn: 'সার্ভার থেকে কোনো সাড়া পাওয়া যায়নি'
    },

    loginFailed: {
      en: 'Login failed ❌',
      bn: 'লগইন ব্যর্থ হয়েছে ❌'
    },

    serverWakingUp: {
      en: 'Server is waking up... try again in 10 seconds ⏳',
      bn: 'সার্ভার চালু হচ্ছে... ১০ সেকেন্ড পর আবার চেষ্টা করুন ⏳'
    },

    logout: {
      en: 'Logout',
      bn: 'লগআউট'
    },

    myOrders: {
      en: 'My Orders',
      bn: 'আমার অর্ডার'
    },

    adminDashboard: {
      en: 'Admin Dashboard',
      bn: 'অ্যাডমিন ড্যাশবোর্ড'
    },


    /* =========================
       SEARCH
    ========================= */

    searchProducts: {
      en: 'Search products...',
      bn: 'পণ্য খুঁজুন...'
    },

    searchProductsExample: {
      en: 'Search for products (e.g. oil, rice, eggs)',
      bn: 'পণ্য খুঁজুন (যেমন: তেল, চাল, ডিম)'
    },

    searchResults: {
      en: 'Search Results',
      bn: 'অনুসন্ধানের ফলাফল'
    },

    noProductsFound: {
      en: 'No products found',
      bn: 'কোনো পণ্য পাওয়া যায়নি'
    },

    noProductMatched: {
      en: 'No product matched',
      bn: 'কোনো পণ্য মেলেনি'
    },


    /* =========================
       HOME PAGE
    ========================= */

    trending: {
      en: 'Trending',
      bn: 'ট্রেন্ডিং'
    },

    showLess: {
      en: 'Show Less',
      bn: 'কম দেখুন'
    },

    seeAll: {
      en: 'See All',
      bn: 'সব দেখুন'
    },

    outOfStock: {
      en: 'Out Of Stock',
      bn: 'স্টক শেষ'
    },

    popularCategories: {
      en: 'Popular Categories',
      bn: 'জনপ্রিয় ক্যাটাগরি'
    },

    placeOrder: {
      en: 'Place Order',
      bn: 'অর্ডার করুন'
    },


    /* =========================
       CART
    ========================= */

    items: {
      en: 'Items',
      bn: 'টি পণ্য'
    },


    /* =========================
       LOCATION
    ========================= */

    changeCity: {
      en: 'Change City',
      bn: 'শহর পরিবর্তন করুন'
    },

    dhaka: {
      en: 'Dhaka',
      bn: 'ঢাকা'
    },

    chattogram: {
      en: 'Chattogram',
      bn: 'চট্টগ্রাম'
    },

    sylhet: {
      en: 'Sylhet',
      bn: 'সিলেট'
    },

    rajshahi: {
      en: 'Rajshahi',
      bn: 'রাজশাহী'
    },

    khulna: {
      en: 'Khulna',
      bn: 'খুলনা'
    },

    bangladesh: {
      en: 'Bangladesh',
      bn: 'বাংলাদেশ'
    },


    /* =========================
       CHAT
    ========================= */

    call: {
      en: 'Call',
      bn: 'কল করুন'
    },

    chat: {
      en: 'Chat',
      bn: 'চ্যাট'
    },

    messenger: {
      en: 'Messenger',
      bn: 'মেসেঞ্জার'
    },

    whatsapp: {
      en: 'WhatsApp',
      bn: 'হোয়াটসঅ্যাপ'
    },


    /* =========================
       SIDEBAR FIXED TEXT
    ========================= */

    offers: {
      en: 'Offers',
      bn: 'অফার'
    },

    rewards: {
      en: 'Rewards',
      bn: 'রিওয়ার্ড'
    },

    safetyCenter: {
      en: 'Safety Center',
      bn: 'নিরাপত্তা কেন্দ্র'
    },

    premiumCare: {
      en: 'Premium Care',
      bn: 'প্রিমিয়াম কেয়ার'
    },

    help: {
      en: 'Help',
      bn: 'সহায়তা'
    },

    fileComplaint: {
      en: 'File a Complaint',
      bn: 'অভিযোগ করুন'
    },

    suppliers: {
      en: 'Suppliers',
      bn: 'সরবরাহকারী'
    },


    /* =========================
       FOOTER
    ========================= */

    footerDescription: {
      en: 'Your trusted online grocery shop. Fresh products, fast delivery and the best prices every day.',
      bn: 'আপনার বিশ্বস্ত অনলাইন গ্রোসারি শপ। প্রতিদিন তাজা পণ্য, দ্রুত ডেলিভারি এবং সেরা দাম।'
    },

    customerService: {
      en: 'Customer Service',
      bn: 'গ্রাহক সেবা'
    },

    helpCenter: {
      en: 'Help Center',
      bn: 'সহায়তা কেন্দ্র'
    },

    contactUs: {
      en: 'Contact Us',
      bn: 'যোগাযোগ করুন'
    },

    reportProblem: {
      en: 'Report a Problem',
      bn: 'সমস্যা জানান'
    },

    returnPolicy: {
      en: 'Return Policy',
      bn: 'ফেরত নীতি'
    },

    aboutSuperBangladesh: {
      en: 'About Super Bangladesh',
      bn: 'সুপার বাংলাদেশ সম্পর্কে'
    },

    aboutUs: {
      en: 'About Us',
      bn: 'আমাদের সম্পর্কে'
    },

    careers: {
      en: 'Careers',
      bn: 'ক্যারিয়ার'
    },

    termsConditions: {
      en: 'Terms & Conditions',
      bn: 'শর্তাবলি'
    },

    privacyPolicy: {
      en: 'Privacy Policy',
      bn: 'গোপনীয়তা নীতি'
    },

    dhakaBangladesh: {
      en: 'Dhaka, Bangladesh',
      bn: 'ঢাকা, বাংলাদেশ'
    },

    open247: {
      en: 'Open 24/7',
      bn: '২৪/৭ খোলা'
    },

    allRightsReserved: {
      en: '© 2026 Super Bangladesh. All Rights Reserved.',
      bn: '© ২০২৬ সুপার বাংলাদেশ। সর্বস্বত্ব সংরক্ষিত।'
    },


    /* =========================
       CHECKOUT PAGE
    ========================= */

    secureCheckout: {
      en: 'SECURE CHECKOUT',
      bn: 'নিরাপদ চেকআউট'
    },

    checkout: {
      en: 'Checkout',
      bn: 'চেকআউট'
    },

    completeOrderPayment: {
      en: 'Complete your order details & payment',
      bn: 'আপনার অর্ডারের তথ্য ও পেমেন্ট সম্পূর্ণ করুন'
    },

    shippingFee: {
      en: 'Shipping Fee',
      bn: 'ডেলিভারি চার্জ'
    },

    shippingDetails: {
      en: 'Shipping Details',
      bn: 'ডেলিভারির তথ্য'
    },

    fullName: {
      en: 'Full Name',
      bn: 'পুরো নাম'
    },

    enterFullName: {
      en: 'Enter your full name',
      bn: 'আপনার পুরো নাম লিখুন'
    },

    phoneNumber: {
      en: 'Phone Number',
      bn: 'ফোন নম্বর'
    },

    enterPhoneNumber: {
      en: 'Enter your phone number',
      bn: 'আপনার ফোন নম্বর লিখুন'
    },

    deliveryAddress: {
      en: 'Delivery Address',
      bn: 'ডেলিভারি ঠিকানা'
    },

    writeCompleteAddress: {
      en: 'Write your complete address',
      bn: 'আপনার সম্পূর্ণ ঠিকানা লিখুন'
    },

    paidAmount: {
      en: 'Paid Amount',
      bn: 'পরিশোধিত পরিমাণ'
    },

    enterPaidAmount: {
      en: 'Enter paid amount',
      bn: 'পরিশোধিত পরিমাণ লিখুন'
    },

    paymentMethod: {
      en: 'Payment Method',
      bn: 'পেমেন্ট পদ্ধতি'
    },

    cashOnDelivery: {
      en: 'Cash On Delivery',
      bn: 'ক্যাশ অন ডেলিভারি'
    },

    deliveryLocation: {
      en: 'Delivery Location',
      bn: 'ডেলিভারি লোকেশন'
    },

    searchLocationPlaceholder: {
      en: 'Search area, road, landmark...',
      bn: 'এলাকা, রাস্তা, ল্যান্ডমার্ক খুঁজুন...'
    },

    useMyLocation: {
      en: 'Use My Current Location',
      bn: 'আমার বর্তমান লোকেশন ব্যবহার করুন'
    },

    tapMapToSelect: {
      en: 'Tap on the map or search above to select your exact delivery point',
      bn: 'ম্যাপে ট্যাপ করুন অথবা উপরে সার্চ করে আপনার সঠিক ডেলিভারি পয়েন্ট বেছে নিন'
    },

    locationSelected: {
      en: 'Location selected',
      bn: 'লোকেশন নির্বাচন করা হয়েছে'
    },

    locatingYou: {
      en: 'Finding your location...',
      bn: 'আপনার লোকেশন খোঁজা হচ্ছে...'
    },

    orderDetails: {
      en: 'ORDER DETAILS',
      bn: 'অর্ডারের তথ্য'
    },

    orderSummary: {
      en: 'Order Summary',
      bn: 'অর্ডার সারাংশ'
    },

    qty: {
      en: 'Qty',
      bn: 'পরিমাণ'
    },

    subtotal: {
      en: 'Subtotal',
      bn: 'সাবটোটাল'
    },

    delivery: {
      en: 'Delivery',
      bn: 'ডেলিভারি'
    },

    total: {
      en: 'Total',
      bn: 'সর্বমোট'
    },

    fillAllFields: {
      en: 'Fill all fields ❌',
      bn: 'সব ঘর পূরণ করুন ❌'
    },

    loginRequiredCheckout: {
      en: 'Login required to checkout 🔐',
      bn: 'চেকআউট করতে লগইন করা প্রয়োজন 🔐'
    },

    loginFirst: {
      en: 'Login first ❌',
      bn: 'প্রথমে লগইন করুন ❌'
    },

    orderPlacedSuccess: {
      en: 'Order placed successfully ✅',
      bn: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে ✅'
    },

    orderFailed: {
      en: 'Order failed ❌',
      bn: 'অর্ডার ব্যর্থ হয়েছে ❌'
    },

    geolocationNotSupported: {
      en: 'Location detection is not supported on this device',
      bn: 'এই ডিভাইসে লোকেশন শনাক্তকরণ সমর্থিত নয়'
    },

    geolocationDenied: {
      en: 'Could not access your location. Please allow location access or select on the map.',
      bn: 'আপনার লোকেশন পাওয়া যায়নি। অনুগ্রহ করে লোকেশন অ্যাক্সেস দিন অথবা ম্যাপে সিলেক্ট করুন।'
    },


    /* =========================
       ORDERS PAGE
    ========================= */

    myOrdersTitle: {
      en: 'My Orders',
      bn: 'আমার অর্ডারসমূহ'
    },

    userDashboard: {
      en: 'USER DASHBOARD',
      bn: 'ইউজার ড্যাশবোর্ড'
    },

    trackRecentPurchases: {
      en: 'Track your recent purchases & delivery status',
      bn: 'আপনার সাম্প্রতিক কেনাকাটা ও ডেলিভারি স্ট্যাটাস দেখুন'
    },

    loadingOrders: {
      en: 'Loading orders...',
      bn: 'অর্ডার লোড হচ্ছে...'
    },

    totalAmountLabel: {
      en: 'Total Amount',
      bn: 'মোট পরিমাণ'
    },

    paidAmountLabel: {
      en: 'Paid Amount',
      bn: 'পরিশোধিত পরিমাণ'
    },

    paymentLabel: {
      en: 'Payment',
      bn: 'পেমেন্ট'
    },

    orderedProducts: {
      en: 'Ordered Products',
      bn: 'অর্ডারকৃত পণ্য'
    },

    delete: {
      en: 'Delete',
      bn: 'মুছুন'
    },

    noAddressSelected: {
      en: 'No address provided',
      bn: 'কোনো ঠিকানা দেওয়া হয়নি'
    },

    trackYourOrders: {
      en: 'Track and manage your orders',
      bn: 'আপনার অর্ডার ট্র্যাক ও পরিচালনা করুন'
    },

    noOrdersYet: {
      en: 'No orders yet',
      bn: 'এখনো কোনো অর্ডার নেই'
    },

    startShoppingNow: {
      en: 'Start shopping now to see your orders here',
      bn: 'এখনই কেনাকাটা শুরু করুন, অর্ডার এখানে দেখা যাবে'
    },

    orderNumber: {
      en: 'Order',
      bn: 'অর্ডার'
    },

    placedOn: {
      en: 'Placed on',
      bn: 'অর্ডারের তারিখ'
    },

    orderStatus: {
      en: 'Status',
      bn: 'স্ট্যাটাস'
    },

    statusNew: {
      en: 'New',
      bn: 'নতুন'
    },

    statusProcessing: {
      en: 'Processing',
      bn: 'প্রক্রিয়াধীন'
    },

    statusShipped: {
      en: 'Shipped',
      bn: 'পাঠানো হয়েছে'
    },

    statusDelivered: {
      en: 'Delivered',
      bn: 'ডেলিভারি সম্পন্ন'
    },

    statusCancelled: {
      en: 'Cancelled',
      bn: 'বাতিল'
    },

    statusDone: {
      en: 'Delivered',
      bn: 'ডেলিভারি সম্পন্ন'
    },

    viewDetails: {
      en: 'View Details',
      bn: 'বিস্তারিত দেখুন'
    },

    viewOnMap: {
      en: 'View on Map',
      bn: 'ম্যাপে দেখুন'
    },


    /* =========================
       ADMIN ORDERS PAGE
    ========================= */

    manageOrders: {
      en: 'Manage Orders',
      bn: 'অর্ডার পরিচালনা'
    },

    allOrders: {
      en: 'All Orders',
      bn: 'সকল অর্ডার'
    },

    customer: {
      en: 'Customer',
      bn: 'কাস্টমার'
    },

    contact: {
      en: 'Contact',
      bn: 'যোগাযোগ'
    },

    amount: {
      en: 'Amount',
      bn: 'পরিমাণ'
    },

    date: {
      en: 'Date',
      bn: 'তারিখ'
    },

    action: {
      en: 'Action',
      bn: 'পদক্ষেপ'
    },

    updateStatus: {
      en: 'Update Status',
      bn: 'স্ট্যাটাস আপডেট করুন'
    },

    searchOrders: {
      en: 'Search by name, phone, order id...',
      bn: 'নাম, ফোন, অর্ডার আইডি দিয়ে খুঁজুন...'
    },

    filterByStatus: {
      en: 'Filter by status',
      bn: 'স্ট্যাটাস অনুযায়ী ফিল্টার করুন'
    },

    noOrdersFound: {
      en: 'No orders found',
      bn: 'কোনো অর্ডার পাওয়া যায়নি'
    },

    orderManagement: {
      en: 'Order Management',
      bn: 'অর্ডার ব্যবস্থাপনা'
    },

    manageDeliveryWorkflow: {
      en: 'Manage customer orders and delivery workflow',
      bn: 'কাস্টমার অর্ডার ও ডেলিভারি প্রক্রিয়া পরিচালনা করুন'
    },

    totalOrders: {
      en: 'Total Orders',
      bn: 'মোট অর্ডার'
    },

    allCustomerOrders: {
      en: 'All customer orders',
      bn: 'সকল কাস্টমার অর্ডার'
    },

    totalRevenue: {
      en: 'Total Revenue',
      bn: 'মোট আয়'
    },

    completedOrderEarnings: {
      en: 'Completed order earnings',
      bn: 'সম্পন্ন অর্ডারের আয়'
    },

    ordersInProgress: {
      en: 'Orders in progress',
      bn: 'চলমান অর্ডার'
    },

    completed: {
      en: 'Completed',
      bn: 'সম্পন্ন'
    },

    deliveredSuccessfully: {
      en: 'Delivered successfully',
      bn: 'সফলভাবে ডেলিভারি হয়েছে'
    },

    customerOrder: {
      en: 'Customer Order',
      bn: 'কাস্টমার অর্ডার'
    },

    nameLabel: {
      en: 'Name',
      bn: 'নাম'
    },

    phoneLabel: {
      en: 'Phone',
      bn: 'ফোন'
    },

    addressLabel: {
      en: 'Address',
      bn: 'ঠিকানা'
    },

    emailLabel: {
      en: 'Email',
      bn: 'ইমেইল'
    },

    invoice: {
      en: 'Invoice',
      bn: 'ইনভয়েস'
    },

    receipt: {
      en: 'Receipt',
      bn: 'রশিদ'
    },

    confirmDeleteOrder: {
      en: 'Delete this order?',
      bn: 'এই অর্ডারটি মুছে ফেলতে চান?'
    },


    /* =========================
       ADMIN PANEL — COMMON
       (নতুন admin পেজগুলোতে t('key')
       দিয়ে ব্যবহার করুন)
    ========================= */

    dashboard: {
      en: 'Dashboard',
      bn: 'ড্যাশবোর্ড'
    },

    products: {
      en: 'Products',
      bn: 'পণ্যসমূহ'
    },

    categories: {
      en: 'Categories',
      bn: 'ক্যাটাগরি'
    },

    customers: {
      en: 'Customers',
      bn: 'কাস্টমার'
    },

    banners: {
      en: 'Banners',
      bn: 'ব্যানার'
    },

    inventory: {
      en: 'Inventory',
      bn: 'ইনভেন্টরি'
    },

    finance: {
      en: 'Finance',
      bn: 'হিসাব-নিকাশ'
    },

    analytics: {
      en: 'Analytics',
      bn: 'অ্যানালিটিক্স'
    },

    complaints: {
      en: 'Complaints',
      bn: 'অভিযোগ'
    },

    purchase: {
      en: 'Purchase',
      bn: 'ক্রয়'
    },

    settings: {
      en: 'Settings',
      bn: 'সেটিংস'
    },

    save: {
      en: 'Save',
      bn: 'সংরক্ষণ করুন'
    },

    cancel: {
      en: 'Cancel',
      bn: 'বাতিল করুন'
    },

    edit: {
      en: 'Edit',
      bn: 'সম্পাদনা করুন'
    },

    add: {
      en: 'Add',
      bn: 'যোগ করুন'
    },

    addNew: {
      en: 'Add New',
      bn: 'নতুন যোগ করুন'
    },

    search: {
      en: 'Search',
      bn: 'খুঁজুন'
    },

    loading: {
      en: 'Loading...',
      bn: 'লোড হচ্ছে...'
    },

    productNameEn: {
      en: 'Product Name (English)',
      bn: 'পণ্যের নাম (ইংরেজি)'
    },

    productNameBn: {
      en: 'Product Name (Bangla)',
      bn: 'পণ্যের নাম (বাংলা)'
    },

    descriptionEn: {
      en: 'Description (English)',
      bn: 'বিবরণ (ইংরেজি)'
    },

    descriptionBn: {
      en: 'Description (Bangla)',
      bn: 'বিবরণ (বাংলা)'
    },

    categoryNameEn: {
      en: 'Category Name (English)',
      bn: 'ক্যাটাগরির নাম (ইংরেজি)'
    },

    categoryNameBn: {
      en: 'Category Name (Bangla)',
      bn: 'ক্যাটাগরির নাম (বাংলা)'
    },

    optionalLeaveBlank: {
      en: 'Optional — leave blank to auto-translate common words',
      bn: '(ঐচ্ছিক — খালি রাখলে সাধারণ শব্দগুলো স্বয়ংক্রিয়ভাবে অনুবাদ হবে)'
    },

    adminPanel: {
      en: 'Admin Panel',
      bn: 'অ্যাডমিন প্যানেল'
    },

    homepageFeatures: {
      en: 'Homepage Features',
      bn: 'হোমপেজ ফিচার'
    },

    shopGetMore: {
      en: 'Shop & Get More',
      bn: 'শপ ও আরও পান'
    },

    popularBrandsNav: {
      en: 'Popular Brands',
      bn: 'জনপ্রিয় ব্র্যান্ড'
    },

    footerManagement: {
      en: 'Footer Management',
      bn: 'ফুটার ব্যবস্থাপনা'
    },

    ordersNav: {
      en: 'Orders',
      bn: 'অর্ডার'
    },

    purchaseManagement: {
      en: 'Purchase Management',
      bn: 'ক্রয় ব্যবস্থাপনা'
    },

    purchaseHistory: {
      en: 'Purchase History',
      bn: 'ক্রয়ের ইতিহাস'
    },

    backToShop: {
      en: 'Back to Shop',
      bn: 'শপে ফিরে যান'
    },

  };


  /* =========================
     CATEGORY NAME MAP
  ========================= */

  private readonly categoryBangla:
    Record<string, string> = {


    /* =========================
       MAIN
    ========================= */

    'Food':
      'খাদ্যপণ্য',

    'Baby Care':
      'শিশুর যত্ন',

    'Home & Kitchen':
      'ঘর ও রান্নাঘর',

    'Health & Wellness':
      'স্বাস্থ্য ও সুস্থতা',

    'Stationery & Office':
      'স্টেশনারি ও অফিস',

    'Toys & Sports':
      'খেলনা ও খেলাধুলা',

    'Beauty & MakeUp':
      'সৌন্দর্য ও মেকআপ',


    /* =========================
       COMMON FOOD
    ========================= */

    'Fruits & Vegetables':
      'ফল ও সবজি',

    'Fresh Fruits':
      'তাজা ফল',

    'Fresh Vegetables':
      'তাজা সবজি',

    'Meat & Fish':
      'মাংস ও মাছ',

    'Fish':
      'মাছ',

    'Meat':
      'মাংস',

    'Chicken':
      'মুরগি',

    'Beef':
      'গরুর মাংস',

    'Mutton':
      'খাসির মাংস',

    'Rice':
      'চাল',

    'Oil':
      'তেল',

    'Eggs':
      'ডিম',

    'Milk':
      'দুধ',

    'Dairy':
      'দুগ্ধজাত পণ্য',

    'Bread':
      'পাউরুটি',

    'Bakery':
      'বেকারি',

    'Snacks':
      'স্ন্যাকস',

    'Beverages':
      'পানীয়',

    'Drinks':
      'পানীয়',

    'Tea':
      'চা',

    'Coffee':
      'কফি',

    'Spices':
      'মসলা',

    'Salt & Sugar':
      'লবণ ও চিনি',

    'Cooking Essentials':
      'রান্নার প্রয়োজনীয় পণ্য',

    'Frozen Food':
      'হিমায়িত খাবার',

    'Breakfast':
      'সকালের নাশতা',

    'Biscuits':
      'বিস্কুট',

    'Chocolate':
      'চকলেট',

    'Noodles':
      'নুডলস',

    'Pasta':
      'পাস্তা',

    'Pickles':
      'আচার',

    'Honey':
      'মধু',


    /* =========================
       BABY
    ========================= */

    'Baby Food':
      'শিশুখাদ্য',

    'Diapers':
      'ডায়াপার',

    'Baby Skin Care':
      'শিশুর ত্বকের যত্ন',

    'Baby Accessories':
      'শিশুর আনুষঙ্গিক পণ্য',


    /* =========================
       HOME
    ========================= */

    'Kitchen':
      'রান্নাঘর',

    'Kitchen Appliances':
      'রান্নাঘরের যন্ত্রপাতি',

    'Cleaning Supplies':
      'পরিষ্কার-পরিচ্ছন্নতার পণ্য',

    'Household':
      'গৃহস্থালি পণ্য',

    'Home Appliances':
      'গৃহস্থালি যন্ত্রপাতি',


    /* =========================
       HEALTH
    ========================= */

    'Personal Care':
      'ব্যক্তিগত যত্ন',

    'Health Care':
      'স্বাস্থ্যসেবা',

    'Oral Care':
      'মুখ ও দাঁতের যত্ন',

    'Skin Care':
      'ত্বকের যত্ন',

    'Hair Care':
      'চুলের যত্ন',


    /* =========================
       OFFICE
    ========================= */

    'Stationery':
      'স্টেশনারি',

    'Office Supplies':
      'অফিস সামগ্রী',

    'Books':
      'বই',


    /* =========================
       TOYS
    ========================= */

    'Toys':
      'খেলনা',

    'Sports':
      'খেলাধুলা',


    /* =========================
       BEAUTY
    ========================= */

    'Beauty':
      'সৌন্দর্য',

    'MakeUp':
      'মেকআপ',

    'Makeup':
      'মেকআপ',

    'Perfume':
      'সুগন্ধি'

  };


  /* =========================
     GET SAVED LANGUAGE
  ========================= */

  private getSavedLanguage():
    AppLanguage {

    const saved =
      localStorage.getItem(
        'language'
      );

    return saved === 'bn'
      ? 'bn'
      : 'en';
  }


  /* =========================
     SET LANGUAGE
  ========================= */

  setLanguage(
    language: AppLanguage
  ): void {

    this.currentLanguage.set(
      language
    );

    localStorage.setItem(
      'language',
      language
    );
  }


  /* =========================
     GET CURRENT LANGUAGE
  ========================= */

  getCurrentLanguage():
    AppLanguage {

    return this.currentLanguage();
  }


  /* =========================
     IS BANGLA
  ========================= */

  isBangla(): boolean {

    return (
      this.currentLanguage() === 'bn'
    );
  }


  /* =========================
     STATIC TRANSLATE
  ========================= */

  translate(
    key: string
  ): string {

    const item =
      this.translations[key];

    if (!item) {
      return key;
    }

    return item[
      this.currentLanguage()
    ];
  }


  /* =========================
     CATEGORY TRANSLATE
  ========================= */

  translateCategory(
    name: string | null | undefined,
    nameBn?: string | null
  ): string {

    if (!name) {
      return '';
    }

    if (
      this.currentLanguage() === 'en'
    ) {
      return name;
    }

    // ✅ Admin panel থেকে দেওয়া Bangla নাম সবার আগে ব্যবহার হবে
    if (nameBn && nameBn.trim()) {
      return nameBn;
    }

    return (
      this.categoryBangla[name]
      || name
    );
  }


  /* =========================
     PRODUCT NAME / DESCRIPTION
     (Admin panel এ যোগ করা future
     পণ্যগুলোও এভাবে বাংলায় দেখাবে)
  ========================= */

  productName(
    product: {
      name?: string | null;
      nameBn?: string | null;
    } | null | undefined
  ): string {

    if (!product) {
      return '';
    }

    if (
      this.currentLanguage() === 'bn'
      && product.nameBn
      && product.nameBn.trim()
    ) {
      return product.nameBn;
    }

    return product.name || '';
  }

  productDescription(
    product: {
      description?: string | null;
      descriptionBn?: string | null;
    } | null | undefined
  ): string {

    if (!product) {
      return '';
    }

    if (
      this.currentLanguage() === 'bn'
      && product.descriptionBn
      && product.descriptionBn.trim()
    ) {
      return product.descriptionBn;
    }

    return product.description || '';
  }

}