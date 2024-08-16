type NotionObject = "list" | "page" | "user" | "text";
type NotionType = "email" | "date" | "relation" | "formula" | "rich_text" | "select" | "multi_select" | "created_time" | "phone_number" | "files" | "number" | "checkbox" | "people" | "status" | "title";

interface NotionAnnotation {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

interface NotionText {
  content: string;
  link: string | null;
}

interface NotionRichText {
  type: NotionObject;
  text: NotionText;
  annotations: NotionAnnotation;
  plain_text: string;
  href: string | null;
}

interface NotionFormula {
  type: "number" | "string";
  number?: number;
  string?: string;
}

interface NotionSelectOption {
  id: string;
  name: string;
  color: string;
}

interface NotionRelation {
  id: string;
  name?: string;
  color?: string;
}

interface NotionMultiSelect {
  id: string;
  name: string;
  color: string;
}

interface NotionDate {
  start: string;
  end: string | null;
  time_zone: string | null;
}

export interface NotionProperties {
  [key: string]: {
    title: any;
    id?: string;
    type: NotionType;
    email?: string | null;
    date?: NotionDate | null;
    relation?: NotionRelation[];
    has_more?: boolean;
    formula?: NotionFormula;
    rich_text?: NotionRichText[];
    select?: NotionSelectOption | null;
    multi_select?: NotionMultiSelect[];
    created_time?: string;
    phone_number?: string | null;
    files?: any[];
    number?: number | null;
    checkbox?: boolean;
    people?: any[];
    status?: {
      id: string;
      name: string;
      color: string;
    };
  };
}

export interface NotionPage {
  object: NotionObject;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: NotionObject;
    id: string;
  };
  last_edited_by: {
    object: NotionObject;
    id: string;
  };
  cover: any | null;
  icon: any | null;
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  in_trash: boolean;
  properties: NotionProperties;
  url: string;
  public_url: string | null;
}

export interface NotionResponse {
  object: NotionObject;
  results: NotionPage[];
}


