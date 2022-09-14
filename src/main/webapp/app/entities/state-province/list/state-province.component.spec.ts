import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StateProvinceService } from '../service/state-province.service';

import { StateProvinceComponent } from './state-province.component';

describe('StateProvince Management Component', () => {
  let comp: StateProvinceComponent;
  let fixture: ComponentFixture<StateProvinceComponent>;
  let service: StateProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'state-province', component: StateProvinceComponent }]), HttpClientTestingModule],
      declarations: [StateProvinceComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StateProvinceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StateProvinceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StateProvinceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.stateProvinces?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to stateProvinceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStateProvinceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStateProvinceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
