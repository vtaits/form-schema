/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useFormState,
} from 'react-final-form';
import { shallow } from 'enzyme';
import type { FC } from 'react';

import type {
  FieldType,
  FieldComponentProps,
} from '../../../core';

import { DynamicField } from '../component';

const TestComponent: FC<FieldComponentProps<any>> = () => null;

const fieldType: FieldType<any> = {
  component: TestComponent,
};

test('should provide form values to `getSchema`', () => {
  const getSchema = jest.fn();

  const values: Record<string, any> = {
    field1: 'value1',
  };

  shallow(
    <DynamicField
      fieldSchema={{
        getSchema,
      }}
      name="test"
      getFieldSchema={() => null}
      getFieldType={() => fieldType}
      renderField={() => null}
      useFormState={(() => ({
        values,
      })) as unknown as typeof useFormState}
    />,
  );

  expect(getSchema).toHaveBeenCalledTimes(1);
  expect(getSchema).toHaveBeenCalledWith(values, 'render');
});

test('should not render anything if `getSchema` returns falsy value', () => {
  const wrapper = shallow(
    <DynamicField
      fieldSchema={{
        getSchema: () => null,
      }}
      name="test"
      getFieldSchema={() => null}
      getFieldType={() => fieldType}
      renderField={() => null}
      useFormState={(() => ({
        values: {},
      })) as unknown as typeof useFormState}
    />,
  );

  expect(wrapper.find(TestComponent).length).toBe(0);
});

test('should render component if `getSchema` returns truthy value', () => {
  const wrapper = shallow(
    <DynamicField
      fieldSchema={{
        getSchema: () => 'test',
      }}
      name="test"
      getFieldSchema={() => null}
      getFieldType={() => fieldType}
      renderField={() => null}
      useFormState={(() => ({
        values: {},
      })) as unknown as typeof useFormState}
    />,
  );

  expect(wrapper.find(TestComponent).length).toBe(1);
});

test('should call `getFieldType` with correct argument', () => {
  const getFieldType = jest.fn()
    .mockReturnValue(fieldType);

  shallow(
    <DynamicField
      fieldSchema={{
        getSchema: () => 'test',
      }}
      name="test"
      getFieldSchema={() => null}
      getFieldType={getFieldType}
      renderField={() => null}
      useFormState={(() => ({
        values: {},
      })) as unknown as typeof useFormState}
    />,
  );

  expect(getFieldType).toHaveBeenCalledTimes(1);
  expect(getFieldType).toHaveBeenCalledWith('test');
});

test('should provider correct props to rendered component', () => {
  const getFieldSchema = jest.fn();
  const renderField = jest.fn();
  const getFieldType = jest.fn()
    .mockReturnValue(fieldType);

  const wrapper = shallow(
    <DynamicField
      fieldSchema={{
        getSchema: () => 'test',
      }}
      name="testName"
      getFieldSchema={getFieldSchema}
      getFieldType={getFieldType}
      renderField={renderField}
      useFormState={(() => ({
        values: {},
      })) as unknown as typeof useFormState}
    />,
  );

  const allProps = wrapper.find(TestComponent).props();

  expect(allProps.fieldSchema).toBe('test');
  expect(allProps.name).toBe('testName');
  expect(allProps.getFieldSchema).toBe(getFieldSchema);
  expect(allProps.getFieldType).toBe(getFieldType);
  expect(allProps.renderField).toBe(renderField);
});
