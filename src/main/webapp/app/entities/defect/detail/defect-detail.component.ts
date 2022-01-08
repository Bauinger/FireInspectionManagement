import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDefect } from '../defect.model';

@Component({
  selector: 'jhi-defect-detail',
  templateUrl: './defect-detail.component.html',
})
export class DefectDetailComponent implements OnInit {
  defect: IDefect | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ defect }) => {
      this.defect = defect;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
