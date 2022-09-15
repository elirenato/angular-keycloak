import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IStateProvince } from '../state-province.model';

@Component({
  selector: 'jhi-state-province-detail',
  templateUrl: './state-province-detail.component.html',
})
export class StateProvinceDetailComponent implements OnInit {
  stateProvince: IStateProvince | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ stateProvince }) => {
      this.stateProvince = stateProvince;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
