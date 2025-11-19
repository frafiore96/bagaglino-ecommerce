import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'it' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Traduzioni base
const translations = {
  it: {
    // Auth
    'login': 'Accedi',
    'register': 'Registrati',
    'logout': 'Esci',
    'email': 'Email',
    'password': 'Password',
    'name': 'Nome',
    'surname': 'Cognome',
    'phone': 'Telefono',
    'confirm_password': 'Conferma Password',
    'already_have_account': 'Hai già un account?',
    'dont_have_account': 'Non hai un account?',
    'login_here': 'Accedi qui',
    'register_here': 'Registrati qui',
    'forgot_password': 'Password dimenticata?',
    
    // Navigation
    'home': 'Home',
    'shop': 'Negozio',
    'cart': 'Carrello',
    'favorites': 'Preferiti',
    'profile': 'Profilo',
    'admin': 'Admin',
    'search': 'Cerca',
    'search_products': 'Cerca prodotti...',
    'menu': 'Menu',
    'close': 'Chiudi',
    'back': 'Indietro',
    
    // Product
    'products': 'Prodotti',
    'price': 'Prezzo',
    'stock': 'Disponibilità',
    'in_stock': 'Disponibile',
    'out_of_stock': 'Esaurito',
    'add_to_cart': 'Aggiungi al carrello',
    'add_to_favorites': 'Aggiungi ai preferiti',
    'remove_from_favorites': 'Rimuovi dai preferiti',
    'buy_now': 'Acquista ora',
    'product_details': 'Dettagli prodotto',
    'related_products': 'Prodotti correlati',
    'size': 'Taglia',
    'select_size': 'Seleziona taglia',
    'quantity': 'Quantità',
    'description': 'Descrizione',
    'category': 'Categoria',
    
    // Categories
    'uomo': 'Uomo',
    'donna': 'Donna',
    'unisex': 'Unisex',
    't-shirt': 'T-shirt',
    'maglioni': 'Maglioni',
    'giacche': 'Giacche',
    'pantaloni': 'Pantaloni',
    'scarpe': 'Scarpe',
    'camicie': 'Camicie',
    'felpe': 'Felpe',
    'giubbotti': 'Giubbotti',
    'accessori': 'Accessori',
    'all_categories': 'Tutte le categorie',
    
    // Cart & Checkout
    'shopping_cart': 'Carrello acquisti',
    'cart_empty': 'Il tuo carrello è vuoto',
    'continue_shopping': 'Continua a fare shopping',
    'remove': 'Rimuovi',
    'update': 'Aggiorna',
    'subtotal': 'Subtotale',
    'total': 'Totale',
    'checkout': 'Procedi al pagamento',
    'billing_address': 'Indirizzo di fatturazione',
    'shipping_address': 'Indirizzo di spedizione',
    'payment_method': 'Metodo di pagamento',
    'place_order': 'Conferma ordine',
    'order_summary': 'Riepilogo ordine',
    
    // User Profile
    'personal_area': 'Area personale',
    'my_orders': 'I miei ordini',
    'my_favorites': 'I miei preferiti',
    'account_settings': 'Impostazioni account',
    'edit_profile': 'Modifica profilo',
    'change_password': 'Cambia password',
    'order_history': 'Cronologia ordini',
    'order_date': 'Data ordine',
    'order_status': 'Stato ordine',
    'order_total': 'Totale ordine',
    
    // Admin
    'dashboard': 'Dashboard',
    'manage_products': 'Gestisci prodotti',
    'sales_report': 'Report vendite',
    'add_product': 'Aggiungi prodotto',
    'edit_product': 'Modifica prodotto',
    'delete_product': 'Elimina prodotto',
    'product_name': 'Nome prodotto',
    'product_image': 'Immagine prodotto',
    'upload_image': 'Carica immagine',
    'save': 'Salva',
    'cancel': 'Annulla',
    'created': 'Creato',
    'updated': 'Aggiornato',
    
    // General
    'welcome': 'Benvenuto',
    'loading': 'Caricamento...',
    'error': 'Errore',
    'success': 'Successo',
    'no_results': 'Nessun risultato trovato',
    'show_more': 'Mostra altro',
    'show_less': 'Mostra meno',
    'view_all': 'Visualizza tutto',
    'new_arrivals': 'Nuovi arrivi',
    'featured_products': 'Prodotti in evidenza',
    'bestsellers': 'Più venduti',
    'sale': 'Saldo',
    'free_shipping': 'Spedizione gratuita',
    'customer_service': 'Servizio clienti',
    'contact_us': 'Contattaci',
    'about_us': 'Chi siamo',
    'terms_conditions': 'Termini e condizioni',
    'privacy_policy': 'Informativa privacy',
    'language': 'Lingua',
    'italian': 'Italiano',
    'english': 'Inglese',
  },
  en: {
    // Auth
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    'email': 'Email',
    'password': 'Password',
    'name': 'Name',
    'surname': 'Surname',
    'phone': 'Phone',
    'confirm_password': 'Confirm Password',
    'already_have_account': 'Already have an account?',
    'dont_have_account': "Don't have an account?",
    'login_here': 'Login here',
    'register_here': 'Register here',
    'forgot_password': 'Forgot password?',
    
    // Navigation
    'home': 'Home',
    'shop': 'Shop',
    'cart': 'Cart',
    'favorites': 'Favorites',
    'profile': 'Profile',
    'admin': 'Admin',
    'search': 'Search',
    'search_products': 'Search products...',
    'menu': 'Menu',
    'close': 'Close',
    'back': 'Back',
    
    // Product
    'products': 'Products',
    'price': 'Price',
    'stock': 'Stock',
    'in_stock': 'In Stock',
    'out_of_stock': 'Out of Stock',
    'add_to_cart': 'Add to cart',
    'add_to_favorites': 'Add to favorites',
    'remove_from_favorites': 'Remove from favorites',
    'buy_now': 'Buy now',
    'product_details': 'Product details',
    'related_products': 'Related products',
    'size': 'Size',
    'select_size': 'Select size',
    'quantity': 'Quantity',
    'description': 'Description',
    'category': 'Category',
    
    // Categories
    'uomo': 'Men',
    'donna': 'Women',
    'unisex': 'Unisex',
    't-shirt': 'T-shirts',
    'maglioni': 'Sweaters',
    'giacche': 'Jackets',
    'pantaloni': 'Pants',
    'scarpe': 'Shoes',
    'camicie': 'Shirts',
    'felpe': 'Hoodies',
    'giubbotti': 'Coats',
    'accessori': 'Accessories',
    'all_categories': 'All categories',
    
    // Cart & Checkout
    'shopping_cart': 'Shopping cart',
    'cart_empty': 'Your cart is empty',
    'continue_shopping': 'Continue shopping',
    'remove': 'Remove',
    'update': 'Update',
    'subtotal': 'Subtotal',
    'total': 'Total',
    'checkout': 'Checkout',
    'billing_address': 'Billing address',
    'shipping_address': 'Shipping address',
    'payment_method': 'Payment method',
    'place_order': 'Place order',
    'order_summary': 'Order summary',
    
    // User Profile
    'personal_area': 'Personal area',
    'my_orders': 'My orders',
    'my_favorites': 'My favorites',
    'account_settings': 'Account settings',
    'edit_profile': 'Edit profile',
    'change_password': 'Change password',
    'order_history': 'Order history',
    'order_date': 'Order date',
    'order_status': 'Order status',
    'order_total': 'Order total',
    
    // Admin
    'dashboard': 'Dashboard',
    'manage_products': 'Manage products',
    'sales_report': 'Sales report',
    'add_product': 'Add product',
    'edit_product': 'Edit product',
    'delete_product': 'Delete product',
    'product_name': 'Product name',
    'product_image': 'Product image',
    'upload_image': 'Upload image',
    'save': 'Save',
    'cancel': 'Cancel',
    'created': 'Created',
    'updated': 'Updated',
    
    // General
    'welcome': 'Welcome',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'no_results': 'No results found',
    'show_more': 'Show more',
    'show_less': 'Show less',
    'view_all': 'View all',
    'new_arrivals': 'New arrivals',
    'featured_products': 'Featured products',
    'bestsellers': 'Bestsellers',
    'sale': 'Sale',
    'free_shipping': 'Free shipping',
    'customer_service': 'Customer service',
    'contact_us': 'Contact us',
    'about_us': 'About us',
    'terms_conditions': 'Terms & conditions',
    'privacy_policy': 'Privacy policy',
    'language': 'Language',
    'italian': 'Italian',
    'english': 'English',
  },
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.it] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};