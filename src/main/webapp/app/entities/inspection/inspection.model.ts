import * as dayjs from 'dayjs';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IUser } from 'app/entities/user/user.model';
import { IDefect } from 'app/entities/defect/defect.model';
import { InspectionStatus } from 'app/entities/enumerations/inspection-status.model';

export interface IInspection {
  id?: string;
  inspectionNr?: string | null;
  inspectionStatus?: InspectionStatus | null;
  startDateTime?: dayjs.Dayjs | null;
  endDateTime?: dayjs.Dayjs | null;
  note?: string | null;
  title?: string | null;
  hasTenantRefused?: boolean | null;
  tenant?: ICustomer | null;
  appraiser?: IUser | null;
  defects?: IDefect[] | null;
}

export class Inspection implements IInspection {
  constructor(
    public id?: string,
    public inspectionNr?: string | null,
    public inspectionStatus?: InspectionStatus | null,
    public startDateTime?: dayjs.Dayjs | null,
    public endDateTime?: dayjs.Dayjs | null,
    public title?: string | null,
    public note?: string | null,
    public hasTenantRefused?: boolean | null,
    public tenant?: ICustomer | null,
    public appraiser?: IUser | null,
    public defects?: IDefect[] | null
  ) {
    this.hasTenantRefused = this.hasTenantRefused ?? false;
  }
}

export function getInspectionIdentifier(inspection: IInspection): string | undefined {
  return inspection.id;
}
