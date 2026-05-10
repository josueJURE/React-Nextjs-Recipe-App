import type { CSSProperties } from "react";

export const themeColor = "#c75a2d";
export const themeHoverColor = "#b24c24";
export const borderRadius = "0.5rem";

export const appSectionClassName =
  "min-h-screen w-full bg-[linear-gradient(135deg,_#f7f8f2_0%,_#eef5f1_46%,_#fbf4ed_100%)] px-4 py-6 text-[#35241b] sm:px-6 sm:py-8 lg:px-8";
export const appShellClassName =
  "mx-auto flex w-full max-w-6xl flex-col items-center gap-6 sm:gap-8 lg:gap-10";
export const heroContainerClassName =
  "flex w-full max-w-3xl flex-col items-center gap-4 text-center sm:gap-5";
export const heroIconContainerClassName =
  "flex size-16 items-center justify-center rounded-lg bg-[#e7f0e8] shadow-[0_16px_34px_-28px_rgba(50,77,62,0.85)] sm:size-20";
export const displayFontClassName = "font-serif";
export const heroTitleClassName = `${displayFontClassName} text-3xl font-semibold leading-tight text-[#24382d] sm:text-4xl lg:text-5xl`;
export const heroSubtitleClassName =
  "mx-auto max-w-2xl text-sm leading-6 text-[#59695e] sm:text-base lg:text-lg";
export const cardClassName =
  "w-full max-w-2xl rounded-lg border border-[#dfe8dd] bg-white/95 py-5 shadow-[0_20px_45px_-34px_rgba(36,56,45,0.55)] sm:py-6";
export const cardHeaderClassName = "gap-2 px-4 sm:px-6 lg:px-8";
export const cardTitleClassName = `${displayFontClassName} text-center text-2xl font-semibold leading-tight text-[#24382d] sm:text-3xl lg:text-4xl`;
export const cardDescriptionClassName =
  "mx-auto max-w-2xl text-center text-sm leading-6 text-[#657167] sm:text-base";
export const cardContentClassName = "px-4 sm:px-6 lg:px-8";
export const sectionHeadingClassName = `${displayFontClassName} text-lg font-semibold leading-snug text-[#24382d] sm:text-xl lg:text-2xl`;
export const bodyTextClassName = "text-sm leading-6 text-[#657167] sm:text-base";
export const fieldLabelClassName =
  "text-sm font-semibold text-[#24382d] sm:text-base";
export const inputClassName =
  "min-h-12 rounded-md border-[#d8e2d6] bg-white px-4 py-3 text-base text-[#3f4c43] shadow-none placeholder:text-[#889589] focus-visible:border-[#7fa789] focus-visible:ring-[#b8d0bd]/45";
export const primaryButtonClassName =
  "min-h-12 w-full rounded-md px-4 py-3 text-sm font-semibold text-white shadow-none hover:bg-[#b24c24] sm:text-base";
export const secondaryButtonClassName =
  "min-h-12 w-full rounded-md border-[#d8e2d6] bg-white px-4 py-3 text-sm font-medium text-[#324d3e] hover:bg-[#f2f7f3] sm:text-base";
export const primaryButtonStyle: CSSProperties = {
  background: themeColor,
  borderRadius,
};
export const accentLinkClassName =
  "inline-block min-h-11 text-sm font-medium leading-11 transition-colors hover:text-[#a94520] sm:text-base";
export const infoPanelClassName =
  "w-full rounded-lg border border-[#dfe8dd] bg-white/90 p-4 shadow-[0_14px_34px_-30px_rgba(36,56,45,0.5)] sm:p-5";
export const switchRowClassName =
  "flex min-h-12 items-center justify-between gap-4 rounded-md border border-[#d8e2d6] bg-white px-4 py-3";
export const switchLabelClassName =
  "text-sm font-semibold text-[#24382d] sm:text-base";
export const previewShellClassName =
  "relative w-full overflow-hidden rounded-lg border border-[#dfe8dd] bg-white/95 p-3 shadow-[0_20px_45px_-34px_rgba(36,56,45,0.55)] sm:p-4";
export const previewSurfaceClassName =
  "min-h-[70vh] overflow-y-auto rounded-lg border border-[#d8e2d6] bg-white bg-cover bg-center bg-no-repeat p-4 sm:p-5";
export const previewTextareaClassName =
  "min-h-[45vh] w-full resize-y rounded-md border border-[#d8e2d6] bg-white/95 p-4 text-sm leading-6 text-[#3f4c43] shadow-none outline-none sm:min-h-[420px] sm:text-base sm:leading-7";


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
