export interface UserProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface UserDeleteRequest {
  password: string;
}
