import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

export function createFormGroupFromConfig(fb: FormBuilder, config: any): FormGroup {
  const formGroup = fb.group({});
  for (const key in config) {
    if (config.hasOwnProperty(key)) {
      formGroup.addControl(key, new FormControl('', config[key][0]));
    }
  }
  return formGroup;
}