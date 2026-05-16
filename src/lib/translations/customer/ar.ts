import { commonTranslations } from './common';
import { bookingTranslations } from './booking';
import { authTranslations } from './auth';
import { homeTranslations } from './home';
import { dashboardTranslations } from './dashboard';
import { profileTranslations } from './profile';
import { hotelTranslations } from './hotel';
import { paymentTranslations } from './payment';
import { footerTranslations } from './footer';
import { loadingTranslations } from './loading';
import { searchTranslations } from './search';
import { navTranslations } from './nav';
import { compareTranslations } from './compare';
import { editBookingPageTranslations } from './edit-booking-page';
import { walkinTranslations } from '../staff/walkin';
import { receptionTranslations } from '../staff/reception';
import { invoiceTranslations } from '../staff/invoice';
import { countriesAR } from '../countries-dict';

/**
 * @fileOverview القاموس العربي الموحد للعملاء - تم تطهيره بالكامل لهوية Bermuda
 */
export const customerArabic = {
  common: commonTranslations,
  booking: bookingTranslations,
  auth: authTranslations,
  home: homeTranslations,
  dashboard: dashboardTranslations,
  profile: profileTranslations,
  hotel: { ...hotelTranslations, ...homeTranslations.hotel },
  payment: paymentTranslations,
  footer: {
    ...footerTranslations,
    description: "برمودا للضيافة هي رمز الفخامة والخصوصية في قلب مصر، نقدم تجارب إقامة ملكية لا تُنسى.",
    rights: "مجموعة برمودا للضيافة الملكية. جميع الحقوق محفوظة 2026."
  },
  loading: loadingTranslations,
  search: {
    ...searchTranslations,
    compare: "المقارنة"
  },
  nav: {
    ...navTranslations,
    rooms: "خريطة الغرف",
    audit_logs: "سجل التدقيق",
    bookings: "حجوزاتي",
    clear_all: "مسح الكل",
    invoice: "الفاتورة",
    main_menu: "القائمة الأساسية",
    notifications: "الإشعارات",
    wishlist: "المفضلة"
  },
  notifications: {
    empty: "لا توجد إشعارات حالياً"
  },
  compare: compareTranslations,
  edit_page: editBookingPageTranslations.ar,
  walkin: walkinTranslations,
  reception: receptionTranslations,
  invoice: invoiceTranslations,
  city: homeTranslations.city,
  country: countriesAR,
  unit_number: "رقم الوحدة",
  notification: {
    booking_updated: "تم تحديث حالة حجزكم بنجاح.",
    booking_cancelled: "تم إلغاء الحجز بنجاح",
    payment_online_success: "تم تأكيد الدفع الإلكتروني بنجاح ملوكي."
  },
  amenity: {
    wifi: "إنترنت فائق السرعة",
    pool: "مسبح ملكي",
    spa: "مركز سبا عالمي",
    gym: "نادي رياضي متطور",
    parking: "موقف سيارات آمن",
    landmark: "قريب من المعالم",
    restaurant: "مطاعم ملوكية فاخرة",
    trips: "رحلات سياحية"
  },
  gallery: {
    exterior: "الواجهة الخارجية",
    room: "الغرف والأجنحة",
    pool: "المسابح والمرافق"
  },
  meal: {
    plan_title: "نظام الوجبات المعتمد",
    breakfast: "إفطار",
    half_board: "نصف إقامة",
    full_board: "إقامة كاملة",
    none: "بدون خدمات"
  },
  checkout: {
    payment_details: "تفاصيل البطاقة الائتمانية",
    cardholder: "اسم صاحب البطاقة",
    card_number: "رقم البطاقة",
    expiry: "تاريخ الانتهاء",
    cvv: "رمز الأمان (CVV)",
    billing_info: "بيانات الفوترة المعتمدة",
    pay_now: "تأكيد الدفع الآمن",
    secure_msg: "معاملتك محمية بتشفير 256-bit ملوكي.",
    success_title: "تم تأكيد حجزكم الملكي بنجاح",
    redirect_msg: "يتم الآن تحويلكم للوحة التحكم الخاصة بكم...",
    processing: "جاري معالجة الطلب ملوكي...",
    city: "المدينة",
    address: "العنوان بالتفصيل",
    nationality: "الجنسية / الدولة",
    postal: "الرقم البريدي"
  },
  register: {
    years_label: "عام",
    success_tag: "تم النجاح",
    denied_tag: "مرفوض"
  }
};