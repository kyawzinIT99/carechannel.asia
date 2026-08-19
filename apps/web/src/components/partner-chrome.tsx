"use client";

import { createContext, useContext, type ReactNode } from "react";
import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import type { PublicChrome } from "@/catalog/public-chrome";
import { lineHttpUrl, telegramHttpUrl, viberAppUrl } from "@/server/security/messengers";

const fallback: PublicChrome = {
  nameEn: HOSPITAL_PROFILE.nameEn,
  nameMy: HOSPITAL_PROFILE.nameMy,
  legalNameTh: HOSPITAL_PROFILE.legalNameTh,
  addressEn: HOSPITAL_PROFILE.addressEn,
  addressMy: HOSPITAL_PROFILE.addressMy,
  logoPath: HOSPITAL_PROFILE.logoPath,
  heroPath: HOSPITAL_PROFILE.heroPath,
  linePhone: HOSPITAL_PROFILE.chatPhoneDisplay,
  lineUrl: lineHttpUrl(HOSPITAL_PROFILE.chatPhoneDisplay),
  telegramUrl: telegramHttpUrl("", HOSPITAL_PROFILE.chatPhoneDisplay),
  viberDisplay: HOSPITAL_PROFILE.viberDisplay,
  viberUrl: viberAppUrl(HOSPITAL_PROFILE.viberDisplay),
  apartmentUrl: "https://sddp-apartment.onrender.com",
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfV14CMMEqKiKkALBxB0JKc740JKPiAIrY-ykNQUqTjKsJbKw/viewform",
};

const PartnerChromeContext = createContext<PublicChrome>(fallback);

export function PartnerChromeProvider({
  value,
  children,
}: {
  value: PublicChrome;
  children: ReactNode;
}) {
  return <PartnerChromeContext.Provider value={value}>{children}</PartnerChromeContext.Provider>;
}

export function usePartnerChrome() {
  return useContext(PartnerChromeContext);
}
