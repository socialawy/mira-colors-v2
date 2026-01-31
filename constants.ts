

import { AppState, ColorId, ColorDefinition, PaletteId, PaletteInfo, MixingRule, FunFactCategory, FunFact, UITexts, Language, TranslationKey, UserProgressData, Stars, AvatarId, AvatarDefinition, ColorMatchChallengeDefinition, RainbowSequenceChallengeDefinition } from './types';

export const LANGUAGES: Record<Language, { name: string; dir: 'ltr' | 'rtl' }> = {
  [Language.EN]: { name: 'English', dir: 'ltr' },
  [Language.AR]: { name: 'العربية', dir: 'rtl' },
};

export const COLORS: Record<ColorId, ColorDefinition> = {
  red: { id: 'red', name: { en: 'Red', ar: 'أحمر' }, hex: '#FF0000', tailwindClass: 'bg-red-500' },
  yellow: { id: 'yellow', name: { en: 'Yellow', ar: 'أصفر' }, hex: '#FFFF00', tailwindClass: 'bg-yellow-400', textColorClass: 'text-black' },
  blue: { id: 'blue', name: { en: 'Blue', ar: 'أزرق' }, hex: '#0000FF', tailwindClass: 'bg-blue-600' },
  orange: { id: 'orange', name: { en: 'Orange', ar: 'برتقالي' }, hex: '#FFA500', tailwindClass: 'bg-orange-500' },
  green: { id: 'green', name: { en: 'Green', ar: 'أخضر' }, hex: '#008000', tailwindClass: 'bg-green-500' },
  purple: { id: 'purple', name: { en: 'Purple', ar: 'بنفسجي' }, hex: '#800080', tailwindClass: 'bg-purple-600' },
  white: { id: 'white', name: { en: 'White', ar: 'أبيض' }, hex: '#FFFFFF', tailwindClass: 'bg-white border border-gray-300', textColorClass: 'text-black' },
  black: { id: 'black', name: { en: 'Black', ar: 'أسود' }, hex: '#000000', tailwindClass: 'bg-black' },
  gray: { id: 'gray', name: { en: 'Gray', ar: 'رمادي' }, hex: '#808080', tailwindClass: 'bg-gray-500' },
  brown: { id: 'brown', name: { en: 'Brown', ar: 'بني' }, hex: '#A52A2A', tailwindClass: 'bg-yellow-700' }, // Tailwind bg-yellow-700 is an approximation for brown
  pink: { id: 'pink', name: { en: 'Pink', ar: 'وردي' }, hex: '#FFC0CB', tailwindClass: 'bg-pink-400' },
  vermilion: { id: 'vermilion', name: { en: 'Vermilion', ar: 'زنجفر' }, hex: '#E34234', tailwindClass: 'bg-red-600' },
  amber: { id: 'amber', name: { en: 'Amber', ar: 'كهرماني' }, hex: '#FFBF00', tailwindClass: 'bg-amber-500' },
  chartreuse: { id: 'chartreuse', name: { en: 'Chartreuse', ar: 'أخضر مصفر' }, hex: '#7FFF00', tailwindClass: 'bg-lime-500' },
  teal: { id: 'teal', name: { en: 'Teal', ar: 'أزرق مخضر' }, hex: '#008080', tailwindClass: 'bg-teal-500' },
  violet: { id: 'violet', name: { en: 'Violet', ar: 'بنفسجي فاتح' }, hex: '#EE82EE', tailwindClass: 'bg-violet-500' },
  magenta: { id: 'magenta', name: { en: 'Magenta', ar: 'أرجواني' }, hex: '#FF00FF', tailwindClass: 'bg-fuchsia-500' },
  cyan: { id: 'cyan', name: { en: 'Cyan', ar: 'سماوي' }, hex: '#00FFFF', tailwindClass: 'bg-cyan-400', textColorClass: 'text-black' },
  lime: { id: 'lime', name: { en: 'Lime', ar: 'ليموني' }, hex: '#00FF00', tailwindClass: 'bg-lime-400', textColorClass: 'text-black' },
  turquoise: { id: 'turquoise', name: { en: 'Turquoise', ar: 'فيروزي' }, hex: '#40E0D0', tailwindClass: 'bg-cyan-500' },
  gold: { id: 'gold', name: { en: 'Gold', ar: 'ذهبي' }, hex: '#FFD700', tailwindClass: 'bg-yellow-500' },
  silver: { id: 'silver', name: { en: 'Silver', ar: 'فضي' }, hex: '#C0C0C0', tailwindClass: 'bg-gray-400' },
};

export const SELECTABLE_COLORS_FOR_MIXING_IDS: ColorId[] = ['red', 'yellow', 'blue', 'white', 'black', 'orange', 'green', 'purple', 'brown', 'teal', 'gray'];

