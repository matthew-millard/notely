import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useRouteLoaderData, useFetcher } from '@remix-run/react';
import { LoaderCircle } from 'lucide-react';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';
import { loader } from '~/root';
import { FirstNameSchema, LastNameSchema } from '~/utils/schemas';
import { Button } from './Button';
import FieldError from './FieldError';
import FormErrors from './FormError';
import Input from './Input';
import Label from './Label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './Sheet';

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
  const editProfileAction = `/${data?.user?.id}/edit-profile`;
  const fetcher = useFetcher({ key: 'edit-profile' });
  const isFetching = fetcher.state !== 'idle' && fetcher.formAction === editProfileAction;
  const [name, setName] = useState({
    firstName: data?.user?.firstName,
    lastName: data?.user?.lastName,
  });

  const [form, fields] = useForm({
    id: 'edit-profile-form',
    constraint: getZodConstraint(EditProfileSchema),
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: EditProfileSchema,
      });
    },
  });

  return (
    <Sheet open={isEditProfileDialogOpen} onOpenChange={setIsEditProfileDialogOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
        </SheetHeader>
        <fetcher.Form {...getFormProps(form)} method="POST" action={editProfileAction} className="grid space-y-3 py-4">
          <div className="grid gap-2">
            <Label htmlFor={fields.firstName.id} className="">
              First name
            </Label>
            <Input
              value={name.firstName}
              onChange={event => setName(prev => ({ ...prev, firstName: event.target.value }))}
              {...getInputProps(fields.firstName, { type: 'text' })}
              autoFocus
            />
            <FieldError field={fields.firstName} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor={fields.lastName.id} className="">
              Last name
            </Label>
            <Input
              value={name.lastName}
              onChange={event => setName(prev => ({ ...prev, lastName: event.target.value }))}
              {...getInputProps(fields.lastName, { type: 'text' })}
              className="col-span-3"
            />
            <FieldError field={fields.lastName} />
          </div>

          <div>
            <FormErrors errors={form.errors} errorId={form.errorId} />
            <Button type="submit" disabled={isFetching} className="w-full">
              {isFetching ? <LoaderCircle className="animate-spin" /> : 'Save changes'}
            </Button>
          </div>
        </fetcher.Form>
      </SheetContent>
    </Sheet>
  );
}
