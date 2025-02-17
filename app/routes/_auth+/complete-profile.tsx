import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Form, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { Button, FieldError, Input, Label } from '~/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/Card';
import { FirstNameSchema, LastNameSchema } from '~/utils/schemas';

const CompleteProfileSchema = z.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
});

export async function action() {
  return {};
}

export default function CompleteProfileRoute() {
  const [form, fields] = useForm({
    id: 'complete-profile-form',
    lastResult: useActionData<typeof action>(),
    constraint: getZodConstraint(CompleteProfileSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: CompleteProfileSchema });
    },
  });

  return (
    <main className="flex-grow mx-auto py-20 sm:py-56">
      <Card className="w-full min-w-80 sm:w-[550px] sm:px-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Complete profile</CardTitle>
          <CardDescription>Lastly, tell us your name!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="POST" {...getFormProps(form)}>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor={fields.firstName.id}>First name</Label>
                <Input {...getInputProps(fields.firstName, { type: 'text' })} autoFocus />
                <FieldError field={fields.firstName} />
              </div>
              <div className="space-y-1">
                <Label htmlFor={fields.lastName.id}>Last name</Label>
                <Input {...getInputProps(fields.lastName, { type: 'text' })} />
                <FieldError field={fields.lastName} />
              </div>
            </div>
            <Button className="w-full mt-6">Create account</Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
