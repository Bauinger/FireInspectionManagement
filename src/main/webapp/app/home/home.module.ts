import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { CalendarDateFormatter, CalendarModule, CalendarMomentDateFormatter, DateAdapter, MOMENT } from 'angular-calendar';
import * as moment from 'moment';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { MwlCalendarComponent } from './mwl-calendar.component';

export function momentAdapterFactory(): DateAdapter {
  return adapterFactory(moment);
}
@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([HOME_ROUTE]),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
  ],
  declarations: [HomeComponent, MwlCalendarComponent],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
})
export class HomeModule {}
