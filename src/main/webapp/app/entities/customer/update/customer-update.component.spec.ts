import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomerFormService } from './customer-form.service';
import { CustomerService } from '../service/customer.service';
import { ICustomer } from '../customer.model';
import { IStateProvince } from 'app/entities/state-province/state-province.model';
import { StateProvinceService } from 'app/entities/state-province/service/state-province.service';

import { CustomerUpdateComponent } from './customer-update.component';

describe('Customer Management Update Component', () => {
  let comp: CustomerUpdateComponent;
  let fixture: ComponentFixture<CustomerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customerFormService: CustomerFormService;
  let customerService: CustomerService;
  let stateProvinceService: StateProvinceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomerUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CustomerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerFormService = TestBed.inject(CustomerFormService);
    customerService = TestBed.inject(CustomerService);
    stateProvinceService = TestBed.inject(StateProvinceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call StateProvince query and add missing value', () => {
      const customer: ICustomer = { id: 456 };
      const stateProvince: IStateProvince = { id: 71372 };
      customer.stateProvince = stateProvince;

      const stateProvinceCollection: IStateProvince[] = [{ id: 35054 }];
      jest.spyOn(stateProvinceService, 'query').mockReturnValue(of(new HttpResponse({ body: stateProvinceCollection })));
      const additionalStateProvinces = [stateProvince];
      const expectedCollection: IStateProvince[] = [...additionalStateProvinces, ...stateProvinceCollection];
      jest.spyOn(stateProvinceService, 'addStateProvinceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      expect(stateProvinceService.query).toHaveBeenCalled();
      expect(stateProvinceService.addStateProvinceToCollectionIfMissing).toHaveBeenCalledWith(
        stateProvinceCollection,
        ...additionalStateProvinces.map(expect.objectContaining)
      );
      expect(comp.stateProvincesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customer: ICustomer = { id: 456 };
      const stateProvince: IStateProvince = { id: 20386 };
      customer.stateProvince = stateProvince;

      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      expect(comp.stateProvincesSharedCollection).toContain(stateProvince);
      expect(comp.customer).toEqual(customer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomer>>();
      const customer = { id: 123 };
      jest.spyOn(customerFormService, 'getCustomer').mockReturnValue(customer);
      jest.spyOn(customerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customer }));
      saveSubject.complete();

      // THEN
      expect(customerFormService.getCustomer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerService.update).toHaveBeenCalledWith(expect.objectContaining(customer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomer>>();
      const customer = { id: 123 };
      jest.spyOn(customerFormService, 'getCustomer').mockReturnValue({ id: null });
      jest.spyOn(customerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customer }));
      saveSubject.complete();

      // THEN
      expect(customerFormService.getCustomer).toHaveBeenCalled();
      expect(customerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomer>>();
      const customer = { id: 123 };
      jest.spyOn(customerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStateProvince', () => {
      it('Should forward to stateProvinceService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(stateProvinceService, 'compareStateProvince');
        comp.compareStateProvince(entity, entity2);
        expect(stateProvinceService.compareStateProvince).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
