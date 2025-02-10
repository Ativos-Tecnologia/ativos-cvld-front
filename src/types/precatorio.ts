export interface PrecatorioData {
  court_info: {
    sphere: "FEDERAL" | "ESTADUAL";
    trf_region: "TRF1" | "TRF2" | "TRF3" | "TRF4" | null;
    court_division: string;
    tribunal: string | null;
    ente_devedor: string | null;
  };
  financial_data: {
    principal_value: number;
    interest_value: number;
    pss_value: number | null;
    total_value: number;
  };
  dates: {
    base_date: string;
    request_date: string;
  };
  beneficiary: {
    name: string;
    document_number: string;
  };
  process: {
    lawsuit_number: string;
  };
  rra_data: {
    present: boolean;
    number_of_months: number | null;
  };
}

export interface ExtractionResponse {
  success: boolean;
  data?: PrecatorioData;
  error?: string;
}

export interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

export type ProcessingStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "complete"
  | "error";
