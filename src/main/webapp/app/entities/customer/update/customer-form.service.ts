import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomer, NewCustomer } from '../customer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomer for edit and NewCustomerFormGroupInput for create.
 */
type CustomerFormGroupInput = ICustomer | PartialWithRequiredKeyOf<NewCustomer>;

type CustomerFormDefaults = Pick<NewCustomer, 'id'>;

type CustomerFormGroupContent = {
  id: FormControl<ICustomer['id'] | NewCustomer['id']>;
  firstName: FormControl<ICustomer['firstName']>;
  lastName: FormControl<ICustomer['lastName']>;
  email: FormControl<ICustomer['email']>;
  address: FormControl<ICustomer['address']>;
  address2: FormControl<ICustomer['address2']>;
  postalCode: FormControl<ICustomer['postalCode']>;
  country: FormControl<ICustomer['country']>;
  stateProvince: FormControl<ICustomer['stateProvince']>;
};

export type CustomerFormGroup = FormGroup<CustomerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomerFormService {
  createCustomerFormGroup(customer: CustomerFormGroupInput = { id: null }): CustomerFormGroup {
    const customerRawValue = {
      ...this.getFormDefaults(),
      ...customer,
    };
    return new FormGroup<CustomerFormGroupContent>({
      id: new FormControl(
        { value: customerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(customerRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(customerRawValue.lastName, {
        validators: [Validators.required],
      }),
      email: new FormControl(customerRawValue.email, {
        validators: [Validators.required],
      }),
      address: new FormControl(customerRawValue.address, {
        validators: [Validators.required],
      }),
      address2: new FormControl(customerRawValue.address2),
      postalCode: new FormControl(customerRawValue.postalCode, {
        validators: [Validators.required],
      }),
      country: new FormControl(customerRawValue.country, {
        validators: [Validators.required],
      }),
      stateProvince: new FormControl(customerRawValue.stateProvince, {
        validators: [Validators.required],
      }),
    });
  }

  getCustomer(form: CustomerFormGroup): ICustomer | NewCustomer {
    return form.getRawValue() as ICustomer | NewCustomer;
  }

  resetForm(form: CustomerFormGroup, customer: CustomerFormGroupInput): void {
    const customerRawValue = { ...this.getFormDefaults(), ...customer };
    form.reset(
      {
        ...customerRawValue,
        id: { value: customerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CustomerFormDefaults {
    return {
      id: null,
    };
  }
}
