import * as dayjs from 'dayjs';
import { IInspection } from 'app/entities/inspection/inspection.model';

export interface IDefect {
  id?: string;
  defectNr?: string | null;
  deadline?: dayjs.Dayjs | null;
  done?: boolean | null;
  imminentDanger?: boolean | null;
  title?: string | null;
  description?: string | null;
  suggestions?: string | null;
  inspection?: IInspection | null;
}

export class Defect implements IDefect {
  constructor(
    public id?: string,
    public defectNr?: string | null,
    public deadline?: dayjs.Dayjs | null,
    public done?: boolean | null,
    public imminentDanger?: boolean | null,
    public title?: string | null,
    public description?: string | null,
    public suggestions?: string | null,
    public inspection?: IInspection | null
  ) {
    this.done = this.done ?? false;
    this.imminentDanger = this.imminentDanger ?? false;
  }
}

export function getDefectIdentifier(defect: IDefect): string | undefined {
  return defect.id;
}
