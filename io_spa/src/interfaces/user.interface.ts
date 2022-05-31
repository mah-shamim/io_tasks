export interface UserInterface {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
  relationships?: Array<any>
}

export interface UserLoginResultInterface {
  user: UserInterface;
  access_token: string;
  token_type: string;
  expires_at: string;
  message: string;
}
