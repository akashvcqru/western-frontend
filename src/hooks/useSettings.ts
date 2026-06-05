import { useGetSettingsByKeyQuery } from "@/redux/api/settingsApi";
import siteContent from "@/data/site-content.json";

export interface ParsedContact {
  email: string;
  phones: string[];
  phone: string;
  phoneRaw: string;
  address: string;
  locationShort: string;
}

export interface ParsedSocial {
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  pinterestUrl: string;
  youtubeUrl: string;
}

export function useSettings() {
  const { data: contactRes, isLoading: isContactLoading } = useGetSettingsByKeyQuery("bdm_settings_contact");
  const { data: socialRes, isLoading: isSocialLoading } = useGetSettingsByKeyQuery("bdm_settings_social");

  const contactData = contactRes?.data;
  const socialData = socialRes?.data;

  // Contact details parsing & fallbacks
  const email = contactData?.supportEmail || siteContent.common.contact.email;
  
  const rawPhones = contactData?.phoneNumber 
    ? contactData.phoneNumber.split(",").map((p: string) => p.trim()) 
    : siteContent.common.contact.phones;

  // Format phones for display and raw (for href links)
  const phones = rawPhones.filter(Boolean);
  const phone = phones.join(", ") || siteContent.common.contact.phone;
  const phoneRaw = phones[0] ? phones[0].replace(/[^0-9]/g, "") : siteContent.common.contact.phoneRaw;

  const address = contactData?.storeAddress || siteContent.common.contact.address;

  // Short address extraction helper
  const getShortAddress = (addr: string) => {
    if (!addr) return siteContent.common.contact.locationShort;
    const parts = addr.split(",").map(p => p.trim());
    // Find Gurugram/Gurgaon and Kadipur
    const hasKadipur = parts.some(p => p.toLowerCase().includes("kadipur"));
    const hasGurugram = parts.some(p => p.toLowerCase().includes("gurugram") || p.toLowerCase().includes("gurgaon"));
    if (hasKadipur && hasGurugram) return "Kadipur, Gurgaon";
    // Fallback to last two parts if available
    if (parts.length >= 2) return `${parts[parts.length - 2]}, ${parts[parts.length - 1].split(" ")[0]}`;
    return parts[0];
  };
  const locationShort = getShortAddress(address);

  // Social links mapping & fallbacks
  const facebookUrl = socialData?.facebookUrl || "#";
  const instagramUrl = socialData?.instagramUrl || "#";
  const twitterUrl = socialData?.twitterUrl || "#";
  const linkedinUrl = socialData?.linkedinUrl || "#";
  const pinterestUrl = socialData?.pinterestUrl || "#";
  const youtubeUrl = socialData?.youtubeUrl || "#";

  return {
    contact: {
      email,
      phones,
      phone,
      phoneRaw,
      address,
      locationShort,
    } as ParsedContact,
    social: {
      facebookUrl,
      instagramUrl,
      twitterUrl,
      linkedinUrl,
      pinterestUrl,
      youtubeUrl,
    } as ParsedSocial,
    isLoading: isContactLoading || isSocialLoading,
  };
}