export const MIXING_RULES: MixingRule[] = [
  { input: ['red', 'yellow'].sort() as [ColorId, ColorId], output: 'orange' },
  { input: ['blue', 'yellow'].sort() as [ColorId, ColorId], output: 'green' },
  { input: ['red', 'blue'].sort() as [ColorId, ColorId], output: 'purple' },
  { input: ['red', 'white'].sort() as [ColorId, ColorId], output: 'pink' },
  { input: ['black', 'white'].sort() as [ColorId, ColorId], output: 'gray' },
  { input: ['red', 'green'].sort() as [ColorId, ColorId], output: 'brown' },
  { input: ['red', 'orange'].sort() as [ColorId, ColorId], output: 'vermilion' },
  { input: ['yellow', 'orange'].sort() as [ColorId, ColorId], output: 'amber' },
  { input: ['yellow', 'green'].sort() as [ColorId, ColorId], output: 'chartreuse' },
  { input: ['blue', 'green'].sort() as [ColorId, ColorId], output: 'teal' },
  { input: ['blue', 'purple'].sort() as [ColorId, ColorId], output: 'violet' },
  { input: ['red', 'purple'].sort() as [ColorId, ColorId], output: 'magenta' },
  { input: ['yellow', 'teal'].sort() as [ColorId, ColorId], output: 'lime' }, 
  { input: ['blue', 'teal'].sort() as [ColorId, ColorId], output: 'turquoise' }, 
  { input: ['yellow', 'brown'].sort() as [ColorId, ColorId], output: 'gold' },
  { input: ['white', 'gray'].sort() as [ColorId, ColorId], output: 'silver' },
];

export const FUNDAMENTAL_COLOR_IDS: ColorId[] = ['red', 'yellow', 'blue', 'white', 'black'];

export const PALETTES: Record<PaletteId, PaletteInfo> = {
  [PaletteId.Warm]: {
    id: PaletteId.Warm,
    name: { en: 'Warm Colors', ar: 'الألوان الدافئة' },
    challengeColorIds: ['orange', 'vermilion', 'pink', 'amber', 'gold', 'red', 'yellow', 'brown'], 
    displayColors: ['red', 'orange', 'yellow', 'pink', 'brown']
  },
  [PaletteId.Cool]: {
    id: PaletteId.Cool,
    name: { en: 'Cool Colors', ar: 'الألوان الباردة' },
    challengeColorIds: ['green', 'purple', 'teal', 'violet', 'lime', 'turquoise', 'blue', 'magenta', 'cyan', 'chartreuse'], 
    displayColors: ['blue', 'green', 'purple', 'teal', 'cyan', 'lime', 'magenta']
  },
  [PaletteId.Neutral]: {
    id: PaletteId.Neutral,
    name: { en: 'Neutral Colors', ar: 'الألوان المحايدة' },
    challengeColorIds: ['gray', 'silver', 'white', 'black'], 
    displayColors: ['black', 'white', 'gray', 'silver']
  },
};

export const MAX_ATTEMPTS = 2;
export const CHALLENGES_PER_PALETTE = 5; 

