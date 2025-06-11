interface GtagParams {
  page_path?: string;
  page_title?: string;
  page_location?: string;
  event_category?: string;
  event_label?: string;
  value?: number;
  content_type?: string;
  content_id?: string;
  custom_parameters?: Record<string, any>;
  item_list_id?: string;
  item_list_name?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
  }>;
  link_text?: string;
  link_url?: string;
  outbound?: boolean;
  form_type?: string;
  form_value?: string;
  percent_scrolled?: number;
  description?: string;
  fatal?: boolean;
  [key: string]: any;
}

interface Window {
  gtag: (
    command: 'event' | 'config' | 'js' | 'consent',
    action: string,
    params?: GtagParams
  ) => void;
  dataLayer: any[];
}
