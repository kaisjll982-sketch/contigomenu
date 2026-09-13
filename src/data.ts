import { MenuItem, CafeSettings } from './types';

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // Hot Drinks
  {
    id: 'hot-1',
    nameEn: 'Espresso',
    nameAr: 'إسبريسو',
    descriptionEn: 'Single shot of rich espresso with golden crema, made from dark roasted premium beans.',
    descriptionAr: 'جرعة مركزة من القهوة الغنية بالرغوة الذهبية، محضّرة من حبوب فاخرة محمّصة.',
    price: 3.5,
    category: 'hot',
    isAvailable: true,
    iconType: 'espresso',
    imageUrl: 'https://images.unsplash.com/photo-151097252790b-af4f42df8e56?q=80&w=600'
  },
  {
    id: 'hot-2',
    nameEn: 'Cappuccino',
    nameAr: 'كابوتشينو',
    descriptionEn: 'Espresso with steamed milk and a thick layer of velvet milk foam, topped with cocoa powder.',
    descriptionAr: 'قهوة إسبريسو مع الحليب الساخن ورغوة الحليب الكثيفة، مع رشة من الكاكاو.',
    price: 4.5,
    category: 'hot',
    isAvailable: true,
    iconType: 'coffee',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600'
  },
  {
    id: 'hot-3',
    nameEn: 'Café Crème',
    nameAr: 'قهوة كريم',
    descriptionEn: 'Traditional cream coffee with a smooth blend of hot espresso and dense velvet cream.',
    descriptionAr: 'قهوة كلاسيكية بالكريمة تمزج بين الإسبريسو الساخن ورغوة الكريمة الكثيفة.',
    price: 4.0,
    category: 'hot',
    isAvailable: true,
    iconType: 'mocha',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600'
  },
  {
    id: 'hot-4',
    nameEn: 'Café Direct / Direct',
    nameAr: 'قهوة ديريكت',
    descriptionEn: 'Generous warm steamed milk splashed with aromatic premium espresso shot.',
    descriptionAr: 'حليب ساخن وفير مع لمسة غنية من الإسبريسو الفاخر.',
    price: 3.8,
    category: 'hot',
    isAvailable: true,
    iconType: 'coffee',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600'
  },
  {
    id: 'hot-5',
    nameEn: 'Tunisian Spiced Coffee (Turkish style)',
    nameAr: 'قهوة عربي بالزهر',
    descriptionEn: 'Traditional Turkish style coffee brewed slowly on demand, flavored with fresh orange blossom water.',
    descriptionAr: 'قهوة عربي تقليدية محضرة على مهل ومنكهة بقطرات ماء الزهر الفواح.',
    price: 4.5,
    category: 'hot',
    isAvailable: true,
    iconType: 'espresso',
    imageUrl: 'https://images.unsplash.com/photo-1588725801262-bdf477112046?q=80&w=600'
  },
  {
    id: 'hot-6',
    nameEn: 'Mint Green Tea',
    nameAr: 'شاي أخضر بالنعناع',
    descriptionEn: 'Classic Tunisian green tea brewed with fresh organic mint leaves and white sugar.',
    descriptionAr: 'الشاي الأخضر التونسي التقليدي بنعناع طازج و منعش.',
    price: 3.0,
    category: 'hot',
    isAvailable: true,
    iconType: 'tea',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600'
  },

  // Cold Drinks
  {
    id: 'cold-1',
    nameEn: 'Iced Latte',
    nameAr: 'آيس لاتيه',
    descriptionEn: 'Refreshing chilled milk with a double shot of espresso, served with large ice cubes.',
    descriptionAr: 'حليب بارد ومنعش مع جرعة مزدوجة من الإسبريسو، يقدم مع مكعبات الثلج.',
    price: 5.5,
    category: 'cold',
    isAvailable: true,
    iconType: 'icecream',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600'
  },
  {
    id: 'cold-2',
    nameEn: 'Café Frappé',
    nameAr: 'قهوة فرابي مثلجة',
    descriptionEn: 'Smooth blended coffee, milk, sugar and fine ice capped with fluffy sweetened foam.',
    descriptionAr: 'مزيج لطيف من القهوة والحليب والثلج مع رغوة غنية وحلوة.',
    price: 6.0,
    category: 'cold',
    isAvailable: true,
    iconType: 'soda',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600'
  },
  {
    id: 'cold-3',
    nameEn: 'Fresh Orange Juice',
    nameAr: 'عصير برتقال طبيعي',
    descriptionEn: 'Hand-pressed sweet local oranges served freshly chilled and loaded with Vitamin C.',
    descriptionAr: 'عصير برتقال تونسي طبيعي طازج ومعصور بكل حب.',
    price: 5.0,
    category: 'cold',
    isAvailable: true,
    iconType: 'juice',
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=600'
  },
  {
    id: 'cold-4',
    nameEn: 'Classic Virgin Mojito',
    nameAr: 'موهيتو كلاسيك',
    descriptionEn: 'Sparkling lemon-lime soda infused with freshly crushed mint leaves and lime wedges.',
    descriptionAr: 'مزيج فوار ومنعش من الليمون والنعناع الطازج المهروس مع قطع الليمون.',
    price: 6.5,
    category: 'cold',
    isAvailable: true,
    iconType: 'soda',
    imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600'
  },
  {
    id: 'cold-5',
    nameEn: 'Chocolate Milkshake',
    nameAr: 'ميلك شيك شوكولاتة',
    descriptionEn: 'Creamy milk blended with dark chocolate syrup and ice cream, topped with cocoa.',
    descriptionAr: 'ميلك شيك الحليب الغني ممزوج بكريمة الشوكولاتة والكاكاو والثلج.',
    price: 7.0,
    category: 'cold',
    isAvailable: true,
    iconType: 'icecream',
    imageUrl: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?q=80&w=600'
  },

  // Desserts
  {
    id: 'dessert-1',
    nameEn: 'Nutella Crepe',
    nameAr: 'كراب شوكولاتة ونوتيلا',
    descriptionEn: 'Warm delicious thin pancake folded with ample premium Nutella hazelnut spread.',
    descriptionAr: 'فطيرة كراب رقيقة وساخنة محشوة بشوكولاتة نوتيلا اللذيذة والوفيرة.',
    price: 7.5,
    category: 'dessert',
    isAvailable: true,
    iconType: 'cake',
    imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=600'
  },
  {
    id: 'dessert-2',
    nameEn: 'Contigo Specialty Cake',
    nameAr: 'كعكة كونتيغو المميزة',
    descriptionEn: 'Irresistible rich chocolate sponge cake layers, glazed with gourmet dark cocoa.',
    descriptionAr: 'كعكة الشوكولاتة الفاخرة بطبقات كريمية مغطاة بصلصة الكاكاو الغنية.',
    price: 8.5,
    category: 'dessert',
    isAvailable: true,
    iconType: 'cake',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600'
  },
  {
    id: 'dessert-3',
    nameEn: 'Butter Croissant',
    nameAr: 'كرواسون زبدة طازج',
    descriptionEn: 'Golden, crispy, and flaky traditional french croissant baked fresh in our ovens.',
    descriptionAr: 'كرواسون زبدة فرنسي ذهبي ومقرمش، محضر طازجاً في أفراننا.',
    price: 3.5,
    category: 'dessert',
    isAvailable: true,
    iconType: 'cookie',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600'
  },
  // Savory Food & Sandwiches (مأكولات)
  {
    id: 'food-1',
    nameEn: 'Tunisian Chapati Mahdia',
    nameAr: 'شباتي المهدية التونسي الشهير',
    descriptionEn: 'Tasty layered toasted flatbread stuffed with egg omelet, Tunisian tuna, melted cheese, and a splash of spicy Harissa.',
    descriptionAr: 'خبز الشباتي المهدوي اللذيذ المحشو بأومليت البيض، التن الفاخر، الجبن الذائب، ولمسة حرارة من الهريسة التونسية.',
    price: 7.5,
    category: 'food',
    isAvailable: true,
    iconType: 'sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=600'
  },
  {
    id: 'food-2',
    nameEn: 'Authentic Tunisian Fricassé',
    nameAr: 'فريكاسي تونسي بالزيتون والتن',
    descriptionEn: 'Golden fried savory mini buns filled with seasoned potatoes, tuna, hard-boiled egg quarters, olives, and authentic Harissa.',
    descriptionAr: 'فطائر الفريكاسي المقلية والذهبية الشهية، محشوة بالبطاطا المتبلة، التن، ربع بيضة مسلوقة، زيتون أسود، وهريسة دياري.',
    price: 3.5,
    category: 'food',
    isAvailable: true,
    iconType: 'sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1598182126888-0329598ef470?q=80&w=600'
  },
  {
    id: 'food-3',
    nameEn: 'Club Sandwich Contigo',
    nameAr: 'كلوب ساندوتش كونتيغو الفاخر',
    descriptionEn: 'Double-decker toasted bread with crispy breaded chicken breast, Cheddar, fresh tomatoes, lettuce, and garlic sauce.',
    descriptionAr: 'ساندوتش دبل مشكل من التوست المحمص مع صدر دجاج مقرمش، جبن الشيدر، طماطم طازجة، خس، وصلصة الثوم الخاصة بينا.',
    price: 11.5,
    category: 'food',
    isAvailable: true,
    iconType: 'sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1567234605884-2091bc29a8f2?q=80&w=600'
  },
  {
    id: 'food-4',
    nameEn: 'Gourmet Escalope Panini',
    nameAr: 'بانيني إسكالوب دجاج بالجبن',
    descriptionEn: 'Griddled Italian Panini stuffed with juicy chicken escalope, Mozzarella, peppers, and garlic mayonnaise spray.',
    descriptionAr: 'خبز البانيني الإيطالي المحمص والمحشو بشرائح إسكالوب الدجاج المشوية، جبن الموزاريلا الذائب، فلفل أخضر، وصلصة المايونيز بالثوم.',
    price: 9.0,
    category: 'food',
    isAvailable: true,
    iconType: 'sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600'
  },
  {
    id: 'food-5',
    nameEn: 'Mechouia Salad Platter',
    nameAr: 'سلطة مشوية بالبيص والتن وزيت الزيتون',
    descriptionEn: 'Traditional grilled pepper and tomato salad drizzled with olive oil, garnished with rich tuna chunks and egg slices.',
    descriptionAr: 'سلطة تونسية مشوية بالقرن غزال حار مع الطماطم والثوم، مزينة بالتن، الزيتون، بيض مسلوق وزيت زيتون تونسي حُر.',
    price: 8.0,
    category: 'food',
    isAvailable: true,
    iconType: 'pasta',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600'
  },
  {
    id: 'food-6',
    nameEn: 'Spicy Tunisian Spaghetti',
    nameAr: 'مقرونة تونسية حارة بالتن',
    descriptionEn: 'Flavorful and spicy pasta cooked in traditional slow tomato sauce, topped with chunk tuna and chickpeas.',
    descriptionAr: 'السباغيتي التونسية الحارة على أصولها، مطبوخة في صلصة طماطم مركزة مع الحمص وجرين فلفل مقلي ومزينة بقطع التن.',
    price: 13.0,
    category: 'food',
    isAvailable: true,
    iconType: 'pasta',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600'
  }
];

export const DEFAULT_CAFE_SETTINGS: CafeSettings = {
  nameAr: 'كونتيغو قهوة ومطعم',
  nameEn: 'Contigo Restaurant & Coffee',
  taglineAr: 'المكان المفضل لقهوتك اليومية وأوقاتك الجميلة',
  taglineEn: 'The favorite place for your daily coffee and great moments',
  wifi: {
    ssid: 'Contigo_VIP_Guest',
    password: 'ContigoCoffee2026',
    security: 'WPA'
  },
  instagram: 'https://instagram.com/contigo.restaurant', // Users can edit this
  facebook: 'https://facebook.com/contigo.restaurant',   // Users can edit this
  locationUrl: 'https://www.google.com/maps/search/?api=1&query=Contigo+Coffee+ISET+Sidi+Bouzid',
  phone: '+216 22 123 456',
  announcementAr: 'مرحباً بكم في مقهى كونتيغو! تمتعوا بأفضل أنواع القهوة التونسية والعالمية وخدمة الواي فاي المجانية الفائقة السرعة.',
  announcementEn: 'Welcome to Contigo! Enjoy the finest Tunisian and international coffee blends with free high-speed wifi.',
  adminPassphrase: 'admin' // Simple default passcode to protect settings
};
