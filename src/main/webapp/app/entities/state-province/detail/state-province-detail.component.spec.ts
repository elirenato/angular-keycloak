import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StateProvinceDetailComponent } from './state-province-detail.component';

describe('StateProvince Management Detail Component', () => {
  let comp: StateProvinceDetailComponent;
  let fixture: ComponentFixture<StateProvinceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StateProvinceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ stateProvince: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StateProvinceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StateProvinceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load stateProvince on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.stateProvince).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
