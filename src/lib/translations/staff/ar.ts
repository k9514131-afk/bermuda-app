import { authTranslations } from './auth';
import { receptionTranslations } from './reception';
import { roomsTranslations } from './rooms';
import { profileTranslations } from './profile';
import { walkinTranslations } from './walkin';
import { invoiceTranslations } from './invoice';
import { loadingTranslations } from './loading';
import { footerTranslations } from './footer';
import { navTranslations } from './nav';
import { commonTranslations } from './common';
import { reportsTranslations } from './reports';
import { editBookingTranslations } from './edit-booking';
import { editCompanionTranslations } from './edit-companion';
import { homeTranslations } from '../customer/home';
import { bookingTranslations } from '../customer/booking';
import { searchTranslations } from '../customer/search';
import { countriesAR } from '../countries-dict';

/**
 * @fileOverview القاموس الإداري الموحد لبرمودا - النسخة النهائية المطهرة
 */
export const staffArabic = {
  common: commonTranslations,
  auth: authTranslations,
  reception: {
    ...receptionTranslations,
    details_modal: {
      ...receptionTranslations.details_modal,
      unit_prefix: "رقم الوحدة"
    }
  },
  notification: {
    booking_updated: "تم تحديث بيانات الحجز بنجاح ملوكي.",
    payment_success: "تم تأكيد الدفع بنجاح.",
    payment_rejected: "تم رفض عملية الدفع، يمكنك المحاولة مرة أخرى أو تغيير البطاقة."
  },
  rooms: {
    ...roomsTranslations,
    status: {
      available: "متاحة",
      occupied: "مشغولة",
      cleaning: "تحتاج تنظيف",
      maintenance: "تحتاج صيانة",
      out_of_service: "خارج الخدمة"
    },
    modal: {
      title: "وحدة إقامة رقم",
      update_label: "تحديث الحالة التشغيلية الفورية",
      available_btn: "متاحة للتسكين",
      cleaning_btn: "تحتاج تنظيف",
      maintenance_btn: "تحتاج صيانة",
      out_of_service_btn: "خارج الخدمة"
    }
  },
  profile: profileTranslations,
  walkin: {
    ...walkinTranslations,
    unified_form: "استمارة التسكين الفوري",
    financial_section: "العمليات والخدمات المالية",
    waiting_payment: "في انتظار موافقة الدفع",
    waiting_bank: "جاري انتظار استجابة البنك...",
    local_network_settings: "إعدادات الربط المحلي للهاتف",
    laptop_ip: "عنوان IP الخاص باللابتوب",
    scan_qr_msg: "يرجى مسح الرمز أعلاه أو فتح الرابط من هاتفك لمحاكاة جهاز الدفع.",
    direct_link: "رابط المحاكي المباشر"
  },
  simulator: {
    title: "محاكي الدفع لبرمودا",
    subtitle: "جهاز دفع بنكي مصرح (محاكاة)",
    request_label: "طلب دفع",
    live_link: "رابط مباشر",
    total_due: "إجمالي المبلغ المستحق",
    currency: "ج.م",
    customer: "العميل",
    transaction_id: "رقم العملية",
    approve_btn: "موافقة",
    reject_btn: "رفض",
    success_title: "تم النجاح",
    success_desc: "تم تنفيذ الحجز وتأكيد السداد بنجاح في برمودا.",
    failed_title: "عملية مرفوضة",
    failed_desc: "تم رفض الطلب من قِبل المستخدم.",
    not_found: "الطلب غير موجود",
    not_found_desc: "عذراً، لم نتمكن من العثور على طلب الدفع المطلوب أو قد يكون انتهت صلاحيته.",
    securing: "جاري تأمين الاتصال..."
  },
  invoice: invoiceTranslations,
  loading: loadingTranslations,
  footer: {
    ...footerTranslations,
    description: "منظومة برمودا للإدارة الفندقية الموحدة - واجهة التشغيل الداخلية.",
    rights: "نظام برمودا PMS • جميع الحقوق محفوظة 2026."
  },
  nav: navTranslations,
  notifications: {
    empty: "لا توجد إشعارات حالياً"
  },
  reports: {
    ...reportsTranslations,
    export_footer: "منظومة برمودا الملكية السحابية • تم التصدير عام 2026"
  },
  edit_booking: editBookingTranslations,
  edit_companion: editCompanionTranslations,
  country: countriesAR,
  nationality: {
    EG: "مصري", SA: "سعودي", AE: "إماراتي", KW: "كويتي", JO: "أردني", FR: "فرنسي", US: "أمريكي", GB: "بريطاني", IT: "إيطالي", DE: "ألماني", RU: "روسي", CN: "صيني", ES: "إسباني", TR: "تركي"
  },
  unit_number: "رقم الوحدة",
  payment: {
    pay_arrival: "الدفع عند الوصول",
    pay_online: "دفع إلكتروني آمن"
  },
  home: homeTranslations,
  booking: bookingTranslations,
  search: searchTranslations,
  city: homeTranslations.city,
  hotel: homeTranslations.hotel,
  amenity: {
    wifi: "إنترنت فائق السرعة", pool: "مسبح ملكي", spa: "مركز سبا عالمي", gym: "نادي رياضي متطور", parking: "موقف سيارات آمن", landmark: "قريب من المعالم", restaurant: "مطاعم ملوكية فاخرة", trips: "رحلات سياحية"
  },
  gallery: {
    exterior: "الواجهة الخارجية", room: "الغرف والأجنحة", pool: "المسابح والمرافق"
  },
  meal: {
    plan_title: "نظام الوجبات المعتمد", breakfast: "إفطار", half_board: "نصف إقامة", full_board: "إقامة كاملة", none: "إقامة فقط"
  },
  audit: {
    title: "سجل التدقيق والعمليات",
    subtitle: "مراقبة تحركات الموظفين والعمليات الحساسة في منظومة برمودا",
    table_title: "سجل التحركات اللحظي",
    count_label: "عملية مسجلة",
    header_time: "التوقيت",
    header_user: "الموظف",
    header_action: "الإجراء",
    header_details: "التفاصيل",
    action: {
      walkin: "تسكين فوري", cancel: "إلغاء حجز", status: "تحديث الحالة", edit: "تعديل بيانات",
      "INSTANT CHECK-IN": "تسكين فوري", "CANCEL BOOKING": "إلغاء الحجز"
    },
    log: {
      walkin: "تسكين فوري للنزيل {name} - حجز #{id}",
      cancel: "تم إلغاء الحجز رقم #{id}",
      status_update: "تغيير حالة الحجز #{id} إلى {status}",
      edit: "تم تحديث بيانات الحجز #{id}"
    }
  }
};