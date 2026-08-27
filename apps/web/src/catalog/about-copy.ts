import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";

/** Public About copy. Admin can override each key in SiteContent. */
export const ABOUT_FIELDS = [
  {
    key: "about.kicker",
    label: "Small line above title",
    multiline: false,
    fallbackEn: "Official partner · website and apps",
    fallbackMy: "တရားဝင် မိတ်ဖက် · ဝက်ဘ်ဆိုက်နှင့် အက်ပ်များ",
  },
  {
    key: "about.title",
    label: "Page title",
    multiline: false,
    fallbackEn: "Connect here for the official partner visit",
    fallbackMy: "တရားဝင် မိတ်ဖက်ခရီးစဉ်ကို ဤနေရာမှ ဆက်သွယ်ပါ",
  },
  {
    key: "about.highlight",
    label: "Highlight under title",
    multiline: true,
    fallbackEn:
      "Visitors who connect on this website or LINE receive the official Chiangmai Ram partner opportunity: a large published discount and visit priority. That is stronger than going through a usual medical agent or incentive broker who works under many hospitals.",
    fallbackMy:
      "ဤဝက်ဘ်ဆိုက် သို့မဟုတ် LINE မှ ဆက်သွယ်သော ဧည့်သည်များသည် ချင်းမိုင်ရမ်၏ တရားဝင် မိတ်ဖက်အခွင့်အရေးကို ရရှိပါသည်။ ဆေးရုံက ထုတ်ပြန်ထားသော လျှော့စျေးကြီးနှင့် ဦးစားပေး ခရီးစဉ်ဖြစ်ပါသည်။ ဆေးရုံအများအပြားအောက်တွင် လုပ်ကိုင်သော ပုံမှန်ဆေးအေးဂျင့် သို့မဟုတ် incentive ကြားခံထက် ပိုမိုခိုင်မာပါသည်။",
  },
  {
    key: "about.lead",
    label: "Lead paragraph",
    multiline: true,
    fallbackEn:
      "This website is the official partner channel of Chiangmai Ram Hospital for patients from Myanmar and Asia. Care is at Chiangmai Ram — one hospital, not a shopping list of many hospitals. We offer a simple way to connect: send a request on this website, use the Google Form, or open LINE from the same site. Every request arrives in one coordinator inbox. We do not invent a different medical service. We confirm the hospital-published incentive for people who come through this official channel.",
    fallbackMy:
      "ဤဝက်ဘ်ဆိုက်သည် မြန်မာနှင့် အာရှလူနာများအတွက် ချင်းမိုင်ရမ်ဆေးရုံ၏ တရားဝင် မိတ်ဖက်လမ်းကြောင်း ဖြစ်ပါသည်။ ကုသမှုကို ချင်းမိုင်ရမ်ဆေးရုံ တစ်ရုံတွင် လုပ်ပါသည်။ ဆေးရုံအများအပြားကို ရွေးချယ်ရောင်းသော လမ်းကြောင်း မဟုတ်ပါ။ ဆက်သွယ်ရန် လွယ်ကူပါသည်။ ဤဝက်ဘ်ဆိုက်မှ တောင်းဆိုမှု ပို့ပါ။ Google Form ကိုသုံးပါ။ သို့မဟုတ် ဤဆိုက်ထဲမှ LINE ကို ဖွင့်ပါ။ တောင်းဆိုမှုအားလုံး ညှိနှိုင်းရေးမှူး စာရင်းတစ်ခုတည်းသို့ ရောက်ပါသည်။ ဆေးဝန်ဆောင်မှုအသစ်ကို တီထွင်မပြောပါ။ ဤတရားဝင်လမ်းကြောင်းမှ လာသူများအတွက် ဆေးရုံထုတ်ပြန် incentive ကို အတည်ပြုပါသည်။",
  },
  {
    key: "about.whoTitle",
    label: "Who we are — heading",
    multiline: false,
    fallbackEn: "Who we are",
    fallbackMy: "ကျွန်ုပ်တို့ ဘယ်သူများလဲ",
  },
  {
    key: "about.whoBody",
    label: "Who we are — body",
    multiline: true,
    fallbackEn:
      "Chiangmai Ram Hospital is the hospital in Chiang Mai. We are the official partner for the incentive visit plan. We show only hospital-published centres and 2026 check-up packages. A coordinator stays with you until the visit, optional airport pickup, and optional rental apartment are clear. Pickup and stay are extra help if you want them — not a hotel package, and not part of the checkup price.",
    fallbackMy:
      "ချင်းမိုင်ရမ်ဆေးရုံသည် ချင်းမိုင်ရှိ ဆေးရုံဖြစ်ပါသည်။ ကျွန်ုပ်တို့သည် incentive ခရီးစဉ်၏ တရားဝင် မိတ်ဖက်ဖြစ်ပါသည်။ ဆေးရုံက ထုတ်ပြန်ထားသော ဌာနများနှင့် ၂၀၂၆ ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်များကိုသာ ပြပါသည်။ ညှိနှိုင်းရေးမှူးက လာရောက်မည့်နေ့၊ လိုပါက လေဆိပ်ကား၊ လိုပါက အငှားတိုက်ခန်း ရှင်းသည်အထိ ကူညီပါသည်။ ကားနှင့် နေထိုင်ရန်သည် လိုမှသာ အကူအညီဖြစ်ပါသည်။ ဟိုတယ်ပက်ကေ့ချ် မဟုတ်ပါ။ စစ်ဆေးစျေးထဲတွင်လည်း မပါပါ။",
  },
  {
    key: "about.focusTitle",
    label: "Asia patients — heading",
    multiline: false,
    fallbackEn: "For Myanmar and Asia visitors",
    fallbackMy: "မြန်မာနှင့် အာရှဧည့်သည်များအတွက်",
  },
  {
    key: "about.focusBody",
    label: "Asia patients — body",
    multiline: true,
    fallbackEn:
      "We focus first on Myanmar patients, then other visitors from Asia. Write in Myanmar or English. If you need an interpreter, say so on the form. This site is for a planned visit, not emergency care.",
    fallbackMy:
      "မြန်မာလူနာများကို ဦးစားပေး ကူညီပါသည်။ ထို့နောက် အာရှမှ အခြားဧည့်သည်များကို ကူညီပါသည်။ မြန်မာ သို့မဟုတ် အင်္ဂလိပ်ဖြင့် ရေးနိုင်ပါသည်။ ဘာသာပြန်လိုပါက ဖောင်တွင် ပြောပါ။ ဤဆိုက်သည် ကြိုတင်စီစဉ်သော ခရီးစဉ်အတွက်သာ ဖြစ်ပါသည်။ အရေးပေါ်ကုသမှု မဟုတ်ပါ။",
  },
  {
    key: "about.whyTitle",
    label: "Why inquire here — heading",
    multiline: false,
    fallbackEn: "Discount and priority on this official channel",
    fallbackMy: "ဤတရားဝင်လမ်းကြောင်းတွင် လျှော့စျေးနှင့် ဦးစားပေး",
  },
  {
    key: "about.whyBody",
    label: "Why inquire here — body",
    multiline: true,
    fallbackEn:
      "People who connect here — on the website or the apps — have the official partner opportunity: a huge published discount and higher visit priority than a typical medical agent or incentive seller who works under many hospitals. Those agents may show similar packages. They are not the official Chiangmai Ram partner channel. We do not sell a different hospital. The same hospital-published packages are confirmed here, with the partner incentive and coordinator priority, because you came through this website and apps.",
    fallbackMy:
      "ဤဝက်ဘ်ဆိုက် သို့မဟုတ် အက်ပ်များမှ ဆက်သွယ်သူများသည် တရားဝင် မိတ်ဖက်အခွင့်အရေး ရရှိပါသည်။ ဆေးရုံက ထုတ်ပြန်ထားသော လျှော့စျေးကြီးနှင့် ခရီးစဉ် ဦးစားပေးဖြစ်ပါသည်။ ဆေးရုံအများအပြားအောက်တွင် လုပ်သော ပုံမှန်ဆေးအေးဂျင့် သို့မဟုတ် incentive ရောင်းသူများထက် ပိုမိုရရှိပါသည်။ ထိုကြားခံများက ဆင်တူပက်ကေ့ချ်ကို ပြနိုင်ပါသည်။ သို့သော် ချင်းမိုင်ရမ်၏ တရားဝင် မိတ်ဖက်လမ်းကြောင်း မဟုတ်ပါ။ ကျွန်ုပ်တို့သည် ဆေးရုံအသစ် မရောင်းပါ။ ဆေးရုံထုတ်ပြန် ပက်ကေ့ချ်အတိုင်း ဤနေရာတွင် အတည်ပြုပါသည်။ ဤဝက်ဘ်ဆိုက်နှင့် အက်ပ်မှ လာသောကြောင့် မိတ်ဖက် incentive နှင့် ညှိနှိုင်းရေးမှူး ဦးစားပေးကို ရရှိပါသည်။",
  },
  {
    key: "about.howTitle",
    label: "How it works — heading",
    multiline: false,
    fallbackEn: "How visitors connect",
    fallbackMy: "ဧည့်သည်များ ဆက်သွယ်ပုံ",
  },
  {
    key: "about.how1",
    label: "Step 1",
    multiline: true,
    fallbackEn: "Read centres and 2026 packages on this website. Then send one request here, use the Google Form, or open LINE from the same page.",
    fallbackMy: "ဤဝက်ဘ်ဆိုက်တွင် ဌာနနှင့် ၂၀၂၆ ပက်ကေ့ချ်ကို ဖတ်ပါ။ ထို့နောက် ဤနေရာမှ တောင်းဆိုမှု ပို့ပါ။ Google Form ကိုသုံးပါ။ သို့မဟုတ် ဤဆိုက်ထဲမှ LINE ကို ဖွင့်ပါ။",
  },
  {
    key: "about.how2",
    label: "Step 2",
    multiline: true,
    fallbackEn: "Send one request on this website. A coordinator keeps your details in the same visit-request list. We do not split them into extra member lists.",
    fallbackMy: "ဤဝက်ဘ်ဆိုက်မှ တောင်းဆိုမှုတစ်ခု ပို့ပါ။ ညှိနှိုင်းရေးမှူးက အချက်အလက်ကို တူညီသော လာရောက်ရန် စာရင်းတွင် ထားပါသည်။ အဖွဲ့ဝင်စာရင်းအသစ်များသို့ ခွဲမထားပါ။",
  },
  {
    key: "about.how3",
    label: "Step 3",
    multiline: true,
    fallbackEn: "A coordinator continues by email or LINE until the discounted incentive visit is clear. This is not a diagnosis by message.",
    fallbackMy: "ညှိနှိုင်းရေးမှူးက အီးမေးလ် သို့မဟုတ် LINE ဖြင့် လျှော့စျေး incentive ခရီးစဉ် ရှင်းသည်အထိ ဆက်ပြောပါမည်။ မက်ဆေ့ချ်ဖြင့် ရောဂါမရှာပါ။",
  },
  {
    key: "about.eventTitle",
    label: "Opening announcement — heading",
    multiline: false,
    fallbackEn: "Announced at the temple opening",
    fallbackMy: "ဘုရားဖွင့်ပွဲတွင် ကြေညာခဲ့ပါသည်",
  },
  {
    key: "about.eventBody",
    label: "Opening announcement — body",
    multiline: true,
    fallbackEn:
      "This official partner relationship was announced at the temple opening ceremony. You can see that announcement on Facebook ChiangmaiRam.myanmar. Facebook is only the public record. To get the partner discount and priority, connect on this website or the apps — not by Facebook message.",
    fallbackMy:
      "ဤတရားဝင် မိတ်ဖက်ဆက်ဆံရေးကို ဘုရားဖွင့်ပွဲတွင် ကြေညာခဲ့ပါသည်။ Facebook ChiangmaiRam.myanmar တွင် ထိုကြေညာချက်ကို ကြည့်နိုင်ပါသည်။ Facebook သည် အများပြည်သူ မှတ်တမ်းသာ ဖြစ်ပါသည်။ မိတ်ဖက် လျှော့စျေးနှင့် ဦးစားပေး ရရှိရန် ဤဝက်ဘ်ဆိုက် သို့မဟုတ် အက်ပ်များမှ ဆက်သွယ်ပါ။ Facebook စာပို့၍ မဟုတ်ပါ။",
  },
  {
    key: "about.noteTitle",
    label: "Important note — heading",
    multiline: false,
    fallbackEn: "Please note",
    fallbackMy: "သတိပြုရန်",
  },
  {
    key: "about.noteBody",
    label: "Important note — body",
    multiline: true,
    fallbackEn:
      "This partner site does not give emergency instructions. Website requests, Google Form requests, and LINE chats all become one visit request for coordinators. Customer details stay in that inquiry list — not scattered as extra members in the admin panel.",
    fallbackMy:
      "ဤမိတ်ဖက်ဆိုက်သည် အရေးပေါ်ညွှန်ကြားချက် မပေးပါ။ ဝက်ဘ်ဆိုက် တောင်းဆိုမှု၊ Google Form တောင်းဆိုမှုနှင့် LINE စကားပြောမှုအားလုံး ညှိနှိုင်းရေးမှူးအတွက် လာရောက်ရန် တောင်းဆိုမှု တစ်ခုတည်း ဖြစ်ပါသည်။ ဧည့်သည်အချက်အလက်ကို ထိုစာရင်းတွင်သာ ထားပါသည်။ အက်ဒမင်တွင် အဖွဲ့ဝင်စာရင်းအသစ်များသို့ ခွဲမဖြန့်ပါ။",
  },
] as const;

export const ABOUT_FACEBOOK_URL = HOSPITAL_PROFILE.facebookUrl;

export function aboutField(key: (typeof ABOUT_FIELDS)[number]["key"]) {
  return ABOUT_FIELDS.find((row) => row.key === key)!;
}
