import { setRequestLocale } from "next-intl/server";
import { PageContainer } from "@/components/page-container";
import { VisitAssistSection } from "@/components/visit-assist-section";

export const dynamic = "force-dynamic";

export default async function VisitHelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const my = locale === "my";

  return (
    <PageContainer>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {my ? "မိတ်ဖက်ခရီးစဉ်" : "Incentive visit"}
      </p>
      <h1 className="mt-2 text-4xl font-semibold text-[#1a2330]">
        {my ? "လာရောက်ရန် အကူအညီ" : "Help getting here"}
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600">
        {my
          ? "ကျန်းမာရေးစစ်ဆေး ပက်ကေ့ချ်တွင် လေဆိပ်ကားနှင့် နေထိုင်ရန် မပါဝင်ပါ။ လိုပါက ညှိနှိုင်းရေးမှူးက ကူညီသည်။ နေထိုင်ရန်သည် ရိုးရိုး အငှားတိုက်ခန်းဖြစ်နိုင်ပြီး ဟိုတယ်ပက်ကေ့ချ် မဟုတ်ပါ။"
          : "Check-up packages do not include airport pickup or a stay. If you wish, a coordinator can help. A stay is a simple rental apartment — not a hotel package."}
      </p>
      <div className="mt-10">
        <VisitAssistSection locale={locale} compact />
      </div>
    </PageContainer>
  );
}
