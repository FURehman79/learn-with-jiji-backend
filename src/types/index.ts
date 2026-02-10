// Database Types
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface Query {
  id: string;
  user_id: string;
  query_text: string;
  response_text: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  resource_type: 'ppt' | 'video' | 'document';
  file_url: string;
  keywords: string[];
  created_at: string;
  updated_at: string;
}

// API Request/Response Types
export interface AskJijiRequest {
  query: string;
  user_id?: string;
}

export interface AskJijiResponse {
  success: boolean;
  data?: {
    answer: string;
    resources: ResourceResponse[];
    query_id: string;
  };
  error?: {
    message: string;
    code: string;
  };
}

export interface ResourceResponse {
  id: string;
  title: string;
  description: string;
  type: 'ppt' | 'video' | 'document';
  url: string;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
}
