import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
    return (target: Object, propertyName: string | symbol) => {
        registerDecorator({
            target: target.constructor,
            propertyName: propertyName as string,
            name: 'isPassword',
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    if (typeof value !== 'string') {
                        return false;
                    }
                    return /^[a-zA-Z0-9!@#$%^&*]*$/.test(value);
                },
            },
        });
    };
}
