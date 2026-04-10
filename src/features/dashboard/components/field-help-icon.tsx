import { MaskIcon } from "@/src/components/ui/mask-icon";
import { Tooltip } from "@/src/components/ui/tooltip";

type FieldHelpIconProps = {
  content: string;
};

export function FieldHelpIcon({ content }: FieldHelpIconProps) {
  return (
    <Tooltip content={content}>
      <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-[0_0_0_3px_rgba(148,163,184,0.08)] transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700">
        <MaskIcon className="h-3.5 w-3.5" src="/icons/info.svg" />
        <span className="pointer-events-none absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-100 text-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.18)]">
          <MaskIcon className="h-1.5 w-1.5" src="/icons/sparkle.svg" />
        </span>
      </span>
    </Tooltip>
  );
}
