import type { CSSProperties } from "react";

export const themeColor = "#c75a2d";
export const themeHoverColor = "#b24c24";
export const borderRadius = "10.5rem";

export const appSectionClassName =
  "min-h-[80vh] w-full bg-[radial-gradient(circle_at_top,_#fffdfb_0%,_#f9f2eb_52%,_#f3e7dc_100%)] px-4 py-8 text-[#35241b] sm:px-6 lg:px-8 justify-self-center";
export const appShellClassName =
  "mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:gap-14";
export const heroContainerClassName =
  "flex flex-col items-center gap-6 text-center";
export const heroIconContainerClassName =
  "flex size-28 items-center justify-center rounded-full bg-[#f7e8df] shadow-[0_18px_45px_-32px_rgba(81,52,34,0.9)] sm:size-32";
export const displayFontClassName = "font-serif";
export const heroTitleClassName = `${displayFontClassName} text-5xl font-semibold`;
export const heroSubtitleClassName =
  "mx-auto inline-block px-4 py-1 text-lg text-[#756961] sm:text-2xl";
export const cardClassName =
  "w-full max-w-2xl rounded-[2rem] border border-[#efe5dc] bg-[#fffdfa] py-8 shadow-[0_24px_60px_-28px_rgba(81,52,34,0.35)] sm:py-10";
export const cardHeaderClassName = "gap-3 px-6 sm:px-12";
export const cardTitleClassName = `${displayFontClassName} text-center text-5xl font-semibold text-[#2f1d17] sm:text-5xl`;
export const cardDescriptionClassName =
  "text-center text-lg text-[#8b7d74] sm:text-2xl";
export const cardContentClassName = "px-6 sm:px-12";
export const sectionHeadingClassName = `${displayFontClassName} text-2xl font-semibold text-[#2f1d17] sm:text-3xl`;
export const bodyTextClassName = "text-lg text-[#7d7068] sm:text-xl";
export const fieldLabelClassName =
  "text-xl font-semibold text-[#2f1d17] sm:text-2xl";
export const inputClassName =
  "h-15 rounded-[1.35rem] border-[#e6ddd5] bg-white px-6 text-lg text-[#5b4d46] placeholder:text-[#8b7d74] shadow-none focus-visible:border-[#dba57a] focus-visible:ring-[#e6c4a8]/40 sm:h-18 sm:text-2xl";
export const primaryButtonClassName =
  "h-15 w-full rounded-[1.35rem] text-lg font-semibold text-white shadow-none hover:bg-[#b24c24] sm:h-18 sm:text-2xl";
export const secondaryButtonClassName =
  "h-13 w-full rounded-[1.2rem] border-[#eadfd6] bg-white text-base font-medium text-[#4c372d] hover:bg-[#fcf5ef] sm:h-14 sm:text-lg";
export const primaryButtonStyle: CSSProperties = {
  background: themeColor,
  borderRadius,
};
export const accentLinkClassName =
  "inline-block text-lg font-medium transition-colors hover:text-[#a94520] sm:text-xl";
export const infoPanelClassName =
  "rounded-[1.5rem] border border-[#efe5dc] bg-[#fcf6f0] p-5 w-auto";
export const switchRowClassName =
  "flex items-center justify-between gap-4 rounded-[1.35rem] border border-[#efe5dc] bg-white px-5 py-4";
export const switchLabelClassName =
  "text-lg font-semibold text-[#2f1d17] sm:text-xl";
export const previewShellClassName =
  "relative min-h-[520px] overflow-hidden rounded-[1.5rem] border border-[#efe5dc] bg-[#fffaf6] p-4";
export const previewSurfaceClassName =
  "h-full overflow-y-auto rounded-[1.35rem] border border-[#e7d7ca] bg-white bg-cover bg-center bg-no-repeat p-5";
export const previewTextareaClassName =
  "min-h-[420px] w-full rounded-[1.35rem] border border-[#e6ddd5] bg-[#fffdfa] p-5 text-base leading-7 text-[#4c372d] shadow-none outline-none";


  export const checkboxTexts = [
    { id: "1", text: "AI-Generated menus from any country in the world" },
    { id: "2", text: "AI-Generated audio" },
    { id: "3", text: "Save your favorite menus" },
    { id: "4", text: "Share your favorite menus" },
    { id: "5", text: "Send email to your inbox" },
    { id: "6", text: "AI-powered nutrution insights" },
  ];

export const formFields = [
  {
    id: 0,
    name: "email",
    label: "Email",
    placeholder: "chef@example.com",
    type: "text",
  },
  {
    id: 1,
    name: "password",
    label: "Password",
    placeholder: "enter your password",
    type: "password",
  },
  {
    id: 2,
    name: "password",
    label: "Password",
    placeholder: "enter your password",
    type: "password",
  },
] ;
