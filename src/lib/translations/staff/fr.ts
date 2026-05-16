
import { homeTranslations } from '../customer/fr/home';
import { hotelTranslations } from '../customer/fr/hotel';
import { searchTranslations } from '../customer/fr/search';
import { editBookingTranslationsFr } from './edit-booking';
import { editCompanionTranslationsFr } from './edit-companion';
import { countriesFR } from '../countries-dict';

/**
 * @fileOverview Dictionnaire Officiel de l'Interface Staff en Français
 */
export const staffFrench = {
  common: {
    currency: "EGP",
    cancel: "Annuler l'opération",
    ok: "Confirmer",
    close: "Fermer",
    save: "Enregistrer",
    loading: "Mise à jour du système...",
    back: "Retour",
    not_available: "Non disponible"
  },
  auth: {
    login_title: "Centre des Opérations",
    login_desc: "Accès Sécurisé au Système de Commandement Royal",
    username: "Nom d'utilisateur",
    password: "Mot de passe autorisé",
    login_btn: "Entrée Sécurisée",
    remember_me: "Se souvenir de moi",
    error_msg: "Identifiants invalides ou compte non autorisé.",
    offline_msg: "Impossible de se connecter au serveur. Veuillez réessayer.",
    wrong_password: "Mot de passe incorrect, veuillez réessayer.",
    success_msg: "Membre Royal connecté. Accès au panneau de contrôle...",
    staff_login_msg: "Centre des Opérations et de Contrôle Royal",
    staff: "Membre de l'équipe Bermuda Royal",
    fullname: "Nom Complet (Vérifié)",
    id_number: "ID National / Matricule",
    email: "Email Professionnel",
    phone: "Numéro de téléphone",
    birth_date: "Date de naissance",
    gender: "Sexe",
    nationality: "Nationalité",
    marital_status: "État Civil",
    status_single: "Célibataire",
    status_married: "Marié(e)",
    status_divorced: "Divorcé(e)",
    status_widowed: "Veuf/Veuve",
    gender_male: "Homme",
    gender_female: "Femme"
  },
  notification: {
    booking_updated: "Réservation mise à jour avec succès.",
    payment_success: "Paiement confirmé avec succès."
  },
  reception: {
    title: "Registre des Réservations",
    subtitle: "Gestion Centrale des Clients et Opérations en Temps Réel",
    search_placeholder: "Rechercher par nom ou ID...",
    walkin_btn: "Enregistrement Immédiat",
    active_records: "Dossiers Actifs",
    id_number: "ID National / Preuve d'identité",
    source_label: "Source:",
    source_customer: "Client",
    source_staff: "Réception",
    category_label: "Catégorie:",
    table_title: "Tableau des Opérations Hôtelières",
    table_header: {
      name: "Nom Complet",
      identity: "ID National",
      phone: "Tél.",
      nationality: "Nationalité",
      birth: "Date Naiss.",
      period: "Période",
      unit: "Hôtel & Unité",
      status: "État",
      financial: "Finance / Paiement",
      details: "Détails"
    },
    status: {
      active: "Actif",
      cancelled: "Annulé",
      completed: "Terminé"
    },
    audit: {
      update_status: "Mise à jour état",
      status_changed_msg: "État réservation # {id} changé en {status}",
      walkin_audit: "Enregistrement direct",
      walkin_msg: "Client {name} enregistré - Réservation # {id}"
    },
    details_modal: {
      title: "Dossier des Opérations",
      id_label: "ID DE RÉSERVATION",
      id_number: "ID National / Preuve d'identité",
      guest_main: "Client Principal",
      email: "Adresse Email",
      hotel: "Propriété Hôtelière",
      unit_num: "Unité Assignée",
      unit_prefix: "Numéro d'unité",
      stay_period: "Période de séjour",
      phone: "Téléphone",
      accounting: "Comptabilité Financière",
      payment_method: "Paiement Approuvé",
      access_control: "Contrôle d'Accès",
      print_invoice: "Imprimer la Facture",
      check_in: "Activer Check-in",
      cancel_booking: "Annuler Séjour"
    },
    no_results: "Aucun dossier correspondant trouvé."
  },
  rooms: {
    title: "Carte des Chambres",
    subtitle: "Suivi en temps réel de 100 unités sur 5 étages",
    updating: "Mise à jour de l'inventaire...",
    floor_label: "Étage",
    status: {
      available: "Disponible",
      occupied: "Occupée",
      cleaning: "Nettoyage",
      maintenance: "Besoin Maintenance",
      out_of_service: "Hors Service"
    },
    types: {
      single: "Simple",
      double: "Double",
      suite: "Suite Royale",
      family: "Familiale"
    },
    modal: {
      title: "Unité Numéro",
      update_label: "Mettre à jour l'état opérationnel",
      available_btn: "Prête pour Check-in",
      cleaning_btn: "Nettoyage",
      maintenance_btn: "Besoin Maintenance",
      out_of_service_btn: "Hors Service"
    }
  },
  profile: {
    title: "Profil Staff",
    guest_type: "Membre de l'équipe Bermuda",
    logout_btn: "Déconnexion Système",
    edit_btn: "Modifier les Données",
    save_btn: "Enregistrer les Mises à jour",
    cancel_btn: "Annuler l'opération",
    update_success: "Profil mis à jour avec succès.",
    points_title: "Récompenses Administratives",
    points_balance: "Solde de Performance",
    points_level: "Niveau de Performance",
    points_gold: "Niveau Or",
    logout_confirm_title: "Sortie Système",
    logout_confirm_msg: "Voulez-vous quitter le Centre des Opérations ?",
    logout_yes: "Oui, Déconnexion",
    logout_no: "Rester Connecté",
    managed_by_admin: "Géré par l'administration supérieure"
  },
  walkin: {
    title: "Portail Réception Royale",
    subtitle: "Système Bermuda Unifié pour les Opérations",
    sidebar_title: "Personnalisation & Ops",
    fields: {
      check_in: "Date d'arrivée",
      check_out: "Date de départ",
      room_type: "Type d'unité",
      meal_plan: "Plan de repas",
      extra_services: "Services Extra",
      deposit: "Acompte Versé",
      deposit_amount: "Montant de l'acompte"
    },
    services: {
      pool: "Piscine Royale",
      spa: "Spa de Classe Mondiale",
      gym: "Salle Fitness",
      trips: "Excursions"
    },
    summary: {
      title: "État de Compte Royal",
      accommodation: "Total Hébergement",
      services: "Total Services Extra",
      total: "Valeur Totale Brute",
      remaining: "Solde Restant",
      units_needed: "Unités Requises",
      extra_beds_count: "Lits d'appoint requis"
    },
    guest_form: {
      title: "Dossier Légal du Client",
      subtitle: "Données de Vérification",
      name: "Nom Complet",
      name_placeholder: "Nom Complet Vérifié",
      identity: "Preuve d'identité",
      identity_placeholder: "ID National / Passeport",
      phone: "Numéro de téléphone",
      phone_placeholder: "01xxxxxxxxx",
      nationality: "Nationalité",
      birth: "Date de Naissance Vérifiée",
      gender: "Sexe / Genre",
      gender_placeholder: "Choisir le genre",
      config: "Guest & Companion Config",
      payment: "Mode de Paiement Approuvé",
      cash: "Espèces",
      visa: "Carte"
    },
    companion_form: {
      title: "Données des Compagnons",
      guest_label: "Compagnon",
      name: "Nom Complet",
      identity: "Numéro ID",
      gender: "Sexe",
      popup_title: "Enregistrement des Compagnons",
      save_btn: "Autoriser les données",
      edit_btn: "Réviser / Modifier",
      next_page: "Page Suivante",
      prev_page: "Page Précédente",
      page_info: "Page {current} sur {total}",
      id_type: "Type ID",
      id_number: "Numéro ID",
      age: "Âge",
      birth_cert: "Acte de Naiss.",
      passport: "Passeport",
      national_id: "Carte National",
      verified: "Vérifié Admin"
    },
    submit_btn: "Confirmer Check-in Immédiat",
    success_msg: "Check-in réussi. Génération de la facture...",
    error_missing: "Veuillez compléter les données requises.",
    error_no_rooms: "Désolé, aucune chambre disponible.",
    status: {
      live_time: "Temps Réel",
      ops_status: "État Opérationnel",
      connected: "Connecté au Cloud Royal"
    },
    logic: {
      person_count: "Total Personnes",
      companion_count: "Compagnons Additionnels",
      primary_registered: "Client principal enregistré",
      primary_guest: "Client Principal",
      pending_age_msg: "Veuillez d'abord préciser l'âge"
    }
  },
  edit_booking: editBookingTranslationsFr,
  edit_companion: editCompanionTranslationsFr,
  country: countriesFR,
  nationality: {
    EG: "Égyptien",
    SA: "Saoudien",
    AE: "Émirati",
    KW: "Koweïtien",
    JO: "Jordanien",
    FR: "Français",
    US: "Américain",
    GB: "Britannique",
    IT: "Italien",
    DE: "Allemand",
    RU: "Russe",
    CN: "Chinois",
    ES: "Espagnol",
    TR: "Turc"
  },
  unit_number: "Numéro d’unité",
  payment: {
    pay_arrival: "Paiement à l'arrivée",
    pay_online: "Paiement en ligne sécurisé"
  },
  meal: {
    plan_title: "Plan de repas",
    breakfast: "Petit-déjeuner",
    half_board: "Demi-pension",
    full_board: "Pension complète",
    none: "Logement seul"
  },
  invoice: {
    title: "Facture Royale",
    subtitle: "Interface des Opérations Internes",
    certified: "Document Fiscal Certifié",
    ref_num: "Référence No",
    date_label: "Date d'émission",
    guest_section: "Données du Contrat & Client",
    unit_section: "Unité d'Hébergement Assignée",
    stay_info: "Période de séjour",
    nights_label: "Nuits",
    guests_count: "Invités",
    children_count: "Enfants",
    extra_beds: "Extra Beds",
    breakdown: {
      title: "État Financier Analytique",
      accommodation: "Services d'Hébergement",
      night_rate: "Tarif par Nuit",
      total_stay: "Total Hébergement",
      extra_services: "Services Extra",
      taxes_fees: "Taxes et frais",
      service_fees: "Frais de service",
      vat: "TVA",
      discount: "Remises",
      deposit: "Acompte",
      grand_total: "Net à payer",
      payment_method: "Mode de paiement"
    },
    footer_msg: "Généré par Bermuda Cloud • Tous droits réservés 2026",
    print_btn: "Imprimer la Facture Royale",
    back_btn: "Retour au Système"
  },
  reports: {
    title: "Rapports & Analyses",
    subtitle: "Analyse de la Performance & Flux Financiers",
    view_reports: "Analytique",
    daily: "Quotidien",
    weekly: "Hebdo",
    monthly: "Mensuel",
    export_pdf: "Exporter PDF",
    total_bookings: "Total Réservations",
    total_revenue: "Chiffre d'Affaires",
    occupied_rooms: "Chambres Occupées",
    occupancy_rate: "Taux d'Occupation",
    performance_curve: "Courbe de Performance",
    revenue_bookings_desc: "Évolution CA & Réservations",
    live_update: "Live Update",
    status_distribution: "Distribution par État",
    inventory_ratio: "Ratio d'occupation",
    occupancy: "Occupation",
    status_occupied: "Occupées",
    status_available: "Disponibles",
    status_cleaning: "Nettoyage",
    status_maintenance: "Maintenance",
    unit: "Unité",
    table_title: "Détails Financiers",
    date: "Date",
    bookings_count: "Réservations",
    day_revenue: "Revenu Jour",
    general_status: "État Général",
    stable: "Stable",
    bookings_suffix: "Réservations",
    currency_suffix: "EGP"
  },
  nav: {
    home: "Accueil",
    bookings: "Registre",
    rooms: "Carte Chambres",
    profile: "Profil Staff",
    notifications: "Notifications",
    logout: "Déconnexion",
    ops_center: "Centre d'Opérations",
    logout_confirm_title: "Sortie Système",
    logout_confirm_msg: "Confirmer la sortie du Centre ?",
    logout_yes: "Oui, Quitter",
    logout_no: "Rester",
    system_tag: "Système Royal Bermuda • Ver 2026",
    audit_logs: "Journaux d'Audit",
    clear_all: "Tout effacer",
    invoice: "Facture",
    main_menu: "Navigation"
  },
  notifications: {
    empty: "Aucune notification pour le moment"
  },
  footer: {
    description: "Système de Gestion Unifié Bermuda - Interface Interne.",
    about_btn: "Support Tech",
    about_title: "Gestion Système",
    privacy: "Confidentialité",
    terms: "Sécurité",
    jobs: "Annuaire Staff",
    contact_title: "Bureau HQ",
    location_val: "HQ - Le Caire",
    follow_title: "Com interne",
    rights: "Bermuda PMS • Tous Droits Réservés 2026.",
  },
  home: homeTranslations,
  hotel: homeTranslations.hotel,
  search: searchTranslations,
  city: homeTranslations.city,
  amenity: {
    wifi: "Internet Haute Vitesse",
    pool: "Piscine Royale",
    spa: "Spa de Classe Mondiale",
    gym: "Centre de Fitness",
    parking: "Parking sécurisé",
    landmark: "Près des Monuments",
    restaurant: "Gastronomie Royale"
  },
  booking: {
    adults: "Adultes",
    single: "Simple",
    double: "Double",
    suite: "Suite Royale",
    family: "Familiale"
  },
  audit: {
    title: "Journal d'Audit et Opérations",
    subtitle: "Surveillance des mouvements du personnel et des opérations sensibles",
    table_title: "Journal d'activité en temps réel",
    count_label: "opérations enregistrées",
    header_time: "Horodatage",
    header_user: "Employé",
    header_action: "Action",
    header_details: "Détails",
    action: {
      walkin: "Enregistrement Immédiat",
      cancel: "Annuler la Réservation",
      status: "Mise à jour du statut",
      edit: "Mise à jour données",
      "INSTANT CHECK-IN": "Enregistrement Immédiat",
      "CANCEL BOOKING": "Annuler Réservation",
      "Canceled booking": "Séjour Annulé",
      "Changed status": "Mise à jour statut"
    },
    log: {
      walkin: "Enregistrement direct pour {name} - Réservation #{id}",
      cancel: "Réservation #{id} annulée",
      status_update: "Statut de #{id} changé en {status}",
      edit: "Détails de la réservation #{id} mis à jour"
    }
  }
};
