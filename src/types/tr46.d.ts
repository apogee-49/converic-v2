declare module "tr46" {
  export type ProcessingOption = "transitional" | "nontransitional";

  export interface ToASCIIOptions {
    useStd3ASCIIRules?: boolean;
    checkBidi?: boolean;
    checkHyphens?: boolean;
    checkJoiners?: boolean;
    processingOption?: ProcessingOption;
    verifyDNSLength?: boolean;
  }

  export function toASCII(domain: string, options?: ToASCIIOptions): string;
}