export const FUN_FACTS: FunFact[] = [
  { id: 'gc1', category: FunFactCategory.GeneralColors, content: { en: "Red is the first color babies see clearly. This is because the photoreceptors for red develop earlier than those for other colors.", ar: "اللون الأحمر هو أول لون يراه الأطفال بوضوح. وذلك لأن المستقبلات الضوئية للون الأحمر تتطور في وقت أبكر من تلك الخاصة بالألوان الأخرى." }, relatedColorIds: ['red', 'vermilion'] },
  { id: 'gc2', category: FunFactCategory.GeneralColors, content: { en: "Blue is often cited as the most popular color worldwide. Psychologically, blue is associated with calmness, stability, and trustworthiness.", ar: "غالبًا ما يُشار إلى اللون الأزرق على أنه اللون الأكثر شعبية في جميع أنحاء العالم. من الناحية النفسية، يرتبط اللون الأزرق بالهدوء والاستقرار والجدارة بالثقة." }, relatedColorIds: ['blue', 'turquoise', 'cyan'] },
  { id: 'gc3', category: FunFactCategory.GeneralColors, content: { en: "Yellow is processed by the human eye very quickly, making it highly visible. This is why it's often used for warning signs and emergency vehicles.", ar: "تتم معالجة اللون الأصفر بواسطة العين البشرية بسرعة كبيرة، مما يجعله مرئيًا للغاية. هذا هو السبب في أنه غالبًا ما يستخدم في علامات التحذير ومركبات الطوارئ." }, relatedColorIds: ['yellow', 'amber', 'gold'] },
  { id: 'gc4', category: FunFactCategory.GeneralColors, content: { en: "Green occupies more space in the spectrum visible to the human eye than most colors and is second only to blue as a favorite color. It's often associated with nature, growth, and health.", ar: "يشغل اللون الأخضر مساحة في الطيف المرئي للعين البشرية أكثر من معظم الألوان وهو اللون المفضل الثاني بعد الأزرق. غالبًا ما يرتبط بالطبيعة والنمو والصحة." }, relatedColorIds: ['green', 'chartreuse', 'teal', 'lime'] },
  { id: 'gc5', category: FunFactCategory.GeneralColors, content: { en: "Historically, purple dye was very expensive to produce, made from the mucus of sea snails. This rarity made it a symbol of royalty and power for centuries.", ar: "تاريخيًا، كانت صبغة اللون الأرجواني باهظة الثمن، حيث كانت تُصنع من مخاط قواقع البحر. هذه الندرة جعلته رمزًا للملكية والسلطة لعدة قرون." }, relatedColorIds: ['purple', 'violet', 'magenta'] },
  { id: 'gc6', category: FunFactCategory.GeneralColors, content: { en: "The word 'orange' for the color came after the fruit. Before that, English speakers referred to the color as 'ġeolurēad' (yellow-red).", ar: "كلمة 'برتقالي' للون جاءت بعد الفاكهة. قبل ذلك، كان المتحدثون باللغة الإنجليزية يشيرون إلى اللون باسم 'ġeolurēad' (أصفر-أحمر)." }, relatedColorIds: ['orange'] },
  { id: 'gc7', category: FunFactCategory.GeneralColors, content: { en: "Gray is often made by mixing black and white paint. Interestingly, black isn't technically a color in the visible spectrum; it's the absence of visible light, while white is the presence of all colors combined.", ar: "غالبًا ما يُصنع اللون الرمادي عن طريق مزج الطلاء الأسود والأبيض. ومن المثير للاهتمام أن الأسود ليس لونًا من الناحية الفنية في الطيف المرئي؛ إنه غياب الضوء المرئي، بينما الأبيض هو وجود جميع الألوان مجمعة." }, relatedColorIds: ['black', 'white', 'gray', 'silver'] },
  { id: 'gc8', category: FunFactCategory.GeneralColors, content: { en: "Pink is often associated with calmness and is sometimes used in prisons or mental health facilities to reduce aggression. This is known as the 'Baker-Miller Pink' effect, though its efficacy is debated.", ar: "غالبًا ما يرتبط اللون الوردي بالهدوء ويستخدم أحيانًا في السجون أو مرافق الصحة العقلية لتقليل العدوانية. يُعرف هذا بتأثير 'بيكر ميلر الوردي'، على الرغم من أن فعاليته لا تزال موضع نقاش." }, relatedColorIds: ['pink'] },
  { id: 'gc9', category: FunFactCategory.GeneralColors, content: { en: "Brown is a composite color, typically made by mixing primary colors (red, yellow, blue) or a primary and its complementary color. It's abundant in nature and often signifies earthiness and stability.", ar: "البني هو لون مركب، يتكون عادةً عن طريق مزج الألوان الأساسية (الأحمر والأصفر والأزرق) أو لون أساسي ولونه المكمل. إنه متوفر بكثرة في الطبيعة وغالبًا ما يدل على الأصالة والاستقرار." }, relatedColorIds: ['brown']},
  { id: 'gc10', category: FunFactCategory.GeneralColors, content: {en: "In many cultures, white symbolizes purity, innocence, and peace, which is why it's often worn at weddings. However, in some East Asian cultures like China and Japan, white is traditionally the color of mourning and funerals.", ar: "في العديد من الثقافات، يرمز اللون الأبيض إلى النقاء والبراءة والسلام، ولهذا السبب غالبًا ما يتم ارتداؤه في حفلات الزفاف. ومع ذلك، في بعض ثقافات شرق آسيا مثل الصين واليابان، يعتبر الأبيض تقليديًا لون الحداد والجنازات." }, relatedColorIds: ['white']},
  { id: 'v1', category: FunFactCategory.Vision, content: { en: "The human eye has three types of cone cells for color vision, corresponding to red, green, and blue light (RGB). Our brain interprets signals from these cones to perceive the full spectrum of colors.", ar: "تحتوي عين الإنسان على ثلاثة أنواع من الخلايا المخروطية للرؤية اللونية، تتوافق مع الضوء الأحمر والأخضر والأزرق. يفسر دماغنا الإشارات من هذه المخاريط لإدراك الطيف الكامل للألوان." } },
  { id: 'v2', category: FunFactCategory.Vision, content: { en: "Rod cells in the retina are much more sensitive to light than cone cells and are responsible for vision in low-light conditions (scotopic vision). However, they don't detect color, which is why we see mostly in grayscale at night.", ar: "الخلايا العصوية في الشبكية أكثر حساسية للضوء بكثير من الخلايا المخروطية وهي مسؤولة عن الرؤية في ظروف الإضاءة المنخفضة (الرؤية الليلية). ومع ذلك، فهي لا تكتشف الألوان، ولهذا السبب نرى في الغالب بتدرجات الرمادي في الليل." } },
  { id: 'v3', category: FunFactCategory.Vision, content: { en: "Some animals, like the mantis shrimp, possess far more types of photoreceptors than humans (up to 16 types!). This allows them to see a much wider range of colors, including polarized light, which is invisible to us.", ar: "بعض الحيوانات، مثل جمبري السرعوف (المانتيس)، تمتلك أنواعًا من المستقبلات الضوئية أكثر بكثير من البشر (تصل إلى 16 نوعًا!). هذا يسمح لها برؤية نطاق أوسع بكثير من الألوان، بما في ذلك الضوء المستقطب، وهو غير مرئي لنا." } },
  { id: 'v4', category: FunFactCategory.Vision, content: { en: "Color blindness, or color vision deficiency, affects approximately 1 in 12 men and 1 in 200 women. The most common form is red-green color blindness, caused by an anomaly in the red or green cone cells.", ar: "يؤثر عمى الألوان، أو نقص رؤية الألوان، على ما يقرب من 1 من كل 12 رجلاً و 1 من كل 200 امرأة. الشكل الأكثر شيوعًا هو عمى الألوان الأحمر والأخضر، الناتج عن خلل في الخلايا المخروطية الحمراء أو الخضراء." } },
  { id: 'v5', category: FunFactCategory.Vision, content: { en: "The 'blind spot' in each eye is where the optic nerve passes through the retina. There are no photoreceptor cells (rods or cones) there, so you can't see anything in that tiny area. Your brain cleverly fills in the gap using information from the other eye or surrounding areas.", ar: "النقطة العمياء' في كل عين هي المكان الذي يمر فيه العصب البصري عبر الشبكية. لا توجد خلايا مستقبلة للضوء (عصي أو مخاريط) هناك، لذلك لا يمكنك رؤية أي شيء في تلك المنطقة الصغيرة. يقوم دماغك بذكاء بملء الفجوة باستخدام معلومات من العين الأخرى أو المناطق المحيطة." } },
  { id: 'ls1', category: FunFactCategory.LightScience, content: { en: "Rainbows are optical illusions; they don't exist in a specific place. They form when sunlight is refracted (bent) as it enters a raindrop, then reflected off the inside of the raindrop, and refracted again as it leaves. Each observer sees their own unique rainbow.", ar: "أقواس قزح هي أوهام بصرية؛ فهي لا توجد في مكان محدد. تتشكل عندما ينكسر ضوء الشمس (ينحني) عند دخوله قطرة مطر، ثم ينعكس من داخل قطرة المطر، وينكسر مرة أخرى عند خروجه منها. يرى كل مراقب قوس قزح فريدًا خاصًا به." } },
  { id: 'ls2', category: FunFactCategory.LightScience, content: { en: "White light, like sunlight, is actually a mixture of all the colors of the visible spectrum (red, orange, yellow, green, blue, indigo, violet). You can see these colors separated when white light passes through a prism.", ar: "الضوء الأبيض، مثل ضوء الشمس، هو في الواقع مزيج من جميع ألوان الطيف المرئي (الأحمر، البرتقالي، الأصفر، الأخضر، الأزرق، النيلي، البنفسجي). يمكنك رؤية هذه الألوان منفصلة عندما يمر الضوء الأبيض عبر منشور." } },
  { id: 'ls3', category: FunFactCategory.LightScience, content: { en: "The sky appears blue due to a phenomenon called Rayleigh scattering. Shorter, smaller blue light waves are scattered more effectively by the tiny air molecules in Earth's atmosphere than longer, redder wavelengths. This scattered blue light reaches our eyes from all directions, making the sky appear blue.", ar: "تبدو السماء زرقاء بسبب ظاهرة تسمى تشتت رايلي. تتشتت موجات الضوء الأزرق الأقصر والأصغر بشكل أكثر فعالية بواسطة جزيئات الهواء الصغيرة في الغلاف الجوي للأرض مقارنة بالأطوال الموجية الأطول والأكثر احمرارًا. يصل هذا الضوء الأزرق المتناثر إلى أعيننا من جميع الاتجاهات، مما يجعل السماء تبدو زرقاء." } },
  { id: 'ls4', category: FunFactCategory.LightScience, content: { en: "Sunsets and sunrises often appear red and orange because when the sun is low on the horizon, its light passes through more of the atmosphere. This increased scattering removes most of the blue light, allowing the longer red and orange wavelengths to dominate what we see.", ar: "غالبًا ما تظهر ألوان غروب الشمس وشروقها باللونين الأحمر والبرتقالي لأنه عندما تكون الشمس منخفضة في الأفق، يمر ضوءها عبر جزء أكبر من الغلاف الجوي. هذا التشتت المتزايد يزيل معظم الضوء الأزرق، مما يسمح للأطوال الموجية الحمراء والبرتقالية الأطول بالسيطرة على ما نراه." } },
  { id: 'ls5', category: FunFactCategory.LightScience, content: { en: "A double rainbow occurs when sunlight is reflected twice inside raindrops. The secondary rainbow is always fainter, appears outside the primary bow, and its colors are reversed (red on the inside, violet on the outside).", ar: "يحدث قوس قزح المزدوج عندما ينعكس ضوء الشمس مرتين داخل قطرات المطر. يكون قوس القزح الثانوي دائمًا أخفت، ويظهر خارج القوس الأساسي، وتكون ألوانه معكوسة (الأحمر من الداخل، والبنفسجي من الخارج)." } },
];

