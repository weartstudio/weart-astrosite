import { wpRest, wpRestUrl, wpSiteUrl } from './client';
import { toPlainText } from './html';

/** Gravity Forms conditional logic, as stored on a field ("show this field if …"). */
export interface FieldLogic {
  actionType: 'show' | 'hide';
  logicType: 'all' | 'any';
  rules: { fieldId: string; operator: string; value: string }[];
}

interface GfApiField {
  id: number;
  type: string;
  label: string;
  isRequired: boolean;
  placeholder: string;
  description: string;
  defaultValue: string;
  visibility: string;
  layoutGridColumnSpan?: number;
  maxLength: string;
  choices: { text: string; value: string; isSelected: boolean }[] | '';
  conditionalLogic: FieldLogic | '' | null;
  enableAutocomplete?: boolean;
  autocompleteAttribute?: string;
}

interface GfApiForm {
  button: { text: string };
  enableHoneypot: boolean;
  fields: GfApiField[];
  confirmations: Record<string, { isDefault: boolean; message: string }>;
}

export type FormFieldType = 'text' | 'email' | 'phone' | 'website' | 'number' | 'textarea' | 'select' | 'hidden';

export interface FormField {
  id: number;
  /** Request parameter Gravity Forms expects for the field. */
  name: string;
  type: FormFieldType;
  label: string;
  required: boolean;
  placeholder: string;
  description: string;
  defaultValue: string;
  /** Half width in the form grid (Gravity Forms column span 6 or less). */
  half: boolean;
  maxLength?: number;
  autocomplete?: string;
  choices: { text: string; value: string; selected: boolean }[];
  logic?: FieldLogic;
}

export interface GravityForm {
  id: number;
  /** Public REST endpoint the browser posts the submission to. */
  submitUrl: string;
  submitLabel: string;
  successMessage: string;
  fields: FormField[];
  /** Present when the form has the anti-spam honeypot enabled. */
  honeypot?: {
    /** Input that must stay empty; Gravity Forms drops the submission when it has a value. */
    name: string;
    /** Sent as `version_hash`; without it Gravity Forms marks the entry as spam and sends no notification. */
    versionHash: string;
  };
}

/** A CMS page that embeds a Gravity Forms form, so its markup carries the honeypot version hash. */
const HONEYPOT_HASH_PAGE = '/contact/';

/**
 * Gravity Forms' own script adds `version_hash` to the form on submit. The value depends on the plugin version and
 * the site salts and is not exposed by the REST API, so it is read from a CMS page that renders a form.
 * After a Gravity Forms update the site has to be rebuilt, otherwise new submissions land in spam.
 */
async function getHoneypotVersionHash(): Promise<string> {
  const url = `${wpSiteUrl}${HONEYPOT_HASH_PAGE}`;
  const response = await fetch(url);
  const html = await response.text();
  const hash = /"honeypot":\{"version_hash":"([0-9a-f]+)"/.exec(html)?.[1];
  if (!response.ok || !hash) {
    throw new Error(
      `Gravity Forms: no honeypot version_hash on ${url} (${response.status}). Point HONEYPOT_HASH_PAGE in src/lib/wordpress/gravity-forms.ts to a CMS page with a form, or turn off the honeypot in the form settings.`,
    );
  }
  return hash;
}

const SUPPORTED = new Set<string>(['text', 'email', 'phone', 'website', 'number', 'textarea', 'select', 'hidden']);
const isSupported = (type: string): type is FormFieldType => SUPPORTED.has(type);

const cache = new Map<number, Promise<GravityForm>>();

/**
 * Loads a Gravity Forms form definition at build time (needs a WordPress user that can view forms).
 * Cached, because the contact section renders it on every page.
 */
export function getGravityForm(id: number): Promise<GravityForm> {
  let form = cache.get(id);
  if (!form) {
    form = loadGravityForm(id);
    cache.set(id, form);
  }
  return form;
}

async function loadGravityForm(id: number): Promise<GravityForm> {
  const form = await wpRest<GfApiForm>(`gf/v2/forms/${id}`);

  const fields = form.fields
    .filter((field) => field.visibility !== 'administrative')
    .map((field): FormField => {
      if (!isSupported(field.type)) {
        throw new Error(
          `Gravity Forms #${id}: the "${field.label}" field has an unsupported type (${field.type}). Add it to src/lib/wordpress/gravity-forms.ts and ContactSection.astro.`,
        );
      }
      const choices = Array.isArray(field.choices) ? field.choices : [];
      const maxLength = Number.parseInt(field.maxLength, 10);
      return {
        id: field.id,
        name: `input_${field.id}`,
        type: field.type,
        label: field.label,
        required: field.isRequired,
        placeholder: field.placeholder,
        description: field.description,
        defaultValue: field.defaultValue,
        half: (field.layoutGridColumnSpan ?? 12) <= 6,
        maxLength: maxLength > 0 ? maxLength : undefined,
        autocomplete: field.enableAutocomplete && field.autocompleteAttribute ? field.autocompleteAttribute : undefined,
        choices: choices.map(({ text, value, isSelected }) => ({ text, value, selected: isSelected })),
        logic: field.conditionalLogic || undefined,
      };
    });

  const confirmation = Object.values(form.confirmations).find((c) => c.isDefault);
  // Gravity Forms puts the honeypot input right after the highest field id
  const honeypotId = Math.max(0, ...form.fields.map((field) => field.id)) + 1;

  return {
    id,
    submitUrl: wpRestUrl(`gf/v2/forms/${id}/submissions`),
    submitLabel: form.button.text,
    successMessage: toPlainText(confirmation?.message ?? '') || 'Köszönjük az üzenetet, hamarosan válaszolunk!',
    fields,
    honeypot: form.enableHoneypot
      ? { name: `input_${honeypotId}`, versionHash: await getHoneypotVersionHash() }
      : undefined,
  };
}
