import Button from "@material-ui/core/Button/Button";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText/FormHelperText";
import Input from "@material-ui/core/Input/Input";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import { isEmpty } from "lodash";
import * as React from "react";
import { DispatchProp } from "react-redux";
import { Field } from "../src-modules/rx-form/Field";
import { RxForm } from "../src-modules/rx-form/RxForm";

interface IPageHomeProps extends DispatchProp {}

const DemoInput = ({ name, value, error, onChange, placeholder, type }: any) => (
  <FormControl error={!!error} aria-describedby="name-error-text">
    <InputLabel htmlFor="name-error">{name}</InputLabel>
    <Input value={value} onChange={onChange} placeholder={placeholder} type={type} />
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

const required = (value: string) => {
  return isEmpty(value) ? "no empty value" : undefined;
};

const maxLength5 = (value: string) => {
  return value.length > 5 ? "value length must less than 5" : undefined;
};

export class FieldLevelValidationForm extends React.Component<IPageHomeProps> {
  button: any = null;

  state = {
    username: {
      value: "",
      error: [],
    },
    password: {
      value: "",
      error: [],
    },
  };

  handleSubmit = () => {};

  render() {
    return (
      <RxForm onSubmit={this.handleSubmit}>
        {({ onSubmit }) => (
          <form onSubmit={onSubmit}>
            <Field name={"username"} component={DemoInput} validate={[required, maxLength5]} value="" />
            <Field
              name={"password"}
              type={"password"}
              component={DemoInput}
              placeholder="type password here..."
              value=""
              validate={required}
            />
            <Button type="submit">Submit</Button>
          </form>
        )}
      </RxForm>
    );
  }
}