// Avatar Constants
export const AVATAR_IDS: AvatarId[] = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5'];

export const AVATARS: Record<AvatarId, AvatarDefinition> = {
  avatar1: { id: 'avatar1', name: { en: 'Bot Star', ar: 'نجمة آلية' }, imageUrl: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=star&radius=40&backgroundColor=transparent' },
  avatar2: { id: 'avatar2', name: { en: 'Friendly Bot', ar: 'آلي ودود' }, imageUrl: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=robot&radius=40&backgroundColor=transparent' },
  avatar3: { id: 'avatar3', name: { en: 'Curious Bot', ar: 'آلي فضولي' }, imageUrl: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=alien&radius=40&backgroundColor=transparent' },
  avatar4: { id: 'avatar4', name: { en: 'Happy Bot', ar: 'آلي سعيد' }, imageUrl: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=cat&radius=40&backgroundColor=transparent' }, 
  avatar5: { id: 'avatar5', name: { en: 'Wise Bot', ar: 'آلي حكيم' }, imageUrl: 'https://api.dicebear.com/8.x/bottts-neutral/svg?seed=owl&radius=40&backgroundColor=transparent' }, 
};

export const INITIAL_SELECTED_AVATAR_ID: AvatarId = AVATAR_IDS[0];

// Color Match Mini-Game Constants
export const MAX_COLOR_MATCH_ATTEMPTS = 3;
export const COLOR_MATCH_CHALLENGES_PER_SESSION = 5; // Number of challenges before game ends or loops

export const COLOR_MATCH_CHALLENGES_DATA: ColorMatchChallengeDefinition[] = [
  { id: 'cm_apple', objectName: { en: 'Apple', ar: 'تفاحة' }, imageUrl: 'https://source.unsplash.com/200x200/?apple,fruit', correctColorId: 'red', choiceColorIds: ['red', 'green', 'yellow', 'blue'] },
  { id: 'cm_banana', objectName: { en: 'Banana', ar: 'موزة' }, imageUrl: 'https://source.unsplash.com/200x200/?banana,fruit', correctColorId: 'yellow', choiceColorIds: ['yellow', 'green', 'orange', 'brown'] },
  { id: 'cm_frog', objectName: { en: 'Frog', ar: 'ضفدع' }, imageUrl: 'https://source.unsplash.com/200x200/?frog,animal', correctColorId: 'green', choiceColorIds: ['green', 'brown', 'blue', 'yellow'] },
  { id: 'cm_sky', objectName: { en: 'Sky', ar: 'سماء' }, imageUrl: 'https://source.unsplash.com/200x200/?sky,blue', correctColorId: 'blue', choiceColorIds: ['blue', 'white', 'gray', 'purple'] },
  { id: 'cm_sun', objectName: { en: 'Sun', ar: 'شمس' }, imageUrl: 'https://source.unsplash.com/200x200/?sun,yellow', correctColorId: 'yellow', choiceColorIds: ['yellow', 'orange', 'red', 'white'] },
  { id: 'cm_grapes', objectName: { en: 'Grapes', ar: 'عنب' }, imageUrl: 'https://source.unsplash.com/200x200/?grapes,fruit', correctColorId: 'purple', choiceColorIds: ['purple', 'green', 'red', 'black'] },
  { id: 'cm_carrot', objectName: { en: 'Carrot', ar: 'جزرة' }, imageUrl: 'https://source.unsplash.com/200x200/?carrot,vegetable', correctColorId: 'orange', choiceColorIds: ['orange', 'red', 'yellow', 'brown'] },
  { id: 'cm_cloud', objectName: { en: 'Cloud', ar: 'سحابة' }, imageUrl: 'https://source.unsplash.com/200x200/?cloud,white', correctColorId: 'white', choiceColorIds: ['white', 'gray', 'blue', 'black'] },
  { id: 'cm_tree_trunk', objectName: { en: 'Tree Trunk', ar: 'جذع شجرة' }, imageUrl: 'https://source.unsplash.com/200x200/?tree,trunk', correctColorId: 'brown', choiceColorIds: ['brown', 'gray', 'green', 'black'] },
  { id: 'cm_flamingo', objectName: { en: 'Flamingo', ar: 'فلامنغو' }, imageUrl: 'https://source.unsplash.com/200x200/?flamingo,bird', correctColorId: 'pink', choiceColorIds: ['pink', 'red', 'orange', 'white'] },
];

// Rainbow Sequence Mini-Game Constants
export const RAINBOW_SEQUENCE_CHALLENGES_PER_SESSION = 3;
export const MAX_RAINBOW_SEQUENCE_ATTEMPTS = 2; // Attempts per sequence challenge

export const RAINBOW_SEQUENCE_CHALLENGES_DATA: RainbowSequenceChallengeDefinition[] = [
  { 
    id: 'rs_primary', 
    name: { en: 'Primary Colors', ar: 'الألوان الأساسية' }, 
    description: { en: 'Tap the primary colors in order: Red, Yellow, Blue.', ar: 'اضغط على الألوان الأساسية بالترتيب: أحمر، أصفر، أزرق.'},
    correctSequence: ['red', 'yellow', 'blue'],
    availableChoices: ['red', 'yellow', 'blue', 'green', 'purple'] 
  },
  { 
    id: 'rs_secondary', 
    name: { en: 'Secondary Colors', ar: 'الألوان الثانوية' },
    description: { en: 'Tap the secondary colors made from primaries: Orange, Green, Purple.', ar: 'اضغط على الألوان الثانوية المصنوعة من الأساسيات: برتقالي، أخضر، بنفسجي.'},
    correctSequence: ['orange', 'green', 'purple'],
    availableChoices: ['orange', 'green', 'purple', 'red', 'yellow', 'blue']
  },
  { 
    id: 'rs_rainbow_short', 
    name: { en: 'Short Rainbow', ar: 'قوس قزح قصير' },
    description: { en: 'Tap these rainbow colors in order: Red, Orange, Yellow, Green, Blue.', ar: 'اضغط على ألوان قوس قزح هذه بالترتيب: أحمر، برتقالي، أصفر، أخضر، أزرق.'},
    correctSequence: ['red', 'orange', 'yellow', 'green', 'blue'],
    availableChoices: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']
  },
    { 
    id: 'rs_warm_to_cool', 
    name: { en: 'Warm to Cool', ar: 'من دافئ إلى بارد' },
    description: { en: 'Order these colors from warmest to coolest: Red, Orange, Yellow, Green, Blue.', ar: 'رتب هذه الألوان من الأدفأ إلى الأبرد: أحمر، برتقالي، أصفر، أخضر، أزرق.'},
    correctSequence: ['red', 'orange', 'yellow', 'green', 'blue'],
    availableChoices: ['blue', 'yellow', 'red', 'green', 'orange', 'purple']
  },
];


export const UI_TEXTS: UITexts = {
  [Language.EN]: {
    appTitle: 'Mira-Colors Learning App',
    mixColorsToMake: 'Mix colors to make',
    mix: 'Mix!',
    reset: 'Reset',
    attemptsLeft: 'Attempts left',
    correct: 'Correct!',
    tryAgain: 'Try Again!',
    warmPalette: 'Warm',
    coolPalette: 'Cool',
    neutralPalette: 'Neutral',
    funFactsExplorer: 'Fun Facts',
    colorMixingGame: 'Color Mixing Game',
    generalColors: 'General Colors',
    vision: 'Vision',
    lightScience: 'Light Science',
    tapToHear: 'Tap to hear',
    greatJob: 'Great job!',
    wantToHearFunFact: 'Want to hear a fun fact?',
    yes: 'Yes!',
    noThanks: 'No, thanks',
    selectTwoColors: 'Select two colors to mix',
    revealAnswer: 'Reveal Answer',
    nextChallenge: 'Next Challenge',
    allChallengesCompleted: 'All challenges completed! Well done!',
    paletteCompleted: 'Palette Completed!',
    toggleTTS: 'Toggle Text-to-Speech (Voice Assistant)',
    pressPlayToHearFact: 'Press play to hear fact',
    answerRevealedTitle: 'Answer Revealed',
    theCorrectAnswerIs: 'The correct answer is',
    playAnswerSound: 'Play Sound',
    and: 'and',
    make: 'make',
    isAFundamentalColorMessage: '{COLOR_NAME} is a fundamental color.',
    paletteLockedMessage: 'Complete previous palettes to unlock!',
    selectTheTargetColorPrompt: 'Select the target color.',
    avatarSelectionTitle: 'Choose Your Avatar',
    selectYourAvatarButton: 'Change Avatar',
    closeAvatarSelection: 'Close',
    avatar1Name: AVATARS.avatar1.name.en,
    avatar2Name: AVATARS.avatar2.name.en,
    avatar3Name: AVATARS.avatar3.name.en,
    avatar4Name: AVATARS.avatar4.name.en,
    avatar5Name: AVATARS.avatar5.name.en,
    toggleSoundEffects: 'Toggle Sound Effects',
    toggleBackgroundMusic: 'Toggle Background Music',
    allColorsViewTabTitle: 'All Colors',
    allColorsViewTitle: 'Color Reference Guide',
    toggleColorblindMode: 'Toggle Colorblind Mode',
    toggleHapticFeedback: 'Toggle Haptic Feedback',
    miniGamesNavTitle: 'Mini-Games',
    colorMatchGameTitle: 'Color Match Challenge',
    whatColorIsThe: 'What color is the {OBJECT_NAME}?',
    submitAnswer: 'Submit Answer',
    nextObject: 'Next Object',
    sessionComplete: 'Session Complete!',
    yourFinalScoreIs: 'Your final score is: {SCORE} / {TOTAL_CHALLENGES}',
    playAgain: 'Play Again',
    exitMiniGame: 'Exit Mini-Game',
    rainbowSequenceGameTitle: 'Rainbow Sequence',
    tapColorsInOrder: 'Tap the colors in the correct order!',
    yourCurrentSequence: 'Your sequence:',
    sequenceCorrect: 'Sequence Correct!',
    sequenceIncorrect: 'Sequence Incorrect, try again!',
    resetAttemptButton: 'Reset Attempt',
    miniGamesLandingTitle: 'Choose a Mini-Game!',
  },
  [Language.AR]: {
    appTitle: 'تطبيق ميرا لتعلم الألوان',
    mixColorsToMake: 'امزج الألوان لتحصل على',
    mix: 'امزج!',
    reset: 'إعادة تعيين',
    attemptsLeft: 'المحاولات المتبقية',
    correct: 'صحيح!',
    tryAgain: 'حاول مرة أخرى!',
    warmPalette: 'دافئة',
    coolPalette: 'باردة',
    neutralPalette: 'محايدة',
    funFactsExplorer: 'حقائق ممتعة',
    colorMixingGame: 'لعبة مزج الألوان',
    generalColors: 'ألوان عامة',
    vision: 'الرؤية',
    lightScience: 'علوم الضوء',
    tapToHear: 'اضغط للاستماع',
    greatJob: 'عمل رائع!',
    wantToHearFunFact: 'هل تريد سماع حقيقة ممتعة؟',
    yes: 'نعم!',
    noThanks: 'لا شكراً',
    selectTwoColors: 'اختر لونين لدمجهما',
    revealAnswer: 'اظهر الإجابة',
    nextChallenge: 'التحدي التالي',
    allChallengesCompleted: 'اكتملت جميع التحديات! أحسنت!',
    paletteCompleted: 'اكتملت ألوان المجموعة!',
    toggleTTS: 'تبديل تحويل النص إلى كلام (مساعد صوتي)',
    pressPlayToHearFact: 'اضغط تشغيل لسماع الحقيقة',
    answerRevealedTitle: 'الإجابة المعروضة',
    theCorrectAnswerIs: 'الإجابة الصحيحة هي',
    playAnswerSound: 'تشغيل الصوت',
    and: 'و',
    make: 'ينتج',
    isAFundamentalColorMessage: '{COLOR_NAME} لون أساسي.',
    paletteLockedMessage: 'أكمل المجموعات السابقة لفتح هذه!',
    selectTheTargetColorPrompt: 'اختر اللون الهدف.',
    avatarSelectionTitle: 'اختر صورتك الرمزية',
    selectYourAvatarButton: 'تغيير الصورة',
    closeAvatarSelection: 'إغلاق',
    avatar1Name: AVATARS.avatar1.name.ar,
    avatar2Name: AVATARS.avatar2.name.ar,
    avatar3Name: AVATARS.avatar3.name.ar,
    avatar4Name: AVATARS.avatar4.name.ar,
    avatar5Name: AVATARS.avatar5.name.ar,
    toggleSoundEffects: 'تبديل المؤثرات الصوتية',
    toggleBackgroundMusic: 'تبديل موسيقى الخلفية',
    allColorsViewTabTitle: 'كل الألوان',
    allColorsViewTitle: 'دليل مرجعي للألوان',
    toggleColorblindMode: 'تبديل وضع عمى الألوان',
    toggleHapticFeedback: 'تبديل ردود الفعل اللمسية',
    miniGamesNavTitle: 'ألعاب مصغرة',
    colorMatchGameTitle: 'تحدي مطابقة الألوان',
    whatColorIsThe: 'ما هو لون الـ {OBJECT_NAME}؟',
    submitAnswer: 'إرسال الإجابة',
    nextObject: 'الكائن التالي',
    sessionComplete: 'اكتملت الجولة!',
    yourFinalScoreIs: 'نتيجتك النهائية هي: {SCORE} / {TOTAL_CHALLENGES}',
    playAgain: 'العب مرة أخرى',
    exitMiniGame: 'الخروج من اللعبة المصغرة',
    rainbowSequenceGameTitle: 'تسلسل الألوان',
    tapColorsInOrder: 'اضغط على الألوان بالترتيب الصحيح!',
    yourCurrentSequence: 'تسلسلك الحالي:',
    sequenceCorrect: 'التسلسل صحيح!',
    sequenceIncorrect: 'التسلسل غير صحيح، حاول مرة أخرى!',
    resetAttemptButton: 'إعادة المحاولة',
    miniGamesLandingTitle: 'اختر لعبة مصغرة!',
  },
};


export const INITIAL_USER_PROGRESS_DATA: UserProgressData = {
  [PaletteId.Warm]: {
    unlocked: true,
    completedChallenges: new Set<ColorId>(),
    starsPerChallenge: {},
    totalStars: 0,
    mastered: false,
  },
  [PaletteId.Cool]: {
    unlocked: false,
    completedChallenges: new Set<ColorId>(),
    starsPerChallenge: {},
    totalStars: 0,
    mastered: false,
  },
  [PaletteId.Neutral]: {
    unlocked: false,
    completedChallenges: new Set<ColorId>(),
    starsPerChallenge: {},
    totalStars: 0,
    mastered: false,
  },
};


export const INITIAL_APP_STATE: AppState = {
  language: Language.EN,
  currentPaletteId: PaletteId.Warm,
  currentChallenge: null,
  selectedMixColors: [],
  mixedResultColor: null,
  attemptsLeft: MAX_ATTEMPTS,
  showSuccessSplash: false,
  showFailureShake: false,
  funFactToShow: null,
  isTTSOn: false,
  userProgress: INITIAL_USER_PROGRESS_DATA,
  isAnswerRevealed: false,
  revealedAnswerInfo: null,
  selectedAvatarId: INITIAL_SELECTED_AVATAR_ID,
  showAvatarSelectionModal: false,
  avatarReaction: null,
  showDelayedFunFactModal: false,
  isSoundEffectsOn: true, 
  isBackgroundMusicOn: false, 
  soundToPlayEffect: null,
  showErrorFlash: false,
  isColorblindModeOn: false,
  isHapticFeedbackOn: false, 
  hapticPatternToPlay: null, 

  activeMiniGame: null,
  // Color Match Mini-Game State
  colorMatchChallenges: [], 
  colorMatchSessionChallenges: [], 
  currentColorMatchChallengeIndex: null,
  currentColorMatchChallenge: null,
  colorMatchSelectedAnswerId: null,
  colorMatchScore: 0,
  colorMatchAttemptsLeft: MAX_COLOR_MATCH_ATTEMPTS,
  showColorMatchSuccess: false,
  showColorMatchFailure: false,
  colorMatchSessionEnded: false,

  // Rainbow Sequence Mini-Game State
  rainbowSequenceChallenges: [],
  rainbowSequenceSessionChallenges: [],
  currentRainbowSequenceChallengeIndex: null,
  currentRainbowSequenceChallenge: null,
  playerRainbowSequence: [],
  rainbowSequenceScore: 0,
  rainbowSequenceAttemptsLeft: MAX_RAINBOW_SEQUENCE_ATTEMPTS,
  showRainbowSequenceSuccess: false,
  showRainbowSequenceFailure: false,
  rainbowSequenceSessionEnded: false,
};

export const PALETTE_BACKGROUND_URLS: Record<PaletteId, string> = {
  [PaletteId.Warm]: 'https://source.unsplash.com/1600x900/?desert,sun,warm,sand',
  [PaletteId.Cool]: 'https://source.unsplash.com/1600x900/?forest,water,cool,leaves',
  [PaletteId.Neutral]: 'https://source.unsplash.com/1600x900/?minimalist,texture,gray,concrete',
};

// Haptic Feedback Patterns
export const HAPTIC_SUCCESS_PATTERN: number[] = [100]; // Short buzz
export const HAPTIC_FAILURE_PATTERN: number[] = [75, 50, 75]; // Interrupted double buzz

// Helper function to determine pattern color based on background luminance
function getLuminance(hexColor: string): number {
  const hex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  if (hex.length === 3) { // shorthand hex
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const rgb = parseInt(hex, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
}

function getPatternColor(hexBgColor: string): string {
  return getLuminance(hexBgColor) > 128 ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)'; // Adjusted opacity
}

type PatternGenerator = (patternColor: string) => string;

// SVG pattern definitions for colorblind mode
// Using simpler, more distinct patterns. Stroke width and fill are important.
export const SVG_PATTERN_GENERATORS: Partial<Record<ColorId, PatternGenerator>> = {
  red:    (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,0 L10,10 M10,0 L0,10" stroke="${pc}" stroke-width="2"/></svg>`, // X
  yellow: (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,5 H10" stroke="${pc}" stroke-width="2.5"/></svg>`, // Horizontal Line
  blue:   (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><circle cx="5" cy="5" r="3" fill="${pc}"/></svg>`, // Solid Dot
  green:  (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M5,0 V10" stroke="${pc}" stroke-width="2.5"/></svg>`, // Vertical Line
  orange: (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M2,2 L10,2 L10,10 L2,10 Z" stroke="${pc}" stroke-width="2" fill="none"/></svg>`, // Square Outline
  purple: (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,0 L10,0 L5,10 Z" fill="${pc}"/></svg>`, // Triangle
  white:  (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M3,6 L6,9 L9,6" stroke="${pc}" stroke-width="2" fill="none"/></svg>`, // Chevron
  black:  (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect x="0" y="0" width="10" height="10" fill="${pc}" fill-opacity="0.3"/></svg>`, // Semi-transparent fill (pattern color is white)
  gray:   (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,0 L5,5 L0,10 M5,0 L10,5 L5,10" stroke="${pc}" stroke-width="1.5" fill="none"/></svg>`, // > < Chevrons
  brown:  (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,2 H10 M0,5 H10 M0,8 H10" stroke="${pc}" stroke-width="1"/></svg>`, // Multiple Horizontal Lines
  pink:   (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M6,0 L12,6 L6,12 L0,6 Z" fill="${pc}"/></svg>`, // Diamond
  // Other colors can reuse or get new patterns
  vermilion: (pc) => SVG_PATTERN_GENERATORS.red!(pc), // Reuse Red's pattern
  amber: (pc) => SVG_PATTERN_GENERATORS.orange!(pc), // Reuse Orange's
  chartreuse: (pc) => SVG_PATTERN_GENERATORS.green!(pc), // Reuse Green's
  teal: (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,5 Q2.5,2.5 5,5 T10,5 M0,7 Q2.5,4.5 5,7 T10,7" stroke="${pc}" fill="none" stroke-width="1.5"/></svg>`, // Double Wavy
  violet: (pc) => SVG_PATTERN_GENERATORS.purple!(pc), // Reuse Purple's
  magenta: (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M0,0L10,0L10,10L0,10L0,0 Z M2,2L8,2L8,8L2,8L2,2Z" fill-rule="evenodd" fill="${pc}"/></svg>`, // Frame
  cyan: (pc) => SVG_PATTERN_GENERATORS.blue!(pc), // Reuse Blue's
  lime: (pc) => SVG_PATTERN_GENERATORS.yellow!(pc), // Reuse Yellow's (as it's light)
  turquoise: (pc) => SVG_PATTERN_GENERATORS.teal!(pc), // Reuse Teal's
  gold: (pc) => `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><path d="M6,1 L7.5,4.5 L11,5 L8.5,7.5 L9,11 L6,9 L3,11 L3.5,7.5 L1,5 L4.5,4.5 Z" fill="${pc}"/></svg>`, // Star
  silver: (pc) => SVG_PATTERN_GENERATORS.gray!(pc), // Reuse Gray's
};


export function getPatternDataUri(colorDef: ColorDefinition): string | null {
  const generator = SVG_PATTERN_GENERATORS[colorDef.id];
  if (!generator) return null;

  const patternFillColor = getPatternColor(colorDef.hex);
  const svgString = generator(patternFillColor);
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svgString)}')`;
}