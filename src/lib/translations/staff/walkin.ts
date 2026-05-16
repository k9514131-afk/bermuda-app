import { homeTranslations } from '../customer/home';
import { bookingTranslations } from '../customer/booking';
import { searchTranslations } from '../customer/search';

/**
 * @fileOverview القاموس الإداري الموحد - تم دمج الوحدات المشتركة لضمان عدم ظهور أي Keys
 */
export const walkinTranslations = {
  title: "بوابة الاستقبال الملكية",
  subtitle: "منظومة برمودا الموحدة لإدارة العمليات والتسكين الفوري",
  sidebar_title: "تخصيص الإقامة والعمليات",
  fields: {
    check_in: "تاريخ الوصول",
    check_out: "تاريخ المغادرة",
    room_type: "الفئة الضريبية",
    meal_plan: "نظام الوجبات",
    extra_services: "الخدمات والمرافق الإضافية",
    deposit: "استلام عربون مقدم",
    deposit_amount: "مبلغ العربون المستلم"
  },
  services: {
    pool: "المسبح الملكي",
    spa: "مركز السبا",
    gym: "النادي الرياضي",
    trips: "الرحلات السياحية"
  },
  summary: {
    title: "كشف الحساب الملوكي",
    accommodation: "إجمالي الإقامة",
    services: "إجمالي الخدمات الإضافية",
    total: "القيمة الإجمالية",
    remaining: "المتبقي للسداد",
    units_needed: "عدد الوحدات المطلوبة",
    extra_beds_count: "الأسرة الإضافية المطلوبة"
  },
  guest_form: {
    title: "سجل النزيل القانوني",
    subtitle: "استيفاء بيانات التحقق والمواطنة",
    name: "اسم النزيل الرباعي",
    name_placeholder: "الاسم الرباعي المعتمد",
    identity: "إثبات الشخصية",
    identity_placeholder: "الرقم القومي / جواز السفر",
    phone: "رقم الهاتف",
    phone_placeholder: "01xxxxxxxxx",
    nationality: "الجنسية",
    birth: "تاريخ الميلاد الموثق",
    gender: "النوع / الجنس",
    gender_placeholder: "اختر النوع",
    config: "توزيع النزلاء والمرافقين",
    payment: "طريقة السداد المعتمدة",
    cash: "نقداً",
    visa: "بطاقة"
  },
  companion_form: {
    title: "بيانات المرافقين المعتمدة",
    guest_label: "المرافق",
    name: "الاسم الكامل",
    identity: "رقم الهوية",
    gender: "النوع",
    popup_title: "مركز تسجيل بيانات المرافقين النخبة",
    save_btn: "اعتماد كافة البيانات",
    edit_btn: "مراجعة / تعديل المرافقين",
    next_page: "الصفحة التالية",
    prev_page: "الصفحة السابقة",
    page_info: "صفحة {current} من {total}",
    id_type: "نوع الإثبات",
    id_number: "رقم الإثبات",
    age: "العمر",
    birth_cert: "شهادة ميلاد",
    passport: "جواز سفر",
    national_id: "بطاقة شخصية",
    verified: "موثق إدارياً"
  },
  submit_btn: "تأكيد التسكين الفوري",
  processing: "جارٍ تنفيذ الحجز...",
  success_msg: "تم التسكين بنجاح، يتم الآن إصدار الفاتورة الملكية",
  error_missing: "يرجى استكمال البيانات الإلزامية للنزيل",
  error_no_rooms: "عذراً، لا تتوفر غرف من هذه الفئة حالياً",
  status: {
    live_time: "التوقيت اللحظي",
    ops_status: "الحالة التشغيلية",
    connected: "متصل بالسحابة الملكية"
  },
  logic: {
    person_count: "إجمالي عدد الأفراد",
    companion_count: "عدد المرافقين الإضافيين",
    primary_registered: "النزيل الأساسي مسجل تلقائياً",
    companion_details: "تصنيف المرافقين",
    infant_label: "رضيع (0-5) - مجاني",
    child_label: "طفل (6-14) - سعر الطفل",
    adult_label: "بالغ (+15) - سعر الوحدة",
    adult_companion: "بالغ (+15) - سعر الوحدة",
    pending_label: "يرجى تحديد العمر",
    pending_age_msg: "يرجى تحديد العمر أولاً",
    age_error_primary: "الحد الأدنى لعمر النزيل بمفرده هو 21 عاماً.",
    age_error_companion: "الحد الأدنى لعمر النزيل مع مرافقين هو 15 عاماً.",
    primary_guest: "النزيل الأساسي",
    companion_age_type: "التصنيف العمرى",
    min_age_21: "الحد الأدنى لعمر النزيل بمفرده: 21 عاماً",
    min_age_15: "الحد الأدنى لعمر النزيل مع مرافقين: 15 عاماً",
    unit: "وحدة",
    bed: "سرير",
    day: "يوم",
    month: "شهر",
    year: "سنة",
    male: "ذكر",
    female: "أنثى"
  }
};