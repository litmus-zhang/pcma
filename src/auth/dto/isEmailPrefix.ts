import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsEmailPrefix(
  prefix: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailPrefix',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [prefix],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPrefix] = args.constraints;
          return value.endsWith(relatedPrefix); // you can return a Promise here if you want to make async validation
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must end with ${args.constraints[0]}`;
        },
      },
    });
  };
}
