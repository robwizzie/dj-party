import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../../lib/utils';

const Switch = React.forwardRef(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
			'bg-white/10 data-[state=checked]:bg-brand-primary',
			className
		)}
		{...props}
		ref={ref}>
		<SwitchPrimitives.Thumb
			className={cn(
				'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200',
				'translate-x-0 data-[state=checked]:translate-x-5'
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
