export class User {
  id: number;
  firstName: string;
  lastName: string;
  resume: string;

  constructor(id: number, firstName: string, lastName: string, resume: string) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.resume = resume;
  }
}
