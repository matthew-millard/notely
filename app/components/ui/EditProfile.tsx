import { useActionData, useFetcher, useRouteLoaderData } from '@remix-run/react';
import React, { Dispatch, SetStateAction } from 'react';
import { loader } from '~/root';
import { Button } from './Button';
import Input from './Input';
import Label from './Label';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from './Sheet';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { z } from 'zod';
import { FirstNameSchema, LastNameSchema } from '~/utils/schemas';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { action } from '~/routes/$userId_+/edit-profile';
import FieldError from './FieldError';
import FormErrors from './FormError';

interface EditProfileProps {
  isEditProfileDialogOpen: boolean;
  setIsEditProfileDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditProfileSchema = z.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
});

export default function EditProfile({ isEditProfileDialogOpen, setIsEditProfileDialogOpen }: EditProfileProps) {
  const data = useRouteLoaderData<typeof loader>('root');
  const updateNameForm = useFetcher();
  const updateNameAction = `/${data?.user?.id}/edit-profile`;

  const [form, fields] = useForm({
    id: 'edit-profile-form',
    lastResult: useActionData<typeof action>(),
    constraint: getZodConstraint(EditProfileSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: EditProfileSchema,
      });
    },
    defaultValue: {
      firstName: data?.user?.firstName,
      lastName: data?.user?.lastName,
    },
  });
  return (
    <Sheet open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <updateNameForm.Form
          {...getFormProps(form)}
          method="POST"
          action={updateNameAction}
          className="grid space-y-3 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor={fields.firstName.id} className="">
              First name
            </Label>
            <Input {...getInputProps(fields.firstName, { type: 'text' })} autoFocus />
            <FieldError field={fields.firstName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={fields.lastName.id} className="">
              Last name
            </Label>
            <Input {...getInputProps(fields.lastName, { type: 'text' })} className="col-span-3" />
            <FieldError field={fields.lastName} />
          </div>
        </updateNameForm.Form>
        <SheetFooter>
          <FormErrors errors={form.errors} errorId={form.errorId} />
          <Button type="submit" form={form.id}>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
