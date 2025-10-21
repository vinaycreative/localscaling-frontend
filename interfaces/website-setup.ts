export interface WebsiteSetupFormData {
  accessGranted: boolean;
  domainProvider: string;
  businessClientsWorked: string[];
  legalLinks: string[];
  legalFiles: File[] | null;
}
