
import { authTranslations } from './fr/auth';
import { homeTranslations } from './fr/home';
import { dashboardTranslations } from './fr/dashboard';
import { hotelTranslations } from './fr/hotel';
import { paymentTranslations } from './fr/payment';
import { searchTranslations } from './fr/search';
import { navTranslations } from './fr/nav';
import { commonTranslations } from './fr/common';
import { compareTranslations } from './fr/compare';
import { editBookingPageTranslations } from './edit-booking-page';
import { countriesFR } from '../countries-dict';

export const customerFrench = {
  common: commonTranslations,
  auth: authTranslations,
  home: homeTranslations,
  dashboard: dashboardTranslations,
  profile: {
    title: "Profil Royal",
    guest_type: "Client Royal d'Élite",
    logout_btn: "Déconnexion",
    edit_btn: "Modifier le Profil",
    save_btn: "Enregistrer",
    cancel_btn: "Annuler",
    update_success: "Profil mis à jour avec succès.",
    points_title: "Récompenses Royales",
    points_balance: "Solde de points actuel",
    points_level: "Niveau de membre",
    points_gold: "Niveau Or",
    logout_confirm_title: "Confirmer la déconnexion",
    logout_confirm_msg: "Voulez-vous vraiment vous déconnecter?",
    logout_yes: "Oui, Sortir",
    logout_no: "Rester"
  },
  unit_number: "Numéro d'unité",
  notification: {
    booking_updated: "Détails de la réservation mis à jour.",
    booking_cancelled: "Réservation annulée avec succès",
    payment_online_success: "Paiement en ligne confirmé avec succès."
  },
  hotel: {
    ...hotelTranslations,
    ...homeTranslations.hotel,
    description_val: "Un séjour de luxe royal qui assure votre intimité et votre luxe absolu au cœur de l'Égypte."
  },
  payment: {
    ...paymentTranslations,
    pay_arrival: "Paiement à l'arrivée",
    pay_online: "Paiement en ligne sécurisé"
  },
  footer: {
    description: "Horizon Hospitality est le symbole du luxe et de l'intimité en Égypte.",
    about_btn: "À propos d'Horizon",
    about_title: "Liens importants",
    privacy: "Confidentialité",
    terms: "Conditions d'utilisation",
    jobs: "Carrières",
    contact_title: "Contactez-nous",
    location_val: "Le Caire, El Gouna, Assouan",
    follow_title: "Suivez-nous",
    rights: "Groupe Horizon Royal Hospitality. Tous droits réservés 2026."
  },
  loading: {
    title: "Le luxe qui vous convient",
    subtitle: "Attention à chaque détail pour votre confort royal",
    processing: "Chargement en cours...",
    phrase: "Bermuda : Là où l'on perd l'envie de partir"
  },
  search: {
    ...searchTranslations,
    compare: "COMPARER"
  },
  nav: {
    ...navTranslations,
    rooms: "Carte des Chambres",
    audit_logs: "Logs d'Audit",
    clear_all: "Tout effacer",
    invoice: "Facture",
    main_menu: "Menu principal",
    notifications: "NOTIFICATIONS",
    wishlist: "FAVORIS"
  },
  notifications: {
    empty: "Aucune notification pour le moment"
  },
  compare: compareTranslations,
  edit_page: editBookingPageTranslations.fr,
  country: countriesFR,
  invoice: {
    title: "Facture Royale",
    subtitle: "Interface des opérations internes",
    certified: "Document fiscal certifié",
    ref_num: "Numéro de réf",
    date_label: "Date d'émission",
    guest_section: "Données du client",
    unit_section: "Unité d'hébergement",
    stay_info: "Période de séjour",
    nights_label: "Nuits",
    guests_count: "Invités",
    children_count: "Enfants",
    extra_beds: "Extra Beds",
    breakdown: {
      title: "État financier analytique",
      accommodation: "Hébergement",
      night_rate: "Tarif par unité",
      total_stay: "Total hébergement",
      extra_services: "Services extra",
      taxes_fees: "Taxes et frais",
      service_fees: "Frais de service",
      vat: "TVA",
      discount: "Remises",
      deposit: "Acompte",
      grand_total: "Net à payer",
      payment_method: "Mode de paiement"
    },
    footer_msg: "Généré par Horizon Cloud • Tous droits réservés 2026",
    print_btn: "Imprimer la facture",
    back_btn: "Retour au tableau de bord"
  },
  city: homeTranslations.city,
  amenity: {
    wifi: "Internet haute vitesse",
    pool: "Piscine Royale",
    spa: "Spa de classe mondiale",
    gym: "Centre de fitness",
    parking: "Parking sécurisé",
    landmark: "Près des monuments",
    restaurant: "Gastronomie Royale",
    trips: "Excursions"
  },
  gallery: {
    exterior: "Extérieur Royal",
    room: "Chambres & Suites",
    pool: "Piscines & Installations"
  },
  meal: {
    plan_title: "Plan de repas",
    breakfast: "Petit-déjeuner",
    half_board: "Demi-pension",
    full_board: "Pension complète",
    none: "Logement seul"
  },
  booking: {
    room_selection: "Sélection de la classe d'hébergement",
    nights_count: "Nuits",
    total_price: "Valeur totale",
    summary: "Résumé de réservation",
    dates: "Dates de séjour",
    room_type: "Type d'hébergement",
    single: "Chambre Simple",
    double: "Chambre Double",
    suite: "Suite Royale",
    family: "Suite Familiale",
    total_persons: "Total des personnes",
    adults: "Adultes"
  },
  checkout: {
    payment_details: "Détails de la carte",
    cardholder: "Nom du titulaire",
    card_number: "Numéro de carte",
    expiry: "Date d'expiration",
    cvv: "Code CVV",
    billing_info: "Données de facturation",
    pay_now: "Confirmer le paiement",
    secure_msg: "Transaction protégée par cryptage 256 bits.",
    success_title: "Réservation Royale Confirmée",
    redirect_msg: "Redirection en cours...",
    processing: "Traitement en cours...",
    city: "Ville",
    address: "Adresse détaillée",
    nationality: "Nationalité / Pays",
    postal: "Code Postal"
  },
  register: {
    years_label: "Ans",
    success_tag: "Succès",
    denied_tag: "Refusé"
  },
  walkin: {
    logic: {
      companion_count: "Compagnons Additionnels",
      companion_details: "Classification Compagnons",
      adult_companion: "Adulte (15 ans+)",
      child_label: "Enfant (5-14 ans)",
      adult_label: "Adulte",
      infant_label: "Nourrisson",
      person_count: "Total Personnes",
      primary_registered: "Client principal enregistré",
      primary_guest: "Client Principal",
      pending_age_msg: "Veuillez d'abord préciser l'âge"
    },
    companion_form: {
      title: "Données des Compagnons",
      edit_btn: "Réviser / Modifier",
      popup_title: "Enregistrement des Compagnons",
      save_btn: "Autoriser les données",
      page_info: "Page {current} sur {total}",
      name: "Nom Complet",
      id_type: "Type ID",
      id_number: "Numéro ID",
      age: "Âge",
      birth_cert: "Acte de Naiss.",
      passport: "Passeport",
      national_id: "Carte National",
      verified: "Vérifié Admin",
      guest_label: "Invité"
    }
  }
};
