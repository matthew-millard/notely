import { parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import { requireAnonymous } from "~/.server/auth";
import { prisma } from "~/.server/db";
import { SignUpForm } from "~/components/forms";
import { SignUpSchema } from "~/components/forms/SignUpForm";

export async function action({ request }: ActionFunctionArgs) {
  await requireAnonymous(request);
  const formData = await request.formData();

  const submission = await parseWithZod(formData, {
    async: true,
    schema: SignUpSchema.transform(async ({ email }, ctx) => {
      const emailExists = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (emailExists) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["email"],
          message: "Email is already in use",
        });
      }

      return email;
    }),
  });

  if (submission.status !== "success") {
    return json(submission.reply(), {
      status: submission.status === "error" ? 400 : 200,
    });
  }

  // const email = submission.value;

  // const { otp, secret, algorithm, charSet, digits, period } = generateTOTP({
  //   digits: 5,
  //   algorithm: "SHA256",
  //   period: 15 * 60, // 15 minutes
  //   charSet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  // });

  return {};
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return null;
}

export default function SignupRoute() {
  return (
    <main className="flex flex-grow justify-center py-12 sm:py-36">
      <SignUpForm />
    </main>
  );
}
