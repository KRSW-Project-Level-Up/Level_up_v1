export class UserModel {
  constructor(
    public user_id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public username: string,
    public age: number,
    public nationality: string,
    public password: string
  ) {}
}
