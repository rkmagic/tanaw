export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  birthday: string | null;
  gender: string | null;
  mobile_number: string | null;
  past_work_experience: string | null;
  educational_background: string | null;
  desired_job: string | null;
  desired_country: string | null;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  id: string;
  full_name: string | null;
  gender: string | null;
  past_work_experience: string | null;
  desired_job: string | null;
  desired_country: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  uploaded_at: string;
}

export interface CreateProfileData {
  full_name: string;
  birthday?: string;
  gender?: string;
  mobile_number?: string;
  past_work_experience?: string;
  educational_background?: string;
  desired_job?: string;
  desired_country?: string;
}

export interface UpdateProfileData extends Partial<CreateProfileData> {}

export type UserRole = 'candidate' | 'agency' | 'employer' | 'admin';

export interface AccountMe {
  user_id: string;
  role: UserRole;
}
