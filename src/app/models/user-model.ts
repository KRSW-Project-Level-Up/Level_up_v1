export class UserModel {
  constructor(
    public id: number,
    public username: string,
    public email: string,
    public password: string,
    public role: string,
    public fullName: string,
    public token: string
  ) {}
}
