import {
  Inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';


export type AppLanguage =
  'en' | 'bn';


@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  private readonly isBrowser: boolean;


  private readonly currentLanguage =
    signal<AppLanguage>('en');


  readonly language =
    this.currentLanguage.asReadonly();


  constructor(
    @Inject(PLATFORM_ID) platformId: Object
  ) {

    this.isBrowser =
      isPlatformBrowser(platformId);

    // ✅ localStorage শুধু browser-এ পড়া হচ্ছে,
    // SSR/prerender-এ এটা না করলে পুরো অ্যাপ ভেঙে যেতে পারে
    if (this.isBrowser) {

      this.currentLanguage.set(
        this.getSavedLanguage()
      );
    }
  }


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

    account: {
      en: 'Account',
      bn: 'অ্যাকাউন্ট'
    },

    menu: {
      en: 'Menu',
      bn: 'মেনু'
    },

    cartLabel: {
      en: 'Cart',
      bn: 'কার্ট'
    },

    admin: {
      en: 'Admin',
      bn: 'অ্যাডমিন'
    },


    unitKg: {
      en: 'KG',
      bn: 'কেজি'
    },

    unitGram: {
      en: 'Gram',
      bn: 'গ্রাম'
    },

    unitLiter: {
      en: 'Liter',
      bn: 'লিটার'
    },

    unitMl: {
      en: 'ML',
      bn: 'মিলি'
    },

    unitPcs: {
      en: 'PCS',
      bn: 'পিস'
    },

    unitPiece: {
      en: 'Piece',
      bn: 'পিস'
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

    deliveryOneHour: {
      en: '1 hr',
      bn: '১ ঘণ্টা'
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

    myAccount: {
      en: 'My Account',
      bn: 'আমার অ্যাকাউন্ট'
    },

    manageYourProfile: {
      en: 'Manage your profile',
      bn: 'আপনার প্রোফাইল পরিচালনা করুন'
    },

    trackYourOrdersShort: {
      en: 'Track your orders',
      bn: 'আপনার অর্ডার ট্র্যাক করুন'
    },

    myProfile: {
      en: 'My Profile',
      bn: 'আমার প্রোফাইল'
    },

    signOutFromAccount: {
      en: 'Sign out from your account',
      bn: 'আপনার অ্যাকাউন্ট থেকে সাইন আউট করুন'
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

    bannerCarousel: {
      en: 'Banner Carousel',
      bn: 'ব্যানার ক্যারোসেল'
    },

    uploadBanner: {
      en: 'Upload Banner',
      bn: 'ব্যানার আপলোড করুন'
    },

    bannerAdded: {
      en: 'Banner Added',
      bn: 'ব্যানার যোগ করা হয়েছে'
    },

    confirmDeleteQuestion: {
      en: 'Delete?',
      bn: 'মুছে ফেলবেন?'
    },

    supplierManagement: {
      en: 'Supplier Management',
      bn: 'সরবরাহকারী ব্যবস্থাপনা'
    },

    supplierName: {
      en: 'Supplier Name',
      bn: 'সরবরাহকারীর নাম'
    },

    phone: {
      en: 'Phone',
      bn: 'ফোন'
    },

    address: {
      en: 'Address',
      bn: 'ঠিকানা'
    },

    updateSupplier: {
      en: 'Update Supplier',
      bn: 'সরবরাহকারী আপডেট করুন'
    },

    saveSupplier: {
      en: 'Save Supplier',
      bn: 'সরবরাহকারী সংরক্ষণ করুন'
    },

    totalSuppliers: {
      en: 'Total Suppliers',
      bn: 'মোট সরবরাহকারী'
    },

    due: {
      en: 'Due',
      bn: 'বকেয়া'
    },

    customerManagement: {
      en: 'Customer Management',
      bn: 'গ্রাহক ব্যবস্থাপনা'
    },

    customerId: {
      en: 'ID',
      bn: 'আইডি'
    },

    roleLabel: {
      en: 'Role',
      bn: 'ভূমিকা'
    },

    statusLabel: {
      en: 'Status',
      bn: 'অবস্থা'
    },

    blocked: {
      en: 'Blocked',
      bn: 'ব্লক করা হয়েছে'
    },

    active: {
      en: 'Active',
      bn: 'সক্রিয়'
    },

    unblock: {
      en: 'Unblock',
      bn: 'আনব্লক করুন'
    },

    block: {
      en: 'Block',
      bn: 'ব্লক করুন'
    },

    confirmDeleteCustomer: {
      en: 'Delete this customer?',
      bn: 'এই গ্রাহককে মুছে ফেলবেন?'
    },

    customerDeletedSuccess: {
      en: 'Customer deleted successfully',
      bn: 'গ্রাহক সফলভাবে মুছে ফেলা হয়েছে'
    },

    deleteFailed: {
      en: 'Delete failed',
      bn: 'মুছতে ব্যর্থ হয়েছে'
    },

    blockUnblockFailed: {
      en: 'Block/Unblock failed',
      bn: 'ব্লক/আনব্লক ব্যর্থ হয়েছে'
    },

    notes: {
      en: 'Notes',
      bn: 'নোট'
    },

    addItem: {
      en: '+ Add Item',
      bn: '+ আইটেম যোগ করুন'
    },

    productId: {
      en: 'Product ID',
      bn: 'পণ্যের আইডি'
    },

    priceLabel: {
      en: 'Price',
      bn: 'দাম'
    },

    submitPurchase: {
      en: 'Submit Purchase',
      bn: 'ক্রয় জমা দিন'
    },

    noPurchaseFound: {
      en: 'No Purchase Found ❌',
      bn: 'কোনো ক্রয় পাওয়া যায়নি ❌'
    },

    orderHash: {
      en: 'Order',
      bn: 'অর্ডার'
    },

    supplier: {
      en: 'Supplier',
      bn: 'সরবরাহকারী'
    },

    purchaseDone: {
      en: 'Purchase Done ✅',
      bn: 'ক্রয় সম্পন্ন হয়েছে ✅'
    },

    confirmDeletePurchase: {
      en: 'Delete this purchase?',
      bn: 'এই ক্রয়টি মুছে ফেলবেন?'
    },

    purchaseSaved: {
      en: '✅ Purchase Saved',
      bn: '✅ ক্রয় সংরক্ষণ হয়েছে'
    },

    saveFailedShort: {
      en: '❌ Save Failed',
      bn: '❌ সংরক্ষণ ব্যর্থ হয়েছে'
    },

    inventoryControl: {
      en: 'INVENTORY CONTROL',
      bn: 'ইনভেন্টরি নিয়ন্ত্রণ'
    },

    manageSupplierPurchases: {
      en: 'Manage supplier purchases, stock updates and pricing',
      bn: 'সরবরাহকারীর ক্রয়, স্টক আপডেট ও মূল্য পরিচালনা করুন'
    },

    savePurchase: {
      en: '💾 Save Purchase',
      bn: '💾 ক্রয় সংরক্ষণ করুন'
    },

    supplierInformation: {
      en: 'Supplier Information',
      bn: 'সরবরাহকারীর তথ্য'
    },

    selectSupplier: {
      en: 'Select Supplier',
      bn: 'সরবরাহকারী নির্বাচন করুন'
    },

    contactNumber: {
      en: 'Contact Number',
      bn: 'যোগাযোগ নম্বর'
    },

    productItem: {
      en: 'Product Item',
      bn: 'পণ্য আইটেম'
    },

    searchProduct: {
      en: 'Search Product',
      bn: 'পণ্য খুঁজুন'
    },

    buyPrice: {
      en: 'Buy Price',
      bn: 'ক্রয় মূল্য'
    },

    sellPrice: {
      en: 'Sell Price',
      bn: 'বিক্রয় মূল্য'
    },

    addNewProductItem: {
      en: '+ Add New Product',
      bn: '+ নতুন পণ্য যোগ করুন'
    },

    totalPurchase: {
      en: 'Total Purchase',
      bn: 'মোট ক্রয়'
    },

    expectedProfit: {
      en: 'Expected Profit',
      bn: 'প্রত্যাশিত লাভ'
    },

    supplierDue: {
      en: 'Supplier Due',
      bn: 'সরবরাহকারীর বকেয়া'
    },

    editComingSoon: {
      en: 'Edit coming soon 😎',
      bn: 'সম্পাদনা শীঘ্রই আসছে 😎'
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

    bulkImportProducts: {
      en: 'Bulk Import',
      bn: 'বাল্ক ইমপোর্ট'
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


    /* =========================
       ADMIN — PRODUCTS PAGE
    ========================= */

    catalogManagement: {
      en: 'Catalog Management',
      bn: 'পণ্য তালিকা ব্যবস্থাপনা'
    },

    itemsListed: {
      en: 'items listed',
      bn: 'টি পণ্য তালিকাভুক্ত'
    },

    editProduct: {
      en: 'Edit Product',
      bn: 'পণ্য সম্পাদনা করুন'
    },

    addNewProduct: {
      en: 'Add a New Product',
      bn: 'নতুন পণ্য যোগ করুন'
    },

    fillDetailsBelow: {
      en: 'Fill in the details below, then save to publish it to the storefront.',
      bn: 'নিচের তথ্যগুলো পূরণ করুন, তারপর সংরক্ষণ করলে এটি দোকানে প্রকাশিত হবে।'
    },

    basicInformation: {
      en: 'Basic Information',
      bn: 'মৌলিক তথ্য'
    },

    category: {
      en: 'Category',
      bn: 'ক্যাটাগরি'
    },

    selectCategory: {
      en: 'Select Category',
      bn: 'ক্যাটাগরি নির্বাচন করুন'
    },

    pricingStock: {
      en: 'Pricing & Stock',
      bn: 'মূল্য ও স্টক'
    },

    price: {
      en: 'Price',
      bn: 'মূল্য'
    },

    discount: {
      en: 'Discount',
      bn: 'ডিসকাউন্ট'
    },

    stock: {
      en: 'Stock',
      bn: 'স্টক'
    },

    stockUnit: {
      en: 'Stock Unit',
      bn: 'স্টক একক'
    },

    packSize: {
      en: 'Pack Size',
      bn: 'প্যাক সাইজ'
    },

    selectUnit: {
      en: 'Select Unit',
      bn: 'একক নির্বাচন করুন'
    },

    quantityLabel: {
      en: 'Quantity',
      bn: 'পরিমাণ'
    },

    productDetails: {
      en: 'Product Details',
      bn: 'পণ্যের বিস্তারিত'
    },

    brand: {
      en: 'Brand',
      bn: 'ব্র্যান্ড'
    },

    originCountry: {
      en: 'Origin Country',
      bn: 'উৎপত্তি দেশ'
    },

    selectOrTypeCountry: {
      en: 'Select or type country',
      bn: 'দেশ নির্বাচন করুন বা লিখুন'
    },

    images: {
      en: 'Images',
      bn: 'ছবি'
    },

    mainImage: {
      en: 'Main Image',
      bn: 'প্রধান ছবি'
    },

    image2: {
      en: 'Image 2',
      bn: 'ছবি ২'
    },

    image3: {
      en: 'Image 3',
      bn: 'ছবি ৩'
    },

    image4: {
      en: 'Image 4',
      bn: 'ছবি ৪'
    },

    mainImagePreview: {
      en: 'Main image preview',
      bn: 'প্রধান ছবির প্রিভিউ'
    },

    updateProduct: {
      en: 'Update Product',
      bn: 'পণ্য আপডেট করুন'
    },

    addProduct: {
      en: 'Add Product',
      bn: 'পণ্য যোগ করুন'
    },

    showingLabel: {
      en: 'Showing',
      bn: 'দেখানো হচ্ছে'
    },

    ofLabel: {
      en: 'of',
      bn: 'এর মধ্যে'
    },

    loadingProducts: {
      en: 'Loading products…',
      bn: 'পণ্য লোড হচ্ছে…'
    },

    hangTightCatalog: {
      en: 'Hang tight while we fetch your catalog.',
      bn: 'একটু অপেক্ষা করুন, আমরা আপনার পণ্যতালিকা আনছি।'
    },

    noMatchingProducts: {
      en: 'No matching products',
      bn: 'কোনো মিলে যাওয়া পণ্য নেই'
    },

    noProductsYet: {
      en: 'No products yet',
      bn: 'এখনও কোনো পণ্য নেই'
    },

    tryDifferentSearch: {
      en: 'Try a different search term.',
      bn: 'ভিন্ন কিছু দিয়ে খুঁজে দেখুন।'
    },

    addFirstProduct: {
      en: 'Add your first product using the form above.',
      bn: 'উপরের ফর্ম ব্যবহার করে আপনার প্রথম পণ্য যোগ করুন।'
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


    /* =========================
       ADMIN — CATEGORY TYPE
       (Main / Sub / Child category)
    ========================= */

    categoryType: {
      en: 'Category Type',
      bn: 'ক্যাটাগরির ধরন'
    },

    mainCategory: {
      en: 'Main Category',
      bn: 'মূল ক্যাটাগরি'
    },

    subCategory: {
      en: 'Sub Category',
      bn: 'সাব ক্যাটাগরি'
    },

    childCategory: {
      en: 'Child Category',
      bn: 'চাইল্ড ক্যাটাগরি'
    },

    parentMainCategory: {
      en: 'Parent Main Category',
      bn: 'মূল ক্যাটাগরি নির্বাচন করুন'
    },

    parentSubCategory: {
      en: 'Parent Sub Category',
      bn: 'সাব ক্যাটাগরি নির্বাচন করুন'
    },

    selectMainCategory: {
      en: 'Select Main Category',
      bn: 'মূল ক্যাটাগরি বেছে নিন'
    },

    selectSubCategory: {
      en: 'Select Sub Category',
      bn: 'সাব ক্যাটাগরি বেছে নিন'
    },

    storeManagement: {
      en: 'Store Management',
      bn: 'স্টোর ব্যবস্থাপনা'
    },

    categoryManagementDesc: {
      en: 'Manage categories and choose which categories appear in the Popular Categories section.',
      bn: 'ক্যাটাগরি পরিচালনা করুন এবং কোন ক্যাটাগরি জনপ্রিয় ক্যাটাগরি সেকশনে দেখাবে তা বেছে নিন।'
    },

    editCategory: {
      en: 'Edit Category',
      bn: 'ক্যাটাগরি সম্পাদনা করুন'
    },

    addNewCategoryTitle: {
      en: 'Add New Category',
      bn: 'নতুন ক্যাটাগরি যোগ করুন'
    },

    createCategoriesDesc: {
      en: 'Create main, sub and child categories.',
      bn: 'মূল, সাব ও চাইল্ড ক্যাটাগরি তৈরি করুন।'
    },

    cancelEdit: {
      en: 'Cancel Edit',
      bn: 'সম্পাদনা বাতিল করুন'
    },

    categoryNameEnglishLabel: {
      en: 'Category Name (English)',
      bn: 'ক্যাটাগরির নাম (ইংরেজি)'
    },

    categoryImage: {
      en: 'Category Image',
      bn: 'ক্যাটাগরির ছবি'
    },

    imagePreview: {
      en: 'Image Preview',
      bn: 'ছবির প্রিভিউ'
    },

    savingEllipsis: {
      en: 'Saving...',
      bn: 'সংরক্ষণ হচ্ছে...'
    },

    updateCategory: {
      en: 'Update Category',
      bn: 'ক্যাটাগরি আপডেট করুন'
    },

    addCategory: {
      en: 'Add Category',
      bn: 'ক্যাটাগরি যোগ করুন'
    },

    allCategories: {
      en: 'All Categories',
      bn: 'সকল ক্যাটাগরি'
    },

    manageCategoryStructure: {
      en: 'Manage your complete category structure.',
      bn: 'আপনার সম্পূর্ণ ক্যাটাগরি কাঠামো পরিচালনা করুন।'
    },

    searchCategoryPlaceholder: {
      en: 'Search category...',
      bn: 'ক্যাটাগরি খুঁজুন...'
    },

    loadingCategories: {
      en: 'Loading categories...',
      bn: 'ক্যাটাগরি লোড হচ্ছে...'
    },

    noCategoriesFound: {
      en: 'No categories found.',
      bn: 'কোনো ক্যাটাগরি পাওয়া যায়নি।'
    },

    homepageControl: {
      en: 'Homepage Control',
      bn: 'হোমপেজ নিয়ন্ত্রণ'
    },

    homepageControlDesc: {
      en: 'Turn categories on or off and control their homepage display order.',
      bn: 'ক্যাটাগরি চালু/বন্ধ করুন এবং হোমপেজে প্রদর্শনের ক্রম নিয়ন্ত্রণ করুন।'
    },

    displayOrderLabel: {
      en: 'Display Order',
      bn: 'প্রদর্শনের ক্রম'
    },

    searchPopularCategoryPlaceholder: {
      en: 'Search popular category...',
      bn: 'জনপ্রিয় ক্যাটাগরি খুঁজুন...'
    },

    categoryManagementTitle: {
      en: 'Category Management',
      bn: 'ক্যাটাগরি ব্যবস্থাপনা'
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

    'Food & Grocery':
      'খাদ্য ও মুদি',

    'Baby Care':
      'শিশুর যত্ন',

    'Home & Kitchen':
      'ঘর ও রান্নাঘর',

    'Health & Wellness':
      'স্বাস্থ্য ও সুস্থতা',

    'Pharmacy Health & Wellness':
      'ফার্মেসি, স্বাস্থ্য ও সুস্থতা',

    'Land, Property & Construction':
      'জমি, সম্পত্তি ও নির্মাণ',

    'Fashion & Lifestyle':
      'ফ্যাশন ও লাইফস্টাইল',

    'Education & Skills':
      'শিক্ষা ও দক্ষতা',

    'Service Hub':
      'সার্ভিস হাব',

    'Mother, Baby & kids':
      'মা, শিশু ও বাচ্চাদের পণ্য',

    'Mother,Baby & kids':
      'মা, শিশু ও বাচ্চাদের পণ্য',

    'Mother, Baby & Kids':
      'মা, শিশু ও বাচ্চাদের পণ্য',

    'Beauty & Personal Care':
      'সৌন্দর্য ও ব্যক্তিগত যত্ন',

    'Stationery & Office':
      'স্টেশনারি ও অফিস',

    'Animal & Pet Care':
      'প্রাণী ও পোষা প্রাণীর যত্ন',

    'Smart Electrical & Electronics':
      'স্মার্ট ইলেকট্রিক্যাল ও ইলেকট্রনিক্স',

    'Corporate 360 Solution':
      'কর্পোরেট ৩৬০ সমাধান',

    'All Kinds of Design Services':
      'সকল ধরনের ডিজাইন সেবা',

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

    if (this.isBrowser) {

      localStorage.setItem(
        'language',
        language
      );
    }
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
     WORD-BY-WORD AUTO TRANSLATE
     ডিকশনারি (পুরোনো প্রোডাক্ট যাদের
     nameBn এখনও দেওয়া হয়নি, তাদের
     নাম আংশিকভাবে বাংলায় দেখানোর জন্য।

     এটা কোনো নিখুঁত অনুবাদ না — শুধু
     পরিচিত শব্দগুলো বাংলায় বদলে দেয়,
     ব্র্যান্ড/অপরিচিত শব্দ ইংরেজিতেই
     থেকে যায়। Admin panel থেকে
     "Product Name (Bangla)" ফিল্ড
     পূরণ করলে সবসময় সেটাই আগে দেখানো
     হবে (এই ডিকশনারি তখন ব্যবহার হয় না)।
  ========================= */

  private readonly wordBangla:
    Record<string, string> = {

    // adjectives / descriptors
    'fresh': 'তাজা',
    'frozen': 'হিমায়িত',
    'organic': 'জৈব',
    'local': 'দেশি',
    'deshi': 'দেশি',
    'imported': 'আমদানি করা',
    'pure': 'খাঁটি',
    'premium': 'প্রিমিয়াম',
    'standard': 'স্ট্যান্ডার্ড',
    'big': 'বড়',
    'small': 'ছোট',
    'large': 'বড়',
    'medium': 'মাঝারি',
    'mini': 'মিনি',
    'jumbo': 'জাম্বো',
    'whole': 'গোটা',
    'half': 'অর্ধেক',
    'sliced': 'কাটা',
    'cut': 'কাটা',
    'cutting': 'কাটা',
    'after': 'পরে',
    'before': 'আগে',
    'with': 'সহ',
    'without': 'ছাড়া',
    'skin': 'চামড়া',
    'boneless': 'হাড়বিহীন',
    'bone': 'হাড়',
    'net': 'নিট',
    'weight': 'ওজন',

    // colors
    'red': 'লাল',
    'green': 'সবুজ',
    'yellow': 'হলুদ',
    'white': 'সাদা',
    'black': 'কালো',
    'blue': 'নীল',

    // meat / fish / eggs / dairy
    'duck': 'হাঁস',
    'chicken': 'মুরগি',
    'beef': 'গরুর মাংস',
    'mutton': 'খাসির মাংস',
    'fish': 'মাছ',
    'egg': 'ডিম',
    'eggs': 'ডিম',
    'milk': 'দুধ',
    'butter': 'মাখন',
    'cheese': 'চিজ',
    'yogurt': 'দই',

    // staples
    'rice': 'চাল',
    'oil': 'তেল',
    'sugar': 'চিনি',
    'salt': 'লবণ',
    'flour': 'আটা',
    'honey': 'মধু',
    'bread': 'পাউরুটি',
    'noodles': 'নুডলস',
    'pasta': 'পাস্তা',

    // produce
    'vegetable': 'সবজি',
    'vegetables': 'সবজি',
    'fruit': 'ফল',
    'fruits': 'ফল',
    'tomato': 'টমেটো',
    'potato': 'আলু',
    'onion': 'পেঁয়াজ',
    'garlic': 'রসুন',
    'ginger': 'আদা',
    'banana': 'কলা',
    'apple': 'আপেল',
    'mango': 'আম',
    'orange': 'কমলা',
    'greens': 'শাক',
    'amaranth': 'নটে শাক',
    'microgreen': 'মাইক্রোগ্রিন',
    'stem': 'ডাঁটা',

    // packaged / snacks
    'salad': 'সালাদ',
    'sauce': 'সস',
    'tuna': 'টুনা',
    'biscuit': 'বিস্কুট',
    'biscuits': 'বিস্কুট',
    'chocolate': 'চকলেট',
    'candy': 'ক্যান্ডি',
    'snacks': 'স্ন্যাকস',
    'spice': 'মসলা',
    'spices': 'মসলা',
    'tea': 'চা',
    'coffee': 'কফি',
    'water': 'পানি',
    'juice': 'জুস',

    // household / personal care
    'towel': 'তোয়ালে',
    'soap': 'সাবান',
    'shampoo': 'শ্যাম্পু',
    'toothpaste': 'টুথপেস্ট',
    'detergent': 'ডিটারজেন্ট',
    'powder': 'গুঁড়া',
    'liquid': 'তরল',
    'plastic': 'প্লাস্টিক',
    'steel': 'স্টিল',
    'glass': 'কাচ',

    // packaging words
    'bottle': 'বোতল',
    'pack': 'প্যাক',
    'packet': 'প্যাকেট',
    'box': 'বাক্স',
    'piece': 'পিস',
    'pieces': 'পিস',
    'bag': 'ব্যাগ',
    'bags': 'ব্যাগ',

    // baby / stationery / toys
    'baby': 'শিশু',
    'diaper': 'ডায়াপার',
    'diapers': 'ডায়াপার',
    'toy': 'খেলনা',
    'toys': 'খেলনা',
    'book': 'বই',
    'books': 'বই',
    'pen': 'কলম',
    'pencil': 'পেন্সিল',
    'notebook': 'নোটবুক',

    // misc connecting words
    'and': 'ও',
    'in': 'এ',
    'kitchen': 'রান্নাঘর',
    'cooking': 'রান্নার'
  };


  /* =========================
     UNIT TRANSLATE
     (kg, gram, pcs ইত্যাদি বাংলায়)
  ========================= */

  private readonly unitBangla:
    Record<string, string> = {

    'kg': 'কেজি',
    'kgs': 'কেজি',
    'gram': 'গ্রাম',
    'grams': 'গ্রাম',
    'gm': 'গ্রাম',
    'g': 'গ্রাম',
    'litre': 'লিটার',
    'liter': 'লিটার',
    'litres': 'লিটার',
    'liters': 'লিটার',
    'l': 'লিটার',
    'ml': 'মিলি',
    'pcs': 'পিস',
    'pc': 'পিস',
    'piece': 'পিস',
    'pieces': 'পিস',
    'dozen': 'ডজন',
    'pack': 'প্যাক',
    'packet': 'প্যাকেট',
    'box': 'বাক্স',
    'bottle': 'বোতল'
  };

  translateUnit(
    unit: string | null | undefined
  ): string {

    if (!unit) {
      return '';
    }

    if (this.currentLanguage() === 'en') {
      return unit;
    }

    const key =
      unit.trim().toLowerCase();

    return (
      this.unitBangla[key] || unit
    );
  }


  /* =========================
     AUTO TRANSLATE (WORD BY WORD)
     পরিচিত শব্দগুলো বাংলায় বদলায়,
     বাকি (ব্র্যান্ড নাম ইত্যাদি)
     অপরিবর্তিত থাকে।
  ========================= */

  private autoTranslateWords(
    text: string
  ): string {

    if (!text) {
      return text;
    }

    return text.replace(
      /[A-Za-z]+/g,
      (match) => {

        const key =
          match.toLowerCase();

        const bn =
          this.wordBangla[key];

        return bn || match;
      }
    );
  }


  /* =========================
     PRODUCT NAME / DESCRIPTION
     (Admin panel এ যোগ করা future
     পণ্যগুলোও এভাবে বাংলায় দেখাবে।
     যেসব পুরোনো প্রোডাক্টে এখনও nameBn
     দেওয়া হয়নি, তাদের নাম পরিচিত
     শব্দ অনুযায়ী auto-translate হয়ে
     আংশিক বাংলায় দেখানো হবে।)
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

    if (this.currentLanguage() !== 'bn') {
      return product.name || '';
    }

    // ১) Admin panel থেকে দেওয়া বাংলা নাম সবার আগে
    if (
      product.nameBn
      && product.nameBn.trim()
    ) {
      return product.nameBn;
    }

    // ২) না দেওয়া থাকলে পরিচিত শব্দগুলো auto-translate
    return this.autoTranslateWords(
      product.name || ''
    );
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