import { IAddress } from 'app/entities/address/address.model';

export interface ICustomer {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  telephoneNumber?: string | null;
  address?: IAddress | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public telephoneNumber?: string | null,
    public address?: IAddress | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): string | undefined {
  return customer.id;
}
