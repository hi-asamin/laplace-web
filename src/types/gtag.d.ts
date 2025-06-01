interface Window {
  gtag: (
    command: string,
    action: string,
    params?: {
      page_path?: string;
      page_title?: string;
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ) => void;
  dataLayer: any[];
}
