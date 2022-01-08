export interface IAddress {
  id?: string;
  street?: string | null;
  streetNumber?: number | null;
  district?: string | null;
  village?: string | null;
  postalCode?: string | null;
}

export class Address implements IAddress {
  constructor(
    public id?: string,
    public street?: string | null,
    public streetNumber?: number | null,
    public district?: string | null,
    public village?: string | null,
    public postalCode?: string | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): string | undefined {
  return address.id;
}
