import { ReactNode } from 'react';
import { Lock } from 'lucide-react';

interface AccessRestrictedOverlayProps {
  plan: string;
  featureName?: string;
  onUpgrade?: () => void;
  children?: ReactNode;
}

export const AccessRestrictedOverlay = ({ plan, featureName, onUpgrade, children }: AccessRestrictedOverlayProps) => {
  return (
    <div className="relative">
      {/* Blurred/dimmed content */}
      <div className="pointer-events-none filter blur-sm brightness-90 select-none">
        {children}
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-black/60 z-10 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
            <Lock className="w-5 h-5" />
          </span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wide">
            {plan} Plan
          </span>
        </div>
        <div className="text-center mb-4">
          <div className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {featureName ? `${featureName} is available on the ${plan} plan.` : `This feature is available on the ${plan} plan.`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Upgrade your plan to unlock this feature.
          </div>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition"
          onClick={onUpgrade}
        >
          Upgrade
        </button>
      </div>
    </div>
  );
}; 