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
    }

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
    name: string | null | undefined
  ): string {

    if (!name) {
      return '';
    }

    if (
      this.currentLanguage() === 'en'
    ) {
      return name;
    }

    return (
      this.categoryBangla[name]
      || name
    );
  }

}