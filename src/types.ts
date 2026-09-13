export interface MenuItem {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: number;
  category: 'hot' | 'cold' | 'dessert' | 'food';
  isAvailable: boolean;
  iconType: 'coffee' | 'tea' | 'mocha' | 'espresso' | 'juice' | 'soda' | 'icecream' | 'cake' | 'cookie' | 'sparkles' | 'sandwich' | 'burger' | 'pasta';
  imageUrl?: string;
}

export interface WiFiDetails {
  ssid: string;
  password?: string;
  security: 'WPA' | 'WEP' | 'None';
}

export interface CafeSettings {
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  taglineEn: string;
  wifi: WiFiDetails;
  instagram: string;
  facebook: string;
  locationUrl: string;
  phone: string;
  announcementAr: string;
  announcementEn: string;
  adminPassphrase?: string;
  customLogoUrl?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

