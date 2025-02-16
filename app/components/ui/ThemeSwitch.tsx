import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useFetcher } from '@remix-run/react';
import { z } from 'zod';
import { useTheme } from '~/hooks';
import { Button } from './Button';

export type Theme = 'light' | 'dark';
export const fetcherKey = 'update-theme';
export const updateThemeActionIntent = 'update-theme';

export const ThemeSwitchSchema = z.object({
  theme: z.enum(['light', 'dark']),
});

export default function ThemeSwitch() {
  const fetcher = useFetcher({ key: fetcherKey });
  const userPreference = useTheme();
  const mode = userPreference ?? 'light';
  const nextMode = mode === 'light' ? 'dark' : 'light';

  return (
    <fetcher.Form method="POST" action="/">
      <input type="hidden" name="theme" value={nextMode} />
      <Button type="submit" name="intent" value={updateThemeActionIntent} variant="ghost" size="icon">
        {mode === 'light' ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </fetcher.Form>
  );
}
