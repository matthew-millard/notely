import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { useRouteLoaderData, useFetcher, Form } from '@remix-run/react';
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
import { Separator } from './Separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './Sheet';

interface EditProfileProps {
  isEditProfileDialogOpen: boolean;
  setIsEditProfileDialogOpen: Dispatch<SetStateAction<boolean>>;
  side?: 'left' | 'right' | 'bottom' | 'top';
}

export const EditProfileSchema = z.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
});

export default function EditProfile({ isEditProfileDialogOpen, setIsEditProfileDialogOpen, side }: EditProfileProps) {
  const data = useRouteLoaderData<typeof loader>('root');
  const editProfileAction = `/${data?.user?.id}/edit-profile`;
  const deleteAccountAction = `/${data?.user?.id}/delete-account`;
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
      <SheetContent side={side} className="overflow-y-auto">
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

          <Button type="submit" disabled={isFetching} className="w-full">
            {isFetching ? <LoaderCircle className="animate-spin" /> : 'Save changes'}
          </Button>

          <FormErrors errors={form.errors} errorId={form.errorId} />
        </fetcher.Form>
        <Separator className="mb-8" />

        <Form method="POST" action={deleteAccountAction} className="grid space-y-3 py-4">
          <SheetHeader>
            <SheetTitle className="text-foreground-destructive">Delete account</SheetTitle>
            <SheetDescription>
              Once you delete your account, there is no going back. You will lose all your saved notes. Please be
              certain.
            </SheetDescription>
          </SheetHeader>
          <Button type="submit" className="w-full" variant={'destructive'}>
            Delete your account
          </Button>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
