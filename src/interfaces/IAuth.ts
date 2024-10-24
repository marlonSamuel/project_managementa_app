export interface ILoginData {
    email: string;
    password: string;
}

export interface IAuth {
    user: IUser
    token: string
  }
  
  export interface IUser {
    id: number
    email: string
    last_names: string
    names: string
    role: string
  }