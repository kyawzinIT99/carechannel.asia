"use client";

import { createContext, useContext, type ReactNode } from "react";
import { HOSPITAL_PROFILE } from "@/catalog/hospital-source";
import type { PublicChrome } from "@/catalog/public-chrome";

const fallback: PublicChrome = {
  nameEn: HOSPITAL_PROFILE.nameEn,
  nameMy: HOSPITAL_PROFILE.nameMy,
  legalNameTh: HOSPITAL_PROFILE.legalNameTh,
  addressEn: HOSPITAL_PROFILE.addressEn,
  addressMy: HOSPITAL_PROFILE.addressMy,
  logoPath: HOSPITAL_PROFILE.logoPath,
  heroPath: HOSPITAL_PROFILE.heroPath,
  linePhone: HOSPITAL_PROFILE.chatPhoneDisplay,
  lineUrl: HOSPITAL_PROFILE.lineUrl,
  telegramUrl: HOSPITAL_PROFILE.telegramUrl,
  viberDisplay: HOSPITAL_PROFILE.viberDisplay,
  viberUrl: HOSPITAL_PROFILE.viberUrl,
  apartmentUrl: "https://sddp-apartment.onrender.com",
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
