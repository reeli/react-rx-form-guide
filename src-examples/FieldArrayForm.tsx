import Button from "@material-ui/core/Button/Button";
import { isEmpty } from "lodash";
import * as React from "react";
import { CustomInput } from "../src-components/CustomInput";
import { Field } from "../src-modules/rx-form/Field";
import { FieldArray } from "../src-modules/rx-form/FieldArray";
import { RxForm } from "../src-modules/rx-form/RxForm";
import { required } from "../src-modules/utils/validations";

export class FieldArrayForm extends React.Component {
  onSubmit = (values: any, onSubmitError: any) => {
    const errors = {} as any;
    if (values.members[0].firstName.length >= 5) {
      errors[`members[0].firstName`] = "Username must less that 5 digits!";
    }
    if (!isEmpty(errors)) {
      onSubmitError(errors);
    } else {
      alert(JSON.stringify(values, null, 2));
    }
  };

  render() {
    return (
      <RxForm>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <FieldArray name={"members"}>
              {({ fields, add, remove }) => (
                <ul>
                  <li>
                    <button type="button" onClick={() => add()}>
                      Add member
                    </button>
                  </li>
                  {fields.map((member, idx) => (
                    <li key={idx}>
                      <h3>{`member${idx + 1}`}</h3>
                      <Field name={`${member}.firstName`} validate={required()}>
                        {(fieldProps) => <CustomInput {...fieldProps} type="text" placeholder={`First Name${idx}`} />}
                      </Field>
                      <Field name={`${member}.lastName`} validate={required()}>
                        {(fieldProps) => <CustomInput {...fieldProps} type="password" placeholder="Last Name" />}
                      </Field>
                      <button type="button" onClick={() => remove(idx)}>
                        Remove Hobby
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </FieldArray>
            <Button type="submit">Submit</Button>
          </form>
        )}
      </RxForm>
    );
  }
}
